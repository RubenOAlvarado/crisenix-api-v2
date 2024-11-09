import { Injectable } from '@nestjs/common';
import { BaseSheetLoader } from '../baseSheetLoader';
import { CreateRoleDTO } from '@/shared/models/dtos/request/role/createrole.dto';
import { CatalogSheetNames } from '@/shared/enums/file-manager/catalogsSheetNames.enum';
import { RolesService } from '@/roles/roles.service';
import { WorkSheet } from 'xlsx';
import { RolesExcel } from '@/shared/interfaces/excel/roles.excel.interface';
import { UserRoles } from '@/shared/enums/roles';
import { Permissions } from '@/shared/enums/permissions.enum';

@Injectable()
export class RolesSheetLoader extends BaseSheetLoader<CreateRoleDTO> {
  constructor(rolesService: RolesService) {
    super(rolesService, CatalogSheetNames.ROLES);
  }

  protected override async transformSheet(
    sheet: WorkSheet,
  ): Promise<CreateRoleDTO[]> {
    const rolesFromExcel = (await super.transformSheet(sheet)) as RolesExcel[];
    return await this.transformRoles(rolesFromExcel);
  }

  private async transformRoles(
    rolesFromExcel: RolesExcel[],
  ): Promise<CreateRoleDTO[]> {
    const transformedRoles: CreateRoleDTO[] = [];

    for (const { descripcion, permisos } of rolesFromExcel) {
      const cleanedPermisos = permisos
        .split(',')
        .map((permiso) => permiso.trim());
      transformedRoles.push({
        description: descripcion as UserRoles,
        permissions: cleanedPermisos as Permissions[],
      });
    }

    return transformedRoles;
  }
}
