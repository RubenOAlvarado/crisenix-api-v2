import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsRolePermissionsConstraint } from '../constraints/IsRolePermissionsConstraint.constraint';

export function IsRolePermissions(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRolePermissionsConstraint,
    });
  };
}
