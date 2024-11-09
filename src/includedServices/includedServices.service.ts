import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';
import { Status } from '@/shared/enums/status.enum';
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
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';

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

  async changeStatus(
    { id }: IdValidator,
    { status }: StatusDTO,
  ): Promise<void> {
    try {
      const includedServiceToUpdate = await this.validateIncludedService(
        id,
        status,
      );
      includedServiceToUpdate.status =
        status === Status.ACTIVE ? Status.ACTIVE : Status.INACTIVE;

      await includedServiceToUpdate.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong deleting included service',
        error,
      );
    }
  }

  private async validateIncludedService(
    id: string,
    status: string = Status.ACTIVE,
  ) {
    const includedService = await this.includedServicesModel.findById(id);
    if (!includedService)
      throw new NotFoundException('Included service not found.');
    if (status === Status.INACTIVE && includedService.status !== Status.ACTIVE)
      throw new NotFoundException('Included service must be active.');
    if (status === Status.ACTIVE && includedService.status !== Status.INACTIVE)
      throw new NotFoundException('Included service must be inactive.');
    return includedService;
  }

  async insertBunch(
    includedServices: CreateIncludedServiceDTO[],
  ): Promise<void> {
    try {
      await this.includedServicesModel.insertMany(includedServices);
    } catch (error) {
      throw handleErrorsOnServices('Error inserting included services.', error);
    }
  }

  async findIncludedServiceByConcept(concept?: string): Promise<IncludedLean> {
    try {
      const includedService = await this.includedServicesModel
        .findOne({ concept })
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!includedService)
        throw new NotFoundException(`Included service ${concept} not found.`);
      return includedService;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong finding included service',
        error,
      );
    }
  }
}
