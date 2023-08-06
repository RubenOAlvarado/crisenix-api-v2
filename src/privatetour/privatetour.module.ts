import { Module } from '@nestjs/common';
import { PrivatetourService } from './privatetour.service';
import { PrivatetourController } from './privatetour.controller';

@Module({
  controllers: [PrivatetourController],
  providers: [PrivatetourService],
})
export class PrivatetourModule {}
