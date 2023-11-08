import { Module } from '@nestjs/common';
import { TranslationtypeService } from './translationtype.service';
import { TranslationtypeController } from './translationtype.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TranslationTypeSchema,
  TranslationTypes,
} from '@/shared/models/schemas/translationtype.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TranslationTypes.name,
        schema: TranslationTypeSchema,
      },
    ]),
  ],
  controllers: [TranslationtypeController],
  providers: [TranslationtypeService],
})
export class TranslationtypeModule {}
