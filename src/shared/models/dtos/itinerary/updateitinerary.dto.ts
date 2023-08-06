import { PartialType } from '@nestjs/swagger';
import { CreateItineraryDTO } from './createitinerary.dto';

export class UpdateItineraryDTO extends PartialType(CreateItineraryDTO) {}
