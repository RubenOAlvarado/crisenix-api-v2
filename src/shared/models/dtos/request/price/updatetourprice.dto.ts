import { PartialType } from '@nestjs/swagger';
import { CreateTourPriceDTO } from './createtourprice.dto';

export class UpdateToutPriceDTO extends PartialType(CreateTourPriceDTO) {}
