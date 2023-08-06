import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CaptionsService } from './captions.service';
import { CreateCaptionDto } from './dto/create-caption.dto';
import { UpdateCaptionDto } from './dto/update-caption.dto';

@Controller('captions')
export class CaptionsController {
  constructor(private readonly captionsService: CaptionsService) {}

  @Post()
  create(@Body() createCaptionDto: CreateCaptionDto) {
    return this.captionsService.create(createCaptionDto);
  }

  @Get()
  findAll() {
    return this.captionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.captionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCaptionDto: UpdateCaptionDto) {
    return this.captionsService.update(+id, updateCaptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.captionsService.remove(+id);
  }
}
