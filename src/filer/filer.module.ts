import { Module } from '@nestjs/common';
import { FilerService } from './filer.service';
import { FilerController } from './filer.controller';

@Module({
  controllers: [FilerController],
  providers: [FilerService],
})
export class FilerModule {}
