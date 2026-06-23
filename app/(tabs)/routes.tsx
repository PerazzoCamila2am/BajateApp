import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Card } from '../../components/Card';
import { OptionButton } from '../../components/OptionButton';
import { alertDistances, stopAlerts } from '../../data/alertOptions';
import {
  getTransitCity,
  TransitRouteIndexItem,
  transitCities,
} from '../../data/transit/transitCities';
import { saveSelectedTransitTrip } from '../../storage/selectedTransitTrip';
import { AlertMode } from '../../types/trip';
import {
  TransitCityId,
  TransitDirection,
  TransitRoute,
  TransitStop,
} from '../../types/transit';

const MIN_ROUTE_SEARCH_LENGTH = 1;

type ListItem =
  | { type: 'citySelector' }
  | { type: 'routeSearch' }
  | { type: 'routePrompt' }
  | { type: 'route'; route: TransitRouteIndexItem }
  | { type: 'routeEmpty' }
  | { type: 'directionHeader' }
  | { type: 'direction'; direction: TransitDirection }
  | { type: 'stopSearch' }
  | { type: 'stop'; stop: TransitStop }
  | { type: 'stopEmpty' }
  | { type: 'alertSettings' }
  | { type: 'summary' };

export default function RoutesScreen() {
  const [selectedCityId, setSelectedCityId] =
    useState<TransitCityId>('buenos-aires');

  const selectedCity = useMemo(() => {
    return getTransitCity(selectedCityId);
  }, [selectedCityId]);

  const [routeSearch, setRouteSearch] = useState('');
  const [stopSearch, setStopSearch] = useState('');
  const [isRoutePickerOpen, setIsRoutePickerOpen] = useState(true);

  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<TransitRoute | null>(null);
  const [selectedDirectionId, setSelectedDirectionId] = useState('');
  const [selectedDestinationStopId, setSelectedDestinationStopId] =
    useState('');

  const [alertMode, setAlertMode] = useState<AlertMode>('distance');
  const [selectedDistance, setSelectedDistance] = useState(alertDistances[0]);
  const [selectedStopAlert, setSelectedStopAlert] = useState(stopAlerts[0]);
  const [savedMessage, setSavedMessage] = useState('');
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  const matchingRoutes = useMemo(() => {
    const search = normalizeText(routeSearch);

    if (search.length < MIN_ROUTE_SEARCH_LENGTH) {
      return [];
    }

    return selectedCity.routeIndex.filter((route) => {
      return normalizeText(`${route.shortName} ${route.longName}`).includes(
        search
      );
    });
  }, [routeSearch, selectedCity]);

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

  const listItems = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [{ type: 'citySelector' }, { type: 'routeSearch' }];

    if (isRoutePickerOpen) {
      if (normalizeText(routeSearch).length < MIN_ROUTE_SEARCH_LENGTH) {
        items.push({ type: 'routePrompt' });
      } else if (matchingRoutes.length === 0) {
        items.push({ type: 'routeEmpty' });
      } else {
        matchingRoutes.forEach((route) => {
          items.push({ type: 'route', route });
        });
      }
    }

    if (selectedRoute) {
      items.push({ type: 'directionHeader' });

      selectedRoute.directions.forEach((direction) => {
        items.push({ type: 'direction', direction });
      });
    }

    if (selectedDirection) {
      items.push({ type: 'stopSearch' });

      if (matchingStops.length === 0) {
        items.push({ type: 'stopEmpty' });
      } else {
        matchingStops.forEach((stop) => {
          items.push({ type: 'stop', stop });
        });
      }

      items.push({ type: 'alertSettings' });
    }

    items.push({ type: 'summary' });

    return items;
  }, [
    isRoutePickerOpen,
    matchingRoutes,
    matchingStops,
    routeSearch,
    selectedDirection,
    selectedRoute,
  ]);

  function resetSelectionForCity(cityId: TransitCityId) {
    setSelectedCityId(cityId);
    setRouteSearch('');
    setStopSearch('');
    setIsRoutePickerOpen(true);
    setSelectedRouteId('');
    setSelectedRoute(null);
    setSelectedDirectionId('');
    setSelectedDestinationStopId('');
    setSavedMessage('');
  }

  async function selectRoute(routeId: string) {
    setIsLoadingRoute(true);
    setSavedMessage('');
    setSelectedRouteId(routeId);
    setIsRoutePickerOpen(false);
    setSelectedRoute(null);
    setSelectedDirectionId('');
    setSelectedDestinationStopId('');
    setStopSearch('');

    const routeDetails = await selectedCity.loadRouteDetails(routeId);

    setSelectedRoute(routeDetails);
    setSelectedDirectionId(routeDetails?.directions[0]?.id ?? '');
    setIsLoadingRoute(false);
  }

  function selectDirection(directionId: string) {
    setSelectedDirectionId(directionId);
    setSelectedDestinationStopId('');
    setStopSearch('');
    setSavedMessage('');
  }

  async function saveTrip(goToTripScreen = false) {
    if (!selectedRoute || !selectedDirection || !destinationStop) {
      setSavedMessage('Elegi una linea, un sentido y una parada destino.');
      return;
    }

    await saveSelectedTransitTrip({
      cityId: selectedCity.id,
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

  function renderItem({ item }: { item: ListItem }) {
    if (item.type === 'citySelector') {
      return (
        <Card>
          <Text style={styles.sectionLabel}>Ciudad</Text>

          <Text style={styles.description}>
            Elegi la ciudad donde queres buscar lineas.
          </Text>

          <View style={styles.cityOptions}>
            {transitCities.map((city) => (
              <OptionButton
                key={city.id}
                label={city.name}
                selected={selectedCityId === city.id}
                onPress={() => resetSelectionForCity(city.id)}
                compact
              />
            ))}
          </View>
        </Card>
      );
    }

    if (item.type === 'routeSearch') {
      return (
        <Card>
          <Text style={styles.sectionLabel}>
            {selectedRoute && !isRoutePickerOpen
              ? 'Linea seleccionada'
              : `Buscar linea en ${selectedCity.name}`}
          </Text>

          {selectedRoute && !isRoutePickerOpen ? (
            <>
              <Text style={styles.selectedRouteTitle}>
                Linea {selectedRoute.shortName}
              </Text>

              <Text style={styles.description}>
                {selectedRoute.longName || 'Sin nombre'}
              </Text>

              <Pressable
                style={styles.changeRouteButton}
                onPress={() => {
                  setIsRoutePickerOpen(true);
                  setSavedMessage('');
                }}
              >
                <Text style={styles.changeRouteButtonText}>Cambiar linea</Text>
              </Pressable>
            </>
          ) : (
            <>
              <TextInput
                value={routeSearch}
                onChangeText={setRouteSearch}
                placeholder="Ej: 12, 60, 152..."
                placeholderTextColor="#6F8193"
                style={styles.input}
              />

              <Text style={styles.helperText}>
                {normalizeText(routeSearch).length < MIN_ROUTE_SEARCH_LENGTH
                  ? 'Escribi el numero o nombre de una linea para buscar.'
                  : `${matchingRoutes.length} lineas encontradas.`}
              </Text>
            </>
          )}

          {isLoadingRoute && (
            <Text style={styles.loadingText}>Cargando detalle de linea...</Text>
          )}
        </Card>
      );
    }

    if (item.type === 'route') {
      const isSelected = item.route.id === selectedRouteId;

      return (
        <Pressable
          style={[styles.routeItem, isSelected && styles.selectedItem]}
          onPress={() => selectRoute(item.route.id)}
        >
          <Text style={styles.routeNumber}>
            Linea {item.route.shortName || 'Sin numero'}
          </Text>

          <Text style={styles.routeName} numberOfLines={2}>
            {item.route.longName || 'Sin nombre'}
          </Text>

          <Text style={styles.helperText}>
            {item.route.directionCount} sentido(s) · {item.route.stopCount}{' '}
            paradas
          </Text>
        </Pressable>
      );
    }

    if (item.type === 'routePrompt') {
      return (
        <Card>
          <Text style={styles.description}>
            Busca una linea de {selectedCity.name} para empezar.
          </Text>
        </Card>
      );
    }

    if (item.type === 'routeEmpty') {
      return (
        <Card>
          <Text style={styles.description}>
            No encontramos lineas con esa busqueda en {selectedCity.name}.
          </Text>
        </Card>
      );
    }

    if (item.type === 'directionHeader' && selectedRoute) {
      return (
        <Card>
          <Text style={styles.sectionLabel}>Sentido</Text>
          <Text style={styles.selectedRouteTitle}>
            Linea {selectedRoute.shortName}
          </Text>
          <Text style={styles.description}>
            Elegi el sentido correcto para tu viaje.
          </Text>
        </Card>
      );
    }

    if (item.type === 'direction') {
      const isSelected = item.direction.id === selectedDirectionId;

      return (
        <Pressable
          style={[styles.directionItem, isSelected && styles.selectedItem]}
          onPress={() => selectDirection(item.direction.id)}
        >
          <Text style={styles.directionName}>{item.direction.name}</Text>
          <Text style={styles.helperText}>
            {item.direction.stops.length} paradas
          </Text>
        </Pressable>
      );
    }

    if (item.type === 'stopSearch') {
      return (
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
            {matchingStops.length} paradas encontradas.
          </Text>
        </Card>
      );
    }

    if (item.type === 'stop') {
      const isSelected = item.stop.id === selectedDestinationStopId;

      return (
        <Pressable
          style={[styles.stopItem, isSelected && styles.selectedItem]}
          onPress={() => {
            setSelectedDestinationStopId(item.stop.id);
            setSavedMessage('');
          }}
        >
          <Text style={styles.stopName}>{item.stop.name}</Text>
          <Text style={styles.helperText}>Parada {item.stop.sequence}</Text>
        </Pressable>
      );
    }

    if (item.type === 'stopEmpty') {
      return (
        <Card>
          <Text style={styles.description}>
            No encontramos paradas con esa busqueda.
          </Text>
        </Card>
      );
    }

    if (item.type === 'alertSettings') {
      return (
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
      );
    }

    return (
      <Card>
        <Text style={styles.sectionLabel}>Resumen</Text>

        <Text style={styles.summaryText}>Ciudad: {selectedCity.name}</Text>

        {selectedRoute ? (
          <Text style={styles.summaryText}>
            Linea: {selectedRoute.shortName}
          </Text>
        ) : (
          <Text style={styles.description}>Todavia falta elegir una linea.</Text>
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
    );
  }

  function getItemKey(item: ListItem, index: number) {
    if (item.type === 'route') {
      return `route-${item.route.id}`;
    }

    if (item.type === 'direction') {
      return `direction-${item.direction.id}`;
    }

    if (item.type === 'stop') {
      return `stop-${item.stop.id}`;
    }

    return `${item.type}-${index}`;
  }

  if (selectedCity.routeIndex.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Lineas</Text>

        <Card>
          <Text style={styles.cardTitle}>No hay datos cargados</Text>
          <Text style={styles.description}>
            Todavia no se procesaron datos para {selectedCity.name}.
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={listItems}
      keyExtractor={getItemKey}
      renderItem={renderItem}
      keyboardShouldPersistTaps="handled"
      initialNumToRender={20}
      maxToRenderPerBatch={20}
      windowSize={9}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Lineas</Text>
          <Text style={styles.subtitle}>
            Elegi ciudad, busca una linea, selecciona tu parada destino y guarda
            el viaje.
          </Text>
        </View>
      }
    />
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
    gap: 10,
  },
  header: {
    marginBottom: 6,
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
    marginTop: 4,
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
  loadingText: {
    color: '#FFB020',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 10,
  },
  description: {
    color: '#B9C6D3',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  cityOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
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
  changeRouteButton: {
    backgroundColor: '#223142',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#263544',
    marginTop: 12,
  },
  changeRouteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
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