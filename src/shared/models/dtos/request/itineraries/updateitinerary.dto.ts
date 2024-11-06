import { PartialType } from '@nestjs/swagger';
import { CreateItineraryDto } from './createitinerary.dto';

export class UpdateItineraryDto extends PartialType(CreateItineraryDto) {}
