import { PartialType } from '@nestjs/swagger';
import { CreateTransferTypeDTO } from './createTransferType.dto';

export class UpdateTransferTypeDTO extends PartialType(CreateTransferTypeDTO) {}
