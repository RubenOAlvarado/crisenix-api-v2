import { Injectable } from '@nestjs/common';
import { CreateDepartureDto } from './dto/create-departure.dto';
import { UpdateDepartureDto } from './dto/update-departure.dto';

@Injectable()
export class DepartureService {
  create(createDepartureDto: CreateDepartureDto) {
    return 'This action adds a new departure';
  }

  findAll() {
    return `This action returns all departure`;
  }

  findOne(id: number) {
    return `This action returns a #${id} departure`;
  }

  update(id: number, updateDepartureDto: UpdateDepartureDto) {
    return `This action updates a #${id} departure`;
  }

  remove(id: number) {
    return `This action removes a #${id} departure`;
  }
}
