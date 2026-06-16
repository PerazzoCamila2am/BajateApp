import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../components/Card';
import { OptionButton } from '../../components/OptionButton';
import { alertDistances, stopAlerts } from '../../data/alertOptions';
import { buenosAiresSampleRoutes } from '../../data/transit/buenosAiresSample';
import { saveSelectedTransitTrip } from '../../storage/selectedTransitTrip';
import { AlertMode } from '../../types/trip';

export default function RoutesScreen() {
  const [selectedRouteId, setSelectedRouteId] = useState(
    buenosAiresSampleRoutes[0]?.id ?? ''
  );
  const [selectedDirectionId, setSelectedDirectionId] = useState(
    buenosAiresSampleRoutes[0]?.directions[0]?.id ?? ''
  );
  const [selectedDestinationStopId, setSelectedDestinationStopId] = useState('');
  const [alertMode, setAlertMode] = useState<AlertMode>('distance');
  const [selectedDistance, setSelectedDistance] = useState(300);
  const [selectedStopAlert, setSelectedStopAlert] = useState(1);
  const [savedMessage, setSavedMessage] = useState('');

  const selectedRoute = useMemo(() => {
    return (
      buenosAiresSampleRoutes.find((route) => route.id === selectedRouteId) ??
      buenosAiresSampleRoutes[0]
    );
  }, [selectedRouteId]);

  const selectedDirection = useMemo(() => {
    return (
      selectedRoute?.directions.find(
        (direction) => direction.id === selectedDirectionId
      ) ?? selectedRoute?.directions[0]
    );
  }, [selectedDirectionId, selectedRoute]);

  const selectedDestinationStop = useMemo(() => {
    return selectedDirection?.stops.find(
      (stop) => stop.id === selectedDestinationStopId
    );
  }, [selectedDestinationStopId, selectedDirection]);

  const visibleStops = selectedDirection?.stops ?? [];

  function selectRoute(routeId: string) {
    const route = buenosAiresSampleRoutes.find((item) => item.id === routeId);

    if (!route) {
      return;
    }

    const firstDirection = route.directions[0];

    setSelectedRouteId(route.id);
    setSelectedDirectionId(firstDirection?.id ?? '');
    setSelectedDestinationStopId('');
    setSavedMessage('');
  }

  function selectDirection(directionId: string) {
    setSelectedDirectionId(directionId);
    setSelectedDestinationStopId('');
    setSavedMessage('');
  }

  async function saveTrip() {
    if (!selectedRoute || !selectedDirection || !selectedDestinationStop) {
      setSavedMessage('Elegí una línea, un sentido y una parada destino.');
      return;
    }

    await saveSelectedTransitTrip({
      routeId: selectedRoute.id,
      routeName: getRouteName(selectedRoute.shortName, selectedRoute.longName),
      directionId: selectedDirection.id,
      directionName: selectedDirection.name,
      tripId: selectedDirection.tripId,
      destinationStopId: selectedDestinationStop.id,
      destinationStopName: selectedDestinationStop.name,
      alertMode,
      selectedDistance,
      selectedStopAlert,
    });

    setSavedMessage('Viaje real guardado correctamente.');
  }

  if (buenosAiresSampleRoutes.length === 0) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.appName}>BajateApp</Text>
          <Text style={styles.title}>Líneas reales</Text>
          <Text style={styles.subtitle}>
            Todavía no hay datos GTFS procesados.
          </Text>
        </View>

        <Card>
          <Text style={styles.label}>Falta procesar GTFS</Text>
          <Text style={styles.description}>
            Corré npm run process-gtfs para generar las líneas reales.
          </Text>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.appName}>BajateApp</Text>
        <Text style={styles.title}>Líneas reales</Text>
        <Text style={styles.subtitle}>
          Elegí una línea de Buenos Aires, un sentido y tu parada destino.
        </Text>
      </View>

      <Card>
        <Text style={styles.label}>Línea</Text>

        <View style={styles.routesGrid}>
          {buenosAiresSampleRoutes.map((route) => {
            const isSelected = selectedRouteId === route.id;

            return (
              <Pressable
                key={route.id}
                style={[
                  styles.routeButton,
                  isSelected && styles.routeButtonSelected,
                ]}
                onPress={() => selectRoute(route.id)}
              >
                <Text
                  style={[
                    styles.routeButtonText,
                    isSelected && styles.routeButtonTextSelected,
                  ]}
                >
                  {route.shortName}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {selectedRoute && (
          <Text style={styles.selectedText}>
            {getRouteName(selectedRoute.shortName, selectedRoute.longName)}
          </Text>
        )}
      </Card>

      {selectedRoute && (
        <Card>
          <Text style={styles.label}>Sentido / recorrido</Text>

          <View style={styles.optionsColumn}>
            {selectedRoute.directions.map((direction) => {
              const isSelected = selectedDirectionId === direction.id;

              return (
                <Pressable
                  key={`${direction.id}-${direction.tripId}`}
                  style={[
                    styles.directionButton,
                    isSelected && styles.directionButtonSelected,
                  ]}
                  onPress={() => selectDirection(direction.id)}
                >
                  <Text
                    style={[
                      styles.directionTitle,
                      isSelected && styles.directionTitleSelected,
                    ]}
                  >
                    {direction.name}
                  </Text>

                  <Text
                    style={[
                      styles.directionSubtitle,
                      isSelected && styles.directionSubtitleSelected,
                    ]}
                  >
                    {direction.stops.length} paradas
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      )}

      {selectedDirection && (
        <Card>
          <Text style={styles.label}>Parada destino</Text>
          <Text style={styles.description}>
            Seleccioná dónde querés que termine tu viaje.
          </Text>

          <View style={styles.stopsList}>
            {visibleStops.map((stop, index) => {
              const isSelected = selectedDestinationStopId === stop.id;

              return (
                <Pressable
                  key={`${stop.id}-${index}`}
                  style={[
                    styles.stopButton,
                    isSelected && styles.stopButtonSelected,
                  ]}
                  onPress={() => {
                    setSelectedDestinationStopId(stop.id);
                    setSavedMessage('');
                  }}
                >
                  <View style={styles.stopNumber}>
                    <Text style={styles.stopNumberText}>{index + 1}</Text>
                  </View>

                  <View style={styles.stopContent}>
                    <Text
                      style={[
                        styles.stopName,
                        isSelected && styles.stopNameSelected,
                      ]}
                    >
                      {stop.name}
                    </Text>

                    <Text
                      style={[
                        styles.stopCoords,
                        isSelected && styles.stopCoordsSelected,
                      ]}
                    >
                      {stop.latitude.toFixed(5)}, {stop.longitude.toFixed(5)}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Card>
      )}

      <Card>
        <Text style={styles.label}>Tipo de aviso</Text>

        <View style={styles.optionsRow}>
          <OptionButton
            label="Distancia"
            selected={alertMode === 'distance'}
            onPress={() => setAlertMode('distance')}
          />

          <OptionButton
            label="Paradas"
            selected={alertMode === 'stops'}
            onPress={() => setAlertMode('stops')}
          />
        </View>
      </Card>

      {alertMode === 'distance' && (
        <Card>
          <Text style={styles.label}>Avisarme cuando falten</Text>

          <View style={styles.optionsRow}>
            {alertDistances.map((distance) => (
              <OptionButton
                key={distance}
                label={`${distance} m`}
                selected={selectedDistance === distance}
                onPress={() => setSelectedDistance(distance)}
              />
            ))}
          </View>
        </Card>
      )}

      {alertMode === 'stops' && (
        <Card>
          <Text style={styles.label}>Avisarme antes de llegar</Text>

          <View style={styles.optionsRow}>
            {stopAlerts.map((amount) => (
              <OptionButton
                key={amount}
                label={`${amount} parada${amount > 1 ? 's' : ''}`}
                selected={selectedStopAlert === amount}
                onPress={() => setSelectedStopAlert(amount)}
              />
            ))}
          </View>
        </Card>
      )}

      {selectedDestinationStop && (
        <Card>
          <Text style={styles.label}>Resumen</Text>

          <Text style={styles.summaryTitle}>
            Línea {selectedRoute.shortName} · {selectedDestinationStop.name}
          </Text>

          <Text style={styles.description}>
            Sentido: {selectedDirection.name}
          </Text>

          <Text style={styles.description}>
            Aviso:{' '}
            {alertMode === 'distance'
              ? `${selectedDistance} m antes`
              : `${selectedStopAlert} parada(s) antes`}
          </Text>
        </Card>
      )}

      <Pressable style={styles.primaryButton} onPress={saveTrip}>
        <Text style={styles.primaryButtonText}>Guardar viaje real</Text>
      </Pressable>

      {savedMessage.length > 0 && (
        <View
          style={[
            styles.messageCard,
            savedMessage.includes('correctamente') && styles.successCard,
          ]}
        >
          <Text style={styles.messageText}>{savedMessage}</Text>
        </View>
      )}

      <Card>
        <Text style={styles.label}>Siguiente paso</Text>
        <Text style={styles.description}>
          Después vamos a conectar este viaje real guardado con la pantalla Viaje
          para iniciar una alarma con paradas reales.
        </Text>
      </Card>
    </ScrollView>
  );
}

function getRouteName(shortName: string, longName: string) {
  if (!longName || longName === shortName) {
    return `Línea ${shortName}`;
  }

  return `Línea ${shortName} · ${longName}`;
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
  description: {
    color: '#B8C2CC',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  selectedText: {
    color: '#B8C2CC',
    fontSize: 14,
    marginTop: 12,
  },
  routesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  routeButton: {
    backgroundColor: '#223142',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 72,
    alignItems: 'center',
  },
  routeButtonSelected: {
    backgroundColor: '#5DE2A3',
  },
  routeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  routeButtonTextSelected: {
    color: '#101820',
  },
  optionsColumn: {
    gap: 10,
  },
  directionButton: {
    backgroundColor: '#223142',
    borderRadius: 16,
    padding: 14,
  },
  directionButtonSelected: {
    backgroundColor: '#5DE2A3',
  },
  directionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  directionTitleSelected: {
    color: '#101820',
  },
  directionSubtitle: {
    color: '#B8C2CC',
    fontSize: 13,
    marginTop: 4,
  },
  directionSubtitleSelected: {
    color: '#101820',
  },
  stopsList: {
    gap: 8,
    marginTop: 12,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#223142',
    borderRadius: 16,
    padding: 12,
  },
  stopButtonSelected: {
    backgroundColor: '#5DE2A3',
  },
  stopNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#101820',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopNumberText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  stopContent: {
    flex: 1,
  },
  stopName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  stopNameSelected: {
    color: '#101820',
  },
  stopCoords: {
    color: '#8FA1B3',
    fontSize: 12,
    marginTop: 3,
  },
  stopCoordsSelected: {
    color: '#101820',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  primaryButton: {
    backgroundColor: '#5DE2A3',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#101820',
    fontSize: 16,
    fontWeight: '900',
  },
  messageCard: {
    backgroundColor: '#3A1F1F',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  successCard: {
    backgroundColor: '#123326',
    borderColor: '#5DE2A3',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});