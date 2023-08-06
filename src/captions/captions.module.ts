import { Module } from '@nestjs/common';
import { CaptionsService } from './captions.service';
import { CaptionsController } from './captions.controller';

@Module({
  controllers: [CaptionsController],
  providers: [CaptionsService],
})
export class CaptionsModule {}
