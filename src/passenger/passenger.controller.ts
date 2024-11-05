import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PassengerService } from './passenger.service';
import { ResponsePassengerDTO } from '@/shared/models/dtos/response/passenger/response-passenger.dto';
import { CreatePassengerDTO } from '@/shared/models/dtos/request/passenger/createpassenger.dto';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';

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
  @Post()
  async create(@Body() createPassengerDTO: CreatePassengerDTO) {
    return await this.passengerService.create(createPassengerDTO);
  }

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

  @ApiCreatedResponse({
    description: 'Passenger reactivated successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong reactivating the passenger.',
  })
  @ApiNotFoundResponse({
    description: 'Passenger not found.',
  })
  @Patch('reactivate/:id')
  async reactivate(@Param() { id }: IdValidator) {
    await this.passengerService.reactivate(id);
    return 'Passenger reactivated successfully.';
  }

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
}
