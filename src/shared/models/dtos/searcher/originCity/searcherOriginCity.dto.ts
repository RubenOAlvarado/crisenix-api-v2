import { PickType } from '@nestjs/swagger';
import { SearcherDestinationDto } from '../destination/searcherDestination.dto';

export class OriginCitySearcherDto extends PickType(SearcherDestinationDto, [
  'word',
] as const) {}
