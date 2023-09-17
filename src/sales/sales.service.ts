import { SalesStatus } from '@/shared/enums/sales/salesstatus.enum';
import { State } from '@/shared/enums/sales/state.enum';
import { TourStatus } from '@/shared/enums/tour/status.enum';
import { CreateSaleDTO } from '@/shared/models/dtos/sales/createsales.dto';
import { PaypalResponse } from '@/shared/models/dtos/sales/paypal.response.dto';
import { ResponseSavedPaypalResponse } from '@/shared/models/dtos/sales/response-paypal.response.dto';
import { Sales, SalesDocument } from '@/shared/models/schemas/sales.schema';
import { TourDocument } from '@/shared/models/schemas/tour.schema';
import { TourService } from '@/tour/tour.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sales.name) private readonly salesModel: Model<Sales>,
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

  /* async paypalResponse(
    { state, sale, operationId, failureReason }: PaypalResponse,
    user: any,
  ): Promise<ResponseSavedPaypalResponse> {
    try {
      this.logger.debug(`Validating sale response`);
      const currentSale = await this.salesModel.findById(sale);

      //sale validation
      // TODO: move to a validation method
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

      // TODO: create a validation method in tour service for tour status
      const saleTour: TourDocument = await this.tourService.getWebTourById({
        id: currentSale.tour._id.toString(),
      });
      if (!saleTour) {
        this.logger.error(`Sale tour not found.`);
        throw new NotFoundException(`Tour not found.`);
      }
      if (saleTour.status !== TourStatus.PUBLISH) {
        this.logger.error(`Tour not in ${TourStatus.PUBLISH} status.`);
        throw new BadRequestException(
          `Tour must be in publish status to allow reservations.`,
        );
      }

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
        // TODO: create update seats method in tour service
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
}
