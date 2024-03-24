import { CreatePrivatetourDto } from '@/shared/models/dtos/request/privatetour/create-privatetour.dto';
import { PrivateTours } from '@/shared/models/schemas/privatetour.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PrivatetourService {
  constructor(
    @InjectModel(PrivateTours.name)
    private readonly privateTourModel: Model<PrivateTours>,
  ) {}

  // private readonly logger = new Logger(PrivatetourService.name);

  async create(
    createPrivateTourDto: CreatePrivatetourDto,
  ): Promise<CreatePrivatetourDto> {
    try {
      const createdPrivateTour = new this.privateTourModel(
        createPrivateTourDto,
      );
      const privateTour = await createdPrivateTour.save();
      const responseDTO: CreatePrivatetourDto = {
        ...privateTour,
      };
      return responseDTO;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong creating the private tour.',
        error,
      );
    }
  }
}
