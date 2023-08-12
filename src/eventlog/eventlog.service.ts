import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EventLog } from 'src/shared/models/schemas/eventlog.schema';
import { CreateEventLogDTO } from 'src/shared/models/dtos/eventlog/eventlog.dto';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';

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
      this.logger.debug('Looking for logs');
      const logs = await this.eventLogModel.find().exec();
      return logs;
    } catch (e) {
      this.logger.error(`Error looking for logs: ${e}`);
      throw new InternalServerErrorException('Error looking for logs');
    }
  }

  async getLogsByTour(tour: string): Promise<Array<EventLog>> {
    try {
      this.logger.debug('Lookign eventlogs by tour');
      const logs = await this.eventLogModel.find({ tour }).exec();
      return logs;
    } catch (e) {
      this.logger.error(`Error looking logs by tour: ${e}`);
      throw new InternalServerErrorException('Error looking logs by tour');
    }
  }

  async getLogsByService(service: string): Promise<Array<EventLog>> {
    try {
      this.logger.debug('Looking logs by service');
      const logs = await this.eventLogModel.find({ service }).exec();
      return logs;
    } catch (e) {
      this.logger.error(`Error looking logs by service: ${e}`);
      throw new InternalServerErrorException('Error looking logs by service');
    }
  }

  async getLogsByMove(move: string): Promise<Array<EventLog>> {
    try {
      this.logger.debug('Looking logs by move');
      const logs = await this.eventLogModel.find({ move }).exec();
      return logs;
    } catch (e) {
      this.logger.error(`Error looking logs by move: ${e}`);
      throw new InternalServerErrorException('Error looking logs by move');
    }
  }

  async getLogsByUser(user: string): Promise<Array<EventLog>> {
    try {
      this.logger.debug('Looking logs by user');
      const logs = await this.eventLogModel.find({ user }).exec();
      return logs;
    } catch (e) {
      this.logger.error(`Error looking logs by user: ${e}`);
      throw new InternalServerErrorException('Error looking logs by user');
    }
  }

  async getLogsByDate(date: Date): Promise<Array<EventLog>> {
    try {
      this.logger.debug('Looking logs by date');
      const logs = await this.eventLogModel.find({ date }).exec();
      return logs;
    } catch (e) {
      this.logger.error(`Error looking logs by date: ${e}`);
      throw new InternalServerErrorException('Error looking logs by date');
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
