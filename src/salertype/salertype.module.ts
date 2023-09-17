import { Module } from '@nestjs/common';
import { SalertypeService } from './salertype.service';
import { SalertypeController } from './salertype.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SalerTypes,
  SalerTypeSchema,
} from '@/shared/models/schemas/salertype.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SalerTypes.name, schema: SalerTypeSchema },
    ]),
  ],
  controllers: [SalertypeController],
  providers: [SalertypeService],
})
export class SalertypeModule {}
