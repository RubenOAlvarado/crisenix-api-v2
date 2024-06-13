import { Module } from '@nestjs/common';
import { TransportsService } from './transports.service';
import { TransportsController } from './transports.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Transports,
  TransportsSchema,
} from '@/shared/models/schemas/transports.schema';
import { TransfertypeModule } from '@/transfertype/transfertype.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Transports.name,
        schema: TransportsSchema,
      },
    ]),
    TransfertypeModule,
  ],
  controllers: [TransportsController],
  providers: [TransportsService],
  exports: [TransportsService],
})
export class TransportsModule {}
