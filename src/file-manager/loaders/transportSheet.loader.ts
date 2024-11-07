import { TransportsService } from '@/transports/transports.service';
import { BaseSheetLoader } from '../baseSheetLoader';
import { CatalogSheetNames } from '@/shared/enums/file-manager/catalogsSheetNames.enum';
import { CreateTransportsDTO } from '@/shared/models/dtos/request/transports/createtransports.dto';
import { Injectable } from '@nestjs/common';
import { TransportsExcel } from '@/shared/interfaces/excel/transports.excel.interface';
import { WorkSheet } from 'xlsx';
import { TransportTypeService } from '@/transporttype/transporttype.service';

@Injectable()
export class TransportSheetLoader extends BaseSheetLoader<CreateTransportsDTO> {
  constructor(
    transportService: TransportsService,
    private transportTypeService: TransportTypeService,
  ) {
    super(transportService, CatalogSheetNames.TRANSPORTS);
  }

  protected override async transformSheet(
    sheet: WorkSheet,
  ): Promise<CreateTransportsDTO[]> {
    const transportsFromExcel = (await super.transformSheet(
      sheet,
    )) as TransportsExcel[];
    return await this.transformTransports(transportsFromExcel);
  }

  private async transformTransports(transportsFromExcel: TransportsExcel[]) {
    const transformedTransports: CreateTransportsDTO[] = [];
    for (const { nombre, tipoDeTransporte } of transportsFromExcel) {
      const transportType = await this.getOrCreateTransportType(
        tipoDeTransporte,
      );
      transformedTransports.push({
        name: nombre,
        transportType,
      });
    }
    return transformedTransports;
  }

  private async getOrCreateTransportType(name: string) {
    const cleanedName = name.trim();

    const transportType =
      await this.transportTypeService.getTransportTypeByName(cleanedName);

    if (!transportType) {
      const insertedTransportType =
        await this.transportTypeService.insertTransportType({
          name: cleanedName,
        });
      return insertedTransportType._id.toString();
    }

    return transportType._id.toString();
  }
}
