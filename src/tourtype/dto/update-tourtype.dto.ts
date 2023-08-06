import { PartialType } from '@nestjs/mapped-types';
import { CreateTourtypeDto } from './create-tourtype.dto';

export class UpdateTourtypeDto extends PartialType(CreateTourtypeDto) {}
