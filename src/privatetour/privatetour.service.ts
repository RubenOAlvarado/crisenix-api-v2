import { CreatePrivatetourDto } from '@/shared/models/dtos/privatetour/create-privatetour.dto';
import { PrivateTours } from '@/shared/models/schemas/privatetour.schema';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PrivatetourService {
  constructor(
    @InjectModel(PrivateTours.name)
    private readonly privateTourModel: Model<PrivateTours>,
  ) {}

  private readonly logger = new Logger(PrivatetourService.name);

  async create(
    createPrivateTourDto: CreatePrivatetourDto,
  ): Promise<CreatePrivatetourDto> {
    try {
      this.logger.debug(`Creating new private tour`);
      const createdPrivateTour = new this.privateTourModel(
        createPrivateTourDto,
      );
      const privateTour = await createdPrivateTour.save();
      const responseDTO: CreatePrivatetourDto = {
        ...privateTour,
      };
      return responseDTO;
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
