import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';

const alertDistances = [300, 500, 800];
const stopAlerts = [1, 2, 3];
const simulationStep = 100;

const demoStops = [
  { id: 1, name: 'Parada 1', distanceFromStart: 0 },
  { id: 2, name: 'Parada 2', distanceFromStart: 300 },
  { id: 3, name: 'Parada 3', distanceFromStart: 600 },
  { id: 4, name: 'Parada 4', distanceFromStart: 900 },
  { id: 5, name: 'Facultad', distanceFromStart: 1200 },
  { id: 6, name: 'Centro', distanceFromStart: 1500 },
  { id: 7, name: 'Casa', distanceFromStart: 1800 },
];

type AlertMode = 'distance' | 'stops';

type TripStatus =
  | 'Sin viaje activo'
  | 'Simulando viaje'
  | 'Cerca del destino'
  | 'Alarma activada'
  | 'Destino alcanzado';

export default function HomeScreen() {
  const [alertMode, setAlertMode] = useState<AlertMode>('distance');
  const [selectedDestinationId, setSelectedDestinationId] = useState(5);
  const [selectedDistance, setSelectedDistance] = useState(300);
  const [selectedStopAlert, setSelectedStopAlert] = useState(1);
  const [currentDistanceFromStart, setCurrentDistanceFromStart] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [tripStatus, setTripStatus] = useState<TripStatus>('Sin viaje activo');

  const selectedDestinationIndex = useMemo(() => {
    return demoStops.findIndex((stop) => stop.id === selectedDestinationId);
  }, [selectedDestinationId]);

  const selectedDestination = demoStops[selectedDestinationIndex];

  const destinationDistance = selectedDestination.distanceFromStart;

  const remainingDistance = Math.max(
    destinationDistance - currentDistanceFromStart,
    0
  );

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

  const alertStopIndex = Math.max(
    selectedDestinationIndex - selectedStopAlert,
    0
  );

  const alertStop = demoStops[alertStopIndex];

  const progress = Math.min(
    Math.max(currentDistanceFromStart / destinationDistance, 0),
    1
  );

  const progressPercent = Math.round(progress * 100);

  const isAlarmActive = tripStatus === 'Alarma activada';
  const isNearDestination = tripStatus === 'Cerca del destino';

  useEffect(() => {
    if (!isSimulating) {
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentDistanceFromStart((currentDistance) => {
        const nextDistance = Math.min(
          currentDistance + simulationStep,
          destinationDistance
        );

        const nextRemainingDistance = Math.max(
          destinationDistance - nextDistance,
          0
        );

        const reachedDistanceAlert =
          alertMode === 'distance' &&
          nextRemainingDistance <= selectedDistance;

        const reachedStopAlert =
          alertMode === 'stops' &&
          nextDistance >= alertStop.distanceFromStart;

        if (reachedDistanceAlert || reachedStopAlert) {
          setTripStatus('Alarma activada');
          setIsSimulating(false);
          Vibration.vibrate([0, 500, 250, 500, 250, 800]);
        } else if (nextRemainingDistance <= selectedDistance + 200) {
          setTripStatus('Cerca del destino');
        } else if (nextDistance >= destinationDistance) {
          setTripStatus('Destino alcanzado');
          setIsSimulating(false);
        } else {
          setTripStatus('Simulando viaje');
        }

        return nextDistance;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [
    alertMode,
    alertStop.distanceFromStart,
    destinationDistance,
    isSimulating,
    selectedDistance,
  ]);

  function selectDestination(destinationId: number) {
    if (isSimulating) {
      return;
    }

    setSelectedDestinationId(destinationId);
    setCurrentDistanceFromStart(0);
    setTripStatus('Sin viaje activo');
  }

  function startSimulation() {
    setCurrentDistanceFromStart(0);
    setTripStatus('Simulando viaje');
    setIsSimulating(true);
    Vibration.cancel();
  }

  function stopSimulation() {
    setIsSimulating(false);
    setCurrentDistanceFromStart(0);
    setTripStatus('Sin viaje activo');
    Vibration.cancel();
  }

  function getStatusMessage() {
    if (isAlarmActive && alertMode === 'distance') {
      return `Te avisamos porque faltan ${selectedDistance} m o menos.`;
    }

    if (isAlarmActive && alertMode === 'stops') {
      return `Te avisamos en ${alertStop.name}, ${selectedStopAlert} parada(s) antes.`;
    }

    if (isNearDestination) {
      return 'Prestá atención, falta poco.';
    }

    if (isSimulating) {
      return 'Estamos siguiendo tu viaje demo.';
    }

    return 'Configurá tu alerta e iniciá la simulación.';
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.appName}>BajateApp</Text>
        <Text style={styles.title}>Dormite tranquilo.</Text>
        <Text style={styles.subtitle}>Te avisamos antes de llegar.</Text>
      </View>

      {isAlarmActive && (
        <View style={styles.alarmCard}>
          <Text style={styles.alarmEmoji}>🚨</Text>
          <Text style={styles.alarmTitle}>¡Estás por llegar!</Text>
          <Text style={styles.alarmText}>
            Bajate en la próxima parada o preparate para descender.
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.label}>Tipo de aviso</Text>

        <View style={styles.optionsRow}>
          <Pressable
            style={[
              styles.optionButton,
              alertMode === 'distance' && styles.optionButtonSelected,
            ]}
            onPress={() => setAlertMode('distance')}
          >
            <Text
              style={[
                styles.optionButtonText,
                alertMode === 'distance' && styles.optionButtonTextSelected,
              ]}
            >
              Distancia
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.optionButton,
              alertMode === 'stops' && styles.optionButtonSelected,
            ]}
            onPress={() => setAlertMode('stops')}
          >
            <Text
              style={[
                styles.optionButtonText,
                alertMode === 'stops' && styles.optionButtonTextSelected,
              ]}
            >
              Paradas
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Destino demo</Text>

        <View style={styles.wrapRow}>
          {demoStops.slice(4).map((stop) => {
            const isSelected = selectedDestinationId === stop.id;

            return (
              <Pressable
                key={stop.id}
                style={[
                  styles.destinationButton,
                  isSelected && styles.optionButtonSelected,
                  isSimulating && styles.optionButtonDisabled,
                ]}
                onPress={() => selectDestination(stop.id)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    isSelected && styles.optionButtonTextSelected,
                  ]}
                >
                  {stop.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.selectedText}>
          Destino elegido: {selectedDestination.name} · {destinationDistance} m
        </Text>
      </View>

      {alertMode === 'distance' && (
        <View style={styles.card}>
          <Text style={styles.label}>Avisarme cuando falten</Text>

          <View style={styles.optionsRow}>
            {alertDistances.map((distance) => {
              const isSelected = selectedDistance === distance;

              return (
                <Pressable
                  key={distance}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedDistance(distance)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      isSelected && styles.optionButtonTextSelected,
                    ]}
                  >
                    {distance} m
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.selectedText}>
            Distancia elegida: {selectedDistance} m
          </Text>
        </View>
      )}

      {alertMode === 'stops' && (
        <View style={styles.card}>
          <Text style={styles.label}>Avisarme antes de llegar</Text>

          <View style={styles.optionsRow}>
            {stopAlerts.map((amount) => {
              const isSelected = selectedStopAlert === amount;

              return (
                <Pressable
                  key={amount}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedStopAlert(amount)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      isSelected && styles.optionButtonTextSelected,
                    ]}
                  >
                    {amount} parada{amount > 1 ? 's' : ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.selectedText}>
            La alarma sonará en: {alertStop.name}
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable
          style={[
            styles.startButton,
            isSimulating && styles.startButtonDisabled,
          ]}
          onPress={startSimulation}
          disabled={isSimulating}
        >
          <Text style={styles.startButtonText}>
            {isSimulating ? 'Simulación en curso' : 'Iniciar simulación'}
          </Text>
        </Pressable>

        <Pressable style={styles.stopButton} onPress={stopSimulation}>
          <Text style={styles.stopButtonText}>Detener</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Avance del viaje</Text>
          <Text style={styles.progressText}>{progressPercent}%</Text>
        </View>

        <Text style={styles.bigNumber}>{remainingDistance} m</Text>
        <Text style={styles.selectedText}>Restantes hasta destino</Text>

        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Parada actual aproximada</Text>
        <Text style={styles.stopName}>{currentStop.name}</Text>
        <Text style={styles.selectedText}>
          Recorridos: {currentDistanceFromStart} m
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Estado</Text>
        <Text
          style={[
            styles.status,
            isNearDestination && styles.statusNear,
            isAlarmActive && styles.statusAlarm,
          ]}
        >
          {tripStatus}
        </Text>
        <Text style={styles.statusMessage}>{getStatusMessage()}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Recorrido demo</Text>

        {demoStops.map((stop, index) => {
          const isPast = index <= currentStopIndex;
          const isDestination = stop.id === selectedDestinationId;
          const isAlertStop = alertMode === 'stops' && index === alertStopIndex;

          return (
            <View key={stop.id} style={styles.stopRow}>
              <Text style={[styles.stopDot, isPast && styles.stopDotPast]}>
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
      </View>
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
    marginTop: 5,
  },
  card: {
    backgroundColor: '#17212B',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#263544',
  },
  alarmCard: {
    backgroundColor: '#3A1F1F',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    alignItems: 'center',
  },
  alarmEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  alarmTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  alarmText: {
    color: '#FFD1D1',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6,
  },
  label: {
    color: '#8FA1B3',
    fontSize: 14,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#223142',
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
  },
  destinationButton: {
    backgroundColor: '#223142',
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#5DE2A3',
  },
  optionButtonDisabled: {
    opacity: 0.5,
  },
  optionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  optionButtonTextSelected: {
    color: '#101820',
  },
  selectedText: {
    color: '#B8C2CC',
    fontSize: 14,
    marginTop: 10,
  },
  actions: {
    gap: 10,
  },
  startButton: {
    backgroundColor: '#5DE2A3',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  startButtonDisabled: {
    opacity: 0.65,
  },
  startButtonText: {
    color: '#101820',
    fontSize: 16,
    fontWeight: '800',
  },
  stopButton: {
    backgroundColor: '#263544',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
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
    fontWeight: '800',
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
  stopName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  status: {
    color: '#F6C85F',
    fontSize: 21,
    fontWeight: '800',
  },
  statusNear: {
    color: '#FFD166',
  },
  statusAlarm: {
    color: '#FF6B6B',
  },
  statusMessage: {
    color: '#B8C2CC',
    fontSize: 14,
    marginTop: 6,
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
  stopText: {
    color: '#DCE6F0',
    fontSize: 15,
  },
});