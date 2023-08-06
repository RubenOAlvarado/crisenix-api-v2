import { PartialType } from '@nestjs/swagger';
import { CreateSalerDTO } from './createsaler.dto';

export class UpdateSalerDTO extends PartialType(CreateSalerDTO) {}
