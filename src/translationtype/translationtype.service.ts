import { Injectable } from '@nestjs/common';
import { CreateTranslationtypeDto } from './dto/create-translationtype.dto';
import { UpdateTranslationtypeDto } from './dto/update-translationtype.dto';

@Injectable()
export class TranslationtypeService {
  create(createTranslationtypeDto: CreateTranslationtypeDto) {
    return 'This action adds a new translationtype';
  }

  findAll() {
    return `This action returns all translationtype`;
  }

  findOne(id: number) {
    return `This action returns a #${id} translationtype`;
  }

  update(id: number, updateTranslationtypeDto: UpdateTranslationtypeDto) {
    return `This action updates a #${id} translationtype`;
  }

  remove(id: number) {
    return `This action removes a #${id} translationtype`;
  }
}
