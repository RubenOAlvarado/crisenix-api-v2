import { PartialType } from '@nestjs/swagger';
import { CreateFbUserDTO } from './createfbuser.dto';

export class UpdateFbUserDTO extends PartialType(CreateFbUserDTO) {}
