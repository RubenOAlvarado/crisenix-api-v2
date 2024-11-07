import { PartialType } from '@nestjs/swagger';
import { CreateItineraryActivityDto } from './createitineraryactivity.dto';

export class UpdateItineraryActivityDto extends PartialType(
  CreateItineraryActivityDto,
) {}
