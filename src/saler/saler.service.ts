import { Injectable } from '@nestjs/common';
import { CreateSalerDto } from './dto/create-saler.dto';
import { UpdateSalerDto } from './dto/update-saler.dto';

@Injectable()
export class SalerService {
  create(createSalerDto: CreateSalerDto) {
    return 'This action adds a new saler';
  }

  findAll() {
    return `This action returns all saler`;
  }

  findOne(id: number) {
    return `This action returns a #${id} saler`;
  }

  update(id: number, updateSalerDto: UpdateSalerDto) {
    return `This action updates a #${id} saler`;
  }

  remove(id: number) {
    return `This action removes a #${id} saler`;
  }
}
