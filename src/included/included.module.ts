import { Module } from '@nestjs/common';
import { IncludedService } from './included.service';
import { IncludedController } from './included.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  IncludedSchema,
  Includeds,
} from '@/shared/models/schemas/included.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Includeds.name, schema: IncludedSchema },
    ]),
  ],
  controllers: [IncludedController],
  providers: [IncludedService],
})
export class IncludedModule {}
