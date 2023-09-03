import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string) {
    try {
      const firebaseUser = await getAuth().verifyIdToken(token);
      if (!firebaseUser) throw new UnauthorizedException();
      return firebaseUser;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
  }
}
