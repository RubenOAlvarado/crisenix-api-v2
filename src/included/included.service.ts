import { Injectable } from '@nestjs/common';
import { CreateIncludedDto } from './dto/create-included.dto';
import { UpdateIncludedDto } from './dto/update-included.dto';

@Injectable()
export class IncludedService {
  create(createIncludedDto: CreateIncludedDto) {
    return 'This action adds a new included';
  }

  findAll() {
    return `This action returns all included`;
  }

  findOne(id: number) {
    return `This action returns a #${id} included`;
  }

  update(id: number, updateIncludedDto: UpdateIncludedDto) {
    return `This action updates a #${id} included`;
  }

  remove(id: number) {
    return `This action removes a #${id} included`;
  }
}
