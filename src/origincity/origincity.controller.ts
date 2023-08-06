import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrigincityService } from './origincity.service';
import { CreateOrigincityDto } from './dto/create-origincity.dto';
import { UpdateOrigincityDto } from './dto/update-origincity.dto';

@Controller('origincity')
export class OrigincityController {
  constructor(private readonly origincityService: OrigincityService) {}

  @Post()
  create(@Body() createOrigincityDto: CreateOrigincityDto) {
    return this.origincityService.create(createOrigincityDto);
  }

  @Get()
  findAll() {
    return this.origincityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.origincityService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrigincityDto: UpdateOrigincityDto,
  ) {
    return this.origincityService.update(+id, updateOrigincityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.origincityService.remove(+id);
  }
}
