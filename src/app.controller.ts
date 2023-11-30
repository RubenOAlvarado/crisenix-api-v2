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
}
