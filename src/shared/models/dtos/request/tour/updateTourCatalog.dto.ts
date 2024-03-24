import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { CoordinatorDTO } from './coordinator.dto';
import { ItineraryDTO } from './itinerary.dto';
import { AboardHourDTO } from './aboardhour.dto';
import { DeparturesDTO } from './departures.dto';
import { TourCatalogs } from '@/shared/enums/tour/catalogs.enum';

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
  /* @Type((type?: TypeHelpOptions | undefined) => {
    if (!type || !type.object || !type.object['catalogName']) {
      throw new BadRequestException('Invalid TypeHelpOptions');
    }

    switch (type.object['catalogName']) {
      case TourCatalogs.COORDINATORS:
        if (
          Array.isArray(type.object['values']) &&
          type.object['values'].length > 0
        ) {
          return Array<CoordinatorDTO>;
        } else {
          throw new BadRequestException(
            'Values array cannot be empty for coordinators.',
          );
        }
      case TourCatalogs.ABOARDHOUR:
      case TourCatalogs.RETURNHOUR:
        if (
          Array.isArray(type.object['values']) &&
          type.object['values'].length > 0
        ) {
          return Array<AboardHourDTO>;
        } else {
          throw new BadRequestException(
            'Values array cannot be empty for aboard hour or return hour.',
          );
        }
      case TourCatalogs.ITINERARY:
        if (
          Array.isArray(type.object['values']) &&
          type.object['values'].length > 0
        ) {
          return Array<ItineraryDTO>;
        } else {
          throw new BadRequestException(
            'Values array cannot be empty for itinerary.',
          );
        }
      case TourCatalogs.DEPARTURE:
        if (
          Array.isArray(type.object['values']) &&
          type.object['values'].length > 0
        ) {
          return DeparturesDTO;
        } else {
          throw new BadRequestException(
            'Values array cannot be empty for departure.',
          );
        }
      case TourCatalogs.INCLUDED:
      case TourCatalogs.PRICE:
        if (
          Array.isArray(type.object['values']) &&
          type.object['values'].every((val) => typeof val === 'string')
        ) {
          return Array<string>;
        } else {
          throw new BadRequestException(
            `Invalid values for ${type.object['catalogName']} catalog, must be a non-empty array of mongo ids.`,
          );
        }
      default:
        throw new BadRequestException('Invalid catalog name');
    }
  }) */
  @IsDefined()
  @ValidateNested({ each: true })
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
