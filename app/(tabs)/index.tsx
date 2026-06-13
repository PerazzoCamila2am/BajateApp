import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const alertDistances = [300, 500, 800];
const initialDistance = 1200;
const simulationStep = 100;

type TripStatus =
  | 'Sin viaje activo'
  | 'Simulando viaje'
  | 'Cerca del destino'
  | 'Alarma activada';

export default function HomeScreen() {
  const [selectedDistance, setSelectedDistance] = useState(300);
  const [remainingDistance, setRemainingDistance] = useState(initialDistance);
  const [isSimulating, setIsSimulating] = useState(false);
  const [tripStatus, setTripStatus] = useState<TripStatus>('Sin viaje activo');

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

  function startSimulation() {
    setRemainingDistance(initialDistance);
    setTripStatus('Simulando viaje');
    setIsSimulating(true);
  }

  function stopSimulation() {
    setIsSimulating(false);
    setRemainingDistance(initialDistance);
    setTripStatus('Sin viaje activo');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.appName}>BajateApp</Text>
        <Text style={styles.title}>Dormite tranquilo.</Text>
        <Text style={styles.subtitle}>Te avisamos antes de llegar.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Destino demo</Text>
        <Text style={styles.destination}>Facultad</Text>
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
        <Pressable style={styles.startButton} onPress={startSimulation}>
          <Text style={styles.startButtonText}>Iniciar simulación</Text>
        </Pressable>

        <Pressable style={styles.stopButton} onPress={stopSimulation}>
          <Text style={styles.stopButtonText}>Detener</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Distancia restante</Text>
        <Text style={styles.bigNumber}>{remainingDistance} m</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Estado</Text>
        <Text style={styles.status}>{tripStatus}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#101820',
    padding: 24,
    justifyContent: 'center',
    gap: 16,
  },
  header: {
    marginBottom: 8,
  },
  appName: {
    color: '#5DE2A3',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: '#B8C2CC',
    fontSize: 18,
    marginTop: 6,
  },
  card: {
    backgroundColor: '#17212B',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#263544',
  },
  label: {
    color: '#8FA1B3',
    fontSize: 14,
    marginBottom: 8,
  },
  destination: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#223142',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#5DE2A3',
  },
  optionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  optionButtonTextSelected: {
    color: '#101820',
  },
  selectedText: {
    color: '#B8C2CC',
    fontSize: 14,
    marginTop: 12,
  },
  actions: {
    gap: 12,
  },
  startButton: {
    backgroundColor: '#5DE2A3',
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#101820',
    fontSize: 17,
    fontWeight: '800',
  },
  stopButton: {
    backgroundColor: '#263544',
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  bigNumber: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
  },
  status: {
    color: '#F6C85F',
    fontSize: 22,
    fontWeight: '700',
  },
});