import { AlarmSoundId } from '../types/trip';

export const alarmSoundOptions: {
  label: string;
  value: AlarmSoundId;
  description: string;
}[] = [
  {
    label: 'Clasica',
    value: 'classic',
    description: 'Alarma principal de BajateApp.',
  },
  {
    label: 'Suave',
    value: 'soft',
    description: 'Sonido mas tranquilo para viajes cortos.',
  },
  {
    label: 'Campana',
    value: 'bell',
    description: 'Aviso tipo campana.',
  },
];

export function getAlarmSoundSource(alarmSoundId: AlarmSoundId) {
  switch (alarmSoundId) {
    case 'soft':
      return require('../assets/sounds/alarm-soft.mp3');

    case 'bell':
      return require('../assets/sounds/alarm-bell.wav');

    case 'classic':
    default:
      return require('../assets/sounds/alarm-classic.mp3');
  }
}