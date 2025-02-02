import { Module } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { PassengerController } from './passenger.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Passengers,
  PassengerSchema,
} from '@/shared/models/schemas/passenger.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Passengers.name, schema: PassengerSchema },
    ]),
  ],
  controllers: [PassengerController],
  providers: [PassengerService],
})
export class PassengerModule {}
