import AsyncStorage from '@react-native-async-storage/async-storage';

import { AlertMode } from '../types/trip';
import { TransitCityId } from '../types/transit';

export type SelectedTransitTrip = {
  cityId: TransitCityId;
  routeId: string;
  routeName: string;
  directionId: string;
  directionName: string;
  tripId: string;
  destinationStopId: string;
  destinationStopName: string;
  alertMode: AlertMode;
  selectedDistance: number;
  selectedStopAlert: number;
};

const SELECTED_TRANSIT_TRIP_KEY = 'bajateapp_selected_transit_trip';

export async function saveSelectedTransitTrip(trip: SelectedTransitTrip) {
  try {
    const jsonValue = JSON.stringify(trip);
    await AsyncStorage.setItem(SELECTED_TRANSIT_TRIP_KEY, jsonValue);
  } catch {
    // Si falla el guardado, no rompemos la app.
  }
}

export async function loadSelectedTransitTrip() {
  try {
    const jsonValue = await AsyncStorage.getItem(SELECTED_TRANSIT_TRIP_KEY);

    if (!jsonValue) {
      return null;
    }

    const savedTrip = JSON.parse(jsonValue) as Partial<SelectedTransitTrip>;

    if (
      !savedTrip.routeId ||
      !savedTrip.directionId ||
      !savedTrip.destinationStopId
    ) {
      return null;
    }

    return {
      cityId: savedTrip.cityId ?? 'buenos-aires',
      routeId: savedTrip.routeId,
      routeName: savedTrip.routeName ?? '',
      directionId: savedTrip.directionId,
      directionName: savedTrip.directionName ?? '',
      tripId: savedTrip.tripId ?? '',
      destinationStopId: savedTrip.destinationStopId,
      destinationStopName: savedTrip.destinationStopName ?? '',
      alertMode: savedTrip.alertMode ?? 'distance',
      selectedDistance: savedTrip.selectedDistance ?? 300,
      selectedStopAlert: savedTrip.selectedStopAlert ?? 1,
    } as SelectedTransitTrip;
  } catch {
    return null;
  }
}