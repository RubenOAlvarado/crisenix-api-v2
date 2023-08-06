import { Module } from '@nestjs/common';
import { OrigincityService } from './origincity.service';
import { OrigincityController } from './origincity.controller';

@Module({
  controllers: [OrigincityController],
  providers: [OrigincityService],
})
export class OrigincityModule {}
