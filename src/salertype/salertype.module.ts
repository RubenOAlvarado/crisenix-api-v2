import { Module } from '@nestjs/common';
import { SalertypeService } from './salertype.service';
import { SalertypeController } from './salertype.controller';

@Module({
  controllers: [SalertypeController],
  providers: [SalertypeService],
})
export class SalertypeModule {}
