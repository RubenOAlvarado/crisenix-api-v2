import { PickType } from '@nestjs/swagger';
import { CreateOriginCityDTO } from './createorigincity.dto';

export class AddAboardPointsDTO extends PickType(CreateOriginCityDTO, [
  'aboardPoints',
] as const) {}
