import { Module } from '@nestjs/common';
import { AboardpointService } from './aboardpoint.service';
import { AboardPointController } from './aboardpoint.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AboardPoints,
  AboardPointSchema,
} from 'src/shared/models/schemas/aboarpoint.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AboardPoints.name, schema: AboardPointSchema },
    ]),
  ],
  controllers: [AboardPointController],
  providers: [AboardpointService],
  exports: [AboardpointService],
})
export class AboardpointModule {}
