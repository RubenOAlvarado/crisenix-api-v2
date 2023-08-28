import { FilerService } from 'src/filer/filer.service';
import { QueryDTO } from '@/shared/dtos/query.dto';
import { Status } from '@/shared/enums/status.enum';
import { CreateCaptionDTO } from '@/shared/models/dtos/captions/createcaption.dto';
import { UpdateCaptionDTO } from '@/shared/models/dtos/captions/updatecaption.dto';
import {
  CaptionDocument,
  Captions,
} from '@/shared/models/schemas/captions.schema';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CaptionsService {
  constructor(
    @InjectModel(Captions.name) private readonly captionModel: Model<Captions>,
    private filer: FilerService,
  ) {}

  private readonly logger = new Logger(CaptionsService.name);

  async create(createCaptionDTO: CreateCaptionDTO): Promise<CaptionDocument> {
    try {
      this.logger.debug(`Creating caption ${createCaptionDTO.name}`);
      const caption = new this.captionModel(createCaptionDTO);
      return await caption.save();
    } catch (error) {
      this.logger.error('Something went wrong creating the caption', error);
      throw new InternalServerErrorException(
        'Something went wrong creating the caption',
      );
    }
  }

  async findAll({ status }: QueryDTO): Promise<CaptionDocument[]> {
    try {
      this.logger.debug('Finding all captions');
      const captions = status
        ? await this.captionModel.find({ status }).exec()
        : await this.captionModel.find().exec();
      return captions;
    } catch (error) {
      this.logger.error('Something went wrong finding all captions', error);
      throw new InternalServerErrorException(
        'Something went wrong finding all captions',
      );
    }
  }

  async findOne({ id }: UrlValidator): Promise<CaptionDocument> {
    try {
      this.logger.debug(`Finding caption ${id}`);
      const caption = await this.captionModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .exec();
      if (!caption) throw new NotFoundException(`Caption ${id} not found`);
      return caption;
    } catch (error) {
      this.logger.error('Something went wrong finding the caption', error);
      throw new InternalServerErrorException(
        'Something went wrong finding the caption',
      );
    }
  }

  async update(
    { id }: UrlValidator,
    updateCaptionDTO: UpdateCaptionDTO,
  ): Promise<void> {
    try {
      this.logger.debug(`Updating caption ${id}`);
      await this.captionModel.findByIdAndUpdate(id, updateCaptionDTO).exec();
    } catch (error) {
      this.logger.error('Something went wrong updating the caption', error);
      throw new InternalServerErrorException(
        'Something went wrong updating the caption',
      );
    }
  }

  async delete({ id }: UrlValidator): Promise<void> {
    try {
      this.logger.debug(`Deleting caption ${id}`);
      await this.captionModel
        .findByIdAndUpdate(id, { status: Status.INACTIVE }, { new: true })
        .exec();
    } catch (error) {
      this.logger.error('Something went wrong deleting the caption', error);
      throw new InternalServerErrorException(
        'Something went wrong deleting the caption',
      );
    }
  }

  async reactivate({ id }: UrlValidator): Promise<void> {
    try {
      this.logger.debug(`Reactivating caption ${id}`);
      const validCaption = await this.findOne({ id });
      if (!validCaption) throw new NotFoundException('Caption not found');
      if (validCaption.status === Status.ACTIVE)
        throw new BadRequestException('Caption already active');
      await this.captionModel
        .findByIdAndUpdate(id, { status: Status.ACTIVE }, { new: true })
        .exec();
    } catch (error) {
      this.logger.error('Something went wrong reactivating the caption', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      else
        throw new InternalServerErrorException(
          'Something went wrong reactivating the caption',
        );
    }
  }

  async loadFromExcel(file: Express.Multer.File): Promise<void> {
    try {
      this.logger.debug('Loading captions from excel');
      const jsonObject = this.filer.excelToJson(file.path);
      const captions: CreateCaptionDTO[] = this.mapJsonToDTO(jsonObject);
      await this.captionModel.insertMany(captions);
    } catch (error) {
      this.logger.error('Something went wrong loading the captions', error);
      throw new InternalServerErrorException(
        'Something went wrong loading the captions',
      );
    }
  }

  private mapJsonToDTO(jsonObject: any): CreateCaptionDTO[] {
    return jsonObject.map((caption: Captions) => {
      return {
        name: caption.name,
        status: caption.status,
      };
    });
  }
}
