import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import {
  Reservations,
  ReservationSchema,
} from '@/shared/models/schemas/reservation.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reservations.name,
        schema: ReservationSchema,
      },
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
