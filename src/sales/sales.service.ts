import { CreateSaleDTO } from '@/shared/models/dtos/sales/createsales.dto';
import { Sales, SalesDocument } from '@/shared/models/schemas/sales.schema';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { SalesStatus } from '@/shared/enums/sales/salesstatus.enum';
import { UserService } from '../user/user.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sales.name) private readonly salesModel: Model<Sales>,
    private readonly userService: UserService,
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
      const sale = await this.salesModel.findById(id).populate('tour').lean();
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

  async salesByUser(id: string): Promise<Sales[]> {
    try {
      this.logger.debug(`finding sales by user`);
      await this.userService.validateUser(id);
      this.logger.debug(`User found, finding sales`);
      const sales = await this.salesModel
        .find({ user: id })
        .populate({
          path: 'tour',
          populate: {
            path: 'destination',
            model: 'Destinations',
          },
        })
        .sort({ reservationDate: -1 })
        .lean();
      if (!sales.length) {
        this.logger.error(`User does not have sales registered.`);
        throw new NotFoundException(`User does not have sales registered.`);
      }
      this.logger.debug(`Sales found.`);
      return sales;
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

  /* async paypalResponse(
    { state, sale, operationId, failureReason }: PaypalResponse,
    user: any,
  ): Promise<ResponseSavedPaypalResponse> {
    try {
      this.logger.debug(`Validating sale response`);
      const validatedSale = await this.validateSale(sale);
      if(validatedSale && this.tourService.validateSaledTour(validatedSale.tour._id.toString())){
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
        const response: ResponseSavedPaypalResponse = {
          sale: updateSale,
          message: 'Sale approved.',
        };
        return response;
      } else {
        this.logger.debug('Sale declined by paypal; updating status and seats');
        await this.tourService.updateSeats({
          id: saleTour._id.toString(),
          seats: currentSale.reservedSeat,
          user,
          move: SalesMove.DELETE,
        }); 
        const updatedSale = await this.salesModel.findByIdAndUpdate(
          sale,
          { status: SalesStatus.DECLINED, failureReason, state },
          { new: true },
        );
        const response: ResponseSavedPaypalResponse = {
          sale: updatedSale,
          message: 'Sale declined.',
        };
        return response;
      }
      }
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
  } */

  /* private async validateSale(saleId: string): Promise<Sales> {
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
  } */
}
