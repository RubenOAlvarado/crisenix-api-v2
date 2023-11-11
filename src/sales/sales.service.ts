import { CreateSaleDTO } from '@/shared/models/dtos/sales/createsales.dto';
import { Sales, SalesDocument } from '@/shared/models/schemas/sales.schema';
import {
  Injectable,
  InternalServerErrorException,
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
import { ResponseSavedPaypalResponse } from '@/shared/models/dtos/sales/response-paypal.response.dto';
import { PaypalResponse } from '@/shared/models/dtos/sales/paypal.response.dto';
import { State } from '@/shared/enums/sales/state.enum';
import { SalesStatus } from '@/shared/enums/sales/salesstatus.enum';
import { SalesMove } from '@/shared/enums/sales/salemove.enum';
import { TourService } from '@/tour/tour.service';

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
      this.logger.debug(`creating new sale`);
      const createdSale = new this.salesModel(sale);
      return createdSale.save();
    } catch (error) {
      this.logger.error(
        `Something went wrong creating the sale: ${JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException(
        `Something went wrong creating the sale.`,
      );
    }
  }

  async findOne(id: string): Promise<Sales> {
    try {
      this.logger.debug(`finding sale by id`);
      const sale = await this.salesModel
        .findById(id)
        .populate('tour')
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!sale) {
        this.logger.error(`Sale not found.`);
        throw new NotFoundException(`Sale not found.`);
      }
      return sale;
    } catch (error) {
      this.logger.error(
        `Something went wrong finding the sale: ${JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException(
        `Something went wrong finding the sale.`,
      );
    }
  }

  async salesByUser(
    id: string,
    { page, limit }: PaginationDTO,
  ): Promise<PaginateResult<Sales>> {
    try {
      this.logger.debug(`finding sales by user`);
      await this.userService.validateUser(id);
      this.logger.debug(`User found, finding sales`);
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
      if (!docs.length) {
        this.logger.error(`User does not have sales registered.`);
        throw new BadRequestException(`User does not have sales registered.`);
      }
      const totalDocs = await this.salesModel.countDocuments({ user: id });
      return {
        docs,
        totalDocs,
        page,
        totalPages: Math.ceil(totalDocs / limit),
        hasPrevPage: page > 1,
        hasNextPage: page < Math.ceil(totalDocs / limit),
      };
    } catch (error) {
      this.logger.error(`Something went wrong finding the sales: ${error}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(
        `Something went wrong finding the sales.`,
      );
    }
  }

  async paypalResponse(
    { state, sale, failureReason }: PaypalResponse,
    user: any,
  ): Promise<ResponseSavedPaypalResponse> {
    try {
      this.logger.debug(`Validating sale response`);
      const validatedSale = await this.validateSale(sale);
      const tour = await this.tourService.validateSaledTour(
        validatedSale.tour._id.toString(),
      );
      let response: ResponseSavedPaypalResponse =
        {} as ResponseSavedPaypalResponse;
      if (validatedSale && tour) {
        // All validations passed, saving sale response
        this.logger.debug(`Processing paypal response `);

        if (state === State.APPROVED) {
          // TODO: create email service

          this.logger.debug(`Sale approved, sending email to client`);
          this.logger.debug(`Sale approved, updating status`);

          const updateSale = await this.salesModel.findByIdAndUpdate(
            sale,
            { status: SalesStatus.CHECKED },
            { new: true },
          );
          response = {
            sale: updateSale,
            message: 'Sale approved.',
          };
        } else {
          this.logger.debug(
            'Sale declined by paypal; updating status and seats',
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
          response = {
            sale: updatedSale,
            message: 'Sale declined.',
          };
        }
      }

      return response;
    } catch (error) {
      this.logger.error(
        `Something went wrong saving sale response: ${JSON.stringify(error)}`,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      else
        throw new InternalServerErrorException(
          'Something went wrong saving sale response.',
        );
    }
  }

  private async validateSale(saleId: string): Promise<Sales> {
    try {
      this.logger.debug(`Validating sale`);
      const currentSale = await this.findOne(saleId);
      if (!currentSale) {
        this.logger.error(`Sale not found.`);
        throw new NotFoundException(`Sale not found.`);
      }
      if (currentSale.status !== SalesStatus.RESERVED) {
        this.logger.error(`Sale not in ${SalesStatus.RESERVED} status.`);
        throw new BadRequestException(
          `Sale must be in reserved status to allow pay it.`,
        );
      }
      return currentSale;
    } catch (error) {
      this.logger.error(
        `Something went wrong validating sale: ${JSON.stringify(error)}`,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      else
        throw new InternalServerErrorException(
          `Something went wrong validating sale.`,
        );
    }
  }
}
