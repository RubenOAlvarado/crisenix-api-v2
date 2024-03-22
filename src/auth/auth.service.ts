import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
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
