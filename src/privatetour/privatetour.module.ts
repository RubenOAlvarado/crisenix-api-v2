import { Module } from '@nestjs/common';
import { PrivatetourService } from './privatetour.service';
import { PrivatetourController } from './privatetour.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PrivateTours,
  PrivateTourSchema,
} from '@/shared/models/schemas/privatetour.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PrivateTours.name,
        schema: PrivateTourSchema,
      },
    ]),
  ],
  controllers: [PrivatetourController],
  providers: [PrivatetourService],
})
export class PrivatetourModule {}
