import AsyncStorage from '@react-native-async-storage/async-storage';

import { TripPreferences } from '../types/trip';

export type FavoriteAlert = {
  id: string;
  name: string;
  preferences: TripPreferences;
};

const FAVORITE_ALERTS_KEY = 'bajateapp_favorite_alerts';

export const defaultFavoriteAlerts: FavoriteAlert[] = [
  {
    id: 'facultad-300',
    name: 'Facultad · Aviso 300 m',
    preferences: {
      alertMode: 'distance',
      selectedDestinationId: 5,
      selectedDistance: 300,
      selectedStopAlert: 1,
    },
  },
  {
    id: 'centro-500',
    name: 'Centro · Aviso 500 m',
    preferences: {
      alertMode: 'distance',
      selectedDestinationId: 6,
      selectedDistance: 500,
      selectedStopAlert: 1,
    },
  },
  {
    id: 'casa-2-paradas',
    name: 'Casa · 2 paradas antes',
    preferences: {
      alertMode: 'stops',
      selectedDestinationId: 7,
      selectedDistance: 300,
      selectedStopAlert: 2,
    },
  },
];

export async function loadFavoriteAlerts() {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITE_ALERTS_KEY);

    if (!jsonValue) {
      await saveFavoriteAlerts(defaultFavoriteAlerts);
      return defaultFavoriteAlerts;
    }

    return JSON.parse(jsonValue) as FavoriteAlert[];
  } catch {
    return defaultFavoriteAlerts;
  }
}

export async function saveFavoriteAlerts(favorites: FavoriteAlert[]) {
  try {
    const jsonValue = JSON.stringify(favorites);
    await AsyncStorage.setItem(FAVORITE_ALERTS_KEY, jsonValue);
  } catch {
    // Si falla el guardado, no rompemos la app.
  }
}