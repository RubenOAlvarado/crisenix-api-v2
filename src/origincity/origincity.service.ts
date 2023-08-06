import { Injectable } from '@nestjs/common';
import { CreateOrigincityDto } from './dto/create-origincity.dto';
import { UpdateOrigincityDto } from './dto/update-origincity.dto';

@Injectable()
export class OrigincityService {
  create(createOrigincityDto: CreateOrigincityDto) {
    return 'This action adds a new origincity';
  }

  findAll() {
    return `This action returns all origincity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} origincity`;
  }

  update(id: number, updateOrigincityDto: UpdateOrigincityDto) {
    return `This action updates a #${id} origincity`;
  }

  remove(id: number) {
    return `This action removes a #${id} origincity`;
  }
}
