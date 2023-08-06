import { Module } from '@nestjs/common';
import { IncludedService } from './included.service';
import { IncludedController } from './included.controller';

@Module({
  controllers: [IncludedController],
  providers: [IncludedService],
})
export class IncludedModule {}
