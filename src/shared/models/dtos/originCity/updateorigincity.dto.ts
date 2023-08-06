import { PartialType } from '@nestjs/swagger';
import { CreateOriginCityDTO } from './createorigincity.dto';

export class UpdateOriginCityDTO extends PartialType(CreateOriginCityDTO) {}
