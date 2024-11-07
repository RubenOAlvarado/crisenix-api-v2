import { Module } from '@nestjs/common';
import { ItineraryActivitiesController } from './itineraryActivities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ItineraryActivitiesService } from './itineraryActivities.service';
import {
  ItineraryActivities,
  ItineraryActivitiesSchema,
} from '@/shared/models/schemas/itineraryActivities.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ItineraryActivities.name, schema: ItineraryActivitiesSchema },
    ]),
  ],
  controllers: [ItineraryActivitiesController],
  providers: [ItineraryActivitiesService],
})
export class ItineraryActivitiesModule {}
