import {
  CaptionDocument,
  Captions,
} from '@/shared/models/schemas/captions.schema';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CaptionsLean } from '@/shared/types/captions/captions.lean.type';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { CreateCaptionDTO } from '@/shared/models/dtos/request/captions/createcaption.dto';
import { UpdateCaptionDTO } from '@/shared/models/dtos/request/captions/updatecaption.dto';
import { Status } from '@/shared/enums/status.enum';

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

  async findOne({ id }: IdValidator): Promise<CaptionsLean> {
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

  async update({ id }: IdValidator, updateCaptionDTO: UpdateCaptionDTO) {
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

  async changeStatus(
    { id }: IdValidator,
    { status }: StatusDTO,
  ): Promise<void> {
    try {
      const captionToUpdate = await this.validateCaption(id, status);
      await this.captionModel.findByIdAndUpdate(
        captionToUpdate._id,
        { status },
        { new: true },
      );
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong deleting the caption',
        error,
      );
    }
  }

  private async validateCaption(
    id: string,
    status: string = Status.ACTIVE,
  ): Promise<CaptionDocument> {
    try {
      const caption = await this.captionModel.findById(id);
      if (!caption) throw new NotFoundException(`Caption ${id} not found`);
      if (status === Status.INACTIVE && caption.status !== Status.ACTIVE)
        throw new BadRequestException('Caption is already inactive');
      if (status === Status.ACTIVE && caption.status !== Status.INACTIVE)
        throw new BadRequestException('Caption is already active');
      return caption;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong validating the caption',
        error,
      );
    }
  }
}
