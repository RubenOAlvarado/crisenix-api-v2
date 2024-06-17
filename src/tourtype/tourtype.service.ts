import { TourTypeExcel } from '@/shared/interfaces/excel/tourType.excel.interface';
import { CreateTourTypeDTO } from '@/shared/models/dtos/request/tourType/createTourType.dto';
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

  async insertTourTypeBunch(jsonObject: TourTypeExcel[]): Promise<void> {
    try {
      const tourTypeDTO = this.mapToDto(jsonObject);
      await this.tourTypeModel.insertMany(tourTypeDTO);
    } catch (error) {
      throw handleErrorsOnServices('Error inserting tour types.', error);
    }
  }

  private mapToDto(jsonObject: TourTypeExcel[]): CreateTourTypeDTO[] {
    try {
      const mappedDTO: CreateTourTypeDTO[] = [];
      for (const { nombre, descripcion } of jsonObject) {
        const dto: CreateTourTypeDTO = {
          name: nombre,
          description: descripcion ?? '',
        };
        mappedDTO.push(dto);
      }
      return mappedDTO;
    } catch (error) {
      throw handleErrorsOnServices('Error mapping tour types.', error);
    }
  }
}
