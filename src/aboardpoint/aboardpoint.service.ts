import { AboardPointLean } from '@/shared/interfaces/aboardPoint/aboardPoint.lean.interface';
import { AboardPointExcel } from '@/shared/interfaces/excel/aboardPoint.excel.interface';
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

  async findOne({ id }: UrlValidator): Promise<AboardPointLean> {
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
    { id }: UrlValidator,
    updateAboardPointDTO: UpdateAboardPointDTO,
  ): Promise<AboardPointLean | null> {
    try {
      if (!(await this.validateAboardPoint({ id }))) {
        return null;
      }

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

  async delete({ id }: UrlValidator) {
    try {
      if (!(await this.validateAboardPoint({ id }))) return;
      await this.aboardPointModel.findByIdAndUpdate(
        id,
        { status: Status.INACTIVE },
        { new: true },
      );
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong deleting aboard point.',
        error,
      );
    }
  }

  async reactivate({ id }: UrlValidator): Promise<void> {
    try {
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
      throw handleErrorsOnServices(
        'Something went wrong reactivating aboard point.',
        error,
      );
    }
  }

  private async validateAboardPoint({ id }: UrlValidator): Promise<boolean> {
    try {
      const foundAboardPoint = await this.aboardPointModel.findById(id).lean();

      if (!foundAboardPoint) {
        throw new NotFoundException('Aboard point not found.');
      }

      if (foundAboardPoint.status !== Status.ACTIVE) {
        throw new BadRequestException('Aboard point must be in active status.');
      }

      return true;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong validating aboard point.',
        error,
      );
    }
  }

  async mapFromNameToObjectId(
    aboardPoints?: string[],
  ): Promise<string[] | undefined> {
    if (!aboardPoints?.length && aboardPoints !== null) {
      return;
    }

    try {
      const mappedAboardPoints: string[] = [];
      for (const aboardPoint of aboardPoints) {
        const foundAboardPoint = await this.findByName(aboardPoint.trim());
        if (!foundAboardPoint) {
          throw new NotFoundException(`Aboard point ${aboardPoint} not found.`);
        }
        mappedAboardPoints.push(foundAboardPoint?._id?.toString());
      }
      return mappedAboardPoints;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong mapping aboard points.',
        error,
      );
    }
  }

  async findByName(name?: string): Promise<AboardPointLean> {
    try {
      if (!name) {
        throw new BadRequestException('Name is required.');
      }
      const foundAboardPoint = await this.aboardPointModel
        .findOne({ name })
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!foundAboardPoint) {
        throw new NotFoundException(`Aboard point ${name} not found.`);
      }
      return foundAboardPoint;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong finding aboard point by name.',
        error,
      );
    }
  }

  async insertAboardPointBunch(
    aboardPoints: AboardPointExcel[],
  ): Promise<void> {
    try {
      const mappedAboardPoints: CreateAboardPointDTO[] = aboardPoints.map(
        (aboardPoint) => ({
          name: aboardPoint.nombre,
          status: (aboardPoint.status as Status) ?? Status.ACTIVE,
        }),
      );
      await this.aboardPointModel.insertMany(mappedAboardPoints);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong inserting aboard points.',
        error,
      );
    }
  }
}
