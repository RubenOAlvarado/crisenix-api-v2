import { Module } from '@nestjs/common';
import { TourtypeService } from './tourtype.service';
import { TourtypeController } from './tourtype.controller';

@Module({
  controllers: [TourtypeController],
  providers: [TourtypeService],
})
export class TourtypeModule {}
