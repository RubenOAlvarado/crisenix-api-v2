import { Module } from '@nestjs/common';
import { DepartureService } from './departure.service';
import { DepartureController } from './departure.controller';

@Module({
  controllers: [DepartureController],
  providers: [DepartureService],
})
export class DepartureModule {}
