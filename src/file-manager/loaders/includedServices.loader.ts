import { CatalogSheetNames } from '@/shared/enums/file-manager/catalogsSheetNames.enum';
import { BaseSheetLoader } from '../baseSheetLoader';
import { WorkSheet } from 'xlsx';
import { IncludedServicesService } from '@/includedServices/includedServices.service';
import { CreateIncludedServiceDTO } from '@/shared/models/dtos/request/included/createincluded.dto';
import { EntriesService } from '@/entries/entries.service';
import { Entry } from '@/shared/enums/entry.enum';
import { IncludedServicesExcel } from '@/shared/interfaces/excel/includedServices.excel.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IncludedServicesSheetLoader extends BaseSheetLoader<CreateIncludedServiceDTO> {
  constructor(
    includedServicesService: IncludedServicesService,
    private readonly entriesService: EntriesService,
  ) {
    super(includedServicesService, CatalogSheetNames.INCLUDED_SERVICES);
  }

  protected override async transformSheet(
    sheet: WorkSheet,
  ): Promise<CreateIncludedServiceDTO[]> {
    const includedServicesFromExcel = (await super.transformSheet(
      sheet,
    )) as IncludedServicesExcel[];
    return await this.transformIncludedServices(includedServicesFromExcel);
  }

  private async transformIncludedServices(
    includedServicesFromExcel: IncludedServicesExcel[],
  ): Promise<CreateIncludedServiceDTO[]> {
    const transformedIncludedServices: CreateIncludedServiceDTO[] = [];
    for (const { concepto, rubro } of includedServicesFromExcel) {
      const entry = await this.getOrCreateEntry(rubro);
      transformedIncludedServices.push({ concept: concepto, entry });
    }
    return transformedIncludedServices;
  }

  private async getOrCreateEntry(description: string): Promise<string> {
    const entry = await this.entriesService.findByDescription(description);

    if (!entry) {
      const newEntry = await this.entriesService.create({
        description: description as Entry,
      });

      return newEntry._id.toString();
    }

    return entry._id.toString();
  }
}
