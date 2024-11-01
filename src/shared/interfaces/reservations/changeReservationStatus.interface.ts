import { ReservationsLean } from './reservations.lean.interface';

export interface ChangeReservationStatusCommand {
  execute(): Promise<ReservationsLean>;
}
