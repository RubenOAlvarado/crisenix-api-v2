import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationsDTO } from '@/shared/models/dtos/request/reservations/create-reservations.dto';
import { UpdateReservationsDto } from '@/shared/models/dtos/request/reservations/update-reservations.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '@/auth/public.decorator';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { ChangeStatusDTO } from '@/shared/models/dtos/request/reservations/change-status.dto';
import { QueryReservationStatusDTO } from '@/shared/models/dtos/request/reservations/query-reservations.dto';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiCreatedResponse({
    description: 'Reservation created successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating reservation.',
  })
  @Post()
  @ApiBody({ type: CreateReservationsDTO })
  async create(@Body() createReservationDto: CreateReservationsDTO) {
    return await this.reservationService.create(createReservationDto);
  }

  @ApiOperation({ summary: 'Get all reservations' })
  @ApiOkResponse({
    description: 'Reservations found successfully.',
  })
  @ApiNotFoundResponse({ description: 'No reservations registered.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong looking reservations.',
  })
  @Public()
  @Get()
  async findAll(@Query() query: QueryReservationStatusDTO) {
    return await this.reservationService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a reservation by id' })
  @ApiOkResponse({
    description: 'Reservation found successfully.',
  })
  @ApiNotFoundResponse({ description: 'Reservation not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong looking reservation.',
  })
  @Public()
  @Get(':id')
  async findOne(@Param() params: IdValidator) {
    return await this.reservationService.findOne(params);
  }

  @ApiOperation({ summary: 'Update a reservation' })
  @ApiOkResponse({
    description: 'Reservation updated successfully.',
  })
  @ApiNotFoundResponse({ description: 'Reservation not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating reservation.',
  })
  @ApiBody({ type: UpdateReservationsDto })
  @Patch(':id')
  async update(
    @Param() params: IdValidator,
    @Body() updateReservationDto: UpdateReservationsDto,
  ) {
    return await this.reservationService.update(params, updateReservationDto);
  }

  @ApiOperation({ summary: 'Change the status of a reservation' })
  @ApiOkResponse({
    description: 'Reservation status changed successfully.',
  })
  @ApiNotFoundResponse({ description: 'Reservation not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong changing reservation status.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid status provided.',
  })
  @Patch(':id/change-status')
  async changeStatus(
    @Param() param: IdValidator,
    @Body() body: ChangeStatusDTO,
  ) {
    return await this.reservationService.changeStatus(param, body);
  }
}
