import { CreateTourPriceDTO } from '../models/dtos/request/price/createtourprice.dto';
import { AboardHourDTO } from '../models/dtos/request/tour/aboardhour.dto';
import { CoordinatorDTO } from '../models/dtos/request/tour/coordinator.dto';
import { ItineraryDTO } from '../models/dtos/request/tour/itinerary.dto';
import { UrlValidator } from '../validators/urlValidator.dto';

export const CatalogMap = {
  aboardHour: AboardHourDTO,
  returnHour: AboardHourDTO,
  coordinator: CoordinatorDTO,
  included: UrlValidator,
  itinerary: ItineraryDTO,
  prices: CreateTourPriceDTO,
} as const;

export type CatalogName = keyof typeof CatalogMap;
