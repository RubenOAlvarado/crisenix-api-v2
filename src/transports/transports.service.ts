import { Transports } from '@/shared/models/schemas/transports.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TransportsService {
  constructor(
    @InjectModel(Transports.name)
    private readonly transportModel: Model<Transports>,
  ) {}

  async getTransport({ id }: UrlValidator): Promise<Transports> {
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

  async validateFromTourExcel(name?: string): Promise<string> {
    try {
      if (!name) {
        throw new BadRequestException('Transport name is required');
      }
      const transport = await this.transportModel.findOne({ name });
      if (!transport) {
        throw new NotFoundException('Transport not found.');
      }
      return transport._id.toString();
    } catch (error) {
      throw handleErrorsOnServices('Error validating transport.', error);
    }
  }
}
