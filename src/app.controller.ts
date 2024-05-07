import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './auth/public.decorator';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get('health')
  @Public()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No Content.',
    type: String,
  })
  getHello(): string {
    return 'Hello World!';
  }

  @Get('health-check')
  @Public()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No Content.',
    type: String,
  })
  getHealthCheck(): string {
    return 'Health Check!';
  }

  @Get()
  @Public()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No Content.',
    type: String,
  })
  getRoot(): string {
    return 'You forgot which endpoint are looking for?';
  }
}
