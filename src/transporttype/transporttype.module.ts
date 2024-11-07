import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransportTypes,
  TransportTypesSchema,
} from '@/shared/models/schemas/transporttype.schema';
import { TransportTypeController } from './transporttype.controller';
import { TransportTypeService } from './transporttype.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TransportTypes.name,
        schema: TransportTypesSchema,
      },
    ]),
  ],
  controllers: [TransportTypeController],
  providers: [TransportTypeService],
  exports: [TransportTypeService],
})
export class TransportTypeModule {}
