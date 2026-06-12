import { Pressable, StyleSheet, Text, View } from 'react-native';

const alertDistances = [300, 500, 800];

export default function HomeScreen() {
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
          {alertDistances.map((distance) => (
            <Pressable key={distance} style={styles.optionButton}>
              <Text style={styles.optionButtonText}>{distance} m</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.startButton}>
          <Text style={styles.startButtonText}>Iniciar simulación</Text>
        </Pressable>

        <Pressable style={styles.stopButton}>
          <Text style={styles.stopButtonText}>Detener</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Distancia restante</Text>
        <Text style={styles.bigNumber}>1200 m</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Estado</Text>
        <Text style={styles.status}>Sin viaje activo</Text>
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
  optionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
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