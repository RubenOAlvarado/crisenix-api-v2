import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DepartureService } from './departure.service';
import { CreateDepartureDto } from './dto/create-departure.dto';
import { UpdateDepartureDto } from './dto/update-departure.dto';

@Controller('departure')
export class DepartureController {
  constructor(private readonly departureService: DepartureService) {}

  @Post()
  create(@Body() createDepartureDto: CreateDepartureDto) {
    return this.departureService.create(createDepartureDto);
  }

  @Get()
  findAll() {
    return this.departureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departureService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartureDto: UpdateDepartureDto,
  ) {
    return this.departureService.update(+id, updateDepartureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departureService.remove(+id);
  }
}
