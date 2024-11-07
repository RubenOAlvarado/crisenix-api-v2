import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PassengerService } from './passenger.service';
import { ResponsePassengerDTO } from '@/shared/models/dtos/response/passenger/response-passenger.dto';
import { CreatePassengerDTO } from '@/shared/models/dtos/request/passenger/createpassenger.dto';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';

@ApiBearerAuth()
@ApiTags('Passenger')
@Controller('passengers')
export class PassengerController {
  constructor(private passengerService: PassengerService) {}

  @ApiOperation({ summary: 'Create a new passenger' })
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
  @Post()
  async create(@Body() createPassengerDTO: CreatePassengerDTO) {
    return await this.passengerService.create(createPassengerDTO);
  }

  @ApiOperation({ summary: 'Get all passengers' })
  @ApiCreatedResponse({
    description: 'Passengers fetched successfully.',
    type: ResponsePassengerDTO,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong fetching the passengers.',
  })
  @ApiNotFoundResponse({
    description: 'Passengers not found.',
  })
  @Get()
  async getAll() {
    return await this.passengerService.getAll();
  }

  @ApiOperation({ summary: 'Get a passenger by id' })
  @ApiCreatedResponse({
    description: 'Passenger fetched successfully.',
    type: ResponsePassengerDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong fetching the passenger.',
  })
  @ApiNotFoundResponse({
    description: 'Passenger not found.',
  })
  @Get(':id')
  async getById(@Param() { id }: IdValidator) {
    return await this.passengerService.getById(id);
  }

  @ApiOperation({ summary: 'Delete a passenger' })
  @ApiCreatedResponse({
    description: 'Passenger deleted successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the passenger.',
  })
  @ApiNotFoundResponse({
    description: 'Passenger not found.',
  })
  @Delete(':id')
  async delete(@Param() { id }: IdValidator) {
    await this.passengerService.delete(id);
    return 'Passenger deleted successfully.';
  }

  @ApiOperation({ summary: 'Update a passenger' })
  @ApiCreatedResponse({
    description: 'Passenger updated successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating the passenger.',
  })
  @ApiNotFoundResponse({
    description: 'Passenger not found.',
  })
  @Put(':id')
  async update(
    @Param() { id }: IdValidator,
    @Body() updatePassengerDTO: CreatePassengerDTO,
  ) {
    return await this.passengerService.update(id, updatePassengerDTO);
  }

  @ApiOperation({ summary: 'Get passenger list by reservation id' })
  @ApiCreatedResponse({
    description: 'Passenger list fetched successfully.',
    type: ResponsePassengerDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong fetching the passengers list.',
  })
  @ApiNotFoundResponse({
    description: 'Not passengers registered for this reservation.',
  })
  @Get('reservation/:id')
  async getByReservationId(@Param() param: IdValidator) {
    return await this.passengerService.getByReservationId(param);
  }

  @ApiOperation({ summary: 'Get passenger list by aboard point id' })
  @ApiCreatedResponse({
    description: 'Passenger list fetched successfully.',
    type: ResponsePassengerDTO,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong fetching the passengers list.',
  })
  @ApiNotFoundResponse({
    description: 'Not passengers registered for this aboard point.',
  })
  @Get('aboardpoint/:id')
  async getByAboardPointId(@Param() param: IdValidator) {
    return await this.passengerService.getByAboardPointId(param);
  }

  @ApiOperation({ summary: 'Get passenger list by tour id' })
  @ApiCreatedResponse({
    description: 'Passenger list fetched successfully.',
    type: ResponsePassengerDTO,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong fetching the passengers list.',
  })
  @ApiNotFoundResponse({
    description: 'Not passengers registered for this tour.',
  })
  @Get('tour/:id')
  async getByTourId(@Param() param: IdValidator) {
    return await this.passengerService.getByTourId(param);
  }
}
