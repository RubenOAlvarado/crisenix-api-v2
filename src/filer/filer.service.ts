import { Injectable } from '@nestjs/common';
import { CreateFilerDto } from './dto/create-filer.dto';
import { UpdateFilerDto } from './dto/update-filer.dto';

@Injectable()
export class FilerService {
  create(createFilerDto: CreateFilerDto) {
    return 'This action adds a new filer';
  }

  findAll() {
    return `This action returns all filer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} filer`;
  }

  update(id: number, updateFilerDto: UpdateFilerDto) {
    return `This action updates a #${id} filer`;
  }

  remove(id: number) {
    return `This action removes a #${id} filer`;
  }
}
