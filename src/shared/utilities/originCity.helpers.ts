import { MappedOriginCity } from '../interfaces/destination/mappedOriginCity.interface';

export function mapCitiesFromDestinationExcel(
  originCities: string,
): MappedOriginCity[] {
  const cityRegex = /(\w+)\s*\(([^)]+)\)\s*\[([^\]]+)\]/g;
  const cities = [];
  let match;
  while ((match = cityRegex.exec(originCities))) {
    cities.push({
      name: match[1]?.trim(),
      state: match[2]?.trim(),
      aboardPoints: match[3]
        ?.split(',')
        .map((aboardPoint) => aboardPoint.trim()),
    });
  }
  return cities;
}
