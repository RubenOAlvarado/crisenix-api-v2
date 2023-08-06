import { PartialType } from '@nestjs/mapped-types';
import { CreateSalerDto } from './create-saler.dto';

export class UpdateSalerDto extends PartialType(CreateSalerDto) {}
