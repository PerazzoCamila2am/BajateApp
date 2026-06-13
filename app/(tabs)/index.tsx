import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, Vibration, View } from 'react-native';

const alertDistances = [300, 500, 800];

const demoDestinations = [
  {
    id: 1,
    name: 'Facultad',
    initialDistance: 1200,
  },
  {
    id: 2,
    name: 'Centro',
    initialDistance: 1800,
  },
  {
    id: 3,
    name: 'Casa',
    initialDistance: 950,
  },
];

const simulationStep = 100;

type TripStatus =
  | 'Sin viaje activo'
  | 'Simulando viaje'
  | 'Cerca del destino'
  | 'Alarma activada';

export default function HomeScreen() {
  const [selectedDestinationId, setSelectedDestinationId] = useState(1);
  const [selectedDistance, setSelectedDistance] = useState(300);
  const [remainingDistance, setRemainingDistance] = useState(1200);
  const [isSimulating, setIsSimulating] = useState(false);
  const [tripStatus, setTripStatus] = useState<TripStatus>('Sin viaje activo');

  const selectedDestination = useMemo(() => {
    return demoDestinations.find(
      (destination) => destination.id === selectedDestinationId
    )!;
  }, [selectedDestinationId]);

  const progress = useMemo(() => {
    const traveledDistance =
      selectedDestination.initialDistance - remainingDistance;

    return Math.min(
      Math.max(traveledDistance / selectedDestination.initialDistance, 0),
      1
    );
  }, [remainingDistance, selectedDestination.initialDistance]);

  const progressPercent = Math.round(progress * 100);
  const isAlarmActive = tripStatus === 'Alarma activada';
  const isNearDestination = tripStatus === 'Cerca del destino';

  useEffect(() => {
    if (!isSimulating) {
      return;
    }

    const intervalId = setInterval(() => {
      setRemainingDistance((currentDistance) => {
        const nextDistance = Math.max(currentDistance - simulationStep, 0);

        if (nextDistance <= selectedDistance) {
          setTripStatus('Alarma activada');
          setIsSimulating(false);
          Vibration.vibrate([0, 500, 250, 500, 250, 800]);
        } else if (nextDistance <= selectedDistance + 200) {
          setTripStatus('Cerca del destino');
        } else {
          setTripStatus('Simulando viaje');
        }

        return nextDistance;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isSimulating, selectedDistance]);

  function selectDestination(destinationId: number) {
    if (isSimulating) {
      return;
    }

    const newDestination = demoDestinations.find(
      (destination) => destination.id === destinationId
    );

    if (!newDestination) {
      return;
    }

    setSelectedDestinationId(destinationId);
    setRemainingDistance(newDestination.initialDistance);
    setTripStatus('Sin viaje activo');
  }

  function startSimulation() {
    setRemainingDistance(selectedDestination.initialDistance);
    setTripStatus('Simulando viaje');
    setIsSimulating(true);
  }

  function stopSimulation() {
    setIsSimulating(false);
    setRemainingDistance(selectedDestination.initialDistance);
    setTripStatus('Sin viaje activo');
    Vibration.cancel();
  }

  function getStatusMessage() {
    if (isAlarmActive) {
      return '¡Estás por llegar, bajate!';
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
    <View style={styles.screen}>
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
        <Text style={styles.label}>Destino demo</Text>

        <View style={styles.optionsRow}>
          {demoDestinations.map((destination) => {
            const isSelected = selectedDestinationId === destination.id;

            return (
              <Pressable
                key={destination.id}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                  isSimulating && styles.optionButtonDisabled,
                ]}
                onPress={() => selectDestination(destination.id)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    isSelected && styles.optionButtonTextSelected,
                  ]}
                >
                  {destination.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.selectedText}>
          Distancia inicial: {selectedDestination.initialDistance} m
        </Text>
      </View>

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
          <Text style={styles.label}>Distancia restante</Text>
          <Text style={styles.progressText}>{progressPercent}%</Text>
        </View>

        <Text style={styles.bigNumber}>{remainingDistance} m</Text>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#101820',
    padding: 22,
    justifyContent: 'center',
    gap: 13,
  },
  header: {
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
  optionButton: {
    flex: 1,
    backgroundColor: '#223142',
    paddingVertical: 13,
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
    marginTop: 11,
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
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#263544',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5DE2A3',
    borderRadius: 999,
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
});