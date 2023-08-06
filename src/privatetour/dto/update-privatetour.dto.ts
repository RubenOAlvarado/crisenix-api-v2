import { PartialType } from '@nestjs/mapped-types';
import { CreatePrivatetourDto } from './create-privatetour.dto';

export class UpdatePrivatetourDto extends PartialType(CreatePrivatetourDto) {}
