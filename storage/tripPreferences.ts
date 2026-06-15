import AsyncStorage from '@react-native-async-storage/async-storage';

import { TripPreferences  } from '@/types/trip';

const TRIP_PREFERENCES_KEY = 'bajateapp_trip_preferences';

export async function saveTripPreferences(preferences: TripPreferences) {
    try {
        const jsonValue = JSON.stringify(preferences);
        await AsyncStorage.setItem(TRIP_PREFERENCES_KEY, jsonValue);
    } catch {
        //si falla el guardado, no rompe la app.
    }
}

export async function loadTripPreferences() {
    try {
        const jsonValue = await AsyncStorage.getItem(TRIP_PREFERENCES_KEY);

        if (!jsonValue) {
            return null;
        }

        return JSON.parse(jsonValue) as TripPreferences;
    } catch {
        return null;
    }
}