import { Module } from '@nestjs/common';
import { SalerService } from './saler.service';
import { SalerController } from './saler.controller';

@Module({
  controllers: [SalerController],
  providers: [SalerService],
})
export class SalerModule {}
