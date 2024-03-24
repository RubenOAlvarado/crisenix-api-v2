import { PartialType } from '@nestjs/swagger';
import { CreateTransportsDTO } from './createtransports.dto';

export class UpdateTransportsDTO extends PartialType(CreateTransportsDTO) {}
