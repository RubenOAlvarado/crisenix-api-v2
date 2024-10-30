import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/shared/models/schemas/user.schema';
import { RolesModule } from '@/roles/roles.module';
import { FirebaseService } from '@/shared/services/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RolesModule,
  ],
  controllers: [UserController],
  providers: [UserService, FirebaseService],
  exports: [UserService],
})
export class UserModule {}
