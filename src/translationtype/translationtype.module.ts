import { Module } from '@nestjs/common';
import { TranslationtypeService } from './translationtype.service';
import { TranslationtypeController } from './translationtype.controller';

@Module({
  controllers: [TranslationtypeController],
  providers: [TranslationtypeService],
})
export class TranslationtypeModule {}
