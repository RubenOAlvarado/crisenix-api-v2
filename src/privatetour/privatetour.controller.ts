import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PrivatetourService } from './privatetour.service';
import { CreatePrivatetourDto } from './dto/create-privatetour.dto';
import { UpdatePrivatetourDto } from './dto/update-privatetour.dto';

@Controller('privatetour')
export class PrivatetourController {
  constructor(private readonly privatetourService: PrivatetourService) {}

  @Post()
  create(@Body() createPrivatetourDto: CreatePrivatetourDto) {
    return this.privatetourService.create(createPrivatetourDto);
  }

  @Get()
  findAll() {
    return this.privatetourService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.privatetourService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePrivatetourDto: UpdatePrivatetourDto,
  ) {
    return this.privatetourService.update(+id, updatePrivatetourDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.privatetourService.remove(+id);
  }
}
