import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, Vibration, View } from 'react-native';

import { Card } from '../../components/Card';
import { demoStops } from '../../data/demoStops';
import {
  defaultAlarmSettings,
  loadAlarmSettings,
} from '../../storage/alarmSettings';
import { loadTripPreferences } from '../../storage/tripPreferences';
import { AlarmSettings, TripPreferences } from '../../types/trip';
import { calculateDistanceInMeters } from '../../utils/distance';

const alarmSound = require('../../assets/sounds/alarm.mp3');

const defaultPreferences: TripPreferences = {
  alertMode: 'distance',
  selectedDestinationId: 5,
  selectedDistance: 300,
  selectedStopAlert: 1,
};

const stopAlertRadiusInMeters = 120;

export default function LocationScreen() {
  const alarmPlayer = useAudioPlayer(alarmSound);

  const [preferences, setPreferences] =
    useState<TripPreferences>(defaultPreferences);
  const [alarmSettings, setAlarmSettings] =
    useState<AlarmSettings>(defaultAlarmSettings);

  const [permissionStatus, setPermissionStatus] = useState('Sin pedir permiso');
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [hasTriggeredGpsAlarm, setHasTriggeredGpsAlarm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedDestinationIndex = useMemo(() => {
    const foundIndex = demoStops.findIndex(
      (stop) => stop.id === preferences.selectedDestinationId
    );

    return foundIndex >= 0 ? foundIndex : 4;
  }, [preferences.selectedDestinationId]);

  const selectedDestination = demoStops[selectedDestinationIndex];

  const alertStopIndex = Math.max(
    selectedDestinationIndex - preferences.selectedStopAlert,
    0
  );

  const alertStop = demoStops[alertStopIndex];

  const distanceToDestination = useMemo(() => {
    if (!currentLocation) {
      return null;
    }

    return calculateDistanceInMeters(
      {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      },
      {
        latitude: selectedDestination.latitude,
        longitude: selectedDestination.longitude,
      }
    );
  }, [
    currentLocation,
    selectedDestination.latitude,
    selectedDestination.longitude,
  ]);

  const distanceToAlertStop = useMemo(() => {
    if (!currentLocation) {
      return null;
    }

    return calculateDistanceInMeters(
      {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      },
      {
        latitude: alertStop.latitude,
        longitude: alertStop.longitude,
      }
    );
  }, [alertStop.latitude, alertStop.longitude, currentLocation]);

  const isInsideDistanceAlert =
    preferences.alertMode === 'distance' &&
    distanceToDestination !== null &&
    distanceToDestination <= preferences.selectedDistance;

  const isInsideStopAlert =
    preferences.alertMode === 'stops' &&
    distanceToAlertStop !== null &&
    distanceToAlertStop <= stopAlertRadiusInMeters;

  const gpsStatus = getGpsStatus();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadSavedData() {
        const savedPreferences = await loadTripPreferences();
        const savedAlarmSettings = await loadAlarmSettings();

        if (!isActive) {
          return;
        }

        if (savedPreferences) {
          setPreferences(savedPreferences);
        }

        setAlarmSettings(savedAlarmSettings);
      }

      loadSavedData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    if (!isTracking) {
      return;
    }

    let isActive = true;
    let subscription: Location.LocationSubscription | null = null;

    async function startLocationWatcher() {
      try {
        setErrorMessage('');

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (!isActive) {
          return;
        }

        setPermissionStatus(status);

        if (status !== 'granted') {
          setErrorMessage(
            'No se concedió permiso de ubicación. Activá el permiso para usar GPS real.'
          );
          setIsTracking(false);
          return;
        }

        const newSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 3000,
            distanceInterval: 10,
          },
          (location) => {
            setCurrentLocation(location);
          }
        );

        if (!isActive) {
          newSubscription.remove();
          return;
        }

        subscription = newSubscription;
      } catch {
        if (isActive) {
          setErrorMessage('No se pudo iniciar el seguimiento GPS.');
          setIsTracking(false);
        }
      }
    }

    startLocationWatcher();

    return () => {
      isActive = false;
      subscription?.remove();
    };
  }, [isTracking]);

  useEffect(() => {
    if (!isTracking || hasTriggeredGpsAlarm) {
      return;
    }

    if (isInsideDistanceAlert || isInsideStopAlert) {
      activateGpsAlarm();
    }
  }, [
    activateGpsAlarm,
    hasTriggeredGpsAlarm,
    isInsideDistanceAlert,
    isInsideStopAlert,
    isTracking,
  ]);

  const stopAlarm = useCallback(() => {
    Vibration.cancel();

    alarmPlayer.pause();
    alarmPlayer.seekTo(0);
  }, [alarmPlayer]);

  const activateGpsAlarm = useCallback(() => {
    setHasTriggeredGpsAlarm(true);
    setIsTracking(false);

    if (alarmSettings.isVibrationEnabled) {
      Vibration.vibrate([0, 500, 250, 500, 250, 800]);
    }

    if (alarmSettings.isSoundEnabled) {
      alarmPlayer.seekTo(0);
      alarmPlayer.play();
    }
  }, [
    alarmPlayer,
    alarmSettings.isSoundEnabled,
    alarmSettings.isVibrationEnabled,
  ]);

  async function getCurrentLocationOnce() {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const { status } = await Location.requestForegroundPermissionsAsync();

      setPermissionStatus(status);

      if (status !== 'granted') {
        setErrorMessage(
          'No se concedió permiso de ubicación. Activá el permiso para probar el GPS.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCurrentLocation(location);
    } catch {
      setErrorMessage('No se pudo obtener la ubicación actual.');
    } finally {
      setIsLoading(false);
    }
  }

  function startGpsTracking() {
    stopAlarm();
    setHasTriggeredGpsAlarm(false);
    setErrorMessage('');
    setIsTracking(true);
  }

  function stopGpsTracking() {
    setIsTracking(false);
    stopAlarm();
  }

  function getGpsStatus() {
    if (hasTriggeredGpsAlarm) {
      return 'Alarma GPS activada';
    }

    if (isTracking) {
      return 'Siguiendo ubicación en tiempo real';
    }

    return 'Seguimiento GPS detenido';
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.appName}>BajateApp</Text>
        <Text style={styles.title}>GPS real</Text>
        <Text style={styles.subtitle}>
          Probá ubicación real y alertas con la app abierta.
        </Text>
      </View>

      {hasTriggeredGpsAlarm && (
        <View style={styles.alarmCard}>
          <Text style={styles.alarmEmoji}>🚨</Text>
          <Text style={styles.alarmTitle}>¡Alarma GPS activada!</Text>
          <Text style={styles.alarmText}>
            Llegaste al rango configurado para tu aviso.
          </Text>

          <Pressable style={styles.alarmSilenceButton} onPress={stopAlarm}>
            <Text style={styles.alarmSilenceButtonText}>Silenciar alarma</Text>
          </Pressable>
        </View>
      )}

      <Card>
        <Text style={styles.label}>Destino elegido</Text>
        <Text style={styles.mainText}>{selectedDestination.name}</Text>

        <Text style={styles.description}>
          Este destino se toma desde la última configuración guardada en Viaje.
        </Text>
      </Card>

      <Card>
        <Text style={styles.label}>Tipo de aviso</Text>

        {preferences.alertMode === 'distance' ? (
          <>
            <Text style={styles.mainText}>Por distancia</Text>
            <Text style={styles.description}>
              La alarma se activa cuando estés a {preferences.selectedDistance} m
              o menos de {selectedDestination.name}.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.mainText}>Por paradas</Text>
            <Text style={styles.description}>
              La alarma se activa cuando estés cerca de {alertStop.name},{' '}
              {preferences.selectedStopAlert} parada(s) antes del destino.
            </Text>
          </>
        )}
      </Card>

      <Card>
        <Text style={styles.label}>Estado GPS</Text>
        <Text
          style={[
            styles.status,
            isTracking && styles.statusActive,
            hasTriggeredGpsAlarm && styles.statusAlarm,
          ]}
        >
          {gpsStatus}
        </Text>

        <Text style={styles.description}>
          Permiso actual: {permissionStatus}
        </Text>
      </Card>

      <View style={styles.actions}>
        <Pressable
          style={[styles.primaryButton, isLoading && styles.disabledButton]}
          onPress={getCurrentLocationOnce}
          disabled={isLoading}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading ? 'Buscando ubicación...' : 'Actualizar ubicación una vez'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.primaryButton, isTracking && styles.disabledButton]}
          onPress={startGpsTracking}
          disabled={isTracking}
        >
          <Text style={styles.primaryButtonText}>
            {isTracking ? 'Seguimiento activo' : 'Iniciar seguimiento GPS'}
          </Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={stopGpsTracking}>
          <Text style={styles.secondaryButtonText}>Detener seguimiento</Text>
        </Pressable>
      </View>

      {errorMessage.length > 0 && (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Atención</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      <Card>
        <Text style={styles.label}>Ubicación actual</Text>

        {currentLocation ? (
          <>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Latitud</Text>
              <Text style={styles.locationValue}>
                {currentLocation.coords.latitude.toFixed(6)}
              </Text>
            </View>

            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Longitud</Text>
              <Text style={styles.locationValue}>
                {currentLocation.coords.longitude.toFixed(6)}
              </Text>
            </View>

            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Precisión</Text>
              <Text style={styles.locationValue}>
                {Math.round(currentLocation.coords.accuracy ?? 0)} m
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>
            Todavía no se obtuvo ninguna ubicación.
          </Text>
        )}
      </Card>

      <Card>
        <Text style={styles.label}>Distancia hasta destino</Text>

        {distanceToDestination !== null ? (
          <>
            <Text style={styles.bigNumber}>{distanceToDestination} m</Text>

            <Text style={styles.description}>
              Distancia desde tu ubicación actual hasta {selectedDestination.name}.
            </Text>

            {preferences.alertMode === 'distance' && (
              <View
                style={[
                  styles.alertStatusCard,
                  isInsideDistanceAlert && styles.alertStatusCardActive,
                ]}
              >
                <Text
                  style={[
                    styles.alertStatusText,
                    isInsideDistanceAlert && styles.alertStatusTextActive,
                  ]}
                >
                  {isInsideDistanceAlert
                    ? 'Estás dentro del rango de aviso'
                    : `Todavía faltan más de ${preferences.selectedDistance} m`}
                </Text>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.emptyText}>
            Tocá “Actualizar ubicación una vez” o iniciá seguimiento GPS.
          </Text>
        )}
      </Card>

      {preferences.alertMode === 'stops' && (
        <Card>
          <Text style={styles.label}>Distancia hasta parada de aviso</Text>

          {distanceToAlertStop !== null ? (
            <>
              <Text style={styles.bigNumber}>{distanceToAlertStop} m</Text>

              <Text style={styles.description}>
                Parada de aviso: {alertStop.name}. La alarma GPS se activa al
                estar a {stopAlertRadiusInMeters} m o menos.
              </Text>

              <View
                style={[
                  styles.alertStatusCard,
                  isInsideStopAlert && styles.alertStatusCardActive,
                ]}
              >
                <Text
                  style={[
                    styles.alertStatusText,
                    isInsideStopAlert && styles.alertStatusTextActive,
                  ]}
                >
                  {isInsideStopAlert
                    ? 'Estás cerca de la parada de aviso'
                    : `Todavía estás a más de ${stopAlertRadiusInMeters} m`}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>
              Tocá “Actualizar ubicación una vez” o iniciá seguimiento GPS.
            </Text>
          )}
        </Card>
      )}

      <Card>
        <Text style={styles.label}>Importante</Text>
        <Text style={styles.description}>
          Este modo usa GPS en primer plano. Para que funcione, la app debe
          permanecer abierta. Más adelante se puede trabajar ubicación en
          segundo plano.
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
  alarmCard: {
    backgroundColor: '#3A1F1F',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    alignItems: 'center',
  },
  alarmEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  alarmTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  alarmText: {
    color: '#FFD1D1',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6,
  },
  alarmSilenceButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    marginTop: 14,
  },
  alarmSilenceButtonText: {
    color: '#3A1F1F',
    fontSize: 15,
    fontWeight: '900',
  },
  label: {
    color: '#8FA1B3',
    fontSize: 14,
    marginBottom: 8,
  },
  mainText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  status: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  statusActive: {
    color: '#5DE2A3',
  },
  statusAlarm: {
    color: '#FF6B6B',
  },
  description: {
    color: '#B8C2CC',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  actions: {
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#5DE2A3',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: '#101820',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: '#263544',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  errorCard: {
    backgroundColor: '#3A1F1F',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  errorText: {
    color: '#FFD1D1',
    fontSize: 15,
    lineHeight: 22,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#263544',
  },
  locationLabel: {
    color: '#8FA1B3',
    fontSize: 15,
  },
  locationValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  emptyText: {
    color: '#B8C2CC',
    fontSize: 15,
    lineHeight: 22,
  },
  bigNumber: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
  },
  alertStatusCard: {
    backgroundColor: '#223142',
    borderRadius: 18,
    padding: 14,
    marginTop: 14,
  },
  alertStatusCardActive: {
    backgroundColor: '#3A1F1F',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  alertStatusText: {
    color: '#B8C2CC',
    fontSize: 15,
    fontWeight: '800',
  },
  alertStatusTextActive: {
    color: '#FFD1D1',
  },
});