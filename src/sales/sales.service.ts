import { Sales, SalesDocument } from '@/shared/models/schemas/sales.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { CreateSaleDTO } from '@/shared/models/dtos/request/sales/createsales.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sales.name) private readonly salesModel: Model<Sales>,
  ) {}

  async create(sale: CreateSaleDTO): Promise<SalesDocument> {
    try {
      const createdSale = new this.salesModel(sale);
      return createdSale.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong creating sale.',
        error,
      );
    }
  }

  async findOne(id: string): Promise<Sales> {
    try {
      const sale = await this.salesModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!sale) {
        throw new NotFoundException(`Sale not found.`);
      }
      return sale;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong finding the sale.',
        error,
      );
    }
  }
}
