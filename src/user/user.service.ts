import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/shared/models/schemas/user.schema';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { Status } from '@/shared/enums/status.enum';
import { RolesService } from '@/roles/roles.service';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { UserLean } from '@/shared/interfaces/user/user.lean.interface';
import { FirebaseService } from '@/shared/services/firebase.service';
import { UserRoles } from '@/shared/enums/roles';
import {
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import { UserRecord } from 'firebase-admin/auth';
import { RolesLean } from '@/shared/interfaces/roles/roles.lean.interface';
import { CreateUserDTO } from '@/shared/models/dtos/request/user/createuser.dto';
import { ResponseWebUserDTO } from '@/shared/models/dtos/response/user/response-webuser.dto';
import { CreateFbUserDTO } from '@/shared/models/dtos/request/user/createfbuser.dto';
import { UpdateWebUserDTO } from '@/shared/models/dtos/request/user/updatewebuser.dto';
import { WebUserDTO } from '@/shared/models/dtos/request/user/createwebuser.dto';
import { UpdateUserDTO } from '@/shared/models/dtos/request/user/updateuser.dto';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private roleService: RolesService,
    private firebaseService: FirebaseService,
  ) {}

  //Database methods
  async createDbUser(createUserDTO: CreateUserDTO): Promise<UserLean> {
    try {
      const { firebaseUid, role: roleId } = createUserDTO;

      await this.setCustomClaims(firebaseUid, roleId);
      const dbUser = new this.userModel(createUserDTO);
      return dbUser.save();
    } catch (e) {
      throw handleErrorsOnServices(
        'Something went wrong creating the user in database',
        e,
      );
    }
  }

  private async setCustomClaims(uid?: string, roleId?: string) {
    if (!uid)
      throw new BadRequestException(
        'Firebase uid is required to set custom claims.',
      );
    if (roleId) {
      const role: RolesLean = await this.roleService.getRoleById({
        id: roleId,
      });
      if (!role) throw new NotFoundException('Role not found.');
      await this.firebaseService.setCustomUserClaims(
        uid,
        role.description as UserRoles,
      );
    }
    await this.firebaseService.setCustomUserClaims(uid);
  }

  async getDbUserById({ id }: UrlValidator): Promise<UserLean> {
    try {
      const profile = await this.userModel
        .findById(id)
        .populate('role', { __v: 0, createdAt: 0 })
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!profile)
        throw new NotFoundException(`Profile for user ${id} not found.`);
      return profile;
    } catch (e) {
      throw handleErrorsOnServices('Error looking user profile', e);
    }
  }

  async getDbUserByFbUid(firebaseUid: string): Promise<UserLean> {
    try {
      const profile = await this.userModel
        .findOne({ firebaseUid })
        .populate('role', { __v: 0, createdAt: 0 })
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!profile)
        throw new NotFoundException(
          `Profile for user ${firebaseUid} not found.`,
        );
      return profile;
    } catch (e) {
      throw handleErrorsOnServices(
        'Error looking user profile by firebaseId',
        e,
      );
    }
  }

  async getDbUsers({
    page,
    limit,
  }: PaginationDTO): Promise<PaginateResult<UserLean>> {
    try {
      const docs = await this.userModel
        .find()
        .populate('role', { __v: 0, createdAt: 0 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!docs) throw new NotFoundException('No users found.');
      const totalDocs = await this.userModel.countDocuments().exec();
      return createPaginatedObject<UserLean>(docs, totalDocs, page, limit);
    } catch (e) {
      throw handleErrorsOnServices('Error looking users profiles', e);
    }
  }

  async updateDbUser(
    { id }: UrlValidator,
    updateUserDTO: UpdateUserDTO,
  ): Promise<User> {
    try {
      const dbUpdatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDTO,
        { new: true },
      );

      if (!dbUpdatedUser)
        throw new NotFoundException('User profile not found.');
      return dbUpdatedUser;
    } catch (e) {
      throw handleErrorsOnServices('Error updating user profile', e);
    }
  }

  async deleteDbUser({ id }: UrlValidator): Promise<UserLean> {
    try {
      const deletedAt = new Date();
      const deletedUser = await this.userModel.findByIdAndUpdate(
        id,
        { status: Status.INACTIVE, deletedAt },
        { new: true },
      );
      if (!deletedUser) throw new NotFoundException('User not found');
      return deletedUser;
    } catch (e) {
      throw handleErrorsOnServices('Error deleting user profile', e);
    }
  }

  //WebUsers methods
  async createWebUser({
    email,
    firebaseUid,
    password,
    displayName,
    name,
    lastName,
    secondLast,
    phone,
    status,
    role,
  }: WebUserDTO): Promise<ResponseWebUserDTO | UserLean> {
    try {
      if (!firebaseUid && !password) {
        throw new BadRequestException(
          'Password is required in order to register user on firebase.',
        );
      }

      let firebaseUser: UserRecord | undefined;
      if (!firebaseUid) {
        const fbUserDTO: CreateFbUserDTO = {
          email,
          password,
          displayName,
        };
        firebaseUser = await this.firebaseService.createUser(fbUserDTO);
      }

      const dbNewUser = await this.createDbUser({
        name,
        lastName,
        secondLast,
        phone,
        status,
        role,
        firebaseUid: firebaseUid || firebaseUser?.uid,
      });

      return this.transformUserResponseDTO(dbNewUser, firebaseUser);
    } catch (e) {
      throw handleErrorsOnServices('Something went wrong creating the user', e);
    }
  }

  async getWebUser(params: UrlValidator): Promise<ResponseWebUserDTO> {
    try {
      const user = await this.getDbUserById(params);
      if (!user) throw new NotFoundException('No user profile found.');
      const fbUser = await this.firebaseService.getUserById(user.firebaseUid);
      return this.transformUserResponseDTO(user, fbUser);
    } catch (e) {
      throw handleErrorsOnServices('Error getting user profile', e);
    }
  }

  async updateWebUser(
    param: UrlValidator,
    updateWebUserDTO: UpdateWebUserDTO,
  ): Promise<ResponseWebUserDTO> {
    try {
      const updatedDbUser = await this.updateDbUser(param, {
        ...updateWebUserDTO,
      });
      if (!updatedDbUser) throw new NotFoundException('User not found.');
      const updatedFbUser = await this.firebaseService.updateUser(
        updatedDbUser.firebaseUid,
        {
          ...updateWebUserDTO,
        },
      );
      return this.transformUserResponseDTO(updatedDbUser, updatedFbUser);
    } catch (e) {
      throw handleErrorsOnServices('Error updating user profile', e);
    }
  }

  async deletedWebUser(params: UrlValidator): Promise<void> {
    try {
      const deletdDbUser = await this.deleteDbUser(params);
      if (!deletdDbUser) throw new NotFoundException('User not found.');
      await this.firebaseService.deleteUser(deletdDbUser.firebaseUid);
    } catch (e) {
      throw handleErrorsOnServices('Error deleting user profile', e);
    }
  }

  async validateUser(id: string): Promise<boolean> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException('User not found.');
      if (user.status === Status.INACTIVE)
        throw new BadRequestException('User is inactive.');
      return true;
    } catch (e) {
      throw handleErrorsOnServices('Error validating user', e);
    }
  }

  private async transformUserResponseDTO(
    user: UserLean | User,
    fbUser: UserRecord | undefined,
  ): Promise<ResponseWebUserDTO> {
    return {
      role: user?.role,
      email: fbUser?.email,
      emailVerified: fbUser?.emailVerified,
      displayName: fbUser?.displayName,
      name: user.name,
      lastName: user.lastName,
      secondLast: user.secondLast,
      phone: user.phone,
      firebaseUid: user.firebaseUid,
      photoUrl: fbUser?.photoURL,
      disabled: fbUser?.disabled,
    };
  }
}
