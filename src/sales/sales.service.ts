import { Sales, SalesDocument } from '@/shared/models/schemas/sales.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { CreateSaleDTO } from '@/shared/models/dtos/request/sales/createsales.dto';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { SalesStatus } from '@/shared/enums/sales/saleStatus.enum';
import { DeclineSaleDto } from '@/shared/models/dtos/request/sales/declineSale.dto';
import { ReservationService } from '@/reservation/reservation.service';
import { ReservationStatus } from '@/shared/enums/reservation-status.enum';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sales.name) private readonly salesModel: Model<Sales>,
    private readonly reservationService: ReservationService,
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

  async findOne({ id }: IdValidator): Promise<Sales> {
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
  }: IdValidator): Promise<Sales> {
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

  async markSaleAsPaid({ id }: IdValidator): Promise<Sales> {
    try {
      const validSale = await this.validateSale(id);
      const updatedSale = await this.salesModel
        .findByIdAndUpdate(
          validSale._id,
          { status: SalesStatus.PAID, paymentDate: new Date() },
          { new: true },
        )
        .exec();
      await this.reservationService.changeStatus(
        { id: validSale.reservation.toString() },
        {
          status: ReservationStatus.PAID,
        },
      );
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

  async markSaleAsDeclined({
    id,
    failureReason,
  }: DeclineSaleDto): Promise<Sales> {
    try {
      const validSale = await this.validateSale(id);
      const updatedSale = await this.salesModel
        .findByIdAndUpdate(
          validSale._id,
          { status: SalesStatus.DECLINED, failureReason },
          { new: true },
        )
        .exec();
      await this.reservationService.changeStatus(
        { id: validSale.reservation.toString() },
        {
          status: ReservationStatus.CANCELLED,
        },
      );
      if (!updatedSale) {
        throw new NotFoundException(`Sale not found.`);
      }
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
