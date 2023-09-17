import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PassengerService } from './passenger.service';
import { CreatePassengerDTO } from '@/shared/models/dtos/passenger/createpassenger.dto';
import { ResponsePassengerDTO } from '@/shared/models/dtos/passenger/response-passenger.dto';

@ApiBearerAuth()
@ApiTags('Passenger')
@Controller('passenger')
export class PassengerController {
  constructor(private passengerService: PassengerService) {}

  @ApiCreatedResponse({
    description: 'Create a new passenger',
    type: ResponsePassengerDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the passenger.',
  })
  @ApiBody({
    description: 'Passenger object',
    type: CreatePassengerDTO,
  })
  @Post('create')
  async create(@Body() createPassengerDTO: CreatePassengerDTO) {
    return await this.passengerService.create(createPassengerDTO);
  }
}
