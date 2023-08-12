import { CreateAboardPointDTO } from '@/shared/models/dtos/aboardpoint/createaboardpoint.dto';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusDTO } from 'src/shared/dtos/statusparam.dto';
import { Status } from 'src/shared/enums/status.enum';
import {
  AboardPoint,
  AboardPointDocument,
} from 'src/shared/models/schemas/aboarpoint.schema';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
@Injectable()
export class AboardpointService {
  constructor(
    @InjectModel(AboardPoint.name)
    private readonly aboardPointModel: Model<AboardPoint>,
  ) {}

  private readonly logger = new Logger(AboardpointService.name);

  async create(
    aboardPoint: CreateAboardPointDTO,
  ): Promise<AboardPointDocument> {
    this.logger.debug(`creating new aboard point`);
    try {
      const newAboardPoint = new this.aboardPointModel(aboardPoint);
      return await newAboardPoint.save();
    } catch (error) {
      this.logger.error(`Error creating an aboard point: ${error}`);
      throw new InternalServerErrorException('Error creating an aboard point');
    }
  }

  async findOne({ id }: UrlValidator): Promise<AboardPointDocument | null> {
    this.logger.debug(`getting aboard point`);
    try {
      return await this.aboardPointModel
        .findById(id)
        .select({ _id: 0, __v: 0, createdAt: 0 })
        .exec();
    } catch (error) {
      this.logger.error(`Error getting aboard point: ${error}`);
      throw new InternalServerErrorException('Error getting aboard point');
    }
  }

  async findAll({ status }: StatusDTO): Promise<Array<AboardPoint>> {
    this.logger.debug(`getting all aboard points`);
    try {
      return status
        ? await this.aboardPointModel
            .find({ status: status as Status })
            .select({ __v: 0, createdAt: 0 })
            .exec()
        : await this.aboardPointModel
            .find()
            .select({ __v: 0, createdAt: 0 })
            .exec();
    } catch (error) {
      this.logger.error(`Error getting all aboard points: ${error}`);
      throw new InternalServerErrorException('Error getting all aboard points');
    }
  }

  async mapFromNameToObjectId(
    aboardPoints?: string[],
  ): Promise<string[] | undefined> {
    this.logger.debug(`mapping aboard points`);
    try {
      if (!aboardPoints && aboardPoints !== null) return;
      const mappedAboardPoints = await Promise.all(
        aboardPoints.map(async (aboardPoint) => {
          const foundAboardPoint = await this.aboardPointModel
            .findOne({ name: aboardPoint })
            .exec();
          if (foundAboardPoint) {
            return foundAboardPoint._id.toString();
          } else {
            const newAboardPoint = await this.create({
              name: aboardPoint,
              status: Status.ACTIVE,
            });
            return newAboardPoint._id.toString();
          }
        }),
      );
      return mappedAboardPoints;
    } catch (error) {
      this.logger.error(`Error mapping aboard points: ${error}`);
      throw new InternalServerErrorException('Error mapping aboard points');
    }
  }
}
