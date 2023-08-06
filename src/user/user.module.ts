import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/shared/models/schemas/user.schema';
import { EventlogModule } from 'src/eventlog/eventlog.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EventlogModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
