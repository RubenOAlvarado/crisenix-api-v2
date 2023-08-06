import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FilerService } from './filer.service';
import { CreateFilerDto } from './dto/create-filer.dto';
import { UpdateFilerDto } from './dto/update-filer.dto';

@Controller('filer')
export class FilerController {
  constructor(private readonly filerService: FilerService) {}

  @Post()
  create(@Body() createFilerDto: CreateFilerDto) {
    return this.filerService.create(createFilerDto);
  }

  @Get()
  findAll() {
    return this.filerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFilerDto: UpdateFilerDto) {
    return this.filerService.update(+id, updateFilerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filerService.remove(+id);
  }
}
