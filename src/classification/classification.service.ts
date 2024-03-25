import { FilerService } from '@/filer/filer.service';
import { Status } from '@/shared/enums/status.enum';
import { ClassificationLean } from '@/shared/interfaces/classification/classification.lean.interface';
import { CreateClassificationDTO } from '@/shared/models/dtos/request/classification/createclassification.dto';
import { UpdateClassificationDTO } from '@/shared/models/dtos/request/classification/updateclasification.dto';
import { ResponseClassificationDTO } from '@/shared/models/dtos/response/classifications/responseclassifications.dto';
import { Classifications } from '@/shared/models/schemas/classification.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ClassificationService {
  constructor(
    @InjectModel(Classifications.name)
    private readonly classificationModel: Model<Classifications>,
    private filerService: FilerService,
  ) {}

  async create(
    createClassificationDTO: CreateClassificationDTO,
  ): Promise<ResponseClassificationDTO> {
    try {
      const classification = new this.classificationModel(
        createClassificationDTO,
      );
      return await classification.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while creating classification.',
        error,
      );
    }
  }

  async findAll(status?: string): Promise<Array<ClassificationLean>> {
    try {
      const query = status ? { status } : {};
      const Classifications = await this.classificationModel
        .find(query)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!Classifications)
        throw new NotFoundException('No Classifications registered.');
      return Classifications;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while finding all Classifications',
        error,
      );
    }
  }

  async findOne(id: string): Promise<ClassificationLean> {
    try {
      const classification = await this.classificationModel.findById(id).lean();
      if (!classification)
        throw new NotFoundException('classification not found.');
      return classification;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while finding classification.',
        error,
      );
    }
  }

  async update(
    id: string,
    UpdateClassificationsDTO: UpdateClassificationDTO,
  ): Promise<ClassificationLean> {
    try {
      const updatedclassification =
        await this.classificationModel.findByIdAndUpdate(
          id,
          UpdateClassificationsDTO,
          {
            new: true,
          },
        );
      if (!updatedclassification)
        throw new NotFoundException('classification not found.');
      return updatedclassification;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while updating classification.',
        error,
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const classification = await this.findOne(id);
      if (!classification)
        throw new NotFoundException('classification not found.');
      if (classification.status === Status.INACTIVE)
        throw new BadRequestException('classification already deleted.');
      await this.classificationModel.findByIdAndUpdate(
        id,
        { status: Status.INACTIVE },
        {
          new: true,
        },
      );
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while deleting classification.',
        error,
      );
    }
  }

  async reactivate(id: string): Promise<void> {
    try {
      const classification = await this.findOne(id);
      if (!classification)
        throw new NotFoundException('classification not found.');
      if (classification.status === Status.ACTIVE)
        throw new BadRequestException('classification already active.');
      await this.classificationModel.findByIdAndUpdate(
        id,
        { status: Status.ACTIVE },
        {
          new: true,
        },
      );
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while reactivating classification.',
        error,
      );
    }
  }

  async loadFromExcel(file: Express.Multer.File): Promise<void> {
    try {
      const jsonObject = this.filerService.excelToJson(file.path);
      const Classifications: CreateClassificationDTO[] =
        this.mapJsonToclassification(jsonObject);
      await this.classificationModel.insertMany(Classifications);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong while loading the Classifications.',
        error,
      );
    }
  }

  private mapJsonToclassification(json: any): CreateClassificationDTO[] {
    return json.map((classification: Classifications) => {
      return {
        name: classification.name,
        description: classification?.description,
        status: Status.ACTIVE,
      };
    });
  }

  async mapFromNameToObjectId(names: string[]): Promise<string[] | undefined> {
    try {
      if (!names.length) {
        return;
      }

      const mappedClassifications = await Promise.all(
        names.map(async (name) => {
          const classification = await this.classificationModel
            .findOne({ name })
            .lean();

          if (!classification) {
            const createdclassification = await this.create({
              name: name,
              status: Status.ACTIVE,
            });

            return createdclassification?._id?.toString();
          }

          return classification._id.toString();
        }),
      );

      return mappedClassifications as string[];
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong mapping Classifications',
        error,
      );
    }
  }
}
