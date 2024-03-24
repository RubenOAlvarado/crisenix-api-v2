import { PartialType } from '@nestjs/swagger';
import { CreateUserDTO } from './createuser.dto';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
