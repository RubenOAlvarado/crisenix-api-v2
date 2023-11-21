import { Module } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { ItineraryController } from './itinerary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Itineraries,
  ItinerarySchema,
} from '@/shared/models/schemas/itinerary.schema';
import { TourModule } from '@/tour/tour.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Itineraries.name,
        schema: ItinerarySchema,
      },
    ]),
    TourModule,
  ],
  controllers: [ItineraryController],
  providers: [ItineraryService],
})
export class ItineraryModule {}
