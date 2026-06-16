import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect, router } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../components/Card';
import { buenosAiresSampleRoutes } from '../../data/transit/buenosAiresSample';
import {
  loadSelectedTransitTrip,
  SelectedTransitTrip,
} from '../../storage/selectedTransitTrip';

export default function MapScreen() {
  const [selectedTrip, setSelectedTrip] = useState<SelectedTransitTrip | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadTrip() {
        const trip = await loadSelectedTransitTrip();

        if (isActive) {
          setSelectedTrip(trip);
          setIsLoading(false);
        }
      }

      loadTrip();

      return () => {
        isActive = false;
      };
    }, [])
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
        (direction) => direction.id === selectedTrip.directionId
      ) ?? null
    );
  }, [selectedRoute, selectedTrip]);

  const destinationStop = useMemo(() => {
    if (!selectedDirection || !selectedTrip) {
      return null;
    }

    return (
      selectedDirection.stops.find(
        (stop) => stop.id === selectedTrip.destinationStopId
      ) ?? null
    );
  }, [selectedDirection, selectedTrip]);

  const routeCoordinates = useMemo(() => {
    if (!selectedDirection) {
      return [];
    }

    if (selectedDirection.shape.length > 0) {
      return selectedDirection.shape.map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
      }));
    }

    return selectedDirection.stops.map((stop) => ({
      latitude: stop.latitude,
      longitude: stop.longitude,
    }));
  }, [selectedDirection]);

  const mapRegion = useMemo(() => {
    return createMapRegion(routeCoordinates);
  }, [routeCoordinates]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Mapa</Text>
        <Text style={styles.description}>Cargando viaje seleccionado...</Text>
      </View>
    );
  }

  if (!selectedTrip || !selectedRoute || !selectedDirection || !destinationStop) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Mapa</Text>

        <Card>
          <Text style={styles.cardTitle}>Todavía no hay viaje seleccionado</Text>
          <Text style={styles.description}>
            Primero elegí una línea, un sentido y una parada destino desde la
            pestaña Lineas.
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
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={mapRegion}>
        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#5DE2A3"
            strokeWidth={5}
          />
        )}

        {selectedDirection.stops.map((stop) => {
          const isDestination = stop.id === destinationStop.id;

          return (
            <Marker
              key={stop.id}
              coordinate={{
                latitude: stop.latitude,
                longitude: stop.longitude,
              }}
              title={stop.name}
              description={isDestination ? 'Parada destino' : 'Parada'}
              pinColor={isDestination ? '#5DE2A3' : '#2F80ED'}
            />
          );
        })}
      </MapView>

      <View style={styles.infoPanel}>
        <Text style={styles.smallLabel}>Viaje seleccionado</Text>

        <Text style={styles.routeTitle}>
          Linea {selectedRoute.shortName}
        </Text>

        <Text style={styles.infoText}>{selectedDirection.name}</Text>

        <View style={styles.destinationBox}>
          <Text style={styles.destinationLabel}>Destino</Text>
          <Text style={styles.destinationName}>{destinationStop.name}</Text>
        </View>

        <Text style={styles.helperText}>
          Este mapa usa el recorrido y las paradas reales procesadas desde GTFS.
        </Text>
      </View>
    </View>
  );
}

function createMapRegion(
  coordinates: {
    latitude: number;
    longitude: number;
  }[]
) {
  if (coordinates.length === 0) {
    return {
      latitude: -34.6037,
      longitude: -58.3816,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    };
  }

  const latitudes = coordinates.map((coordinate) => coordinate.latitude);
  const longitudes = coordinates.map((coordinate) => coordinate.longitude);

  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);

  const latitude = (minLatitude + maxLatitude) / 2;
  const longitude = (minLongitude + maxLongitude) / 2;

  const latitudeDelta = Math.max((maxLatitude - minLatitude) * 1.4, 0.01);
  const longitudeDelta = Math.max((maxLongitude - minLongitude) * 1.4, 0.01);

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101820',
  },
  map: {
    flex: 1,
  },
  infoPanel: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    backgroundColor: '#17212B',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#263544',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#101820',
    padding: 20,
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  description: {
    color: '#B9C6D3',
    fontSize: 15,
    lineHeight: 22,
  },
  smallLabel: {
    color: '#8FA1B3',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  routeTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
  },
  infoText: {
    color: '#B9C6D3',
    fontSize: 14,
    marginTop: 4,
  },
  destinationBox: {
    backgroundColor: '#223142',
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },
  destinationLabel: {
    color: '#8FA1B3',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  destinationName: {
    color: '#5DE2A3',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 3,
  },
  helperText: {
    color: '#8FA1B3',
    fontSize: 12,
    marginTop: 10,
    lineHeight: 17,
  },
  primaryButton: {
    backgroundColor: '#5DE2A3',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 18,
  },
  primaryButtonText: {
    color: '#101820',
    fontSize: 15,
    fontWeight: '900',
  },
});