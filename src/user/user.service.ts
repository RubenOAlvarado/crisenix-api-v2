import { UserRoles } from '../shared/enums/roles';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
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

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private logService: EventlogService,
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
    role: string,
  ): Promise<User> {
    try {
      this.logger.debug('Creating new user profile');
      const dbUser = new this.userModel(createUserDTO);
      const { firebaseUid } = createUserDTO;
      await this.addClaimsToUser(firebaseUid);
      await this.setLogDto(dbUser._id.toString(), MOVES.CREATE, dbUser, role);
      return dbUser.save();
    } catch (e) {
      this.logger.error(`Error creating user profile: ${e}`);
      throw new InternalServerErrorException('Error creating user profile');
    }
  }

  async getDbUserById({ id }: UrlValidator): Promise<User> {
    try {
      this.logger.debug('Looking user profile');
      const dbUSer = await this.userModel.findById(id).exec();
      return dbUSer;
    } catch (e) {
      this.logger.error(`Error looking user profile: ${e}`);
      throw new InternalServerErrorException('Error looking user profile');
    }
  }

  async getDbUserByFbUid(firebaseUid: string): Promise<User> {
    try {
      this.logger.debug('Looking user profile by his firebaseid');
      const user = await this.userModel.findOne({ firebaseUid }).exec();
      return user;
    } catch (e) {
      this.logger.error(`Error looking user profile by firebaseid: ${e}`);
      throw new InternalServerErrorException(
        'Error looking user profile by firebaseid',
      );
    }
  }

  async getDbUsers(): Promise<User[]> {
    try {
      this.logger.debug('looking users profiles');
      return await this.userModel
        .find()
        .select({ __v: 0, createdAt: 0 })
        .exec();
    } catch (e) {
      this.logger.error(`Error looking users profiles: ${e}`);
      throw new InternalServerErrorException('Error looking users profiles');
    }
  }

  async updateDbUser(
    { id }: UrlValidator,
    updateUserDTO: UpdateUserDTO,
    user: string,
  ): Promise<User> {
    try {
      this.logger.debug('Updating user profile');
      const dbUpdatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDTO,
        { new: true },
      );
      await this.setLogDto(
        dbUpdatedUser._id.toString(),
        MOVES.UPDATE,
        dbUpdatedUser,
        user,
      );
      return dbUpdatedUser;
    } catch (e) {
      this.logger.error(`Error updating user profile: ${e}`);
      throw new InternalServerErrorException('Error updating user profile');
    }
  }

  async replaceDbUser(
    { id }: UrlValidator,
    updateUserDTO: UpdateUserDTO,
    user: string,
  ): Promise<string> {
    try {
      this.logger.debug('Updating user profile');
      const dbUpdatedUser = await this.userModel.replaceOne(
        { _id: id },
        updateUserDTO,
      );
      await this.setLogDto(
        dbUpdatedUser.upsertedId._id.toString(),
        MOVES.UPDATE,
        dbUpdatedUser,
        user,
      );
      return 'User replaced';
    } catch (e) {
      this.logger.error(`Error updating user profile: ${e}`);
      throw new InternalServerErrorException('Error updating user profile');
    }
  }

  async deleteDbUser({ id }: UrlValidator, user: string): Promise<User> {
    try {
      this.logger.debug('Deleting user profile');
      const deletedAt = new Date();
      const deletedUser = await this.userModel.findByIdAndUpdate(
        id,
        { status: Status.INACTIVE, deletedAt },
        { new: true },
      );
      await this.setLogDto(
        deletedUser._id.toString(),
        MOVES.DELETE,
        deletedUser,
        user,
      );
      return deletedUser;
    } catch (e) {
      this.logger.error(`Error deleting user profle: ${e}`);
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

  //Auth method
  async verifiedUserToken(token: string): Promise<FbUser> {
    try {
      this.logger.debug('Verifying user token');
      const checkRevoked = true;
      const decodeToken = await getAuth().verifyIdToken(token, checkRevoked);
      return this.getFbUserById(decodeToken.uid);
    } catch (e) {
      if (e.code == 'auth/id-token-revoked') {
        this.logger.error('User token revoked');
        throw new BadRequestException('Token revoked');
      } else {
        this.logger.error('User token invalid');
        throw new BadRequestException('Token invalid');
      }
    }
  }

  async addClaimsToUser(
    uid: string,
    role: UserRoles = UserRoles.CONSULTA,
  ): Promise<void> {
    try {
      this.logger.debug('Adding claims to user');
      const claims = { role };
      await getAuth().createCustomToken(uid, claims);
    } catch (e) {
      this.logger.error(`Error adding claims to user: ${e}`);
    }
  }

  // TODO - add roles service
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
            'Password is required in order to register user on firebase',
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
      this.logger.error(`Error creating webuser: ${e}`);
      throw new InternalServerErrorException('Error creating webuser');
    }
  }

  async getWebUser(params: UrlValidator): Promise<any> {
    try {
      this.logger.debug('Looking for web user');
      const user = await this.getDbUserById(params);
      const fbUser = await this.getFbUserById(user.firebaseUid);
      return { user, fbUser };
    } catch (e) {
      this.logger.error(`Error looking for web user: ${e}`);
      throw new InternalServerErrorException('Error looking for web user');
    }
  }

  async updateWebUser(
    params: UrlValidator,
    updateWebUserDTO: UpdateWebUserDTO,
    roleId: string,
  ): Promise<any> {
    try {
      this.logger.debug('Updating web user');
      const updatedDbUser = await this.updateDbUser(
        params,
        { ...updateWebUserDTO },
        roleId,
      );
      this.logger.debug('Updated in db');
      const updatedFbUser = await this.updatefbUser(updatedDbUser.firebaseUid, {
        ...updateWebUserDTO,
      });
      this.logger.debug('Updated in fb');
      return { user: updatedDbUser, fbUser: updatedFbUser };
    } catch (e) {
      this.logger.error(`Error updating web user: ${e}`);
      throw new InternalServerErrorException('Error updating web user');
    }
  }

  async deletedWebUser(params: UrlValidator, user: string): Promise<void> {
    try {
      this.logger.debug('Deleting web user');
      const deletdDbUser = await this.deleteDbUser(params, user);
      this.logger.debug('Deleted in db');
      await this.deleteFbUser(deletdDbUser.firebaseUid);
      this.logger.debug('Deleted in firebase');
    } catch (e) {
      this.logger.error(`Error deleting web user`);
      throw new InternalServerErrorException('Error deleting web user');
    }
  }
}
