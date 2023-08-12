import { Module } from '@nestjs/common';
import { FilerService } from './filer.service';

@Module({
  providers: [FilerService],
  exports: [FilerService],
})
export class FilerModule {}
