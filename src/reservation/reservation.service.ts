import { QueryDTO } from '@/shared/dtos/query.dto';
import { CreateReservationsDTO } from '@/shared/models/dtos/request/reservations/create-reservations.dto';
import { UpdateReservationsDto } from '@/shared/models/dtos/request/reservations/update-reservations.dto';
import { Reservations } from '@/shared/models/schemas/reservation.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservations.name)
    private readonly reservationModel: Model<Reservations>,
  ) {}

  create(createReservationDto: CreateReservationsDTO) {
    try {
      const newReservation = new this.reservationModel(createReservationDto);
      return newReservation.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong creating reservation.',
        error,
      );
    }
  }

  findAll({ limit, page, status }: QueryDTO) {
    try {
      const query = status ? { status } : {};
      const reservations = this.reservationModel
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

  findOne({ id }: UrlValidator) {
    try {
      const reservation = this.reservationModel
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

  update({ id }: UrlValidator, updateReservationDto: UpdateReservationsDto) {
    try {
      const updatedReservation = this.reservationModel.findByIdAndUpdate(
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

  remove({ id }: UrlValidator) {
    try {
      const removedReservation = this.reservationModel.findByIdAndUpdate(
        id,
        { status: 'inactive' },
        { new: true },
      );
      if (!removedReservation) throw new Error('Reservation not found.');
      return 'Reservation removed successfully.';
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong removing reservation.',
        error,
      );
    }
  }
}
