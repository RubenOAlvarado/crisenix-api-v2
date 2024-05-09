import { TourTypes } from '@/shared/models/schemas/tourtype.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TourtypeService {
  constructor(
    @InjectModel(TourTypes.name)
    private readonly tourTypeModel: Model<TourTypes>,
  ) {}

  async validateFromTourExcel(name?: string): Promise<string> {
    try {
      if (!name) {
        throw new BadRequestException('Tour type name is required');
      }
      const tourType = await this.tourTypeModel.findOne({ name });
      if (!tourType) {
        const newTourType = new this.tourTypeModel({ name });
        await newTourType.save();
        return newTourType._id.toString();
      }
      return tourType._id.toString();
    } catch (error) {
      throw handleErrorsOnServices('Error validating tour type.', error);
    }
  }
}
