import { CreatePassengerDTO } from '@/shared/models/dtos/passenger/createpassenger.dto';
import {
  PassengerDocument,
  Passengers,
} from '@/shared/models/schemas/passenger.schema';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PassengerService {
  constructor(
    @InjectModel(Passengers.name)
    private readonly passengerModel: Model<Passengers>,
  ) {}

  private readonly logger = new Logger(PassengerService.name);

  async create(
    createPassengerDTO: CreatePassengerDTO,
  ): Promise<PassengerDocument> {
    try {
      this.logger.debug(`creating new passenger`);
      const createdPassenger = new this.passengerModel(createPassengerDTO);
      return createdPassenger.save();
    } catch (error) {
      this.logger.error(
        `Something went wrong creating the passenger: ${JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException(
        `Something went wrong creating the passenger.`,
      );
    }
  }
}
