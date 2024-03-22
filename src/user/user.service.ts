import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EventlogService } from '../eventlog/eventlog.service';
import { User } from '@/shared/models/schemas/user.schema';
import { CreateEventLogDTO } from '@/shared/models/dtos/eventlog/eventlog.dto';
import { CreateUserDTO } from '@/shared/models/dtos/user/createuser.dto';
import { MOVES } from '@/shared/enums/moves.enum';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { UpdateUserDTO } from '@/shared/models/dtos/user/updateuser.dto';
import { WebUserDTO } from '@/shared/models/dtos/user/createwebuser.dto';
import { UpdateWebUserDTO } from '@/shared/models/dtos/user/updatewebuser.dto';
import { Status } from '@/shared/enums/status.enum';
import { RolesService } from '@/roles/roles.service';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { ResponseWebUserDTO } from '@/shared/models/dtos/user/response-webuser.dto';
import { ResponseRoleDTO } from '@/shared/models/dtos/role/response-role.dto';
import { UserLean } from '@/shared/interfaces/user/user.lean.interface';
import { FirebaseService } from '@/shared/services/firebase.service';
import { UserRoles } from '@/shared/enums/roles';
import {
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import { UserRecord } from 'firebase-admin/auth';
import { CreateFbUserDTO } from '@/shared/models/dtos/user/createfbuser.dto';
import { RolesLean } from '@/shared/interfaces/roles/roles.lean.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private logService: EventlogService,
    private roleService: RolesService,
    private firebaseService: FirebaseService,
  ) {}

  private readonly logger = new Logger(UserService.name);

  private async setLogDto(
    serviceId: string,
    move: string,
    registry: any,
    user: string,
  ): Promise<void> {
    try {
      this.logger.debug('Saving in log');
      const dto: CreateEventLogDTO = {
        serviceId,
        service: UserService.name,
        move,
        registry,
        user,
      };
      await this.logService.saveLog(dto);
      this.logger.debug(`${user} ${move} an user`);
    } catch (e) {
      this.logger.error(`Error saving log: ${e}`);
      throw new InternalServerErrorException('Error saving log');
    }
  }

  //Database methods
  async createDbUser(
    createUserDTO: CreateUserDTO,
    creatorRoleId: string,
  ): Promise<UserLean> {
    try {
      const { firebaseUid, role: roleId } = createUserDTO;

      await this.setCustomClaims(firebaseUid, roleId);
      const dbUser = new this.userModel(createUserDTO);
      await this.setLogDto(
        dbUser._id.toString(),
        MOVES.CREATE,
        dbUser,
        creatorRoleId,
      );
      return dbUser.save();
    } catch (e) {
      if (createUserDTO?.firebaseUid)
        this.firebaseService.deleteUser(createUserDTO.firebaseUid);
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
      this.logger.debug('Looking user profile');
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
      this.logger.debug('Looking user profile by his firebaseid');
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
  }: QueryDTO): Promise<PaginateResult<UserLean>> {
    try {
      this.logger.debug('looking users profiles');
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
    user: string,
  ): Promise<User> {
    try {
      const dbUpdatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDTO,
        { new: true },
      );

      if (!dbUpdatedUser)
        throw new NotFoundException('User profile not found.');
      await this.setLogDto(
        dbUpdatedUser._id.toString(),
        MOVES.UPDATE,
        dbUpdatedUser,
        user,
      );
      return dbUpdatedUser;
    } catch (e) {
      throw handleErrorsOnServices('Error updating user profile', e);
    }
  }

  async deleteDbUser({ id }: UrlValidator, user: string): Promise<UserLean> {
    try {
      const deletedAt = new Date();
      const deletedUser = await this.userModel.findByIdAndUpdate(
        id,
        { status: Status.INACTIVE, deletedAt },
        { new: true },
      );
      if (!deletedUser) throw new NotFoundException('User not found');
      await this.setLogDto(
        deletedUser._id.toString(),
        MOVES.DELETE,
        deletedUser,
        user,
      );
      return deletedUser;
    } catch (e) {
      throw handleErrorsOnServices('Error deleting user profile', e);
    }
  }

  //WebUsers methods
  async createWebUser(
    {
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
    }: WebUserDTO,
    managerId: string,
  ): Promise<ResponseWebUserDTO | UserLean> {
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

      const dbNewUser = await this.createDbUser(
        {
          name,
          lastName,
          secondLast,
          phone,
          status,
          role,
          firebaseUid: firebaseUid || firebaseUser?.uid,
        },
        managerId,
      );

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
    managerId: string,
  ): Promise<ResponseWebUserDTO> {
    try {
      const updatedDbUser = await this.updateDbUser(
        param,
        { ...updateWebUserDTO },
        managerId,
      );
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

  async deletedWebUser(params: UrlValidator, managerId: string): Promise<void> {
    try {
      const deletdDbUser = await this.deleteDbUser(params, managerId);
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
      role: user?.role as ResponseRoleDTO,
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

  /* async test(uid: string) {
    try {
      const user = await this.authService.getFirebaseUser(uid);
      console.log(user);
    } catch (e) {
      console.log(e);
    }
  } */
}
