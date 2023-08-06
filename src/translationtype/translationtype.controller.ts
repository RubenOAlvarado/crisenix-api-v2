import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TranslationtypeService } from './translationtype.service';
import { CreateTranslationtypeDto } from './dto/create-translationtype.dto';
import { UpdateTranslationtypeDto } from './dto/update-translationtype.dto';

@Controller('translationtype')
export class TranslationtypeController {
  constructor(
    private readonly translationtypeService: TranslationtypeService,
  ) {}

  @Post()
  create(@Body() createTranslationtypeDto: CreateTranslationtypeDto) {
    return this.translationtypeService.create(createTranslationtypeDto);
  }

  @Get()
  findAll() {
    return this.translationtypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.translationtypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTranslationtypeDto: UpdateTranslationtypeDto,
  ) {
    return this.translationtypeService.update(+id, updateTranslationtypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.translationtypeService.remove(+id);
  }
}
