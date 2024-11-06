import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';
import { Entry } from '@/shared/enums/entry.enum';
import { Status } from '@/shared/enums/status.enum';
import { IncludedExcel } from '@/shared/interfaces/excel/included.excel.interface';
import { IncludedLean } from '@/shared/types/included/included.lean.type';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { CreateIncludedServiceDTO } from '@/shared/models/dtos/request/included/createincluded.dto';
import { UpdateIncludedServiceDTO } from '@/shared/models/dtos/request/included/updateincluded.dto';
import { IncludedServices } from '@/shared/models/schemas/included.schema';
import {
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class IncludedServicesService {
  constructor(
    @InjectModel(IncludedServices.name)
    private readonly includedServicesModel: Model<IncludedServices>,
  ) {}

  async create(
    createIncludedDTO: CreateIncludedServiceDTO,
  ): Promise<IncludedLean> {
    try {
      const createdIncluded = new this.includedServicesModel(createIncludedDTO);
      return await createdIncluded.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong creating included service',
        error,
      );
    }
  }

  async findOne({ id }: IdValidator): Promise<IncludedLean> {
    try {
      const included = await this.includedServicesModel
        .findById(id)
        .populate('lodging')
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!included) throw new NotFoundException('Included service not found.');
      return included;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong finding included service',
        error,
      );
    }
  }

  async findAll({
    page,
    limit,
    status,
  }: QueryDTO): Promise<PaginateResult<IncludedLean>> {
    try {
      const query = status ? { status } : {};
      const docs = await this.includedServicesModel
        .find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!docs.length)
        throw new NotFoundException('No included services registered.');
      const totalDocs = await this.includedServicesModel
        .countDocuments(query)
        .exec();
      return createPaginatedObject<IncludedLean>(docs, totalDocs, page, limit);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong finding included services',
        error,
      );
    }
  }

  async update(
    { id }: IdValidator,
    body: UpdateIncludedServiceDTO,
  ): Promise<IncludedLean> {
    try {
      const included = await this.includedServicesModel
        .findByIdAndUpdate(id, body, { new: true })
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!included) throw new NotFoundException('Included service not found.');
      return included;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong updating included service',
        error,
      );
    }
  }

  async delete({ id }: IdValidator): Promise<void> {
    try {
      const included = await this.includedServicesModel
        .findByIdAndUpdate(id, { status: Status.INACTIVE }, { new: true })
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!included) throw new NotFoundException('Included service not found.');
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong deleting included service',
        error,
      );
    }
  }

  async reactivate({ id }: IdValidator): Promise<void> {
    try {
      const included = await this.includedServicesModel
        .findByIdAndUpdate(id, { status: Status.ACTIVE }, { new: true })
        .exec();
      if (!included) throw new NotFoundException('Included service not found.');
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong reactivating included service',
        error,
      );
    }
  }

  async insertManyFromExcel(includedArray: any[]): Promise<void> {
    try {
      const includedServices = this.mapToDTO(includedArray);
      await this.includedServicesModel.insertMany(includedServices);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong inserting included services',
        error,
      );
    }
  }

  private mapToDTO(
    IncludedServices: IncludedExcel[],
  ): CreateIncludedServiceDTO[] {
    return IncludedServices.map((included) => {
      const response = {
        concept: included.concepto,
        included: included.incluido,
        publish: included.publicar,
        entry: included.rubro as Entry,
      };
      return response;
    });
  }
}
