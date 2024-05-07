import {
  TransferTypes,
  TransferTypesSchema,
} from '@/shared/models/schemas/transfertype.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransfertypeService } from './transfertype.service';
import { TransfertypeController } from './transfertype.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TransferTypes.name,
        schema: TransferTypesSchema,
      },
    ]),
  ],
  controllers: [TransfertypeController],
  providers: [TransfertypeService],
  exports: [TransfertypeService],
})
export class TransfertypeModule {}
