import { useCallback, useMemo, useState } from 'react';
import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../components/Card';
import { demoStops } from '../../data/demoStops';
import { loadTripPreferences } from '../../storage/tripPreferences';
import { TripPreferences } from '../../types/trip';
import { calculateDistanceInMeters } from '../../utils/distance';

const defaultPreferences: TripPreferences = {
  alertMode: 'distance',
  selectedDestinationId: 5,
  selectedDistance: 300,
  selectedStopAlert: 1,
};

export default function LocationScreen() {
  const [preferences, setPreferences] =
    useState<TripPreferences>(defaultPreferences);
  const [permissionStatus, setPermissionStatus] = useState('Sin pedir permiso');
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedDestinationIndex = useMemo(() => {
    const foundIndex = demoStops.findIndex(
      (stop) => stop.id === preferences.selectedDestinationId
    );

    return foundIndex >= 0 ? foundIndex : 4;
  }, [preferences.selectedDestinationId]);

  const selectedDestination = demoStops[selectedDestinationIndex];

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
  }, [currentLocation, selectedDestination.latitude, selectedDestination.longitude]);

  const isInsideDistanceAlert =
    preferences.alertMode === 'distance' &&
    distanceToDestination !== null &&
    distanceToDestination <= preferences.selectedDistance;

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

  async function getCurrentLocation() {
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

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.appName}>BajateApp</Text>
        <Text style={styles.title}>GPS real</Text>
        <Text style={styles.subtitle}>
          Probá la ubicación real y calculá la distancia hasta el destino demo.
        </Text>
      </View>

      <Card>
        <Text style={styles.label}>Destino elegido</Text>
        <Text style={styles.mainText}>{selectedDestination.name}</Text>

        <Text style={styles.description}>
          Este destino se toma desde la última configuración guardada en la
          pantalla Viaje.
        </Text>
      </Card>

      <Card>
        <Text style={styles.label}>Estado del permiso</Text>
        <Text style={styles.status}>{permissionStatus}</Text>

        <Text style={styles.description}>
          Esta prueba usa ubicación en primer plano. Funciona mientras la app
          está abierta.
        </Text>
      </Card>

      <Pressable
        style={[styles.primaryButton, isLoading && styles.disabledButton]}
        onPress={getCurrentLocation}
        disabled={isLoading}
      >
        <Text style={styles.primaryButtonText}>
          {isLoading ? 'Buscando ubicación...' : 'Usar mi ubicación actual'}
        </Text>
      </Pressable>

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
        <Text style={styles.label}>Distancia hasta destino demo</Text>

        {distanceToDestination !== null ? (
          <>
            <Text style={styles.bigNumber}>{distanceToDestination} m</Text>

            <Text style={styles.description}>
              Distancia calculada desde tu ubicación actual hasta{' '}
              {selectedDestination.name}.
            </Text>

            {preferences.alertMode === 'distance' ? (
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
            ) : (
              <Text style={styles.description}>
                Tenés configurado aviso por paradas. Más adelante vamos a
                conectar el GPS con la parada de aviso.
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.emptyText}>
            Tocá “Usar mi ubicación actual” para calcular la distancia.
          </Text>
        )}
      </Card>

      <Card>
        <Text style={styles.label}>Próximo paso</Text>
        <Text style={styles.description}>
          Después podemos hacer que el GPS real active la alarma cuando estés
          dentro del rango configurado.
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
  mainText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  status: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  description: {
    color: '#B8C2CC',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
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