import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CatalogMap, CatalogName } from '../utilities/tourCatalogs.mapper';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class CatalogValidationInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { catalogName, data } = request.body;

    const catalogDTO: ClassConstructor<any> =
      CatalogMap[catalogName as CatalogName];
    if (!catalogDTO) {
      throw new BadRequestException('Invalid catalog name');
    }

    const objects = data.map((item: any) => plainToInstance(catalogDTO, item));
    const validationPromises = objects.map((object: any) => validate(object));
    const errors = await Promise.all(validationPromises);

    const flatErrors = errors.flat();
    if (flatErrors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    request.body.data = objects;
    return next.handle();
  }
}
