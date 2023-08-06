import { PartialType } from '@nestjs/mapped-types';
import { CreateFilerDto } from './create-filer.dto';

export class UpdateFilerDto extends PartialType(CreateFilerDto) {}
