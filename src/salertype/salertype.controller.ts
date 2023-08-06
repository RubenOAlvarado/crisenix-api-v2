import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SalertypeService } from './salertype.service';
import { CreateSalertypeDto } from './dto/create-salertype.dto';
import { UpdateSalertypeDto } from './dto/update-salertype.dto';

@Controller('salertype')
export class SalertypeController {
  constructor(private readonly salertypeService: SalertypeService) {}

  @Post()
  create(@Body() createSalertypeDto: CreateSalertypeDto) {
    return this.salertypeService.create(createSalertypeDto);
  }

  @Get()
  findAll() {
    return this.salertypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salertypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSalertypeDto: UpdateSalertypeDto,
  ) {
    return this.salertypeService.update(+id, updateSalertypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salertypeService.remove(+id);
  }
}
