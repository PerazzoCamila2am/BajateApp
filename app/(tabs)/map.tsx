import { useCallback, useMemo, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../components/Card';
import { buenosAiresSampleRoutes } from '../../data/transit/buenosAiresSample';
import {
  loadSelectedTransitTrip,
  SelectedTransitTrip,
} from '../../storage/selectedTransitTrip';
import { calculateDistanceInMeters } from '../../utils/distance';

export default function MapScreen() {
  const mapRef = useRef<MapView | null>(null);

  const [selectedTrip, setSelectedTrip] = useState<SelectedTransitTrip | null>(
    null
  );
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [locationStatus, setLocationStatus] = useState(
    'Buscando tu ubicacion...'
  );
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadMapData() {
        const trip = await loadSelectedTransitTrip();

        if (isActive) {
          setSelectedTrip(trip);
          setIsLoading(false);
        }

        const permission = await Location.requestForegroundPermissionsAsync();

        if (!isActive) {
          return;
        }

        if (permission.status !== 'granted') {
          setLocationStatus('No diste permiso para usar la ubicacion.');
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (isActive) {
          setCurrentLocation(location);
          setLocationStatus('Ubicacion real detectada.');
        }
      }

      loadMapData();

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

  const destinationStopIndex = useMemo(() => {
    if (!selectedDirection || !destinationStop) {
      return -1;
    }

    return selectedDirection.stops.findIndex(
      (stop) => stop.id === destinationStop.id
    );
  }, [selectedDirection, destinationStop]);

  const alertStop = useMemo(() => {
    if (!selectedDirection || !selectedTrip || destinationStopIndex < 0) {
      return null;
    }

    if (selectedTrip.alertMode === 'distance') {
      return destinationStop;
    }

    const alertStopIndex = Math.max(
      destinationStopIndex - selectedTrip.selectedStopAlert,
      0
    );

    return selectedDirection.stops[alertStopIndex] ?? null;
  }, [selectedDirection, selectedTrip, destinationStopIndex, destinationStop]);

  const distanceToAlertStop = useMemo(() => {
    if (!currentLocation || !alertStop) {
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
  }, [currentLocation, alertStop]);

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

  function simulateNearAlertStop() {
    if (!alertStop) {
      return;
    }

    const simulatedLocation: Location.LocationObject = {
      coords: {
        latitude: alertStop.latitude + 0.0003,
        longitude: alertStop.longitude + 0.0003,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    setCurrentLocation(simulatedLocation);
    setLocationStatus('Modo prueba: ubicacion simulada cerca del aviso.');

    mapRef.current?.animateToRegion(
      {
        latitude: simulatedLocation.coords.latitude,
        longitude: simulatedLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      700
    );
  }

  async function useRealCurrentLocation() {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== 'granted') {
      setLocationStatus('No diste permiso para usar la ubicacion.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    setCurrentLocation(location);
    setLocationStatus('Ubicacion real actual detectada.');

    mapRef.current?.animateToRegion(
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      700
    );
  }

  function centerOnCurrentLocation() {
    if (!currentLocation) {
      return;
    }

    mapRef.current?.animateToRegion(
      {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      700
    );
  }

  function centerOnRoute() {
    if (routeCoordinates.length === 0) {
      return;
    }

    mapRef.current?.fitToCoordinates(routeCoordinates, {
      edgePadding: {
        top: 90,
        right: 50,
        bottom: 250,
        left: 50,
      },
      animated: true,
    });
  }

  function centerOnAlertStop() {
    if (!alertStop) {
      return;
    }

    mapRef.current?.animateToRegion(
      {
        latitude: alertStop.latitude,
        longitude: alertStop.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      700
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Mapa</Text>
        <Text style={styles.description}>Cargando viaje seleccionado...</Text>
      </View>
    );
  }

  if (
    !selectedTrip ||
    !selectedRoute ||
    !selectedDirection ||
    !destinationStop ||
    !alertStop
  ) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Mapa</Text>

        <Card>
          <Text style={styles.cardTitle}>Todavia no hay viaje seleccionado</Text>
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
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={mapRegion}>
        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#5DE2A3"
            strokeWidth={5}
          />
        )}

        {selectedDirection.stops.map((stop) => {
          const isDestination = stop.id === destinationStop.id;
          const isAlertStop = stop.id === alertStop.id;

          let pinColor = '#2F80ED';

          if (isDestination) {
            pinColor = '#5DE2A3';
          }

          if (isAlertStop) {
            pinColor = '#FFB020';
          }

          return (
            <Marker
              key={stop.id}
              coordinate={{
                latitude: stop.latitude,
                longitude: stop.longitude,
              }}
              title={stop.name}
              description={
                isDestination
                  ? 'Parada destino'
                  : isAlertStop
                    ? 'Parada de aviso'
                    : 'Parada'
              }
              pinColor={pinColor}
            />
          );
        })}

        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
            title="Tu ubicacion"
            description="Ubicacion actual aproximada"
            pinColor="#FF5C5C"
          />
        )}
      </MapView>

      <View style={styles.topButtons}>
        <Pressable style={styles.mapButton} onPress={centerOnRoute}>
          <Text style={styles.mapButtonText}>Recorrido</Text>
        </Pressable>

        <Pressable style={styles.mapButton} onPress={centerOnAlertStop}>
          <Text style={styles.mapButtonText}>Aviso</Text>
        </Pressable>

        <Pressable style={styles.mapButton} onPress={simulateNearAlertStop}>
          <Text style={styles.mapButtonText}>Prueba</Text>
        </Pressable>

        <Pressable
          style={[styles.mapButton, !currentLocation && styles.disabledButton]}
          onPress={centerOnCurrentLocation}
          disabled={!currentLocation}
        >
          <Text style={styles.mapButtonText}>Yo</Text>
        </Pressable>
      </View>

      <View style={styles.infoPanel}>
        <Text style={styles.smallLabel}>Viaje seleccionado</Text>

        <Text style={styles.routeTitle}>Linea {selectedRoute.shortName}</Text>

        <Text style={styles.infoText}>{selectedDirection.name}</Text>

        <View style={styles.destinationBox}>
          <Text style={styles.destinationLabel}>Destino</Text>
          <Text style={styles.destinationName}>{destinationStop.name}</Text>
        </View>

        <View style={styles.alertBox}>
          <Text style={styles.destinationLabel}>Parada de aviso</Text>
          <Text style={styles.alertName}>{alertStop.name}</Text>

          {selectedTrip.alertMode === 'distance' ? (
            <Text style={styles.infoText}>
              Aviso configurado a {selectedTrip.selectedDistance} m
            </Text>
          ) : (
            <Text style={styles.infoText}>
              Aviso configurado {selectedTrip.selectedStopAlert} paradas antes
            </Text>
          )}
        </View>

        {distanceToAlertStop !== null && (
          <Text style={styles.distanceText}>
            Distancia al aviso: {distanceToAlertStop} m
          </Text>
        )}

        <Text style={styles.locationStatus}>{locationStatus}</Text>

        <Pressable style={styles.realLocationButton} onPress={useRealCurrentLocation}>
          <Text style={styles.realLocationButtonText}>Usar ubicacion real</Text>
        </Pressable>

        <Text style={styles.helperText}>
          Si no estas en Buenos Aires, usa Prueba para simular que estas cerca
          de la parada de aviso.
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
  topButtons: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  mapButton: {
    flex: 1,
    backgroundColor: '#17212B',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#263544',
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  disabledButton: {
    opacity: 0.5,
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
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
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
    fontSize: 16,
    fontWeight: '900',
    marginTop: 3,
  },
  alertBox: {
    backgroundColor: '#2B2719',
    borderRadius: 16,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFB020',
  },
  alertName: {
    color: '#FFB020',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 3,
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 10,
  },
  locationStatus: {
    color: '#FFB020',
    fontSize: 12,
    marginTop: 10,
    fontWeight: '800',
  },
  realLocationButton: {
    backgroundColor: '#223142',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  realLocationButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  helperText: {
    color: '#8FA1B3',
    fontSize: 12,
    marginTop: 8,
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