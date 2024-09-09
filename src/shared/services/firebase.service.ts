import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DecodedIdToken, UserRecord, getAuth } from 'firebase-admin/auth';
import { FirebaseError } from 'firebase-admin';
import { UserRoles } from '../enums/roles';
import { handleErrorsOnServices } from '../utilities/helpers';
import { CreateFbUserDTO } from '../models/dtos/request/user/createfbuser.dto';
import { UpdateFbUserDTO } from '../models/dtos/request/user/updatefbuser.dto';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    try {
      const checkRevoked = true;
      const decodeToken = await getAuth().verifyIdToken(idToken, checkRevoked);
      return decodeToken;
    } catch (e: FirebaseError | any) {
      if (e.code == 'auth/id-token-revoked') {
        this.logger.error('User token revoked');
        throw new BadRequestException('Token revoked');
      } else {
        this.logger.error('User token invalid');
        throw new BadRequestException('Token invalid');
      }
    }
  }

  async setCustomUserClaims(
    uid: string,
    role = UserRoles.CLIENT,
  ): Promise<void> {
    try {
      const claims = { role };
      await getAuth().setCustomUserClaims(uid, claims);
    } catch (e) {
      this.logger.error(`Error adding claims to user: ${e}`);
    }
  }

  async createUser(createFbUserDTO: CreateFbUserDTO): Promise<UserRecord> {
    try {
      return await getAuth().createUser(createFbUserDTO);
    } catch (e) {
      throw handleErrorsOnServices(
        'Something went wrong creating firebase user',
        e,
      );
    }
  }

  async getUserById(uid: string): Promise<UserRecord> {
    try {
      return await getAuth().getUser(uid);
    } catch (e) {
      throw handleErrorsOnServices(
        'Something went wrong getting firebase user',
        e,
      );
    }
  }

  async updateUser(
    uid: string,
    updateFbUserDTO: UpdateFbUserDTO,
  ): Promise<UserRecord> {
    try {
      return await getAuth().updateUser(uid, updateFbUserDTO);
    } catch (e) {
      throw handleErrorsOnServices(
        'Something went wrong updating firebase user',
        e,
      );
    }
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      await getAuth().deleteUser(uid);
    } catch (e) {
      throw handleErrorsOnServices(
        'Something went wrong deleting firebase user',
        e,
      );
    }
  }
}
