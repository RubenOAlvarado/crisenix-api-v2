import { PartialType } from '@nestjs/swagger';
import { CreateAboardPointDTO } from './createaboardpoint.dto';

export class UpdateAboardPointDTO extends PartialType(CreateAboardPointDTO) {}
