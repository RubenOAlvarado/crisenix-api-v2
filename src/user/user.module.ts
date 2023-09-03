import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/shared/models/schemas/user.schema';
import { EventlogModule } from 'src/eventlog/eventlog.module';
import { RolesModule } from 'src/roles/roles.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EventlogModule,
    RolesModule,
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
