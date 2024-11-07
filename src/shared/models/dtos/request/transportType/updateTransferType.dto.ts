import { PartialType } from '@nestjs/swagger';
import { CreateTransportTypeDTO } from './createTransferType.dto';

export class UpdateTransportTypeDTO extends PartialType(
  CreateTransportTypeDTO,
) {}
