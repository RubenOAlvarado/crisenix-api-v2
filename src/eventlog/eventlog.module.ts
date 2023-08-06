import { Module } from '@nestjs/common';
import { EventlogService } from './eventlog.service';
import { EventlogController } from './eventlog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EventLog,
  EventLogSchema,
} from 'src/shared/models/schemas/eventlog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventLog.name, schema: EventLogSchema },
    ]),
  ],
  controllers: [EventlogController],
  providers: [EventlogService],
  exports: [EventlogService],
})
export class EventlogModule {}
