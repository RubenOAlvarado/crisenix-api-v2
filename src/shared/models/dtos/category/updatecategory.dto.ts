import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDTO } from './createcategory.dto';

export class UpdateCategoryDTO extends PartialType(CreateCategoryDTO) {}
