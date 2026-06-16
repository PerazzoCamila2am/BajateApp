import AsyncStorage from '@react-native-async-storage/async-storage';

import { AlertMode } from '../types/trip';

export type SelectedTransitTrip = {
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

    return JSON.parse(jsonValue) as SelectedTransitTrip;
  } catch {
    return null;
  }
}