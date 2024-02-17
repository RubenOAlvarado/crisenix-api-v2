import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isISO8601,
  registerDecorator,
} from 'class-validator';
import { SearchableTourFields } from '../enums/searcher/tour/fields.enum';

@ValidatorConstraint({ name: 'isValidInitDate', async: false })
export class IsValidInitDate implements ValidatorConstraintInterface {
  validate(value: string, validationArguments: ValidationArguments): boolean {
    const { field } = (validationArguments?.object as { field: string }) ?? '';

    if (field === SearchableTourFields.INITDATE) {
      return isISO8601(value, { strict: true }) && value.length === 7;
    }

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const { field } = (validationArguments?.object as { field: string }) ?? '';
    return `The field ${field} is not a valid date.`;
  }
}

export function IsInitDate(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidInitDate,
    });
  };
}
