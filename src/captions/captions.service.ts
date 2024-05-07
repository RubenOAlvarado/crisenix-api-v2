import { Status } from '@/shared/enums/status.enum';
import {
  CaptionDocument,
  Captions,
} from '@/shared/models/schemas/captions.schema';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CaptionsLean } from '@/shared/interfaces/captions/captions.lean.interface';
import { StatusDTO } from '@/shared/dtos/statusparam.dto';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { CreateCaptionDTO } from '@/shared/models/dtos/request/captions/createcaption.dto';
import { UpdateCaptionDTO } from '@/shared/models/dtos/request/captions/updatecaption.dto';

@Injectable()
export class CaptionsService {
  constructor(
    @InjectModel(Captions.name) private readonly captionModel: Model<Captions>,
  ) {}

  async create(createCaptionDTO: CreateCaptionDTO): Promise<CaptionDocument> {
    try {
      const caption = new this.captionModel(createCaptionDTO);
      return await caption.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong creating the caption',
        error,
      );
    }
  }

  async findAll({ status }: StatusDTO): Promise<Array<CaptionsLean>> {
    try {
      const query = status ? { status } : {};
      const captions = await this.captionModel
        .find(query)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!captions) throw new NotFoundException('No captions registered');
      return captions;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong finding all captions',
        error,
      );
    }
  }

  async findOne({ id }: UrlValidator): Promise<CaptionsLean> {
    try {
      const caption = await this.captionModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!caption) throw new NotFoundException(`Caption ${id} not found`);
      return caption;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong finding the caption',
        error,
      );
    }
  }

  async update({ id }: UrlValidator, updateCaptionDTO: UpdateCaptionDTO) {
    try {
      const caption = await this.captionModel.findByIdAndUpdate(
        id,
        updateCaptionDTO,
        { new: true },
      );
      if (!caption) throw new NotFoundException(`Caption ${id} not found`);
      return caption;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong updating the caption',
        error,
      );
    }
  }

  async delete({ id }: UrlValidator): Promise<void> {
    try {
      const caption = await this.captionModel.findByIdAndDelete(id);
      if (!caption) throw new NotFoundException(`Caption ${id} not found`);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong deleting the caption',
        error,
      );
    }
  }

  async reactivate({ id }: UrlValidator): Promise<void> {
    try {
      const validCaption = await this.findOne({ id });
      if (!validCaption) throw new NotFoundException('Caption not found');
      if (validCaption.status === Status.ACTIVE)
        throw new BadRequestException('Caption already active');
      await this.captionModel.findByIdAndUpdate(
        id,
        { status: Status.ACTIVE },
        { new: true },
      );
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong reactivating the caption',
        error,
      );
    }
  }

  /* async loadFromExcel(file: Express.Multer.File): Promise<void> {
    try {
      const jsonObject = this.filer.excelToJson(file.path);
      const captions: CreateCaptionDTO[] = this.mapJsonToDTO(jsonObject);
      await this.captionModel.insertMany(captions);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong loading the captions',
        error,
      );
    }
  } */

  /* private mapJsonToDTO(jsonObject: any): CreateCaptionDTO[] {
    return jsonObject.map((caption: Captions) => {
      return {
        name: caption.name,
        status: caption.status,
      };
    });
  } */
}
