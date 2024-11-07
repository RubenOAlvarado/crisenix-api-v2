import { Module } from '@nestjs/common';
import { DestinationService } from './destination.service';
import { DestinationController } from './destination.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DestinationSchema,
  Destinations,
} from '@/shared/models/schemas/destination.schema';
import { CategoryModule } from '@/category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Destinations.name, schema: DestinationSchema },
    ]),
    CategoryModule,
  ],
  controllers: [DestinationController],
  providers: [DestinationService],
  exports: [DestinationService],
})
export class DestinationModule {}
