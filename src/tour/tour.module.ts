import { Module, forwardRef } from '@nestjs/common';
import { TourService } from './tour.service';
import { TourController } from './tour.controller';
import { Tours, TourSchema } from '@/shared/models/schemas/tour.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesModule } from '@/sales/sales.module';
import { FilerModule } from '@/filer/filer.module';
import { EventlogModule } from '@/eventlog/eventlog.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tours.name, schema: TourSchema }]),
    forwardRef(() => SalesModule),
    FilerModule,
    EventlogModule,
  ],
  controllers: [TourController],
  providers: [TourService],
  exports: [TourService],
})
export class TourModule {}
