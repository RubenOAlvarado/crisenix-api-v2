import { IntersectionType } from '@nestjs/swagger';
import { CreateUserDTO } from './createuser.dto';
import { CreateFbUserDTO } from './createfbuser.dto';

export class WebUserDTO extends IntersectionType(
  CreateFbUserDTO,
  CreateUserDTO,
) {}
