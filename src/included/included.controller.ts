import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IncludedService } from './included.service';
import { CreateIncludedDto } from './dto/create-included.dto';
import { UpdateIncludedDto } from './dto/update-included.dto';

@Controller('included')
export class IncludedController {
  constructor(private readonly includedService: IncludedService) {}

  @Post()
  create(@Body() createIncludedDto: CreateIncludedDto) {
    return this.includedService.create(createIncludedDto);
  }

  @Get()
  findAll() {
    return this.includedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.includedService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIncludedDto: UpdateIncludedDto,
  ) {
    return this.includedService.update(+id, updateIncludedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.includedService.remove(+id);
  }
}
