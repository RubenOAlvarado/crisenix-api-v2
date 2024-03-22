import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/shared/models/schemas/user.schema';
import { EventlogModule } from '@/eventlog/eventlog.module';
import { RolesModule } from '@/roles/roles.module';
import { FirebaseService } from '@/shared/services/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EventlogModule,
    RolesModule,
  ],
  controllers: [UserController],
  providers: [UserService, FirebaseService],
  exports: [UserService],
})
export class UserModule {}
