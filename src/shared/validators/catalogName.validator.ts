/* import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TourCatalogs } from '../enums/tour/catalogs.enum';

@Injectable()
export class CatalogNameValidator implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { catalogName, values } = value;

    let validatedValues: any;

    switch (catalogName) {
      case TourCatalogs.INCLUDED:
        validatedValues = plainToInstance(IncludedValuesDTO, values);
        break;
      case TourCatalogs.COORDINATORS:
        validatedValues = plainToInstance(CoordinatorDTO, values);
        break;
      default:
        throw new BadRequestException('Invalid catalog name.');
    }

    const errors = await validate(validatedValues, {
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return { catalogName, values: validatedValues };
  }
}
 */
