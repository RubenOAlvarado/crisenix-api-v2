import { Module } from '@nestjs/common';
import { SalerService } from './saler.service';
import { SalerController } from './saler.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SalerSchema, Salers } from '@/shared/models/schemas/saler.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Salers.name, schema: SalerSchema }]),
  ],
  controllers: [SalerController],
  providers: [SalerService],
})
export class SalerModule {}
