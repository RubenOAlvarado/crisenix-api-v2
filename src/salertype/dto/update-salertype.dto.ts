import { PartialType } from '@nestjs/mapped-types';
import { CreateSalertypeDto } from './create-salertype.dto';

export class UpdateSalertypeDto extends PartialType(CreateSalertypeDto) {}
