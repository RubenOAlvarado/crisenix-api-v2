import { Module } from '@nestjs/common';
import { TourtypeService } from './tourtype.service';
import { TourtypeController } from './tourtype.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TourTypes,
  TourTypeSchema,
} from '@/shared/models/schemas/tourtype.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TourTypes.name, schema: TourTypeSchema },
    ]),
  ],
  controllers: [TourtypeController],
  providers: [TourtypeService],
})
export class TourtypeModule {}
