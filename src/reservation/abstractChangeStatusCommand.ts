import { ReservationStatus } from '@/shared/enums/reservation-status.enum';
import { ChangeReservationStatusCommand } from '@/shared/interfaces/changeReservationStatus.interface';
import { ReservationsLean } from '@/shared/types/reservations/reservations.lean.type';
import { Reservations } from '@/shared/models/schemas/reservation.schema';
import { TourService } from '@/tour/tour.service';
import { NotFoundException } from '@nestjs/common';
import { Document, Model } from 'mongoose';

export abstract class AbstractChangeReservationStatusCommand
  implements ChangeReservationStatusCommand
{
  constructor(
    protected reservationModel: Model<Reservations>,
    protected tourService: TourService,
    protected id: string,
    protected status: ReservationStatus,
  ) {}

  public async execute(): Promise<ReservationsLean> {
    await this.validateStatus();
    const reservation = await this.fetchReservation();
    await this.handleTourSeatRelease(reservation);
    return this.updateReservationStatus();
  }

  protected async validateStatus(): Promise<void> {
    if (this.status === ReservationStatus.RESERVED) {
      return;
    }
    throw new Error('Invalid status.');
  }

  protected async fetchReservation(): Promise<Reservations> {
    const reservation = await this.reservationModel.findById(this.id);
    if (!reservation) {
      throw new NotFoundException('Reservation not found.');
    }
    return reservation;
  }

  protected async handleTourSeatRelease(
    reservation: Reservations,
  ): Promise<void> {
    if (this.status !== ReservationStatus.PAID && reservation?.tour) {
      const tourId =
        reservation.tour instanceof Document
          ? reservation.tour._id
          : reservation.tour;
      await this.tourService.releaseTourSeats(tourId, reservation.totalSeats);
    }
  }

  protected async updateReservationStatus(): Promise<ReservationsLean> {
    const updatedReservation = await this.reservationModel.findByIdAndUpdate(
      this.id,
      { status: this.status },
      { new: true },
    );
    if (!updatedReservation) {
      throw new NotFoundException('Reservation not found after update.');
    }
    return updatedReservation;
  }
}
