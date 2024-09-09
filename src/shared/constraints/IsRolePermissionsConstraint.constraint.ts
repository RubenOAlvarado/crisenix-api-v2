import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Permissions } from '../enums/permissions.enum';
import { UserRoles } from '../enums/roles';

@ValidatorConstraint({ async: false })
export class IsRolePermissionsConstraint
  implements ValidatorConstraintInterface
{
  validate(
    value: any,
    validationArguments?: ValidationArguments | undefined,
  ): boolean {
    const permissions: Permissions[] = value;
    const args: ValidationArguments | undefined =
      validationArguments || undefined;

    // Rest of the code remains unchanged
    const role = args && (args.object as any).description;

    const rolePermissionsMap: { [key: string]: Permissions[] } = {
      [UserRoles.ADMIN]: [
        Permissions.MANAGE_USERS,
        Permissions.MANAGE_CATALOGS,
      ],
      [UserRoles.OPERATOR]: [
        Permissions.UPDATE_DESTINATIONS,
        Permissions.CONFIGURE_ITINERARY,
      ],
      [UserRoles.SALES]: [
        Permissions.PUBLISH_TOURS,
        Permissions.VIEW_RESERVATIONS,
      ],
      [UserRoles.MANAGEMENT]: [
        Permissions.VIEW_REPORTS,
        Permissions.ACCESS_LOGS,
      ],
      [UserRoles.CLIENT]: [Permissions.VIEW_INFORMATION],
      // DEVELOP has all permissions, just for dev purposes; this should be removed in upper environments
      [UserRoles.DEVELOP]: [
        Permissions.ACCESS_LOGS,
        Permissions.MANAGE_USERS,
        Permissions.MANAGE_CATALOGS,
        Permissions.UPDATE_DESTINATIONS,
        Permissions.CONFIGURE_ITINERARY,
        Permissions.PUBLISH_TOURS,
        Permissions.VIEW_RESERVATIONS,
        Permissions.VIEW_REPORTS,
        Permissions.VIEW_INFORMATION,
      ],
    };

    const allowedPermissions = rolePermissionsMap[role];

    return (
      (allowedPermissions &&
        permissions.every((permission) =>
          allowedPermissions.includes(permission),
        )) ||
      false
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `Some permissions are invalid for the role ${
      (args.object as any).description
    }`;
  }
}
