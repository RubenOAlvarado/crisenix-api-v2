import { PartialType } from '@nestjs/swagger';
import { CreatePrivatetourDto } from './create-privatetour.dto';

export class UpdatePrivatetourDto extends PartialType(CreatePrivatetourDto) {}
