import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PassengerService } from './passenger.service';
import { ResponsePassengerDTO } from '@/shared/models/dtos/response/passenger/response-passenger.dto';
import { CreatePassengerDTO } from '@/shared/models/dtos/request/passenger/createpassenger.dto';

@ApiBearerAuth()
@ApiTags('Passenger')
@Controller('passenger')
export class PassengerController {
  constructor(private passengerService: PassengerService) {}

  @ApiCreatedResponse({
    description: 'Passenger created successfully.',
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
