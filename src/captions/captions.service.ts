import { Injectable } from '@nestjs/common';
import { CreateCaptionDto } from './dto/create-caption.dto';
import { UpdateCaptionDto } from './dto/update-caption.dto';

@Injectable()
export class CaptionsService {
  create(createCaptionDto: CreateCaptionDto) {
    return 'This action adds a new caption';
  }

  findAll() {
    return `This action returns all captions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} caption`;
  }

  update(id: number, updateCaptionDto: UpdateCaptionDto) {
    return `This action updates a #${id} caption`;
  }

  remove(id: number) {
    return `This action removes a #${id} caption`;
  }
}
