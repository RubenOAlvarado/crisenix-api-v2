import { PartialType } from '@nestjs/mapped-types';
import { CreateAboardpointDto } from './create-aboardpoint.dto';

export class UpdateAboardpointDto extends PartialType(CreateAboardpointDto) {}
