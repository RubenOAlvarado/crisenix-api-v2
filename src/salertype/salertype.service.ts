import { Injectable } from '@nestjs/common';
import { CreateSalertypeDto } from './dto/create-salertype.dto';
import { UpdateSalertypeDto } from './dto/update-salertype.dto';

@Injectable()
export class SalertypeService {
  create(createSalertypeDto: CreateSalertypeDto) {
    return 'This action adds a new salertype';
  }

  findAll() {
    return `This action returns all salertype`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salertype`;
  }

  update(id: number, updateSalertypeDto: UpdateSalertypeDto) {
    return `This action updates a #${id} salertype`;
  }

  remove(id: number) {
    return `This action removes a #${id} salertype`;
  }
}
