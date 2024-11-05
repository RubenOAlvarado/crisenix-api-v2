import { ReservationsLean } from '@/shared/interfaces/reservations/reservations.lean.interface';
import { ChangeStatusDTO } from '@/shared/models/dtos/request/reservations/change-status.dto';
import { CreateReservationsDTO } from '@/shared/models/dtos/request/reservations/create-reservations.dto';
import { UpdateReservationsDto } from '@/shared/models/dtos/request/reservations/update-reservations.dto';
import { Reservations } from '@/shared/models/schemas/reservation.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { TourService } from '@/tour/tour.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChangeReservationStatus } from './changeReservationStatus';
import { QueryReservationStatusDTO } from '@/shared/models/dtos/request/reservations/query-reservations.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservations.name)
    private readonly reservationModel: Model<Reservations>,
    private readonly tourService: TourService,
  ) {}

  async create(createReservationDto: CreateReservationsDTO) {
    try {
      const newReservation = new this.reservationModel(createReservationDto);
      const { tour, totalSeats } = createReservationDto;
      await this.tourService.reserveTourSeats(tour, totalSeats);
      return newReservation.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong creating reservation.',
        error,
      );
    }
  }

  async findAll({
    limit,
    page,
    status,
  }: QueryReservationStatusDTO): Promise<ReservationsLean[]> {
    try {
      const query = status ? { status } : {};
      const reservations = await this.reservationModel
        .find(query)
        .limit(limit)
        .skip(page * limit)
        .select({ __v: 0, createdAt: 0 })
        .lean()
        .exec();
      if (!reservations) throw new Error('No reservations registered.');
      return reservations;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong looking reservations.',
        error,
      );
    }
  }

  async findOne({ id }: IdValidator): Promise<ReservationsLean> {
    try {
      const reservation = await this.reservationModel
        .findById(id)
        .select({
          __v: 0,
          createdAt: 0,
        })
        .lean()
        .exec();
      if (!reservation) throw new Error('Reservation not found.');
      return reservation;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong looking reservation.',
        error,
      );
    }
  }

  async update(
    { id }: IdValidator,
    updateReservationDto: UpdateReservationsDto,
  ): Promise<ReservationsLean> {
    try {
      const updatedReservation = await this.reservationModel.findByIdAndUpdate(
        id,
        updateReservationDto,
        { new: true },
      );
      if (!updatedReservation) throw new Error('Reservation not found.');
      return updatedReservation;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong updating reservation.',
        error,
      );
    }
  }

  async changeStatus({ id, status }: ChangeStatusDTO) {
    try {
      const command = new ChangeReservationStatus(
        this.reservationModel,
        this.tourService,
        id,
        status,
      );
      return command.execute();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong changing reservation status.',
        error,
      );
    }
  }
}
