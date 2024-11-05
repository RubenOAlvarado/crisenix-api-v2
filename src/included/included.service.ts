import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';
import { Entry } from '@/shared/enums/entry.enum';
import { Status } from '@/shared/enums/status.enum';
import { IncludedExcel } from '@/shared/interfaces/excel/included.excel.interface';
import { IncludedLean } from '@/shared/interfaces/included/included.lean.interface';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { CreateIncludedDTO } from '@/shared/models/dtos/request/included/createincluded.dto';
import { UpdateIncludedDTO } from '@/shared/models/dtos/request/included/updateincluded.dto';
import { Includeds } from '@/shared/models/schemas/included.schema';
import {
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class IncludedService {
  constructor(
    @InjectModel(Includeds.name)
    private readonly includedModel: Model<Includeds>,
  ) {}

  async create(createIncludedDTO: CreateIncludedDTO): Promise<IncludedLean> {
    try {
      const createdIncluded = new this.includedModel(createIncludedDTO);
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
      const included = await this.includedModel
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
      const docs = await this.includedModel
        .find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!docs.length)
        throw new NotFoundException('No included services registered.');
      const totalDocs = await this.includedModel.countDocuments(query).exec();
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
    body: UpdateIncludedDTO,
  ): Promise<IncludedLean> {
    try {
      const included = await this.includedModel
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
      const included = await this.includedModel
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
      const included = await this.includedModel
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
      const includeds = this.mapToDTO(includedArray);
      await this.includedModel.insertMany(includeds);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong inserting included services',
        error,
      );
    }
  }

  private mapToDTO(includeds: IncludedExcel[]): CreateIncludedDTO[] {
    return includeds.map((included) => {
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
