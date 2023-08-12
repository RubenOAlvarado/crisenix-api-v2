import { Module } from '@nestjs/common';
import { AboardpointService } from './aboardpoint.service';
import { AboardPointController } from './aboardpoint.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AboardPoint,
  AboardPointSchema,
} from 'src/shared/models/schemas/aboarpoint.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AboardPoint.name, schema: AboardPointSchema },
    ]),
  ],
  controllers: [AboardPointController],
  providers: [AboardpointService],
  exports: [AboardpointService],
})
export class AboardpointModule {}
