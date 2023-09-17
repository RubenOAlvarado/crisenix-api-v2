import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'firebase-auth' }),
    /* JwtModule.registerAsync({
      imports: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }), */
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, FirebaseAuthStrategy],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
