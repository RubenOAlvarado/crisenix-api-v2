import { PartialType } from '@nestjs/mapped-types';
import { CreateOrigincityDto } from './create-origincity.dto';

export class UpdateOrigincityDto extends PartialType(CreateOrigincityDto) {}
