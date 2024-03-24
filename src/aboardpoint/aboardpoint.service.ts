import { AboardPointLean } from '@/shared/interfaces/aboardPoint/aboardPoint.lean.interface';
import { CreateAboardPointDTO } from '@/shared/models/dtos/request/aboardpoint/createaboardpoint.dto';
import { UpdateAboardPointDTO } from '@/shared/models/dtos/request/aboardpoint/updateaboardpoint.dto';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusDTO } from 'src/shared/dtos/statusparam.dto';
import { Status } from 'src/shared/enums/status.enum';
import {
  AboardPoints,
  AboardPointDocument,
} from 'src/shared/models/schemas/aboarpoint.schema';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
@Injectable()
export class AboardpointService {
  constructor(
    @InjectModel(AboardPoints.name)
    private readonly aboardPointModel: Model<AboardPoints>,
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

  async findOne({ id }: UrlValidator): Promise<AboardPointLean> {
    try {
      const aboardPoint = await this.aboardPointModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!aboardPoint) throw new NotFoundException('Aboard point not found.');
      return aboardPoint;
    } catch (error) {
      this.logger.error(`Error getting aboard point: ${error}`);
      throw handleErrorsOnServices(
        'Something went wrong getting aboard point.',
        error,
      );
    }
  }

  async findAll({ status }: StatusDTO): Promise<Array<AboardPointLean>> {
    this.logger.debug(`getting all aboard points`);
    try {
      const query = status ? { status } : {};
      const aboardPoints = await this.aboardPointModel
        .find(query)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (aboardPoints.length === 0)
        throw new NotFoundException('No aboard points found');
      return aboardPoints;
    } catch (error) {
      this.logger.error(
        `Something went wrong getting all aboard points: ${error}`,
      );
      throw handleErrorsOnServices(
        'Something went wrong getting all aboard points',
        error,
      );
    }
  }

  async update(
    { id }: UrlValidator,
    updateAboardPointDTO: UpdateAboardPointDTO,
  ): Promise<AboardPointLean | null> {
    try {
      this.logger.debug(`Updating aboard point`);

      if (!(await this.validateAboardPoint({ id }))) {
        // Returning null as an indication of unsuccessful validation
        return null;
      }

      const updatedAboardPoint = await this.aboardPointModel.findByIdAndUpdate(
        id,
        updateAboardPointDTO,
        { new: true },
      );

      return updatedAboardPoint;
    } catch (error) {
      this.logger.error(`Something went wrong updating aboard point: ${error}`);
      throw handleErrorsOnServices(
        'Something went wrong updating aboard point.',
        error,
      );
    }
  }

  async delete({ id }: UrlValidator) {
    this.logger.debug(`deleting aboard point ${id}`);
    try {
      if (!(await this.validateAboardPoint({ id }))) return;
      await this.aboardPointModel.findByIdAndUpdate(
        id,
        { status: Status.INACTIVE },
        { new: true },
      );
    } catch (error) {
      this.logger.error(`Something went wrong deleting aboard point: ${error}`);
      throw handleErrorsOnServices(
        'Something went wrong deleting aboard point.',
        error,
      );
    }
  }

  async reactivate({ id }: UrlValidator): Promise<void> {
    try {
      this.logger.debug(`Reactivating aboard point ${id}`);

      const inactiveAboardPoint = await this.findOne({ id });

      if (!inactiveAboardPoint) {
        throw new NotFoundException('Aboard point not found.');
      }

      if (inactiveAboardPoint.status !== Status.INACTIVE) {
        throw new BadRequestException(
          'Aboard point is already in active status.',
        );
      }

      await this.aboardPointModel
        .findByIdAndUpdate(id, { status: Status.ACTIVE }, { new: true })
        .exec();
    } catch (error) {
      this.logger.error(`Error reactivating aboard point: ${error}`);
      throw handleErrorsOnServices(
        'Something went wrong reactivating aboard point.',
        error,
      );
    }
  }

  private async validateAboardPoint({ id }: UrlValidator): Promise<boolean> {
    try {
      this.logger.debug(`Validating aboard point`);

      const foundAboardPoint = await this.aboardPointModel.findById(id).lean();

      if (!foundAboardPoint) {
        throw new NotFoundException('Aboard point not found.');
      }

      if (foundAboardPoint.status !== Status.ACTIVE) {
        throw new BadRequestException('Aboard point must be in active status.');
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Something went wrong validating aboard point: ${error}`,
      );
      throw handleErrorsOnServices(
        'Something went wrong validating aboard point.',
        error,
      );
    }
  }

  async mapFromNameToObjectId(
    aboardPoints?: string[],
  ): Promise<string[] | undefined> {
    try {
      this.logger.debug(`Mapping aboard points`);

      if (!aboardPoints && aboardPoints !== null) {
        return;
      }

      const mappedAboardPoints = await Promise.all(
        aboardPoints.map(async (aboardPoint) => {
          const foundAboardPoint = await this.aboardPointModel
            .findOne({ name: aboardPoint })
            .lean();

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
