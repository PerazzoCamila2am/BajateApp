export type AlertMode = 'distance' | 'stops';

export type TripStatus =
  | 'Sin viaje activo'
  | 'Simulando viaje'
  | 'Cerca del destino'
  | 'Alarma activada'
  | 'Destino alcanzado';

export type TripPreferences = {
  alertMode: AlertMode;
  selectedDestinationId: number;
  selectedDistance: number;
  selectedStopAlert: number;
};

export type SimulationSpeed = 'slow' | 'normal' | 'fast';

export type AlarmSoundId = 'classic' | 'soft' | 'bell';

export type AlarmSettings = {
  isSoundEnabled: boolean;
  isVibrationEnabled: boolean;
  simulationSpeed: SimulationSpeed;
  alarmSoundId: AlarmSoundId;
};