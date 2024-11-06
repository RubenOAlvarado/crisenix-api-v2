import { AboardPointLean } from '@/shared/types/aboardPoint/aboardPoint.lean.type';
import { CreateAboardPointDTO } from '@/shared/models/dtos/request/aboardpoint/createaboardpoint.dto';
import { UpdateAboardPointDTO } from '@/shared/models/dtos/request/aboardpoint/updateaboardpoint.dto';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';
import { Status } from 'src/shared/enums/status.enum';
import {
  AboardPoints,
  AboardPointDocument,
} from 'src/shared/models/schemas/aboarpoint.schema';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
@Injectable()
export class AboardpointService {
  constructor(
    @InjectModel(AboardPoints.name)
    private readonly aboardPointModel: Model<AboardPoints>,
  ) {}

  async create(
    aboardPoint: CreateAboardPointDTO,
  ): Promise<AboardPointDocument> {
    try {
      const newAboardPoint = new this.aboardPointModel(aboardPoint);
      return await newAboardPoint.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong creating aboard point.',
        error,
      );
    }
  }

  async findOne({ id }: IdValidator): Promise<AboardPointLean> {
    try {
      const aboardPoint = await this.aboardPointModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!aboardPoint) throw new NotFoundException('Aboard point not found.');
      return aboardPoint;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong getting aboard point.',
        error,
      );
    }
  }

  async findAll({ status }: StatusDTO): Promise<Array<AboardPointLean>> {
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
      throw handleErrorsOnServices(
        'Something went wrong getting all aboard points',
        error,
      );
    }
  }

  async update(
    { id }: IdValidator,
    updateAboardPointDTO: UpdateAboardPointDTO,
  ): Promise<AboardPointLean | null> {
    try {
      const updatedAboardPoint = await this.aboardPointModel.findByIdAndUpdate(
        id,
        updateAboardPointDTO,
        { new: true },
      );

      return updatedAboardPoint;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong updating aboard point.',
        error,
      );
    }
  }

  async changeStatus(
    { id }: IdValidator,
    { status }: StatusDTO,
  ): Promise<void> {
    try {
      const aboardPointToUpdate = await this.validateAboardPoint(id, status);
      aboardPointToUpdate.status =
        status === Status.ACTIVE ? Status.ACTIVE : Status.INACTIVE;
      await aboardPointToUpdate.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong deleting aboard point.',
        error,
      );
    }
  }

  private async validateAboardPoint(
    id: string,
    status: string = Status.ACTIVE,
  ) {
    try {
      const aboardPoint = await this.aboardPointModel.findById(id);

      if (!aboardPoint) throw new NotFoundException('Aboard point not found.');

      if (status === Status.INACTIVE && aboardPoint.status !== Status.ACTIVE)
        throw new BadRequestException('Aboard point must be in active status.');

      if (status === Status.ACTIVE && aboardPoint.status !== Status.INACTIVE)
        throw new BadRequestException(
          'Aboard point must be in inactive status.',
        );

      return aboardPoint;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong validating aboard point.',
        error,
      );
    }
  }

  async findByOriginCity({ id }: IdValidator): Promise<Array<AboardPointLean>> {
    try {
      const aboardPoints = await this.aboardPointModel
        .find({ originCity: id })
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (aboardPoints.length === 0)
        throw new NotFoundException('No aboard points found');
      return aboardPoints;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong getting all aboard points',
        error,
      );
    }
  }
}
