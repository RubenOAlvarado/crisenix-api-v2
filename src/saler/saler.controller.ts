import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SalerService } from './saler.service';
import { CreateSalerDto } from './dto/create-saler.dto';
import { UpdateSalerDto } from './dto/update-saler.dto';

@Controller('saler')
export class SalerController {
  constructor(private readonly salerService: SalerService) {}

  @Post()
  create(@Body() createSalerDto: CreateSalerDto) {
    return this.salerService.create(createSalerDto);
  }

  @Get()
  findAll() {
    return this.salerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalerDto: UpdateSalerDto) {
    return this.salerService.update(+id, updateSalerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salerService.remove(+id);
  }
}
