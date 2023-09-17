/* eslint-disable @typescript-eslint/no-empty-function */
import { UserRoles } from '@/shared/enums/roles';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { FirebaseError } from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor /*private configService: ConfigService,
    //private jwtService: JwtService /* @Inject(forwardRef(() => UserService))
    private userService: UserService, */() {}
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

  /* async signIn(username: string, password: string) {
    const configUser = this.configService.get<string>('ADMIN_USERNAME');
    const configPass = this.configService.get<string>('ADMIN_PASSWORD');
    if (username === configUser && password === configPass) {
      const payload = { username: configUser };
      const token = await this.jwtService.signAsync(payload);
      return {
        access_token: token,
      };
    } else {
      throw new UnauthorizedException('Invalid credentials.');
    }
  } */

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
