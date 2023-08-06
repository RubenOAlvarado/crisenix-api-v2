import { Module } from '@nestjs/common';
import { ClasificationService } from './clasification.service';
import { ClasificationController } from './clasification.controller';

@Module({
  controllers: [ClasificationController],
  providers: [ClasificationService],
})
export class ClasificationModule {}
