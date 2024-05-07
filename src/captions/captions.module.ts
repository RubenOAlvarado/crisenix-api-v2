import { Module } from '@nestjs/common';
import { CaptionsService } from './captions.service';
import { CaptionsController } from './captions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Captions,
  CaptionSchema,
} from '@/shared/models/schemas/captions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Captions.name, schema: CaptionSchema }]),
  ],
  controllers: [CaptionsController],
  providers: [CaptionsService],
})
export class CaptionsModule {}
