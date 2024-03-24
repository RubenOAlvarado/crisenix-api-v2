import { Sales, SalesDocument } from '@/shared/models/schemas/sales.schema';
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { PaginateResult } from '@/shared/interfaces/paginate.interface';
import { State } from '@/shared/enums/sales/state.enum';
import { SalesStatus } from '@/shared/enums/sales/salesstatus.enum';
import { SalesMove } from '@/shared/enums/sales/salemove.enum';
import { TourService } from '@/tour/tour.service';
import {
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import { CreateSaleDTO } from '@/shared/models/dtos/request/sales/createsales.dto';
import { PaypalResponse } from '@/shared/models/dtos/response/sales/paypal.response.dto';
import { ResponseSavedPaypalResponse } from '@/shared/models/dtos/response/sales/response-paypal.response.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sales.name) private readonly salesModel: Model<Sales>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => TourService))
    private tourService: TourService,
  ) {}

  private readonly logger = new Logger(SalesService.name);

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
        .populate('tour')
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

  async salesByUser(
    id: string,
    { page, limit }: PaginationDTO,
  ): Promise<PaginateResult<Sales>> {
    try {
      await this.userService.validateUser(id);
      const docs = await this.salesModel
        .find({ user: id })
        .populate({
          path: 'tour',
          populate: {
            path: 'destination',
            model: 'Destinations',
          },
        })
        .sort({ reservationDate: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!docs.length)
        throw new BadRequestException(`User does not have sales registered.`);
      const totalDocs = await this.salesModel.countDocuments({ user: id });
      return createPaginatedObject<Sales>(docs, totalDocs, page, limit);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong finding the sales.',
        error,
      );
    }
  }

  async paypalResponse(
    { state, sale, failureReason }: PaypalResponse,
    user: any,
  ): Promise<ResponseSavedPaypalResponse> {
    try {
      const validatedSale = await this.validateSaleForPayment(sale);
      const tour = await this.tourService.validateSaledTour(
        validatedSale.tour._id.toString(),
      );

      if (validatedSale && tour) {
        // All validations passed, saving sale response
        this.logger.debug(`Processing PayPal response `);

        if (state === State.APPROVED) {
          // TODO: create email service

          this.logger.debug(`Sale approved, sending email to client`);
          this.logger.debug(`Sale approved, updating status`);

          const updateSale = await this.salesModel.findByIdAndUpdate(
            sale,
            { status: SalesStatus.CHECKED },
            { new: true },
          );

          return {
            sale: updateSale,
            message: 'Sale approved.',
          };
        } else {
          this.logger.debug(
            'Sale declined by PayPal; updating status and seats',
          );

          await this.tourService.updateTourSeats(
            validatedSale.tour,
            validatedSale.reservedSeat,
            user,
            SalesMove.DELETE,
          );

          const updatedSale = await this.salesModel.findByIdAndUpdate(
            sale,
            { status: SalesStatus.DECLINED, failureReason, state },
            { new: true },
          );

          return {
            sale: updatedSale,
            message: 'Sale declined.',
          };
        }
      }

      return {} as ResponseSavedPaypalResponse;
    } catch (error) {
      throw handleErrorsOnServices('Error saving sale response.', error);
    }
  }

  private async validateSaleForPayment(saleId: string): Promise<Sales> {
    try {
      const currentSale = await this.findOne(saleId);

      if (!currentSale) {
        throw new NotFoundException(`Sale not found.`);
      }

      if (currentSale.status !== SalesStatus.RESERVED) {
        throw new BadRequestException(
          `Sale must be in reserved status to allow payment.`,
        );
      }

      return currentSale;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong validating sale.',
        error,
      );
    }
  }
}
