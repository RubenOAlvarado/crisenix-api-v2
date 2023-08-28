import { PartialType } from '@nestjs/swagger';
import { CreateCaptionDTO } from './createcaption.dto';

export class UpdateCaptionDTO extends PartialType(CreateCaptionDTO) {}
