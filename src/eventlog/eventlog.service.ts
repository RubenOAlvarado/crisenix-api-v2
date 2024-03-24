import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EventLog } from 'src/shared/models/schemas/eventlog.schema';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { CreateEventLogDTO } from '@/shared/models/dtos/request/eventlog/eventlog.dto';

@Injectable()
export class EventlogService {
  constructor(
    @InjectModel(EventLog.name) private readonly eventLogModel: Model<EventLog>,
  ) {}

  private readonly logger = new Logger(EventlogService.name);

  async saveLog(createEventLogDTO: CreateEventLogDTO): Promise<void> {
    try {
      this.logger.debug('Creating new eventlog');
      const newLog = new this.eventLogModel(createEventLogDTO);
      newLog.markModified('registry');
      await newLog.save();
    } catch (e) {
      this.logger.error(`Error creating eventlog: ${e}`);
      throw new InternalServerErrorException('Error creating eventlog');
    }
  }

  async getLog({ id }: UrlValidator): Promise<EventLog | null> {
    try {
      this.logger.debug('Looking for eventlog');
      const log = await this.eventLogModel.findById(id).exec();
      return log;
    } catch (e) {
      this.logger.error(`Error looking for log: ${e}`);
      throw new InternalServerErrorException('Error looking for log');
    }
  }

  async getLogs(): Promise<Array<EventLog>> {
    try {
      const logs = await this.eventLogModel.find().exec();
      if (!logs) throw new NotFoundException('No logs found.');
      return logs;
    } catch (e) {
      throw handleErrorsOnServices('Error looking for logs', e);
    }
  }

  async getLogsByTour(tour: string): Promise<Array<EventLog>> {
    try {
      const logs = await this.eventLogModel.find({ tour }).exec();
      if (!logs) throw new NotFoundException('No logs found for this tour.');
      return logs;
    } catch (e) {
      throw handleErrorsOnServices('Error looking logs by tour', e);
    }
  }

  async getLogsByService(service: string): Promise<Array<EventLog>> {
    try {
      const logs = await this.eventLogModel.find({ service }).exec();
      if (!logs) throw new NotFoundException('No logs found for this service.');
      return logs;
    } catch (e) {
      throw handleErrorsOnServices('Error looking logs by service', e);
    }
  }

  async getLogsByMove(move: string): Promise<Array<EventLog>> {
    try {
      const logs = await this.eventLogModel.find({ move }).exec();
      if (!logs) throw new NotFoundException('No logs found for this move.');
      return logs;
    } catch (e) {
      throw handleErrorsOnServices('Error looking logs by move', e);
    }
  }

  async getLogsByUser(user: string): Promise<Array<EventLog>> {
    try {
      const logs = await this.eventLogModel.find({ user }).exec();
      if (!logs) throw new NotFoundException('No logs found for this user.');
      return logs;
    } catch (e) {
      throw handleErrorsOnServices('Error looking logs by user', e);
    }
  }

  async getLogsByDate(date: Date): Promise<Array<EventLog>> {
    try {
      const logs = await this.eventLogModel.find({ date }).exec();
      if (!logs) throw new NotFoundException('No logs found for this date.');
      return logs;
    } catch (e) {
      throw handleErrorsOnServices('Error looking logs by date', e);
    }
  }

  // TODO: improve searchLog method
  /* async searchLog(
    searchLogDTO: SearchLogDTO,
  ): Promise<Array<EventLog> | undefined> {
    let logs: EventLog[] = [] as EventLog[];
    try {
      for (const [key, value] of Object.entries(searchLogDTO)) {
        if (value !== undefined && value !== null) {
          switch (key) {
            case 'serviceId':
              const serviceById = await this.getLogsByTour(value);
              logs = [...logs, ...serviceById];
              break;
            case 'service':
              const logsByService = await this.getLogsByService(value);
              logs = [...logs, ...logsByService];
              break;
            case 'move':
              const logsByMove = await this.getLogsByMove(value);
              logs = [...logs, ...logsByMove];
              break;
            case 'user':
              const logsByUser = await this.getLogsByUser(value);
              logs = [...logs, ...logsByUser];
              break;
            case 'date':
              const logsByDate = await this.getLogsByDate(value);
              logs = [...logs, ...logsByDate];
              break;
          }
        }
      }
      return logs;
    } catch (e) {
      this.logger.error(`Error searching logs: ${e}`);
    }
  } */
}
