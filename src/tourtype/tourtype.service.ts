import { CreateTourTypeDTO } from '@/shared/models/dtos/request/tourType/createTourType.dto';
import { TourTypes } from '@/shared/models/schemas/tourtype.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TourtypeService {
  constructor(
    @InjectModel(TourTypes.name)
    private readonly tourTypeModel: Model<TourTypes>,
  ) {}

  async insertBunch(tourTypes: CreateTourTypeDTO[]): Promise<void> {
    try {
      await this.tourTypeModel.insertMany(tourTypes);
    } catch (error) {
      throw handleErrorsOnServices('Error inserting tour types.', error);
    }
  }
}
