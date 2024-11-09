import { CreateTourTypeDTO } from '@/shared/models/dtos/request/tourType/createTourType.dto';
import {
  TourTypeDocument,
  TourTypes,
} from '@/shared/models/schemas/tourtype.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getTourTypeByName(name?: string): Promise<TourTypeDocument> {
    try {
      if (!name) throw new BadRequestException('Name is required.');
      const foundTourTypes = await this.tourTypeModel.findOne({ name });
      if (!foundTourTypes)
        throw new NotFoundException(`Tour type with name ${name} not found.`);
      return foundTourTypes;
    } catch (error) {
      throw handleErrorsOnServices('Error getting tour type by name.', error);
    }
  }
}
