import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';
import { CoordinatorDTO } from './coordinator.dto';
import { ItineraryDTO } from './itinerary.dto';
import { AboardHourDTO } from './aboardhour.dto';
import { DeparturesDTO } from './departures.dto';
import { TourCatalogs } from '@/shared/enums/tour/catalogs.enum';
import { Type, TypeHelpOptions } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class UpdateTourCatalogDTO {
  @ApiProperty({
    description: 'The name of the catalog to look for.',
    example: TourCatalogs.COORDINATORS,
    enum: TourCatalogs,
  })
  @IsNotEmpty()
  @IsEnum(TourCatalogs)
  catalogName: TourCatalogs;

  @ApiProperty({
    description: 'The new value for the catalog.',
  })
  @Type((type?: TypeHelpOptions | undefined) => {
    if (!type || !type.object || !type.object['catalogName']) {
      throw new BadRequestException('Invalid TypeHelpOptions');
    }

    switch (type.object['catalogName']) {
      case TourCatalogs.COORDINATORS:
        if (
          !Array.isArray(type.object['values']) ||
          type.object['values'].length === 0
        ) {
          throw new BadRequestException(
            'Values array cannot be empty for coordinators.',
          );
        }
        return CoordinatorDTO;
      case TourCatalogs.ABOARDHOUR:
      case TourCatalogs.RETURNHOUR:
        if (
          !Array.isArray(type.object['values']) ||
          type.object['values'].length === 0
        ) {
          throw new BadRequestException(
            'Values array cannot be empty for aboard hour or return hour.',
          );
        }
        return AboardHourDTO;
      case TourCatalogs.ITINERARY:
        if (
          !Array.isArray(type.object['values']) ||
          type.object['values'].length === 0
        ) {
          throw new BadRequestException(
            'Values array cannot be empty for itinerary.',
          );
        }
        return ItineraryDTO;
      case TourCatalogs.DEPARTURE:
        return DeparturesDTO;
      case TourCatalogs.INCLUDED:
      case TourCatalogs.PRICE:
        if (
          !Array.isArray(type.object['values']) ||
          type.object['values'].length === 0
        ) {
          throw new BadRequestException(
            `Values array cannot be empty for ${type.object['catalogName']} catalog.`,
          );
        }
        return Array<string>;
      default:
        throw new BadRequestException('Invalid catalog name');
    }
  })
  @IsDefined()
  values:
    | Array<string>
    | Array<CoordinatorDTO>
    | Array<AboardHourDTO>
    | Array<ItineraryDTO>
    | DeparturesDTO;

  constructor(
    catalogName: TourCatalogs,
    values:
      | Array<string>
      | Array<CoordinatorDTO>
      | Array<AboardHourDTO>
      | Array<ItineraryDTO>
      | DeparturesDTO,
  ) {
    this.catalogName = catalogName;
    this.values = values;
  }
}
