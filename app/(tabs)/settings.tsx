import { useCallback, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useFocusEffect } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';

import { Card } from '../../components/Card';
import { OptionButton } from '../../components/OptionButton';
import { alarmSoundOptions, getAlarmSoundSource } from '../../data/alarmSounds';
import { simulationSpeedOptions } from '../../data/simulationSpeeds';
import {
  defaultAlarmSettings,
  loadAlarmSettings,
  saveAlarmSettings,
} from '../../storage/alarmSettings';
import { AlarmSettings, AlarmSoundId, SimulationSpeed } from '../../types/trip';

export default function SettingsScreen() {
  const [settings, setSettings] =
    useState<AlarmSettings>(defaultAlarmSettings);
  const [statusMessage, setStatusMessage] = useState(
    'Elegí cómo querés que suene la alarma.'
  );

  const alarmPlayer = useAudioPlayer(
    getAlarmSoundSource(settings.alarmSoundId)
  );

  const stopPreview = useCallback(() => {
  Vibration.cancel();

  try {
    alarmPlayer.pause();
    alarmPlayer.seekTo(0);
    } catch {
    // Si no hay sonido activo, no hacemos nada.
    }
  }, [alarmPlayer]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadSettings() {
        const savedSettings = await loadAlarmSettings();

        if (isActive) {
          setSettings(savedSettings);
        }
      }

      loadSettings();

      return () => {
        isActive = false;
        stopPreview();
      };
    }, [stopPreview])
  );

  async function updateSettings(newSettings: AlarmSettings) {
    setSettings(newSettings);
    await saveAlarmSettings(newSettings);
    setStatusMessage('Configuracion guardada.');
  }


  function testAlarm() {
    stopPreview();

    if (settings.isSoundEnabled) {
      try {
        alarmPlayer.seekTo(0);
        alarmPlayer.play();
      } catch {
        // Si falla el sonido, probamos vibracion igual.
      }
    }

    if (settings.isVibrationEnabled) {
      Vibration.vibrate([700, 400, 700, 400], true);
    }

    setStatusMessage('Probando alarma.');
  }

  function toggleSound() {
    updateSettings({
      ...settings,
      isSoundEnabled: !settings.isSoundEnabled,
    });
  }

  function toggleVibration() {
    updateSettings({
      ...settings,
      isVibrationEnabled: !settings.isVibrationEnabled,
    });
  }

  function selectSimulationSpeed(simulationSpeed: SimulationSpeed) {
    updateSettings({
      ...settings,
      simulationSpeed,
    });
  }

  function selectAlarmSound(alarmSoundId: AlarmSoundId) {
    stopPreview();

    updateSettings({
      ...settings,
      alarmSoundId,
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Config</Text>
      <Text style={styles.subtitle}>
        Personalizá la alarma, la vibración y el sonido de aviso.
      </Text>

      <Card>
        <Text style={styles.sectionLabel}>Alarma</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingTextBox}>
            <Text style={styles.settingTitle}>Sonido</Text>
            <Text style={styles.description}>
              Activa o desactiva el sonido de la alarma.
            </Text>
          </View>

          <Pressable
            style={[
              styles.switchButton,
              settings.isSoundEnabled && styles.switchButtonActive,
            ]}
            onPress={toggleSound}
          >
            <Text
              style={[
                styles.switchButtonText,
                settings.isSoundEnabled && styles.switchButtonTextActive,
              ]}
            >
              {settings.isSoundEnabled ? 'ON' : 'OFF'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingTextBox}>
            <Text style={styles.settingTitle}>Vibracion</Text>
            <Text style={styles.description}>
              Hace vibrar el celular cuando llega el aviso.
            </Text>
          </View>

          <Pressable
            style={[
              styles.switchButton,
              settings.isVibrationEnabled && styles.switchButtonActive,
            ]}
            onPress={toggleVibration}
          >
            <Text
              style={[
                styles.switchButtonText,
                settings.isVibrationEnabled && styles.switchButtonTextActive,
              ]}
            >
              {settings.isVibrationEnabled ? 'ON' : 'OFF'}
            </Text>
          </Pressable>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionLabel}>Sonido de alarma</Text>

        <Text style={styles.description}>
          Elegí qué sonido querés usar cuando se active la alarma.
        </Text>

        <View style={styles.soundList}>
          {alarmSoundOptions.map((sound) => {
            const isSelected = settings.alarmSoundId === sound.value;

            return (
              <Pressable
                key={sound.value}
                style={[styles.soundItem, isSelected && styles.selectedItem]}
                onPress={() => selectAlarmSound(sound.value)}
              >
                <Text style={styles.soundTitle}>{sound.label}</Text>
                <Text style={styles.description}>{sound.description}</Text>

                {isSelected && (
                  <Text style={styles.selectedText}>Seleccionado</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.primaryButton} onPress={testAlarm}>
          <Text style={styles.primaryButtonText}>Probar alarma</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={stopPreview}>
          <Text style={styles.secondaryButtonText}>Silenciar prueba</Text>
        </Pressable>
      </Card>

      <Card>
        <Text style={styles.sectionLabel}>Modo prueba</Text>

        <Text style={styles.description}>
          Esta velocidad se usa para simulaciones y pruebas internas.
        </Text>

        <View style={styles.compactOptions}>
          {simulationSpeedOptions.map((option) => (
            <OptionButton
              key={option.value}
              label={option.label}
              selected={settings.simulationSpeed === option.value}
              onPress={() => selectSimulationSpeed(option.value)}
              compact
            />
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionLabel}>Estado</Text>
        <Text style={styles.statusMessage}>{statusMessage}</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101820',
  },
  content: {
    padding: 20,
    paddingTop: 58,
    paddingBottom: 120,
    gap: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    color: '#B9C6D3',
    fontSize: 15,
    lineHeight: 22,
  },
  sectionLabel: {
    color: '#8FA1B3',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  settingTextBox: {
    flex: 1,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  description: {
    color: '#B9C6D3',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  switchButton: {
    backgroundColor: '#223142',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#263544',
  },
  switchButtonActive: {
    backgroundColor: '#5DE2A3',
    borderColor: '#5DE2A3',
  },
  switchButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  switchButtonTextActive: {
    color: '#101820',
  },
  soundList: {
    gap: 10,
    marginTop: 14,
  },
  soundItem: {
    backgroundColor: '#223142',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: '#263544',
  },
  selectedItem: {
    backgroundColor: '#183326',
    borderColor: '#5DE2A3',
  },
  soundTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  selectedText: {
    color: '#5DE2A3',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginTop: 8,
  },
  compactOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  primaryButton: {
    backgroundColor: '#5DE2A3',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    color: '#101820',
    fontSize: 15,
    fontWeight: '900',
  },
  secondaryButton: {
    backgroundColor: '#223142',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#263544',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  statusMessage: {
    color: '#5DE2A3',
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 22,
  },
});