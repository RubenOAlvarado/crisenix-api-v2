import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TourtypeService } from './tourtype.service';
import { CreateTourtypeDto } from './dto/create-tourtype.dto';
import { UpdateTourtypeDto } from './dto/update-tourtype.dto';

@Controller('tourtype')
export class TourtypeController {
  constructor(private readonly tourtypeService: TourtypeService) {}

  @Post()
  create(@Body() createTourtypeDto: CreateTourtypeDto) {
    return this.tourtypeService.create(createTourtypeDto);
  }

  @Get()
  findAll() {
    return this.tourtypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourtypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTourtypeDto: UpdateTourtypeDto,
  ) {
    return this.tourtypeService.update(+id, updateTourtypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tourtypeService.remove(+id);
  }
}
