import { buenosAiresRouteIndex } from './buenosAiresRouteIndex';
import { loadBuenosAiresRouteDetails } from './loadBuenosAiresRouteDetails';
import { loadRosarioRouteDetails } from './loadRosarioRouteDetails';
import { rosarioRouteIndex } from './rosarioRouteIndex';
import { TransitCityId, TransitRoute } from '../../types/transit';

export type TransitRouteIndexItem = {
  id: string;
  shortName: string;
  longName: string;
  color?: string;
  textColor?: string;
  directionCount: number;
  stopCount: number;
};

export type TransitCity = {
  id: TransitCityId;
  name: string;
  routeIndex: TransitRouteIndexItem[];
  loadRouteDetails: (routeId: string) => Promise<TransitRoute | null>;
};

export const transitCities: TransitCity[] = [
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    routeIndex: buenosAiresRouteIndex,
    loadRouteDetails: loadBuenosAiresRouteDetails,
  },
  {
    id: 'rosario',
    name: 'Rosario',
    routeIndex: rosarioRouteIndex,
    loadRouteDetails: loadRosarioRouteDetails,
  },
];

export function getTransitCity(cityId: TransitCityId) {
  return (
    transitCities.find((city) => city.id === cityId) ?? transitCities[0]
  );
}

export async function loadTransitRouteDetails(
  cityId: TransitCityId,
  routeId: string
) {
  const city = getTransitCity(cityId);

  return city.loadRouteDetails(routeId);
}