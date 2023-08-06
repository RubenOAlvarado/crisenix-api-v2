import {
  Controller,
  Res,
  HttpStatus,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventlogService } from './eventlog.service';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import { SearchLogDTO } from 'src/shared/models/dtos/eventlog/searchlog.dto';

@ApiTags('EventLog')
@Controller('eventlog')
export class EventlogController {
  constructor(private eventLogService: EventlogService) {}

  @ApiResponse({ status: 200 })
  @Get()
  async getEventLog(@Res() res) {
    const logs = await this.eventLogService.getLogs();

    if (!logs) throw new NotFoundException('No logs registered!');

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: logs,
    });
  }

  @ApiResponse({ status: 200 })
  @Get(':id')
  async getLogById(@Res() res, @Param() params: UrlValidator) {
    const log = await this.eventLogService.getLog(params);

    if (!log)
      throw new NotFoundException(`Log with id: ${params.id} not found`);

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: log,
    });
  }

  @ApiResponse({ status: 200 })
  @Post('search')
  async searchLog(@Body() searchLogDTO: SearchLogDTO, @Res() res) {
    const logs = await this.eventLogService.searchLog(searchLogDTO);

    if (!logs) throw new NotFoundException('No logs found');

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: logs,
    });
  }
}
