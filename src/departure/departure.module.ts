import { Module } from '@nestjs/common';
import { DepartureService } from './departure.service';
import { DepartureController } from './departure.controller';
import {
  DepartureSchema,
  Departures,
} from '@/shared/models/schemas/departure.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Departures.name, schema: DepartureSchema },
    ]),
  ],
  controllers: [DepartureController],
  providers: [DepartureService],
})
export class DepartureModule {}
