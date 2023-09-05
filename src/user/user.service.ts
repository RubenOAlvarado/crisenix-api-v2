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
import { getAuth } from 'firebase-admin/auth';
import { User } from 'src/shared/models/schemas/user.schema';
import { CreateEventLogDTO } from 'src/shared/models/dtos/eventlog/eventlog.dto';
import { CreateUserDTO } from 'src/shared/models/dtos/user/createuser.dto';
import { MOVES } from 'src/shared/enums/moves.enum';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import { UpdateUserDTO } from 'src/shared/models/dtos/user/updateuser.dto';
import { CreateFbUserDTO } from 'src/shared/models/dtos/user/createfbuser.dto';
import { UpdateFbUserDTO } from 'src/shared/models/dtos/user/updatefbuser.dto';
import { WebUserDTO } from 'src/shared/models/dtos/user/createwebuser.dto';
import { UpdateWebUserDTO } from 'src/shared/models/dtos/user/updatewebuser.dto';
import { FbUser } from 'src/shared/interfaces/fbUser.interface';
import { Status } from 'src/shared/enums/status.enum';
import { RolesService } from 'src/roles/roles.service';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private logService: EventlogService,
    private roleService: RolesService,
    private authService: AuthService,
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
  ): Promise<User> {
    try {
      this.logger.debug('Creating new user profile');
      const dbUser = new this.userModel(createUserDTO);
      const { firebaseUid, role: roleId } = createUserDTO;
      if (!roleId && firebaseUid) {
        await this.authService.addClaimsToUser(firebaseUid);
      } else if (roleId && firebaseUid) {
        const role = await this.roleService.getRoleById({ id: roleId });
        if (!role) throw new BadRequestException('Sended role not found.');
        await this.authService.addClaimsToUser(firebaseUid, role.description);
      }
      await this.setLogDto(
        dbUser._id.toString(),
        MOVES.CREATE,
        dbUser,
        creatorRoleId,
      );
      return dbUser.save();
    } catch (e) {
      this.logger.error(
        `Something went wrong creating the user in database: ${e}`,
      );
      throw new InternalServerErrorException(
        'Something went wrong creating the user in database.',
      );
    }
  }

  async getDbUserById({ id }: UrlValidator): Promise<User> {
    try {
      this.logger.debug('Looking user profile');
      const profile = await this.userModel
        .findById(id)
        .populate('role', { __v: 0, createdAt: 0 })
        .select({ __v: 0, createdAt: 0 })
        .exec();
      if (!profile)
        throw new NotFoundException(`Profile for user ${id} not found.`);
      return profile;
    } catch (e) {
      this.logger.error(`Something went wrong finding the user: ${e}`);
      throw new InternalServerErrorException(
        'Something went wrong finding the user profile.',
      );
    }
  }

  async getDbUserByFbUid(firebaseUid: string): Promise<User | null> {
    try {
      this.logger.debug('Looking user profile by his firebaseid');
      const profile = await this.userModel
        .findOne({ firebaseUid })
        .populate('role', { __v: 0, createdAt: 0 })
        .select({ __v: 0, createdAt: 0 })
        .exec();
      if (!profile)
        throw new NotFoundException(
          `Profile for user ${firebaseUid} not found.`,
        );
      return profile;
    } catch (e) {
      this.logger.error(
        `Something went wrong finding the user profile by his firebase id: ${e}`,
      );
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException(
        'Something went wrong finding the user profile by his firebase id.',
      );
    }
  }

  async getDbUsers(): Promise<User[]> {
    try {
      this.logger.debug('looking users profiles');
      const users = await this.userModel
        .find()
        .populate('role', { __v: 0, createdAt: 0 })
        .select({ __v: 0, createdAt: 0 })
        .exec();
      if (!users) throw new NotFoundException('No users found.');
      return users;
    } catch (e) {
      this.logger.error(`Error looking users profiles: ${e}`);
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException(
        'Something went wrong finding the users profiles.',
      );
    }
  }

  async updateDbUser(
    { id }: UrlValidator,
    updateUserDTO: UpdateUserDTO,
    user: string,
  ): Promise<void> {
    try {
      this.logger.debug('Updating user profile');
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
    } catch (e) {
      this.logger.error(`Error updating user profile: ${e}`);
      throw new InternalServerErrorException('Error updating user profile');
    }
  }

  async replaceDbUser(
    { id }: UrlValidator,
    updateUserDTO: UpdateUserDTO,
    user: string,
  ): Promise<void> {
    try {
      this.logger.debug('Updating user profile');
      const dbUpdatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDTO,
        { new: true },
      );
      if (!dbUpdatedUser) throw new BadRequestException('User not found.');
      await this.setLogDto(
        dbUpdatedUser._id.toString(),
        MOVES.UPDATE,
        dbUpdatedUser,
        user,
      );
    } catch (e) {
      this.logger.error(`Error updating user profile: ${e}`);
      throw new InternalServerErrorException('Error updating user profile');
    }
  }

  async deleteDbUser({ id }: UrlValidator, user: string): Promise<void> {
    try {
      this.logger.debug('Deleting user profile');
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
    } catch (e) {
      this.logger.error(`Error deleting user profle: ${e}`);
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Error deleting user profle');
    }
  }

  //Firebase methods
  async createFbUser(createFbUserDTO: CreateFbUserDTO): Promise<FbUser> {
    try {
      this.logger.debug('Creating new firebase user');
      const fbUser = await getAuth().createUser(createFbUserDTO);
      return fbUser;
    } catch (e) {
      this.logger.error(`Error creating firebase user: ${e}`);
      throw new InternalServerErrorException('Error creating firebase user');
    }
  }

  async getFbUserById(id: string): Promise<FbUser> {
    try {
      this.logger.debug('Getting firebase user by his id');
      const fbUser = await getAuth().getUser(id);
      return fbUser;
    } catch (e) {
      this.logger.error(`Error looking firebase user: ${e}`);
      throw new InternalServerErrorException('Error looking firebase user');
    }
  }

  async updatefbUser(
    id: string,
    updateFbUserDTO: UpdateFbUserDTO,
  ): Promise<FbUser> {
    try {
      this.logger.debug('Updating firebase user');
      const updatedFbUser = await getAuth().updateUser(id, updateFbUserDTO);
      return updatedFbUser;
    } catch (e) {
      this.logger.error(`Error updating firebase user: ${e}`);
      throw new InternalServerErrorException('Error updating firebase user');
    }
  }

  async deleteFbUser(id: string): Promise<void> {
    try {
      this.logger.debug('Deleting firebase user');
      await getAuth().deleteUser(id);
    } catch (e) {
      this.logger.error(`Error deleting fb user: ${e}`);
      throw new InternalServerErrorException('Error deleting fb user');
    }
  }

  //WebUsers methods
  async createWebUser(
    createWebUserDTO: WebUserDTO,
    roleId: string,
  ): Promise<any> {
    try {
      let fbNewUser: FbUser;
      let dbNewUser: User;
      this.logger.debug('Creating new web user');
      if (!createWebUserDTO.fbregistered) {
        if (!createWebUserDTO.password) {
          throw new BadRequestException(
            'Password is required in order to register user on firebase.',
          );
        }
        fbNewUser = await this.createFbUser({ ...createWebUserDTO });
        this.logger.debug('User created in firebase');
        const createdFirebaseUser = {
          ...createWebUserDTO,
          firebaseUid: fbNewUser.uid,
          fbregistered: true,
        };
        dbNewUser = await this.createDbUser({ ...createdFirebaseUser }, roleId);
        this.logger.debug('User created in db');
        return dbNewUser;
      }

      dbNewUser = await this.createDbUser({ ...createWebUserDTO }, roleId);
      this.logger.debug('User created in db');
      return dbNewUser;
    } catch (e) {
      this.logger.error(`Something went wrong creating the user: ${e}`);
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException(
        'Something went wrong creating the user.',
      );
    }
  }

  async getWebUser(params: UrlValidator): Promise<any> {
    try {
      this.logger.debug('Looking for web user');
      const user = await this.getDbUserById(params);
      if (!user) throw new NotFoundException('No user profile found.');
      const fbUser = await this.getFbUserById(user.firebaseUid);
      return { user, fbUser };
    } catch (e) {
      this.logger.error(`Something went wrong finding the user profiles: ${e}`);
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException(
        'Something went wrong finding the user profiles.',
      );
    }
  }

  async updateWebUser(
    params: UrlValidator,
    updateWebUserDTO: UpdateWebUserDTO,
    roleId: string,
  ): Promise<any> {
    try {
      this.logger.debug('Updating web user');
      await this.updateDbUser(params, { ...updateWebUserDTO }, roleId);
      const updatedDbUser = await this.getDbUserById(params);
      this.logger.debug('Updated in db');
      if (!updatedDbUser) throw new NotFoundException('User not found.');
      const updatedFbUser = await this.updatefbUser(updatedDbUser.firebaseUid, {
        ...updateWebUserDTO,
      });
      this.logger.debug('Updated in fb');
      return { user: updatedDbUser, fbUser: updatedFbUser };
    } catch (e) {
      this.logger.error(`Something went wrong updating the user profile: ${e}`);
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException(
        'Something went wrong updating the user profile.',
      );
    }
  }

  async deletedWebUser(params: UrlValidator, roleId: string): Promise<void> {
    try {
      this.logger.debug('Deleting web user');
      await this.deleteDbUser(params, roleId);
      this.logger.debug('Deleted in db');
      const deletdDbUser = await this.getDbUserById(params);
      if (!deletdDbUser) throw new NotFoundException('User not found.');
      await this.deleteFbUser(deletdDbUser.firebaseUid);
      this.logger.debug('Deleted in firebase');
    } catch (e) {
      this.logger.error(`Something went wrong deleting the user: ${e}`);
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException(
        'Something went wrong deleting the user.',
      );
    }
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
