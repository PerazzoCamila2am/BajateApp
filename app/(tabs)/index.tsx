import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';

import { Card } from '../../components/Card';
import { loadBuenosAiresRouteDetails } from '../../data/transit/loadBuenosAiresRouteDetails';
import {
  defaultAlarmSettings,
  loadAlarmSettings,
} from '../../storage/alarmSettings';
import {
  loadSelectedTransitTrip,
  SelectedTransitTrip,
} from '../../storage/selectedTransitTrip';
import { AlarmSettings } from '../../types/trip';
import { TransitRoute } from '../../types/transit';
import { calculateDistanceInMeters } from '../../utils/distance';
import {
  getStopsWindow,
  getTransitTripDetails,
} from '../../utils/transitTripDetails';

type TripStatus =
  | 'Sin viaje activo'
  | 'Seguimiento activo'
  | 'Buscando ubicacion'
  | 'Cerca del aviso'
  | 'Alarma activada'
  | 'Viaje detenido';

export default function HomeScreen() {
  const alarmPlayer = useAudioPlayer(require('../../assets/sounds/alarm.mp3'));

  const locationSubscriptionRef =
    useRef<Location.LocationSubscription | null>(null);

  const [selectedTrip, setSelectedTrip] = useState<SelectedTransitTrip | null>(
    null
  );
  const [selectedRoute, setSelectedRoute] = useState<TransitRoute | null>(null);
  const [alarmSettings, setAlarmSettings] =
    useState<AlarmSettings>(defaultAlarmSettings);
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [tripStatus, setTripStatus] =
    useState<TripStatus>('Sin viaje activo');
  const [locationStatus, setLocationStatus] = useState(
    'Todavia no se inicio el seguimiento.'
  );
  const [distanceToTarget, setDistanceToTarget] = useState<number | null>(null);
  const [isTripActive, setIsTripActive] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadScreenData() {
        setIsLoading(true);

        const [trip, settings] = await Promise.all([
          loadSelectedTransitTrip(),
          loadAlarmSettings(),
        ]);

        if (!isActive) {
          return;
        }

        setSelectedTrip(trip);
        setAlarmSettings(settings);

        if (!trip) {
          setSelectedRoute(null);
          setIsLoading(false);
          return;
        }

        const routeDetails = await loadBuenosAiresRouteDetails(trip.routeId);

        if (isActive) {
          setSelectedRoute(routeDetails);
          setIsLoading(false);
        }
      }

      loadScreenData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const tripDetails = useMemo(() => {
    return getTransitTripDetails(selectedTrip, selectedRoute);
  }, [selectedTrip, selectedRoute]);

  const targetStop = tripDetails?.alertStop ?? null;
  const alertDistanceInMeters = tripDetails?.alertDistanceInMeters ?? 300;

  const stopsUntilDestination = useMemo(() => {
    if (!tripDetails) {
      return [];
    }

    return getStopsWindow(
      tripDetails.selectedDirection,
      tripDetails.alertStopIndex,
      tripDetails.destinationStopIndex
    );
  }, [tripDetails]);

  const resetAlarm = useCallback(() => {
    setIsAlarmActive(false);
    Vibration.cancel();

    try {
      alarmPlayer.pause();
      alarmPlayer.seekTo(0);
    } catch {
      // Si el sonido no estaba activo, no hacemos nada.
    }
  }, [alarmPlayer]);

  const activateAlarm = useCallback(() => {
    if (isAlarmActive) {
      return;
    }

    setIsAlarmActive(true);
    setTripStatus('Alarma activada');

    if (alarmSettings.isSoundEnabled) {
      try {
        alarmPlayer.seekTo(0);
        alarmPlayer.play();
      } catch {
        // Si el sonido falla, la app sigue funcionando con vibracion.
      }
    }

    if (alarmSettings.isVibrationEnabled) {
      Vibration.vibrate([700, 400, 700, 400], true);
    }
  }, [alarmPlayer, alarmSettings, isAlarmActive]);

  function silenceAlarm() {
    resetAlarm();

    if (isTripActive) {
      setTripStatus('Seguimiento activo');
    }
  }

  const stopTrip = useCallback(() => {
    locationSubscriptionRef.current?.remove();
    locationSubscriptionRef.current = null;

    setIsTripActive(false);
    setTripStatus('Viaje detenido');
    setLocationStatus('Seguimiento detenido.');
    setDistanceToTarget(null);
    resetAlarm();
  }, [resetAlarm]);

  useEffect(() => {
    return () => {
      locationSubscriptionRef.current?.remove();
      Vibration.cancel();

      try {
        alarmPlayer.pause();
      } catch {
        // Limpieza segura.
      }
    };
  }, [alarmPlayer]);

  useEffect(() => {
    if (!isTripActive || !currentLocation || !targetStop || isAlarmActive) {
      return;
    }

    const distance = calculateDistanceInMeters(
      {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      },
      {
        latitude: targetStop.latitude,
        longitude: targetStop.longitude,
      }
    );

    setDistanceToTarget(distance);

    if (distance <= alertDistanceInMeters) {
      setTripStatus('Cerca del aviso');
      activateAlarm();
      return;
    }

    setTripStatus('Seguimiento activo');
    setLocationStatus('GPS activo. Todavia no estas cerca del aviso.');
  }, [
    alertDistanceInMeters,
    activateAlarm,
    currentLocation,
    isAlarmActive,
    isTripActive,
    targetStop,
  ]);

  async function startTripWithGps() {
    if (!selectedTrip || !tripDetails || !targetStop) {
      return;
    }

    resetAlarm();

    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== 'granted') {
      setLocationStatus('No diste permiso para usar la ubicacion.');
      setTripStatus('Sin viaje activo');
      return;
    }

    setIsTripActive(true);
    setTripStatus('Buscando ubicacion');
    setLocationStatus('GPS iniciado. Buscando tu ubicacion...');

    const firstLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    setCurrentLocation(firstLocation);

    locationSubscriptionRef.current?.remove();

    locationSubscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 15,
        timeInterval: 5000,
      },
      (location) => {
        setCurrentLocation(location);
      }
    );
  }

  function simulateFarFromTarget() {
    if (!targetStop) {
      return;
    }

    locationSubscriptionRef.current?.remove();
    locationSubscriptionRef.current = null;

    const simulatedLocation = createSimulatedLocation(
      targetStop.latitude + 0.02,
      targetStop.longitude + 0.02
    );

    resetAlarm();
    setIsTripActive(true);
    setCurrentLocation(simulatedLocation);
    setTripStatus('Seguimiento activo');
    setLocationStatus('Modo prueba: estas lejos del aviso.');
  }

  function simulateNearTarget() {
    if (!targetStop) {
      return;
    }

    locationSubscriptionRef.current?.remove();
    locationSubscriptionRef.current = null;

    const simulatedLocation = createSimulatedLocation(
      targetStop.latitude + 0.0003,
      targetStop.longitude + 0.0003
    );

    resetAlarm();
    setIsTripActive(true);
    setCurrentLocation(simulatedLocation);
    setLocationStatus('Modo prueba: estas cerca del aviso.');
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>BajateApp</Text>
        <Text style={styles.description}>Cargando viaje...</Text>
      </View>
    );
  }

  if (!selectedTrip || !tripDetails) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>BajateApp</Text>

        <Card>
          <Text style={styles.cardTitle}>No hay viaje seleccionado</Text>
          <Text style={styles.description}>
            Primero elegi una linea, un sentido y una parada destino desde la
            pestana Lineas.
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push('/routes')}
          >
            <Text style={styles.primaryButtonText}>Elegir linea</Text>
          </Pressable>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.appName}>BajateApp</Text>
      <Text style={styles.subtitle}>
        Seguimiento del viaje seleccionado con GPS y modo prueba.
      </Text>

      <Card>
        <Text style={styles.sectionLabel}>Viaje seleccionado</Text>
        <Text style={styles.routeTitle}>
          Linea {tripDetails.selectedRoute.shortName}
        </Text>
        <Text style={styles.description}>
          {tripDetails.selectedDirection.name}
        </Text>

        <View style={styles.destinationBox}>
          <Text style={styles.smallLabel}>Destino</Text>
          <Text style={styles.destinationName}>
            {tripDetails.destinationStop.name}
          </Text>
        </View>

        <View style={styles.targetBox}>
          <Text style={styles.smallLabel}>Parada de aviso</Text>
          <Text style={styles.targetName}>{tripDetails.alertStop.name}</Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionLabel}>Alerta configurada</Text>

        {selectedTrip.alertMode === 'distance' ? (
          <Text style={styles.bigText}>
            Avisar a {selectedTrip.selectedDistance} metros del destino
          </Text>
        ) : (
          <Text style={styles.bigText}>
            Avisar {selectedTrip.selectedStopAlert} paradas antes
          </Text>
        )}

        <Text style={styles.description}>
          {'Para probar sin estar en Buenos Aires, usa el boton "Prueba cerca".'}
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionLabel}>Estado</Text>
        <Text style={[styles.statusText, isAlarmActive && styles.alarmText]}>
          {tripStatus}
        </Text>

        <Text style={styles.description}>{locationStatus}</Text>

        {distanceToTarget !== null && (
          <View style={styles.distanceBox}>
            <Text style={styles.smallLabel}>Distancia al aviso</Text>
            <Text style={styles.distanceText}>{distanceToTarget} m</Text>
          </View>
        )}
      </Card>

      <View style={styles.actions}>
        <Pressable
          style={[styles.primaryButton, isTripActive && styles.disabledButton]}
          onPress={startTripWithGps}
          disabled={isTripActive}
        >
          <Text style={styles.primaryButtonText}>Iniciar GPS real</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={simulateFarFromTarget}
        >
          <Text style={styles.secondaryButtonText}>Prueba lejos</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={simulateNearTarget}
        >
          <Text style={styles.secondaryButtonText}>Prueba cerca</Text>
        </Pressable>

        <Pressable style={styles.stopButton} onPress={stopTrip}>
          <Text style={styles.stopButtonText}>Detener viaje</Text>
        </Pressable>

        {isAlarmActive && (
          <Pressable style={styles.alarmButton} onPress={silenceAlarm}>
            <Text style={styles.alarmButtonText}>Silenciar alarma</Text>
          </Pressable>
        )}
      </View>

      <Card>
        <Text style={styles.sectionLabel}>Proximas paradas</Text>

        {stopsUntilDestination.map((stop) => {
          const isTarget = tripDetails.alertStop.id === stop.id;
          const isDestination = tripDetails.destinationStop.id === stop.id;

          return (
            <View
              key={stop.id}
              style={[
                styles.stopItem,
                isTarget && styles.targetStopItem,
                isDestination && styles.destinationStopItem,
              ]}
            >
              <Text style={styles.stopName}>{stop.name}</Text>

              {isTarget && <Text style={styles.stopBadge}>Aviso</Text>}
              {isDestination && <Text style={styles.stopBadge}>Destino</Text>}
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );
}

function createSimulatedLocation(
  latitude: number,
  longitude: number
): Location.LocationObject {
  return {
    coords: {
      latitude,
      longitude,
      altitude: null,
      accuracy: 10,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  };
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
  centerContainer: {
    flex: 1,
    backgroundColor: '#101820',
    padding: 20,
    justifyContent: 'center',
    gap: 16,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
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
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 8,
  },
  sectionLabel: {
    color: '#8FA1B3',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  smallLabel: {
    color: '#8FA1B3',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  routeTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
  },
  description: {
    color: '#B9C6D3',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
  },
  destinationBox: {
    backgroundColor: '#223142',
    borderRadius: 16,
    padding: 12,
    marginTop: 14,
  },
  destinationName: {
    color: '#5DE2A3',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  targetBox: {
    backgroundColor: '#1C2A38',
    borderRadius: 16,
    padding: 12,
    marginTop: 10,
  },
  targetName: {
    color: '#FFB020',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 4,
  },
  bigText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 26,
  },
  statusText: {
    color: '#5DE2A3',
    fontSize: 24,
    fontWeight: '900',
  },
  alarmText: {
    color: '#FF5C5C',
  },
  distanceBox: {
    backgroundColor: '#223142',
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 4,
  },
  actions: {
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#5DE2A3',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
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
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  stopButton: {
    backgroundColor: '#331D24',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#66313E',
  },
  stopButtonText: {
    color: '#FF8FA3',
    fontSize: 15,
    fontWeight: '900',
  },
  alarmButton: {
    backgroundColor: '#FF5C5C',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
  },
  alarmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  disabledButton: {
    opacity: 0.5,
  },
  stopItem: {
    backgroundColor: '#223142',
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#263544',
  },
  targetStopItem: {
    borderColor: '#FFB020',
  },
  destinationStopItem: {
    borderColor: '#5DE2A3',
  },
  stopName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  stopBadge: {
    color: '#8FA1B3',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
    textTransform: 'uppercase',
  },
});