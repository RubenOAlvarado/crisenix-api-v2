import {
  Controller,
  HttpStatus,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventlogService } from './eventlog.service';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';

@ApiTags('EventLog')
@Controller('eventlog')
export class EventlogController {
  constructor(private eventLogService: EventlogService) {}

  @ApiResponse({ status: HttpStatus.OK })
  @Get()
  async getEventLog() {
    const logs = await this.eventLogService.getLogs();

    if (!logs) throw new NotFoundException('No logs registered!');

    return logs;
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Get(':id')
  async getLogById(@Param() params: UrlValidator) {
    const log = await this.eventLogService.getLog(params);

    if (!log)
      throw new NotFoundException(`Log with id: ${params.id} not found`);

    return log;
  }

  /* @ApiResponse({ status: HttpStatus.OK })
  @Post('search')
  async searchLog(@Body() searchLogDTO: SearchLogDTO) {
    const logs = await this.eventLogService.searchLog(searchLogDTO);

    if (!logs) throw new NotFoundException('No logs found');

    return logs;
  } */
}
