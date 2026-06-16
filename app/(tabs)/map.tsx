import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { Card } from '../../components/Card';
import { demoStops } from '../../data/demoStops';
import { loadTripPreferences } from '../../storage/tripPreferences';
import { TripPreferences } from '../../types/trip';

const defaultPreferences: TripPreferences = {
  alertMode: 'distance',
  selectedDestinationId: 5,
  selectedDistance: 300,
  selectedStopAlert: 1,
};

export default function MapScreen() {
  const [preferences, setPreferences] =
    useState<TripPreferences>(defaultPreferences);

  const selectedDestinationIndex = demoStops.findIndex(
    (stop) => stop.id === preferences.selectedDestinationId
  );

  const safeDestinationIndex =
    selectedDestinationIndex >= 0 ? selectedDestinationIndex : 4;

  const selectedDestination = demoStops[safeDestinationIndex];

  const alertStopIndex = Math.max(
    safeDestinationIndex - preferences.selectedStopAlert,
    0
  );

  const alertStop = demoStops[alertStopIndex];

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
        }
      }

      loadSavedPreferences();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.appName}>BajateApp</Text>
        <Text style={styles.title}>Mapa demo</Text>
        <Text style={styles.subtitle}>
          Visualizá el recorrido, las paradas, el destino y el punto de aviso.
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
                })}
                pinColor={getMarkerColor({
                  isDestination,
                  isAlertStop,
                })}
              />
            );
          })}
        </MapView>
      </View>

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
          const isDestination = stop.id === selectedDestination.id;
          const isAlertStop =
            preferences.alertMode === 'stops' && index === alertStopIndex;

          return (
            <View key={stop.id} style={styles.stopRow}>
              <Text
                style={[
                  styles.stopDot,
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

function getMarkerDescription({
  isDestination,
  isAlertStop,
}: {
  isDestination: boolean;
  isAlertStop: boolean;
}) {
  if (isDestination) {
    return 'Destino seleccionado';
  }

  if (isAlertStop) {
    return 'Parada de aviso';
  }

  return 'Parada demo';
}

function getMarkerColor({
  isDestination,
  isAlertStop,
}: {
  isDestination: boolean;
  isAlertStop: boolean;
}) {
  if (isDestination) {
    return '#FF6B6B';
  }

  if (isAlertStop) {
    return '#F6C85F';
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
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  stopDot: {
    color: '#5DE2A3',
    fontSize: 18,
    marginRight: 10,
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