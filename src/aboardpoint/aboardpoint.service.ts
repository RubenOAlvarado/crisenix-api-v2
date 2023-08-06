import { Injectable } from '@nestjs/common';
import { CreateAboardpointDto } from './dto/create-aboardpoint.dto';
import { UpdateAboardpointDto } from './dto/update-aboardpoint.dto';

@Injectable()
export class AboardpointService {
  create(createAboardpointDto: CreateAboardpointDto) {
    return 'This action adds a new aboardpoint';
  }

  findAll() {
    return `This action returns all aboardpoint`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aboardpoint`;
  }

  update(id: number, updateAboardpointDto: UpdateAboardpointDto) {
    return `This action updates a #${id} aboardpoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} aboardpoint`;
  }
}
