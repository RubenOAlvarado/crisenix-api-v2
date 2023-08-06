import { PartialType } from '@nestjs/swagger';
import { WebUserDTO } from './createwebuser.dto';

export class UpdateWebUserDTO extends PartialType(WebUserDTO) {}
