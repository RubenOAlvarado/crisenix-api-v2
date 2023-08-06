import { Injectable } from '@nestjs/common';
import { CreateTourtypeDto } from './dto/create-tourtype.dto';
import { UpdateTourtypeDto } from './dto/update-tourtype.dto';

@Injectable()
export class TourtypeService {
  create(createTourtypeDto: CreateTourtypeDto) {
    return 'This action adds a new tourtype';
  }

  findAll() {
    return `This action returns all tourtype`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tourtype`;
  }

  update(id: number, updateTourtypeDto: UpdateTourtypeDto) {
    return `This action updates a #${id} tourtype`;
  }

  remove(id: number) {
    return `This action removes a #${id} tourtype`;
  }
}
