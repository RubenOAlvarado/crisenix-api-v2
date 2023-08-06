import { PartialType } from '@nestjs/mapped-types';
import { CreateIncludedDto } from './create-included.dto';

export class UpdateIncludedDto extends PartialType(CreateIncludedDto) {}
