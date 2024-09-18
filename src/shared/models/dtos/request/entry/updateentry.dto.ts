import { PartialType } from '@nestjs/swagger';
import { CreateEntryDTO } from './createentry.dto';

export class UpdateEntryDTO extends PartialType(CreateEntryDTO) {}
