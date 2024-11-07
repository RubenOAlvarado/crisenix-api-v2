import { TransportsService } from '@/transports/transports.service';
import { BaseSheetLoader } from '../baseSheetLoader';
import { CatalogSheetNames } from '@/shared/enums/file-manager/catalogsSheetNames.enum';
import { CreateTransportsDTO } from '@/shared/models/dtos/request/transports/createtransports.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransportSheetLoader extends BaseSheetLoader<CreateTransportsDTO> {
  constructor(transportService: TransportsService) {
    super(transportService, CatalogSheetNames.TRANSPORTS);
  }
}
