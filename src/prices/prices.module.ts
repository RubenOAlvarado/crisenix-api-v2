import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { Prices, PricesSchema } from '@/shared/models/schemas/price.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DestinationModule } from '@/destination/destination.module';
import { OrigincityModule } from '@/origincity/origincity.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Prices.name,
        schema: PricesSchema,
      },
    ]),
    DestinationModule,
    OrigincityModule,
  ],
  controllers: [PricesController],
  providers: [PricesService],
  exports: [PricesService],
})
export class PricesModule {}
