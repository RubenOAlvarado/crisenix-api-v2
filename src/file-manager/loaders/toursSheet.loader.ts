import { Injectable } from '@nestjs/common';
import { BaseSheetLoader } from '../baseSheetLoader';
import { CreateTourDTO } from '@/shared/models/dtos/request/tour/createtour.dto';
import { TourService } from '@/tour/tour.service';
import { CatalogSheetNames } from '@/shared/enums/file-manager/catalogsSheetNames.enum';
import { DestinationService } from '@/destination/destination.service';
import { TourtypeService } from '@/tourtype/tourtype.service';
import { AboardpointService } from '@/aboardpoint/aboardpoint.service';
import { TransportsService } from '@/transports/transports.service';
import { WorkSheet } from 'xlsx';
import { TourExcel } from '@/shared/interfaces/excel/tour.excel.interface';
import { IncludedServicesService } from '@/includedServices/includedServices.service';

@Injectable()
export class ToursSheetLoader extends BaseSheetLoader<CreateTourDTO> {
  constructor(
    toursService: TourService,
    private destinationService: DestinationService,
    private tourTypeService: TourtypeService,
    private aboardPointService: AboardpointService,
    private transportsService: TransportsService,
    private includedServices: IncludedServicesService,
  ) {
    super(toursService, CatalogSheetNames.TOURS);
  }

  protected override async transformSheet(
    sheet: WorkSheet,
  ): Promise<CreateTourDTO[]> {
    const toursFromExcel = (await super.transformSheet(sheet)) as TourExcel[];
    return await this.transformTours(toursFromExcel);
  }

  private async transformTours(
    toursFromExcel: TourExcel[],
  ): Promise<CreateTourDTO[]> {
    const createToursDtos: CreateTourDTO[] = [];
    for (const {
      destino,
      tipoDeTour,
      transporte,
      serviciosIncluidos,
      codigo,
      dias,
      noches,
      lugares,
      lugaresLibres,
      lugaresOcupados,
      fechaInicio,
      fechaRegreso,
      recomendaciones,
      horaDeAbordaje,
      horaDeRegreso,
    } of toursFromExcel) {
      const destination = await this.getDestinationId(destino);
      const tourType = await this.getTourTypeId(tipoDeTour);
      const transport = await this.getTransportId(transporte);
      const includedServices = await this.getIncludedServicesIds(
        serviciosIncluidos,
      );
      const aboardHours = await this.mapHoursAndPoints(horaDeAbordaje);
      const returnHours = await this.mapHoursAndPoints(horaDeRegreso);

      const tour: CreateTourDTO = {
        destination,
        tourType,
        transport,
        includedServices,
        code: codigo,
        days: dias,
        nights: noches,
        seats: lugares,
        availableSeats: lugaresLibres,
        ocuppiedSeats: lugaresOcupados,
        startDate: new Date(fechaInicio),
        endDate: new Date(fechaRegreso),
        recommendations: recomendaciones,
        aboardHours,
        returnHours,
      };
      createToursDtos.push(tour);
    }

    return createToursDtos;
  }

  private async getDestinationId(destinationCode: string): Promise<string> {
    const { _id } = await this.destinationService.getDestinationByCode(
      destinationCode,
    );
    return _id.toString();
  }

  private async getTourTypeId(tourTypeName: string): Promise<string> {
    const { _id } = await this.tourTypeService.getTourTypeByName(tourTypeName);
    return _id.toString();
  }

  private async getTransportId(transportName?: string): Promise<string> {
    const { _id } = await this.transportsService.findTransportByName(
      transportName,
    );
    return _id.toString();
  }

  private async mapHoursAndPoints(hoursAndPointsToMap: string): Promise<any[]> {
    const hoursAndPoints = hoursAndPointsToMap.split('|');
    const hoursAndPointsMapped = [];
    for (const hourAndPoint of hoursAndPoints) {
      const [hour, point] = hourAndPoint
        .split(',')
        .map((value) => value.trim());
      const aboardPoint = await this.getAboardPointId(point?.trim());
      hoursAndPointsMapped.push({ hour, aboardPoint });
    }
    return hoursAndPointsMapped;
  }

  private async getAboardPointId(aboardPointName?: string): Promise<string> {
    const { _id } = await this.aboardPointService.getAboardPointByName(
      aboardPointName?.trim(),
    );
    return _id.toString();
  }

  private async getIncludedServicesIds(
    includedServices?: string,
  ): Promise<string[] | undefined> {
    if (!includedServices) return undefined;
    const includedServicesArray = includedServices
      ?.split(',')
      .map((value) => value.trim());
    const includedServicesIds: string[] = [];
    for (const includedService of includedServicesArray) {
      const { _id } = await this.includedServices.findIncludedServiceByConcept(
        includedService,
      );
      includedServicesIds.push(_id.toString());
    }
    return includedServicesIds;
  }
}
