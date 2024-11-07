import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateTransportTypeDTO } from '@/shared/models/dtos/request/transportType/createTransferType.dto';
import { TransportTypes } from '@/shared/models/schemas/transporttype.schema';

@Injectable()
export class TransportTypeService {
  constructor(
    @InjectModel(TransportTypes.name)
    private readonly transportModel: Model<TransportTypes>,
  ) {}

  async getTransportType({
    id,
  }: IdValidator): Promise<TransportTypes & { _id: ObjectId }> {
    try {
      const transportType = (await this.transportModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean()) as TransportTypes & { _id: ObjectId };
      if (!transportType) {
        throw new NotFoundException('Transport type not found.');
      }
      return transportType;
    } catch (error) {
      throw handleErrorsOnServices('Error getting transport type.', error);
    }
  }

  async insertTransportType(createTransportTypeDto: CreateTransportTypeDTO) {
    try {
      const newTransportType = new this.transportModel(createTransportTypeDto);
      return await newTransportType.save();
    } catch (error) {
      throw handleErrorsOnServices('Error getting transport type.', error);
    }
  }

  async getTransportTypeByName(name?: string) {
    try {
      if (!name) {
        throw new BadRequestException('Name is required.');
      }
      return await this.transportModel
        .findOne({ name })
        .select({ __v: 0, createdAt: 0 })
        .exec();
    } catch (error) {
      throw handleErrorsOnServices('Error getting transport type.', error);
    }
  }
}
