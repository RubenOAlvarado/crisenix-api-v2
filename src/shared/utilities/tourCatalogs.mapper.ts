import { AboardHourDTO } from '../models/dtos/request/tour/aboardhour.dto';
import { CoordinatorDTO } from '../models/dtos/request/tour/coordinator.dto';
import { ItineraryDTO } from '../models/dtos/request/tour/itinerary.dto';
import { IdValidator } from '../models/dtos/validators/id.validator';

export const CatalogMap = {
  aboardHour: AboardHourDTO,
  returnHour: AboardHourDTO,
  coordinators: CoordinatorDTO,
  includeds: IdValidator,
  itineraries: ItineraryDTO,
  prices: IdValidator,
} as const;

export type CatalogName = keyof typeof CatalogMap;
