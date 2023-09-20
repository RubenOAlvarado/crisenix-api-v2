import { Module } from '@nestjs/common';
import { TransportsService } from './transports.service';
import { TransportsController } from './transports.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Transports,
  TransportsSchema,
} from '@/shared/models/schemas/transporst.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Transports.name,
        schema: TransportsSchema,
      },
    ]),
  ],
  controllers: [TransportsController],
  providers: [TransportsService],
})
export class TransportsModule {}
