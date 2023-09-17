import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  constructor() {
    super({
      passReqToCallback: true,
    });
  }

  /* async validate(
    //request: UserRequest,
    username: string,
    password: string,
  ): Promise<any> {
    // const user = await this.authService.signIn(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    // request.user = user;
    return true;
  } */
}
