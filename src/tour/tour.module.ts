import { Module, forwardRef } from '@nestjs/common';
import { TourService } from './tour.service';
import { TourController } from './tour.controller';
import { Tours, TourSchema } from '@/shared/models/schemas/tour.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesModule } from '@/sales/sales.module';
import { EventlogModule } from '@/eventlog/eventlog.module';
import { DestinationModule } from '@/destination/destination.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tours.name, schema: TourSchema }]),
    forwardRef(() => SalesModule),
    EventlogModule,
    DestinationModule,
  ],
  controllers: [TourController],
  providers: [TourService],
  exports: [TourService],
})
export class TourModule {}
