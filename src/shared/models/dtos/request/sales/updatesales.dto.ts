import { PartialType } from '@nestjs/swagger';
import { CreateSaleDTO } from './createsales.dto';

export class UpdateSaleDTO extends PartialType(CreateSaleDTO) {}
