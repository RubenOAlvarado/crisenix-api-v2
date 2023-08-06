import { Module } from '@nestjs/common';
import { AboardpointService } from './aboardpoint.service';
import { AboardpointController } from './aboardpoint.controller';

@Module({
  controllers: [AboardpointController],
  providers: [AboardpointService],
})
export class AboardpointModule {}
