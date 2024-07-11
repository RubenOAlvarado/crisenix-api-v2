import { CreatePassengerDTO } from '@/shared/models/dtos/request/passenger/createpassenger.dto';
import {
  PassengerDocument,
  Passengers,
} from '@/shared/models/schemas/passenger.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PassengerService {
  constructor(
    @InjectModel(Passengers.name)
    private readonly passengerModel: Model<Passengers>,
  ) {}

  // private readonly logger = new Logger(PassengerService.name);

  async create(
    createPassengerDTO: CreatePassengerDTO,
  ): Promise<PassengerDocument> {
    try {
      const createdPassenger = new this.passengerModel(createPassengerDTO);
      return createdPassenger.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong creating passenger.',
        error,
      );
    }
  }

  async getByTour(tourId: string): Promise<PassengerDocument[]> {
    try {
      return this.passengerModel.find({ tour: tourId });
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong fetching passengers.',
        error,
      );
    }
  }
}
