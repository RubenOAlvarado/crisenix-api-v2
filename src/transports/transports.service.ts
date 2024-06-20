import { TransportsExcel } from '@/shared/interfaces/excel/transports.excel.interface';
import { CreateTransportsDTO } from '@/shared/models/dtos/request/transports/createtransports.dto';
import { Transports } from '@/shared/models/schemas/transports.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { TransfertypeService } from '@/transfertype/transfertype.service';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TransportsService {
  constructor(
    @InjectModel(Transports.name)
    private readonly transportModel: Model<Transports>,
    private transferTypeService: TransfertypeService,
  ) {}

  async getTransport({ id }: UrlValidator): Promise<Transports> {
    try {
      const transport = await this.transportModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!transport) {
        throw new NotFoundException('Transport not found.');
      }
      return transport;
    } catch (error) {
      throw handleErrorsOnServices('Error getting transport.', error);
    }
  }

  async validateFromTourExcel(name?: string): Promise<string> {
    try {
      if (!name) {
        throw new BadRequestException('Transport name is required');
      }
      const transport = await this.transportModel.findOne({ name }).exec();
      if (!transport) {
        throw new NotFoundException('Transport not found.');
      }
      return transport._id.toString();
    } catch (error) {
      throw handleErrorsOnServices('Error validating transport.', error);
    }
  }

  async insertTransportsBunch(jsonObject: TransportsExcel[]): Promise<void> {
    try {
      const transportsDTO = await this.mapToDto(jsonObject);
      await this.transportModel.insertMany(transportsDTO);
    } catch (error) {
      throw handleErrorsOnServices('Error inserting transports.', error);
    }
  }

  private async mapToDto(
    jsonObject: TransportsExcel[],
  ): Promise<CreateTransportsDTO[]> {
    try {
      const mappedDTO: CreateTransportsDTO[] = [];
      for (const { nombre, tipoDeTraslado } of jsonObject) {
        const transferType =
          await this.transferTypeService.getTransferTypeByName(tipoDeTraslado);
        mappedDTO.push({
          name: nombre.trim(),
          transferType,
        });
      }
      return mappedDTO;
    } catch (error) {
      throw handleErrorsOnServices('Error mapping transports.', error);
    }
  }
}
