import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceSchema, Prices } from '@/shared/models/schemas/price.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Prices.name, schema: PriceSchema }]),
  ],
  controllers: [PriceController],
  providers: [PriceService],
})
export class PriceModule {}
