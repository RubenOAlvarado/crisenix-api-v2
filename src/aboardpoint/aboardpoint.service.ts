import { AboardPointLean } from '@/shared/interfaces/aboardPoint/aboardPoint.lean.interface';
import { CreateAboardPointDTO } from '@/shared/models/dtos/aboardpoint/createaboardpoint.dto';
import { UpdateAboardPointDTO } from '@/shared/models/dtos/aboardpoint/updateaboardpoint.dto';
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
    this.logger.debug(`getting aboard point`);
    try {
      const aboardPoint = await this.aboardPointModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!aboardPoint) throw new NotFoundException('Aboard point not found');
      return aboardPoint;
    } catch (error) {
      this.logger.error(`Error getting aboard point: ${error}`);
      throw new InternalServerErrorException('Error getting aboard point');
    }
  }

  async findAll({ status }: StatusDTO): Promise<Array<AboardPointLean>> {
    this.logger.debug(`getting all aboard points`);
    try {
      return status
        ? await this.aboardPointModel
            .find({ status: status as Status })
            .select({ __v: 0, createdAt: 0 })
            .lean()
        : await this.aboardPointModel
            .find()
            .select({ __v: 0, createdAt: 0 })
            .lean();
    } catch (error) {
      this.logger.error(`Error getting all aboard points: ${error}`);
      throw new InternalServerErrorException('Error getting all aboard points');
    }
  }

  async update(
    { id }: UrlValidator,
    updateAboardPointDTO: UpdateAboardPointDTO,
  ): Promise<void> {
    this.logger.debug(`updating aboard point`);
    try {
      if (!(await this.validateAboardPoint({ id }))) return;
      await this.aboardPointModel.findByIdAndUpdate(id, updateAboardPointDTO, {
        new: true,
      });
    } catch (error) {
      this.logger.error(`Error updating aboard point: ${error}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      else
        throw new InternalServerErrorException('Error updating aboard point');
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
      this.logger.error(`Error deleting aboard point: ${error}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      else
        throw new InternalServerErrorException('Error deleting aboard point');
    }
  }

  async reactivate({ id }: UrlValidator) {
    this.logger.debug(`reactivating aboard point ${id}`);
    try {
      const inactiveAboardPoint = await this.findOne({ id });
      if (!inactiveAboardPoint)
        throw new NotFoundException('Aboard point not found');
      if (inactiveAboardPoint.status !== Status.INACTIVE)
        throw new BadRequestException(
          'Aboard point is already in active status',
        );
      await this.aboardPointModel
        .findByIdAndUpdate(id, { status: Status.ACTIVE }, { new: true })
        .exec();
    } catch (error) {
      this.logger.error(`Error reactivating aboard point: ${error}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      else
        throw new InternalServerErrorException(
          'Error reactivating aboard point',
        );
    }
  }

  private async validateAboardPoint({ id }: UrlValidator): Promise<boolean> {
    this.logger.debug(`validating aboard point`);
    try {
      const foundAboardPoint = await this.aboardPointModel.findById(id).lean();
      if (!foundAboardPoint)
        throw new NotFoundException('Aboard point not found');
      if (foundAboardPoint.status !== Status.ACTIVE)
        throw new BadRequestException('Aboard point must be in active status');
      return true;
    } catch (error) {
      this.logger.error(`Error validating aboard point: ${error}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      else
        throw new InternalServerErrorException('Error validating aboard point');
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
