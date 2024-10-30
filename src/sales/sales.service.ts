import { Sales, SalesDocument } from '@/shared/models/schemas/sales.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { CreateSaleDTO } from '@/shared/models/dtos/request/sales/createsales.dto';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { SalesStatus } from '@/shared/enums/sales/saleStatus.enum';
import { DeclineSaleDto } from '@/shared/models/dtos/request/sales/declineSale.dto';

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

  async findOne({ id }: UrlValidator): Promise<Sales> {
    try {
      const sale = await this.salesModel
        .findById(id)
        .populate('reservation')
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

  async findSalesByReservationId({
    id: reservation,
  }: UrlValidator): Promise<Sales> {
    try {
      const sale = await this.salesModel
        .findOne({ reservation })
        .populate('reservation')
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!sale) {
        throw new NotFoundException(`Reservation not found.`);
      }
      return sale;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong finding the sale.',
        error,
      );
    }
  }

  async markSaleAsPaid({ id }: UrlValidator): Promise<Sales> {
    try {
      const sale = await this.validateSale(id);
      const updatedSale = await this.salesModel
        .findByIdAndUpdate(
          sale._id,
          { status: SalesStatus.PAID, paymentDate: new Date() },
          { new: true },
        )
        .exec();
      if (!updatedSale) {
        throw new NotFoundException(`Sale not found.`);
      }
      return updatedSale;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong marking the sale as paid.',
        error,
      );
    }
  }

  async markSaleAsDeclined(
    { id }: UrlValidator,
    { failureReason }: DeclineSaleDto,
  ): Promise<Sales> {
    try {
      const sale = await this.validateSale(id);
      const updatedSale = await this.salesModel
        .findByIdAndUpdate(
          sale._id,
          { status: SalesStatus.DECLINED, failureReason },
          { new: true },
        )
        .exec();
      if (!updatedSale) {
        throw new NotFoundException(`Sale not found.`);
      }
      // TODO: cancel reservation and release seats
      return updatedSale;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong marking the sale as declined.',
        error,
      );
    }
  }

  private async validateSale(id: string): Promise<SalesDocument> {
    const sale = await this.salesModel.findById(id).exec();
    if (!sale) {
      throw new NotFoundException(`Sale not found.`);
    }
    if (sale.status === SalesStatus.PAID) {
      throw new NotFoundException(`Sale already paid.`);
    }
    return sale;
  }
}
