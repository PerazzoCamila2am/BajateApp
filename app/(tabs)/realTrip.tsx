import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useFocusEffect } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, Vibration, View } from 'react-native';

import { Card } from '../../components/Card';
import { buenosAiresSampleRoutes } from '../../data/transit/buenosAiresSample';
import {
  defaultAlarmSettings,
  loadAlarmSettings,
} from '../../storage/alarmSettings';
import {
  loadSelectedTransitTrip,
  SelectedTransitTrip,
} from '../../storage/selectedTransitTrip';
import { AlarmSettings } from '../../types/trip';
import { TransitDirection, TransitRoute, TransitStop } from '../../types/transit';
import { calculateDistanceInMeters } from '../../utils/distance';

const alarmSound = require('../../assets/sounds/alarm.mp3');

type RealTripStatus =
  | 'Sin viaje real seleccionado'
  | 'Listo para iniciar'
  | 'Viaje real en curso'
  | 'Cerca del destino'
  | 'Alarma activada'
  | 'Destino alcanzado';

export default function RealTripScreen() {
  const alarmPlayer = useAudioPlayer(alarmSound);

  const [selectedTrip, setSelectedTrip] = useState<SelectedTransitTrip | null>(
    null
  );
  const [alarmSettings, setAlarmSettings] =
    useState<AlarmSettings>(defaultAlarmSettings);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [tripStatus, setTripStatus] = useState<RealTripStatus>(
    'Sin viaje real seleccionado'
  );

  const selectedRoute = useMemo(() => {
    if (!selectedTrip) {
      return null;
    }

    return (
      buenosAiresSampleRoutes.find((route) => route.id === selectedTrip.routeId) ??
      null
    );
  }, [selectedTrip]);

  const selectedDirection = useMemo(() => {
    if (!selectedRoute || !selectedTrip) {
      return null;
    }

    return (
      selectedRoute.directions.find(
        (direction) => direction.tripId === selectedTrip.tripId
      ) ??
      selectedRoute.directions.find(
        (direction) => direction.id === selectedTrip.directionId
      ) ??
      null
    );
  }, [selectedRoute, selectedTrip]);

  const destinationStopIndex = useMemo(() => {
    if (!selectedDirection || !selectedTrip) {
      return -1;
    }

    return selectedDirection.stops.findIndex(
      (stop) => stop.id === selectedTrip.destinationStopId
    );
  }, [selectedDirection, selectedTrip]);

  const safeDestinationStopIndex =
    destinationStopIndex >= 0 ? destinationStopIndex : 0;

  const visibleStops = useMemo(() => {
    if (!selectedDirection) {
      return [];
    }

    return selectedDirection.stops.slice(0, safeDestinationStopIndex + 1);
  }, [safeDestinationStopIndex, selectedDirection]);

  const currentStop = visibleStops[currentStopIndex] ?? visibleStops[0] ?? null;
  const destinationStop =
    visibleStops[safeDestinationStopIndex] ?? visibleStops[visibleStops.length - 1];

  const remainingStops = Math.max(
    safeDestinationStopIndex - currentStopIndex,
    0
  );

  const distanceToDestination = useMemo(() => {
    if (!currentStop || !destinationStop) {
      return null;
    }

    return calculateDistanceInMeters(
      {
        latitude: currentStop.latitude,
        longitude: currentStop.longitude,
      },
      {
        latitude: destinationStop.latitude,
        longitude: destinationStop.longitude,
      }
    );
  }, [currentStop, destinationStop]);

  const progressPercent = useMemo(() => {
    if (safeDestinationStopIndex <= 0) {
      return 0;
    }

    return Math.round((currentStopIndex / safeDestinationStopIndex) * 100);
  }, [currentStopIndex, safeDestinationStopIndex]);

  const isAlarmActive = tripStatus === 'Alarma activada';

  const stopAlarm = useCallback(() => {
    Vibration.cancel();

    alarmPlayer.pause();
    alarmPlayer.seekTo(0);
  }, [alarmPlayer]);

  const activateAlarm = useCallback(() => {
    setTripStatus('Alarma activada');
    setIsSimulating(false);

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

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadSavedTrip() {
        const savedTrip = await loadSelectedTransitTrip();
        const savedAlarmSettings = await loadAlarmSettings();

        if (!isActive) {
          return;
        }

        setAlarmSettings(savedAlarmSettings);
        setSelectedTrip(savedTrip);
        setCurrentStopIndex(0);
        setIsSimulating(false);
        stopAlarm();

        if (savedTrip) {
          setTripStatus('Listo para iniciar');
        } else {
          setTripStatus('Sin viaje real seleccionado');
        }
      }

      loadSavedTrip();

      return () => {
        isActive = false;
      };
    }, [stopAlarm])
  );

  useEffect(() => {
    if (!isSimulating || !selectedTrip || !selectedDirection || !destinationStop) {
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentStopIndex((currentIndex) => {
        const nextIndex = Math.min(currentIndex + 1, safeDestinationStopIndex);
        const nextStop = visibleStops[nextIndex];

        if (!nextStop) {
          setIsSimulating(false);
          return currentIndex;
        }

        const nextRemainingStops = Math.max(
          safeDestinationStopIndex - nextIndex,
          0
        );

        const nextDistanceToDestination = calculateDistanceInMeters(
          {
            latitude: nextStop.latitude,
            longitude: nextStop.longitude,
          },
          {
            latitude: destinationStop.latitude,
            longitude: destinationStop.longitude,
          }
        );

        const reachedDistanceAlert =
          selectedTrip.alertMode === 'distance' &&
          nextDistanceToDestination <= selectedTrip.selectedDistance;

        const reachedStopsAlert =
          selectedTrip.alertMode === 'stops' &&
          nextRemainingStops <= selectedTrip.selectedStopAlert;

        if (reachedDistanceAlert || reachedStopsAlert) {
          activateAlarm();
        } else if (
          selectedTrip.alertMode === 'distance' &&
          nextDistanceToDestination <= selectedTrip.selectedDistance + 300
        ) {
          setTripStatus('Cerca del destino');
        } else if (nextIndex >= safeDestinationStopIndex) {
          setTripStatus('Destino alcanzado');
          setIsSimulating(false);
        } else {
          setTripStatus('Viaje real en curso');
        }

        return nextIndex;
      });
    }, 1200);

    return () => clearInterval(intervalId);
  }, [
    activateAlarm,
    destinationStop,
    isSimulating,
    safeDestinationStopIndex,
    selectedDirection,
    selectedTrip,
    visibleStops,
  ]);

  function startRealTrip() {
    if (!selectedTrip || !selectedDirection || !destinationStop) {
      setTripStatus('Sin viaje real seleccionado');
      return;
    }

    stopAlarm();
    setCurrentStopIndex(0);
    setTripStatus('Viaje real en curso');
    setIsSimulating(true);
  }

  function stopRealTrip() {
    setIsSimulating(false);
    setCurrentStopIndex(0);
    setTripStatus(selectedTrip ? 'Listo para iniciar' : 'Sin viaje real seleccionado');
    stopAlarm();
  }

  if (!selectedTrip || !selectedRoute || !selectedDirection || !destinationStop) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.appName}>BajateApp</Text>
          <Text style={styles.title}>Viaje real</Text>
          <Text style={styles.subtitle}>
            Primero elegí una línea, sentido y parada destino desde la pestaña Líneas.
          </Text>
        </View>

        <Card>
          <Text style={styles.label}>Sin viaje real seleccionado</Text>
          <Text style={styles.description}>
            Entrá en Líneas, elegí un recorrido real de Buenos Aires y tocá
            “Guardar viaje real”.
          </Text>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.appName}>BajateApp</Text>
        <Text style={styles.title}>Viaje real</Text>
        <Text style={styles.subtitle}>
          Seguimiento con línea, sentido y paradas reales de Buenos Aires.
        </Text>
      </View>

      {isAlarmActive && (
        <View style={styles.alarmCard}>
          <Text style={styles.alarmEmoji}>🚨</Text>
          <Text style={styles.alarmTitle}>¡Estás por llegar!</Text>
          <Text style={styles.alarmText}>
            Preparáte para bajar en {destinationStop.name}.
          </Text>

          <Pressable style={styles.alarmSilenceButton} onPress={stopAlarm}>
            <Text style={styles.alarmSilenceButtonText}>Silenciar alarma</Text>
          </Pressable>
        </View>
      )}

      <Card>
        <Text style={styles.label}>Línea real seleccionada</Text>
        <Text style={styles.mainText}>
          Línea {selectedRoute.shortName}
        </Text>
        <Text style={styles.description}>{selectedRoute.longName}</Text>
      </Card>

      <Card>
        <Text style={styles.label}>Sentido</Text>
        <Text style={styles.mainText}>{selectedDirection.name}</Text>
        <Text style={styles.description}>
          {selectedDirection.stops.length} paradas cargadas desde GTFS.
        </Text>
      </Card>

      <Card>
        <Text style={styles.label}>Destino</Text>
        <Text style={styles.mainText}>{destinationStop.name}</Text>

        <Text style={styles.description}>
          Aviso:{' '}
          {selectedTrip.alertMode === 'distance'
            ? `${selectedTrip.selectedDistance} m antes`
            : `${selectedTrip.selectedStopAlert} parada(s) antes`}
        </Text>
      </Card>

      <View style={styles.actions}>
        <Pressable
          style={[styles.primaryButton, isSimulating && styles.disabledButton]}
          onPress={startRealTrip}
          disabled={isSimulating}
        >
          <Text style={styles.primaryButtonText}>
            {isSimulating ? 'Viaje en curso' : 'Iniciar viaje real'}
          </Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={stopRealTrip}>
          <Text style={styles.secondaryButtonText}>Detener</Text>
        </Pressable>
      </View>

      <Card>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Avance</Text>
          <Text style={styles.progressText}>{progressPercent}%</Text>
        </View>

        <Text style={styles.bigNumber}>{remainingStops}</Text>
        <Text style={styles.description}>Paradas restantes hasta destino.</Text>

        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>
      </Card>

      <Card>
        <Text style={styles.label}>Parada actual aproximada</Text>
        <Text style={styles.mainText}>{currentStop?.name}</Text>

        <Text style={styles.description}>
          Distancia aproximada al destino:{' '}
          {distanceToDestination !== null ? `${distanceToDestination} m` : '-'}
        </Text>
      </Card>

      <Card>
        <Text style={styles.label}>Estado</Text>
        <Text
          style={[
            styles.status,
            isSimulating && styles.statusActive,
            isAlarmActive && styles.statusAlarm,
          ]}
        >
          {tripStatus}
        </Text>
      </Card>

      <Card>
        <Text style={styles.label}>Recorrido hasta tu destino</Text>

        {visibleStops.map((stop, index) => {
          const isPast = index <= currentStopIndex;
          const isCurrent = index === currentStopIndex;
          const isDestination = index === safeDestinationStopIndex;
          const isAlertStop =
            selectedTrip.alertMode === 'stops' &&
            safeDestinationStopIndex - index === selectedTrip.selectedStopAlert;

          return (
            <View key={`${stop.id}-${index}`} style={styles.stopRow}>
              <Text
                style={[
                  styles.stopDot,
                  isPast && styles.stopDotPast,
                  isCurrent && styles.stopDotCurrent,
                  isAlertStop && styles.stopDotAlert,
                  isDestination && styles.stopDotDestination,
                ]}
              >
                ●
              </Text>

              <View style={styles.stopContent}>
                <Text style={styles.stopName}>
                  {index + 1}. {stop.name}
                </Text>

                <Text style={styles.stopMeta}>
                  {isCurrent ? 'Actual · ' : ''}
                  {isAlertStop ? 'Aviso · ' : ''}
                  {isDestination ? 'Destino' : ''}
                </Text>
              </View>
            </View>
          );
        })}
      </Card>

      <Card>
        <Text style={styles.label}>Nota</Text>
        <Text style={styles.description}>
          Esta pantalla ya usa paradas reales procesadas desde GTFS. El avance
          todavía está simulado por paradas; el próximo paso es conectarlo con
          GPS real.
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
    fontSize: 23,
    fontWeight: '800',
  },
  description: {
    color: '#B8C2CC',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
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
    fontWeight: '900',
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
    fontWeight: '900',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    color: '#5DE2A3',
    fontSize: 14,
    fontWeight: '800',
  },
  bigNumber: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '900',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#263544',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 14,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5DE2A3',
    borderRadius: 999,
  },
  status: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  statusActive: {
    color: '#5DE2A3',
  },
  statusAlarm: {
    color: '#FF6B6B',
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 7,
  },
  stopDot: {
    color: '#425466',
    fontSize: 18,
    marginRight: 10,
    marginTop: 1,
  },
  stopDotPast: {
    color: '#5DE2A3',
  },
  stopDotCurrent: {
    color: '#4D96FF',
  },
  stopDotAlert: {
    color: '#F6C85F',
  },
  stopDotDestination: {
    color: '#FF6B6B',
  },
  stopContent: {
    flex: 1,
  },
  stopName: {
    color: '#DCE6F0',
    fontSize: 15,
    fontWeight: '700',
  },
  stopMeta: {
    color: '#8FA1B3',
    fontSize: 12,
    marginTop: 3,
  },
});