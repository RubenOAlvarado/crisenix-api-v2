import { Injectable } from '@nestjs/common';
import { CreatePrivatetourDto } from './dto/create-privatetour.dto';
import { UpdatePrivatetourDto } from './dto/update-privatetour.dto';

@Injectable()
export class PrivatetourService {
  create(createPrivatetourDto: CreatePrivatetourDto) {
    return 'This action adds a new privatetour';
  }

  findAll() {
    return `This action returns all privatetour`;
  }

  findOne(id: number) {
    return `This action returns a #${id} privatetour`;
  }

  update(id: number, updatePrivatetourDto: UpdatePrivatetourDto) {
    return `This action updates a #${id} privatetour`;
  }

  remove(id: number) {
    return `This action removes a #${id} privatetour`;
  }
}
