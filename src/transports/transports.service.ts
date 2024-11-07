import { Transports } from '@/shared/models/schemas/transports.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransportsDTO } from '@/shared/models/dtos/request/transports/createtransports.dto';

@Injectable()
export class TransportsService {
  constructor(
    @InjectModel(Transports.name)
    private readonly transportModel: Model<Transports>,
  ) {}

  async getTransport({ id }: IdValidator): Promise<Transports> {
    try {
      const transport = await this.transportModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!transport) {
        throw new NotFoundException('Transport not found.');
      }
      return transport;
    } catch (error) {
      throw handleErrorsOnServices('Error getting transport.', error);
    }
  }

  async insertBunch(transports: CreateTransportsDTO[]): Promise<void> {
    try {
      await this.transportModel.insertMany(transports);
    } catch (error) {
      throw handleErrorsOnServices('Error inserting transports.', error);
    }
  }
}
