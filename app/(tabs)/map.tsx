import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { Card } from '../../components/Card';
import { demoStops, simulationStep } from '../../data/demoStops';
import { loadTripPreferences } from '../../storage/tripPreferences';
import { TripPreferences } from '../../types/trip';

const defaultPreferences: TripPreferences = {
  alertMode: 'distance',
  selectedDestinationId: 5,
  selectedDistance: 300,
  selectedStopAlert: 1,
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

export default function MapScreen() {
  const [preferences, setPreferences] =
    useState<TripPreferences>(defaultPreferences);
  const [currentDistanceFromStart, setCurrentDistanceFromStart] = useState(0);
  const [isMapSimulating, setIsMapSimulating] = useState(false);

  const selectedDestinationIndex = useMemo(() => {
    const foundIndex = demoStops.findIndex(
      (stop) => stop.id === preferences.selectedDestinationId
    );

    return foundIndex >= 0 ? foundIndex : 4;
  }, [preferences.selectedDestinationId]);

  const selectedDestination = demoStops[selectedDestinationIndex];
  const destinationDistance = selectedDestination.distanceFromStart;

  const alertStopIndex = Math.max(
    selectedDestinationIndex - preferences.selectedStopAlert,
    0
  );

  const alertStop = demoStops[alertStopIndex];

  const currentStopIndex = useMemo(() => {
    let closestIndex = 0;

    demoStops.forEach((stop, index) => {
      if (currentDistanceFromStart >= stop.distanceFromStart) {
        closestIndex = index;
      }
    });

    return closestIndex;
  }, [currentDistanceFromStart]);

  const currentStop = demoStops[currentStopIndex];

  const currentMapPosition = useMemo(() => {
    return getPositionOnRoute(currentDistanceFromStart);
  }, [currentDistanceFromStart]);

  const progress = Math.min(
    Math.max(currentDistanceFromStart / destinationDistance, 0),
    1
  );

  const progressPercent = Math.round(progress * 100);

  const routeCoordinates = demoStops.map((stop) => ({
    latitude: stop.latitude,
    longitude: stop.longitude,
  }));

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadSavedPreferences() {
        const savedPreferences = await loadTripPreferences();

        if (isActive && savedPreferences) {
          setPreferences(savedPreferences);
          setCurrentDistanceFromStart(0);
          setIsMapSimulating(false);
        }
      }

      loadSavedPreferences();

      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    if (!isMapSimulating) {
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentDistanceFromStart((currentDistance) => {
        const nextDistance = Math.min(
          currentDistance + simulationStep,
          destinationDistance
        );

        if (nextDistance >= destinationDistance) {
          setIsMapSimulating(false);
        }

        return nextDistance;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [destinationDistance, isMapSimulating]);

  function startMapSimulation() {
    setCurrentDistanceFromStart(0);
    setIsMapSimulating(true);
  }

  function stopMapSimulation() {
    setCurrentDistanceFromStart(0);
    setIsMapSimulating(false);
  }

  function getMapStatus() {
    if (currentDistanceFromStart >= destinationDistance) {
      return 'Destino alcanzado';
    }

    if (isMapSimulating) {
      return 'Simulando recorrido en mapa';
    }

    return 'Simulación detenida';
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.appName}>BajateApp</Text>
        <Text style={styles.title}>Mapa demo</Text>
        <Text style={styles.subtitle}>
          Visualizá el recorrido, las paradas, el destino y el avance simulado.
        </Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -32.9468,
            longitude: -60.6464,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
          }}
        >
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#5DE2A3"
            strokeWidth={5}
          />

          {demoStops.map((stop, index) => {
            const isDestination = stop.id === selectedDestination.id;
            const isAlertStop =
              preferences.alertMode === 'stops' && index === alertStopIndex;
            const isCurrentStop = index === currentStopIndex;

            return (
              <Marker
                key={stop.id}
                coordinate={{
                  latitude: stop.latitude,
                  longitude: stop.longitude,
                }}
                title={stop.name}
                description={getMarkerDescription({
                  isDestination,
                  isAlertStop,
                  isCurrentStop,
                })}
                pinColor={getMarkerColor({
                  isDestination,
                  isAlertStop,
                  isCurrentStop,
                })}
              />
            );
          })}

          <Marker
            coordinate={currentMapPosition}
            title="Ubicación simulada"
            description="Colectivo demo"
          >
            <View style={styles.busMarker}>
              <Text style={styles.busMarkerText}>🚌</Text>
            </View>
          </Marker>
        </MapView>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.primaryButton, isMapSimulating && styles.disabledButton]}
          onPress={startMapSimulation}
          disabled={isMapSimulating}
        >
          <Text style={styles.primaryButtonText}>
            {isMapSimulating
              ? 'Simulación en curso'
              : 'Iniciar simulación en mapa'}
          </Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={stopMapSimulation}>
          <Text style={styles.secondaryButtonText}>Detener</Text>
        </Pressable>
      </View>

      <Card>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Avance visual</Text>
          <Text style={styles.progressText}>{progressPercent}%</Text>
        </View>

        <Text style={styles.bigNumber}>{currentDistanceFromStart} m</Text>
        <Text style={styles.description}>Recorridos desde el inicio.</Text>

        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>
      </Card>

      <Card>
        <Text style={styles.label}>Estado</Text>
        <Text
          style={[
            styles.status,
            isMapSimulating && styles.statusActive,
            currentDistanceFromStart >= destinationDistance &&
              styles.statusFinished,
          ]}
        >
          {getMapStatus()}
        </Text>

        <Text style={styles.description}>
          Parada actual aproximada: {currentStop.name}
        </Text>
      </Card>

      <Card>
        <Text style={styles.label}>Destino seleccionado</Text>
        <Text style={styles.mainText}>{selectedDestination.name}</Text>
        <Text style={styles.description}>
          Este destino se toma desde la última configuración guardada en la
          pantalla Viaje.
        </Text>
      </Card>

      <Card>
        <Text style={styles.label}>Tipo de aviso</Text>

        {preferences.alertMode === 'distance' ? (
          <>
            <Text style={styles.mainText}>Por distancia</Text>
            <Text style={styles.description}>
              La alarma está configurada para avisar cuando falten{' '}
              {preferences.selectedDistance} m.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.mainText}>Por paradas</Text>
            <Text style={styles.description}>
              La alarma está configurada para sonar en {alertStop.name},{' '}
              {preferences.selectedStopAlert} parada(s) antes del destino.
            </Text>
          </>
        )}
      </Card>

      <Card>
        <Text style={styles.label}>Recorrido demo</Text>

        {demoStops.map((stop, index) => {
          const isPast = index <= currentStopIndex;
          const isDestination = stop.id === selectedDestination.id;
          const isAlertStop =
            preferences.alertMode === 'stops' && index === alertStopIndex;

          return (
            <View key={stop.id} style={styles.stopRow}>
              <Text
                style={[
                  styles.stopDot,
                  isPast && styles.stopDotPast,
                  isAlertStop && styles.stopDotAlert,
                  isDestination && styles.stopDotDestination,
                ]}
              >
                ●
              </Text>

              <Text style={styles.stopText}>
                {stop.name}
                {isAlertStop ? ' · aviso' : ''}
                {isDestination ? ' · destino' : ''}
              </Text>
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );
}

function getPositionOnRoute(distanceFromStart: number): Coordinate {
  const firstStop = demoStops[0];

  if (distanceFromStart <= firstStop.distanceFromStart) {
    return {
      latitude: firstStop.latitude,
      longitude: firstStop.longitude,
    };
  }

  for (let index = 0; index < demoStops.length - 1; index++) {
    const currentStop = demoStops[index];
    const nextStop = demoStops[index + 1];

    const isBetweenStops =
      distanceFromStart >= currentStop.distanceFromStart &&
      distanceFromStart <= nextStop.distanceFromStart;

    if (isBetweenStops) {
      const segmentDistance =
        nextStop.distanceFromStart - currentStop.distanceFromStart;

      const distanceIntoSegment =
        distanceFromStart - currentStop.distanceFromStart;

      const segmentProgress = distanceIntoSegment / segmentDistance;

      return {
        latitude:
          currentStop.latitude +
          (nextStop.latitude - currentStop.latitude) * segmentProgress,
        longitude:
          currentStop.longitude +
          (nextStop.longitude - currentStop.longitude) * segmentProgress,
      };
    }
  }

  const lastStop = demoStops[demoStops.length - 1];

  return {
    latitude: lastStop.latitude,
    longitude: lastStop.longitude,
  };
}

function getMarkerDescription({
  isDestination,
  isAlertStop,
  isCurrentStop,
}: {
  isDestination: boolean;
  isAlertStop: boolean;
  isCurrentStop: boolean;
}) {
  if (isDestination) {
    return 'Destino seleccionado';
  }

  if (isAlertStop) {
    return 'Parada de aviso';
  }

  if (isCurrentStop) {
    return 'Parada actual aproximada';
  }

  return 'Parada demo';
}

function getMarkerColor({
  isDestination,
  isAlertStop,
  isCurrentStop,
}: {
  isDestination: boolean;
  isAlertStop: boolean;
  isCurrentStop: boolean;
}) {
  if (isDestination) {
    return '#FF6B6B';
  }

  if (isAlertStop) {
    return '#F6C85F';
  }

  if (isCurrentStop) {
    return '#4D96FF';
  }

  return '#5DE2A3';
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
  mapContainer: {
    height: 420,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#263544',
  },
  map: {
    flex: 1,
  },
  busMarker: {
    backgroundColor: '#101820',
    borderWidth: 2,
    borderColor: '#5DE2A3',
    borderRadius: 999,
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  busMarkerText: {
    fontSize: 22,
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
    textAlign: 'center',
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
    textAlign: 'center',
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
  description: {
    color: '#B8C2CC',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
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
    fontSize: 34,
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
    fontWeight: '800',
  },
  statusActive: {
    color: '#5DE2A3',
  },
  statusFinished: {
    color: '#FF6B6B',
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  stopDot: {
    color: '#425466',
    fontSize: 18,
    marginRight: 10,
  },
  stopDotPast: {
    color: '#5DE2A3',
  },
  stopDotAlert: {
    color: '#F6C85F',
  },
  stopDotDestination: {
    color: '#FF6B6B',
  },
  stopText: {
    color: '#DCE6F0',
    fontSize: 15,
  },
});