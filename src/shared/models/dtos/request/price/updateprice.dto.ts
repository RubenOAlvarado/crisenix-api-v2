import { PartialType } from '@nestjs/swagger';
import { CreatePriceDTO } from './createprice.dto';

export class UpdatePriceDTO extends PartialType(CreatePriceDTO) {}
