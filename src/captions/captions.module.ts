import { Module } from '@nestjs/common';
import { CaptionsService } from './captions.service';
import { CaptionsController } from './captions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Caption,
  CaptionSchema,
} from '@/shared/models/schemas/captions.schema';
import { FilerModule } from '@/filer/filer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Caption.name, schema: CaptionSchema }]),
    FilerModule,
  ],
  controllers: [CaptionsController],
  providers: [CaptionsService],
})
export class CaptionsModule {}
