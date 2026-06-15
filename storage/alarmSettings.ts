import AsyncStorage from '@react-native-async-storage/async-storage';

import { AlarmSettings } from '../types/trip';

const ALARM_SETTINGS_KEY = 'bajateapp_alarm_settings';

export const defaultAlarmSettings: AlarmSettings = {
  isSoundEnabled: true,
  isVibrationEnabled: true,
  simulationSpeed: 'normal',
};

export async function saveAlarmSettings(settings: AlarmSettings) {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(ALARM_SETTINGS_KEY, jsonValue);
  } catch {
    // Si falla el guardado, no rompemos la app.
  }
}

export async function loadAlarmSettings() {
  try {
    const jsonValue = await AsyncStorage.getItem(ALARM_SETTINGS_KEY);

    if (!jsonValue) {
      return defaultAlarmSettings;
    }

    return {
      ...defaultAlarmSettings,
      ...(JSON.parse(jsonValue) as AlarmSettings),
    };
  } catch {
    return defaultAlarmSettings;
  }
}