import { Module } from '@nestjs/common';
import { OriginCityController } from './origincity.controller';
import { OriginCityService } from './origincity.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OriginCity,
  OriginCitySchema,
} from 'src/shared/models/schemas/origincity.schema';
import { AboardpointModule } from '@/aboardpoint/aboardpoint.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OriginCity.name, schema: OriginCitySchema },
    ]),
    AboardpointModule,
  ],
  controllers: [OriginCityController],
  providers: [OriginCityService],
  exports: [OriginCityService],
})
export class OrigincityModule {}
