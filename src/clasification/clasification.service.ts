import { Injectable } from '@nestjs/common';
import { CreateClasificationDto } from './dto/create-clasification.dto';
import { UpdateClasificationDto } from './dto/update-clasification.dto';

@Injectable()
export class ClasificationService {
  create(createClasificationDto: CreateClasificationDto) {
    return 'This action adds a new clasification';
  }

  findAll() {
    return `This action returns all clasification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clasification`;
  }

  update(id: number, updateClasificationDto: UpdateClasificationDto) {
    return `This action updates a #${id} clasification`;
  }

  remove(id: number) {
    return `This action removes a #${id} clasification`;
  }
}
