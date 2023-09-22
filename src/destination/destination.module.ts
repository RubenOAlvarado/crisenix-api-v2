import { Module } from '@nestjs/common';
import { DestinationService } from './destination.service';
import { DestinationController } from './destination.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DestinationSchema,
  Destinations,
} from '@/shared/models/schemas/destination.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Destinations.name, schema: DestinationSchema },
    ]),
  ],
  controllers: [DestinationController],
  providers: [DestinationService],
})
export class DestinationModule {}
