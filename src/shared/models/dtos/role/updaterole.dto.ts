import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDTO } from './createrole.dto';

export class UpdateRoleDTO extends PartialType(CreateRoleDTO) {}
