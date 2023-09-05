import { UserRoles } from '@/shared/enums/roles';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { FirebaseError } from 'firebase-admin';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  //Auth method
  async verifiedUserToken(token: string): Promise<DecodedIdToken> {
    try {
      this.logger.debug('Verifying user token');
      const checkRevoked = true;
      const decodeToken = await getAuth().verifyIdToken(token, checkRevoked);
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

  async addClaimsToUser(
    uid: string,
    role: string = UserRoles.CLIENTE,
  ): Promise<void> {
    try {
      this.logger.debug('Adding claims to user');
      const claims = { role };
      await getAuth().setCustomUserClaims(uid, claims);
      //this.logger.debug(`User with claims: ${userWithCustClaims}`);
    } catch (e) {
      this.logger.error(`Error adding claims to user: ${e}`);
    }
  }

  /* async getFirebaseUser(uid: string): Promise<any> {
    try {
      this.logger.debug('Getting firebase user');
      const user = await getAuth().getUser(uid);
      if (!user) {
        this.logger.error('User not found.');
        throw new BadRequestException('User not found.');
      }
      return user;
    } catch (e) {
      this.logger.error(`Error getting firebase user: ${e}`);
    }
  } */
}
