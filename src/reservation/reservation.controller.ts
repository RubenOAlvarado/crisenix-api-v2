import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationsDTO } from '@/shared/models/dtos/request/reservations/create-reservations.dto';
import { UpdateReservationsDto } from '@/shared/models/dtos/request/reservations/update-reservations.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '@/auth/public.decorator';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { QueryDTO } from '@/shared/dtos/query.dto';

@ApiTags('Reservations')
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @ApiCreatedResponse({
    description: 'Reservation created successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating reservation.',
  })
  @Post()
  @ApiBody({ type: CreateReservationsDTO })
  create(@Body() createReservationDto: CreateReservationsDTO) {
    return this.reservationService.create(createReservationDto);
  }

  @ApiOkResponse({
    description: 'Reservations found successfully.',
  })
  @ApiNotFoundResponse({ description: 'No reservations registered.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong looking reservations.',
  })
  @Public()
  @Get()
  findAll(@Query() query: QueryDTO) {
    return this.reservationService.findAll(query);
  }

  @ApiOkResponse({
    description: 'Reservation found successfully.',
  })
  @ApiNotFoundResponse({ description: 'Reservation not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong looking reservation.',
  })
  @Public()
  @Get(':id')
  findOne(@Param() params: UrlValidator) {
    return this.reservationService.findOne(params);
  }

  @ApiOkResponse({
    description: 'Reservation updated successfully.',
  })
  @ApiNotFoundResponse({ description: 'Reservation not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating reservation.',
  })
  @ApiBody({ type: UpdateReservationsDto })
  @Patch(':id')
  update(
    @Param() params: UrlValidator,
    @Body() updateReservationDto: UpdateReservationsDto,
  ) {
    return this.reservationService.update(params, updateReservationDto);
  }

  @ApiOkResponse({
    description: 'Reservation removed successfully.',
  })
  @ApiNotFoundResponse({ description: 'Reservation not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong removing reservation.',
  })
  @Delete(':id')
  remove(@Param() params: UrlValidator) {
    return this.reservationService.remove(params);
  }
}
