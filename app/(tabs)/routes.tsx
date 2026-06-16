import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Card } from '../../components/Card';
import { OptionButton } from '../../components/OptionButton';
import { alertDistances, stopAlerts } from '../../data/alertOptions';
import { buenosAiresSampleRoutes } from '../../data/transit/buenosAiresSample';
import { saveSelectedTransitTrip } from '../../storage/selectedTransitTrip';
import { AlertMode } from '../../types/trip';

const MAX_VISIBLE_ROUTES = 30;
const MAX_VISIBLE_STOPS = 60;

export default function RoutesScreen() {
  const firstRoute = buenosAiresSampleRoutes[0] ?? null;
  const firstDirection = firstRoute?.directions[0] ?? null;

  const [routeSearch, setRouteSearch] = useState('');
  const [stopSearch, setStopSearch] = useState('');

  const [selectedRouteId, setSelectedRouteId] = useState(firstRoute?.id ?? '');
  const [selectedDirectionId, setSelectedDirectionId] = useState(
    firstDirection?.id ?? ''
  );
  const [selectedDestinationStopId, setSelectedDestinationStopId] =
    useState('');

  const [alertMode, setAlertMode] = useState<AlertMode>('distance');
  const [selectedDistance, setSelectedDistance] = useState(alertDistances[0]);
  const [selectedStopAlert, setSelectedStopAlert] = useState(stopAlerts[0]);
  const [savedMessage, setSavedMessage] = useState('');

  const matchingRoutes = useMemo(() => {
    const search = normalizeText(routeSearch);

    if (!search) {
      return buenosAiresSampleRoutes;
    }

    return buenosAiresSampleRoutes.filter((route) => {
      return normalizeText(
        `${route.shortName} ${route.longName}`
      ).includes(search);
    });
  }, [routeSearch]);

  const visibleRoutes = useMemo(() => {
    return matchingRoutes.slice(0, MAX_VISIBLE_ROUTES);
  }, [matchingRoutes]);

  const selectedRoute = useMemo(() => {
    return (
      buenosAiresSampleRoutes.find((route) => route.id === selectedRouteId) ??
      null
    );
  }, [selectedRouteId]);

  const selectedDirection = useMemo(() => {
    if (!selectedRoute) {
      return null;
    }

    return (
      selectedRoute.directions.find(
        (direction) => direction.id === selectedDirectionId
      ) ?? null
    );
  }, [selectedRoute, selectedDirectionId]);

  const matchingStops = useMemo(() => {
    if (!selectedDirection) {
      return [];
    }

    const search = normalizeText(stopSearch);

    if (!search) {
      return selectedDirection.stops;
    }

    return selectedDirection.stops.filter((stop) => {
      return normalizeText(`${stop.name} ${stop.sequence}`).includes(search);
    });
  }, [selectedDirection, stopSearch]);

  const visibleStops = useMemo(() => {
    return matchingStops.slice(0, MAX_VISIBLE_STOPS);
  }, [matchingStops]);

  const destinationStop = useMemo(() => {
    if (!selectedDirection) {
      return null;
    }

    return (
      selectedDirection.stops.find(
        (stop) => stop.id === selectedDestinationStopId
      ) ?? null
    );
  }, [selectedDirection, selectedDestinationStopId]);

  const canSaveTrip =
    selectedRoute !== null &&
    selectedDirection !== null &&
    destinationStop !== null;

  function selectRoute(routeId: string) {
    const route = buenosAiresSampleRoutes.find((item) => item.id === routeId);

    setSelectedRouteId(routeId);
    setSelectedDirectionId(route?.directions[0]?.id ?? '');
    setSelectedDestinationStopId('');
    setStopSearch('');
    setSavedMessage('');
  }

  function selectDirection(directionId: string) {
    setSelectedDirectionId(directionId);
    setSelectedDestinationStopId('');
    setStopSearch('');
    setSavedMessage('');
  }

  async function saveTrip(goToTripScreen = false) {
    if (!selectedRoute || !selectedDirection || !destinationStop) {
      setSavedMessage('Elegí una línea, un sentido y una parada destino.');
      return;
    }

    await saveSelectedTransitTrip({
      routeId: selectedRoute.id,
      routeName: `${selectedRoute.shortName} ${selectedRoute.longName}`.trim(),
      directionId: selectedDirection.id,
      directionName: selectedDirection.name,
      tripId: selectedDirection.tripId,
      destinationStopId: destinationStop.id,
      destinationStopName: destinationStop.name,
      alertMode,
      selectedDistance,
      selectedStopAlert,
    });

    setSavedMessage('Viaje guardado correctamente.');

    if (goToTripScreen) {
      router.push('/');
    }
  }

  if (buenosAiresSampleRoutes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Lineas</Text>

        <Card>
          <Text style={styles.cardTitle}>No hay datos cargados</Text>
          <Text style={styles.description}>
            Todavia no se procesaron datos GTFS. Ejecuta el script para generar
            las lineas reales.
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Lineas</Text>
      <Text style={styles.subtitle}>
        Busca una linea, elegi el sentido, selecciona tu parada destino y guarda
        el viaje.
      </Text>

      <Card>
        <Text style={styles.sectionLabel}>Buscar linea</Text>

        <TextInput
          value={routeSearch}
          onChangeText={setRouteSearch}
          placeholder="Ej: 12, 60, 152..."
          placeholderTextColor="#6F8193"
          style={styles.input}
        />

        <Text style={styles.helperText}>
          {matchingRoutes.length} lineas encontradas. Mostrando hasta{' '}
          {MAX_VISIBLE_ROUTES}.
        </Text>

        <View style={styles.list}>
          {visibleRoutes.map((route) => {
            const isSelected = route.id === selectedRouteId;

            return (
              <Pressable
                key={route.id}
                style={[styles.routeItem, isSelected && styles.selectedItem]}
                onPress={() => selectRoute(route.id)}
              >
                <Text style={styles.routeNumber}>
                  Linea {route.shortName || 'Sin numero'}
                </Text>

                <Text style={styles.routeName} numberOfLines={2}>
                  {route.longName || 'Sin nombre'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {visibleRoutes.length === 0 && (
          <Text style={styles.description}>
            No encontramos lineas con esa busqueda.
          </Text>
        )}
      </Card>

      {selectedRoute && (
        <Card>
          <Text style={styles.sectionLabel}>Sentido</Text>

          <Text style={styles.selectedRouteTitle}>
            Linea {selectedRoute.shortName}
          </Text>

          <View style={styles.list}>
            {selectedRoute.directions.map((direction) => {
              const isSelected = direction.id === selectedDirectionId;

              return (
                <Pressable
                  key={direction.id}
                  style={[
                    styles.directionItem,
                    isSelected && styles.selectedItem,
                  ]}
                  onPress={() => selectDirection(direction.id)}
                >
                  <Text style={styles.directionName}>{direction.name}</Text>
                  <Text style={styles.helperText}>
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
          <Text style={styles.sectionLabel}>Parada destino</Text>

          <TextInput
            value={stopSearch}
            onChangeText={setStopSearch}
            placeholder="Buscar parada por nombre..."
            placeholderTextColor="#6F8193"
            style={styles.input}
          />

          <Text style={styles.helperText}>
            {matchingStops.length} paradas encontradas. Mostrando hasta{' '}
            {MAX_VISIBLE_STOPS}.
          </Text>

          <View style={styles.list}>
            {visibleStops.map((stop) => {
              const isSelected = stop.id === selectedDestinationStopId;

              return (
                <Pressable
                  key={stop.id}
                  style={[styles.stopItem, isSelected && styles.selectedItem]}
                  onPress={() => {
                    setSelectedDestinationStopId(stop.id);
                    setSavedMessage('');
                  }}
                >
                  <Text style={styles.stopName}>{stop.name}</Text>
                  <Text style={styles.helperText}>Parada {stop.sequence}</Text>
                </Pressable>
              );
            })}
          </View>

          {visibleStops.length === 0 && (
            <Text style={styles.description}>
              No encontramos paradas con esa busqueda.
            </Text>
          )}
        </Card>
      )}

      {selectedDirection && (
        <Card>
          <Text style={styles.sectionLabel}>Tipo de aviso</Text>

          <View style={styles.optionRow}>
            <OptionButton
              label="Por metros"
              selected={alertMode === 'distance'}
              onPress={() => setAlertMode('distance')}
            />

            <OptionButton
              label="Por paradas"
              selected={alertMode === 'stops'}
              onPress={() => setAlertMode('stops')}
            />
          </View>

          {alertMode === 'distance' ? (
            <>
              <Text style={styles.subsectionTitle}>
                Avisarme antes de llegar
              </Text>

              <View style={styles.compactOptions}>
                {alertDistances.map((distance) => (
                  <OptionButton
                    key={distance}
                    label={`${distance} m`}
                    selected={selectedDistance === distance}
                    onPress={() => setSelectedDistance(distance)}
                    compact
                  />
                ))}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.subsectionTitle}>
                Avisarme paradas antes
              </Text>

              <View style={styles.compactOptions}>
                {stopAlerts.map((amount) => (
                  <OptionButton
                    key={amount}
                    label={`${amount}`}
                    selected={selectedStopAlert === amount}
                    onPress={() => setSelectedStopAlert(amount)}
                    compact
                  />
                ))}
              </View>
            </>
          )}
        </Card>
      )}

      <Card>
        <Text style={styles.sectionLabel}>Resumen</Text>

        {selectedRoute && (
          <Text style={styles.summaryText}>
            Linea: {selectedRoute.shortName}
          </Text>
        )}

        {selectedDirection && (
          <Text style={styles.summaryText}>
            Sentido: {selectedDirection.name}
          </Text>
        )}

        {destinationStop ? (
          <Text style={styles.summaryDestination}>
            Destino: {destinationStop.name}
          </Text>
        ) : (
          <Text style={styles.description}>
            Todavia falta elegir una parada destino.
          </Text>
        )}

        {alertMode === 'distance' ? (
          <Text style={styles.summaryText}>
            Aviso: {selectedDistance} metros antes
          </Text>
        ) : (
          <Text style={styles.summaryText}>
            Aviso: {selectedStopAlert} paradas antes
          </Text>
        )}

        {savedMessage.length > 0 && (
          <Text style={styles.savedMessage}>{savedMessage}</Text>
        )}

        <Pressable
          style={[styles.primaryButton, !canSaveTrip && styles.disabledButton]}
          onPress={() => saveTrip(false)}
          disabled={!canSaveTrip}
        >
          <Text style={styles.primaryButtonText}>Guardar viaje</Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, !canSaveTrip && styles.disabledButton]}
          onPress={() => saveTrip(true)}
          disabled={!canSaveTrip}
        >
          <Text style={styles.secondaryButtonText}>Guardar e ir a Viaje</Text>
        </Pressable>
      </Card>
    </ScrollView>
  );
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
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
  input: {
    backgroundColor: '#101820',
    borderColor: '#263544',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  helperText: {
    color: '#8FA1B3',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
  },
  description: {
    color: '#B9C6D3',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  list: {
    gap: 8,
    marginTop: 12,
  },
  routeItem: {
    backgroundColor: '#223142',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: '#263544',
  },
  routeNumber: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  routeName: {
    color: '#B9C6D3',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  selectedItem: {
    backgroundColor: '#183326',
    borderColor: '#5DE2A3',
  },
  selectedRouteTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
  },
  directionItem: {
    backgroundColor: '#223142',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: '#263544',
  },
  directionName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  stopItem: {
    backgroundColor: '#223142',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#263544',
  },
  stopName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  compactOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  subsectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 16,
  },
  summaryText: {
    color: '#B9C6D3',
    fontSize: 14,
    lineHeight: 22,
  },
  summaryDestination: {
    color: '#5DE2A3',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
    marginBottom: 4,
  },
  savedMessage: {
    color: '#5DE2A3',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: '#5DE2A3',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 16,
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
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  disabledButton: {
    opacity: 0.5,
  },
});