import { Transports } from '@/shared/models/schemas/transporst.schema';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TransportsService {
  constructor(
    @InjectModel(Transports.name)
    private readonly transportModel: Model<Transports>,
  ) {}

  private logger = new Logger(TransportsService.name);

  async getTransport({ id }: UrlValidator): Promise<Transports> {
    try {
      this.logger.debug(`Getting transport with id: ${id}`);
      const transport = await this.transportModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!transport) {
        this.logger.error(`Transport with id: ${id} not found.`);
        throw new NotFoundException('Transport not found.');
      }
      return transport;
    } catch (error) {
      this.logger.error(
        `Something went wrong getting transport with id: ${id}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Something went wrong getting transport.',
      );
    }
  }
}
