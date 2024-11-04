import { Status } from '@/shared/enums/status.enum';
import { CreatePassengerDTO } from '@/shared/models/dtos/request/passenger/createpassenger.dto';
import {
  PassengerDocument,
  Passengers,
} from '@/shared/models/schemas/passenger.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePassengerDTO } from '../shared/models/dtos/request/passenger/updatepassenger.dto';

@Injectable()
export class PassengerService {
  constructor(
    @InjectModel(Passengers.name)
    private readonly passengerModel: Model<Passengers>,
  ) {}

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

  async getById(id: string): Promise<Passengers> {
    try {
      const passenger = await this.passengerModel.findById(id);
      if (!passenger) {
        throw new NotFoundException('Passenger not found.');
      }
      return passenger;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong fetching passenger.',
        error,
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const passenger = await this.passengerModel.findByIdAndUpdate(id, {
        status: Status.INACTIVE,
      });
      if (!passenger) {
        throw new NotFoundException('Passenger not found.');
      }
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong deleting passenger.',
        error,
      );
    }
  }

  async update(
    id: string,
    updatePassengerDTO: UpdatePassengerDTO,
  ): Promise<Passengers> {
    try {
      const passenger = await this.passengerModel.findByIdAndUpdate(
        id,
        updatePassengerDTO,
        { new: true },
      );
      if (!passenger) {
        throw new NotFoundException('Passenger not found.');
      }
      return passenger;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong updating passenger.',
        error,
      );
    }
  }

  async getAll(): Promise<PassengerDocument[]> {
    try {
      return await this.passengerModel.find();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong fetching passengers.',
        error,
      );
    }
  }

  async reactivate(id: string): Promise<void> {
    try {
      const passenger = await this.passengerModel.findByIdAndUpdate(id, {
        status: Status.ACTIVE,
      });
      if (!passenger) {
        throw new NotFoundException('Passenger not found.');
      }
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong reactivating passenger.',
        error,
      );
    }
  }
}
