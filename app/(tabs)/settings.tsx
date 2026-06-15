import { useEffect, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  Vibration,
  View,
} from 'react-native';

import { Card } from '../../components/Card';
import { OptionButton } from '../../components/OptionButton';
import {
  defaultAlarmSettings,
  loadAlarmSettings,
  saveAlarmSettings,
} from '../../storage/alarmSettings';
import { AlarmSettings, SimulationSpeed } from '../../types/trip';

const alarmSound = require('../../assets/sounds/alarm.mp3');

const simulationSpeedOptions: {
  label: string;
  value: SimulationSpeed;
  delay: number;
}[] = [
  { label: 'Lenta', value: 'slow', delay: 1500 },
  { label: 'Normal', value: 'normal', delay: 1000 },
  { label: 'Rápida', value: 'fast', delay: 500 },
];

export default function SettingsScreen() {
  const alarmPlayer = useAudioPlayer(alarmSound);

  const [alarmSettings, setAlarmSettings] =
    useState<AlarmSettings>(defaultAlarmSettings);
  const [hasLoadedAlarmSettings, setHasLoadedAlarmSettings] = useState(false);

  const selectedSimulationSpeed = simulationSpeedOptions.find(
    (option) => option.value === alarmSettings.simulationSpeed
  )!;

  useEffect(() => {
    let isMounted = true;

    async function loadSavedAlarmSettings() {
      const savedSettings = await loadAlarmSettings();

      if (!isMounted) {
        return;
      }

      setAlarmSettings(savedSettings);
      setHasLoadedAlarmSettings(true);
    }

    loadSavedAlarmSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedAlarmSettings) {
      return;
    }

    saveAlarmSettings(alarmSettings);
  }, [alarmSettings, hasLoadedAlarmSettings]);

  function updateAlarmSettings(newSettings: Partial<AlarmSettings>) {
    setAlarmSettings((currentSettings) => ({
      ...currentSettings,
      ...newSettings,
    }));
  }

  function selectSimulationSpeed(speed: SimulationSpeed) {
    updateAlarmSettings({
      simulationSpeed: speed,
    });
  }

  function stopAlarm() {
    Vibration.cancel();

    alarmPlayer.pause();
    alarmPlayer.seekTo(0);
  }

  function testAlarm() {
    if (alarmSettings.isVibrationEnabled) {
      Vibration.vibrate([0, 500, 250, 500, 250, 800]);
    }

    if (alarmSettings.isSoundEnabled) {
      alarmPlayer.seekTo(0);
      alarmPlayer.play();
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.appName}>BajateApp</Text>
        <Text style={styles.title}>Configuración</Text>
        <Text style={styles.subtitle}>
          Ajustá cómo querés que te avise la app durante el viaje.
        </Text>
      </View>

      <Card>
        <Text style={styles.label}>Alarma</Text>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Sonido</Text>
            <Text style={styles.settingDescription}>
              Reproducir alarma al llegar al aviso.
            </Text>
          </View>

          <Switch
            value={alarmSettings.isSoundEnabled}
            onValueChange={(value) =>
              updateAlarmSettings({ isSoundEnabled: value })
            }
            trackColor={{ false: '#263544', true: '#5DE2A3' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingDivider} />

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Vibración</Text>
            <Text style={styles.settingDescription}>
              Vibrar cuando se active la alerta.
            </Text>
          </View>

          <Switch
            value={alarmSettings.isVibrationEnabled}
            onValueChange={(value) =>
              updateAlarmSettings({ isVibrationEnabled: value })
            }
            trackColor={{ false: '#263544', true: '#5DE2A3' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </Card>

      <Card>
        <Text style={styles.label}>Velocidad de simulación</Text>

        <View style={styles.optionsRow}>
          {simulationSpeedOptions.map((option) => (
            <OptionButton
              key={option.value}
              label={option.label}
              selected={alarmSettings.simulationSpeed === option.value}
              onPress={() => selectSimulationSpeed(option.value)}
            />
          ))}
        </View>

        <Text style={styles.selectedText}>
          Velocidad elegida: {selectedSimulationSpeed.label}
        </Text>
      </Card>

      <Card>
        <Text style={styles.label}>Prueba de alarma</Text>
        <Text style={styles.settingDescription}>
          Usá estos botones para comprobar sonido y vibración sin esperar la simulación.
        </Text>

        <View style={styles.settingButtons}>
          <Pressable style={styles.testButton} onPress={testAlarm}>
            <Text style={styles.testButtonText}>Probar alarma</Text>
          </Pressable>

          <Pressable style={styles.silenceButton} onPress={stopAlarm}>
            <Text style={styles.silenceButtonText}>Silenciar</Text>
          </Pressable>
        </View>
      </Card>

      <Card>
        <Text style={styles.label}>Guardado automático</Text>
        <Text style={styles.infoText}>
          La configuración se guarda automáticamente y se aplica al volver a la pantalla de viaje.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#101820',
  },
  content: {
    padding: 22,
    gap: 13,
    paddingBottom: 36,
  },
  header: {
    marginTop: 20,
    marginBottom: 4,
  },
  appName: {
    color: '#5DE2A3',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: '#B8C2CC',
    fontSize: 17,
    lineHeight: 24,
    marginTop: 5,
  },
  label: {
    color: '#8FA1B3',
    fontSize: 14,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  selectedText: {
    color: '#B8C2CC',
    fontSize: 14,
    marginTop: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  settingDescription: {
    color: '#8FA1B3',
    fontSize: 13,
    marginTop: 4,
    maxWidth: 230,
    lineHeight: 19,
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#263544',
    marginVertical: 14,
  },
  settingButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  testButton: {
    flex: 1,
    backgroundColor: '#5DE2A3',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#101820',
    fontSize: 15,
    fontWeight: '800',
  },
  silenceButton: {
    flex: 1,
    backgroundColor: '#263544',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  silenceButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  infoText: {
    color: '#B8C2CC',
    fontSize: 15,
    lineHeight: 22,
  },
});