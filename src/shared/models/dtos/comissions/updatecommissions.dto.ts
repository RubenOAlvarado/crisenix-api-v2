import { PartialType } from '@nestjs/swagger';
import { CreateCommissionDTO } from './createcomissions.dto';

export class UpdateCommissionsDTO extends PartialType(CreateCommissionDTO) {}
