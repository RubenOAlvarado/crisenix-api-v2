import { ReservationsLean } from '../types/reservations/reservations.lean.type';

export interface ChangeReservationStatusCommand {
  execute(): Promise<ReservationsLean>;
}
