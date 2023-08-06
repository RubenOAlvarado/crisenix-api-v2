import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClasificationService } from './clasification.service';
import { CreateClasificationDto } from './dto/create-clasification.dto';
import { UpdateClasificationDto } from './dto/update-clasification.dto';

@Controller('clasification')
export class ClasificationController {
  constructor(private readonly clasificationService: ClasificationService) {}

  @Post()
  create(@Body() createClasificationDto: CreateClasificationDto) {
    return this.clasificationService.create(createClasificationDto);
  }

  @Get()
  findAll() {
    return this.clasificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clasificationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClasificationDto: UpdateClasificationDto,
  ) {
    return this.clasificationService.update(+id, updateClasificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clasificationService.remove(+id);
  }
}
