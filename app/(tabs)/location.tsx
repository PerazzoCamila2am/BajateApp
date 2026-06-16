import { useState } from 'react';
import * as Location from 'expo-location';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../components/Card';

export default function LocationScreen() {
  const [permissionStatus, setPermissionStatus] = useState('Sin pedir permiso');
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
          Probá si la app puede acceder a tu ubicación actual.
        </Text>
      </View>

      <Card>
        <Text style={styles.label}>Estado del permiso</Text>
        <Text style={styles.status}>{permissionStatus}</Text>

        <Text style={styles.description}>
          Esta prueba usa ubicación en primer plano. Es decir, funciona mientras
          la app está abierta.
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

            <Text style={styles.description}>
              Más adelante esta ubicación se va a usar para calcular distancia
              real hasta una parada o destino.
            </Text>
          </>
        ) : (
          <Text style={styles.emptyText}>
            Todavía no se obtuvo ninguna ubicación.
          </Text>
        )}
      </Card>

      <Card>
        <Text style={styles.label}>Próximo paso</Text>
        <Text style={styles.description}>
          Cuando esto funcione, podemos conectar el GPS con el viaje demo para
          comparar ubicación actual contra una parada destino.
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
});