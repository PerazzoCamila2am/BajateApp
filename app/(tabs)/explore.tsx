import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function GuideScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.appName}>BajateApp</Text>
        <Text style={styles.title}>¿Cómo funciona?</Text>
        <Text style={styles.subtitle}>
          Configurás una alerta, iniciás el viaje y la app te avisa antes de llegar.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.stepNumber}>1</Text>
        <Text style={styles.cardTitle}>Elegí tu destino</Text>
        <Text style={styles.cardText}>
          En esta versión demo podés elegir Facultad, Centro o Casa como destino.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.stepNumber}>2</Text>
        <Text style={styles.cardTitle}>Elegí cómo querés que te avise</Text>
        <Text style={styles.cardText}>
          Podés usar aviso por distancia, como 300 m, 500 m o 800 m, o aviso por paradas.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.stepNumber}>3</Text>
        <Text style={styles.cardTitle}>Iniciá la simulación</Text>
        <Text style={styles.cardText}>
          La distancia empieza a bajar como si estuvieras viajando en colectivo.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.stepNumber}>4</Text>
        <Text style={styles.cardTitle}>Recibí la alerta</Text>
        <Text style={styles.cardText}>
          Cuando llegás al punto configurado, BajateApp cambia el estado, muestra una alerta y vibra.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Versión actual</Text>
        <Text style={styles.infoText}>
          Esta primera versión usa modo simulación. Todavía no usa GPS real, mapa ni datos reales de transporte.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Próximas mejoras</Text>

        <Text style={styles.bullet}>• Sonido de alarma</Text>
        <Text style={styles.bullet}>• Notificaciones</Text>
        <Text style={styles.bullet}>• GPS real</Text>
        <Text style={styles.bullet}>• Mapa con recorrido</Text>
        <Text style={styles.bullet}>• Datos reales de colectivos</Text>
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
    paddingBottom: 36,
    gap: 14,
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
    fontWeight: '900',
  },
  subtitle: {
    color: '#B8C2CC',
    fontSize: 17,
    lineHeight: 24,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#17212B',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#263544',
  },
  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#5DE2A3',
    color: '#101820',
    textAlign: 'center',
    lineHeight: 34,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  cardText: {
    color: '#B8C2CC',
    fontSize: 15,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: '#122A34',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#245365',
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 8,
  },
  infoText: {
    color: '#B8C2CC',
    fontSize: 15,
    lineHeight: 22,
  },
  bullet: {
    color: '#B8C2CC',
    fontSize: 15,
    lineHeight: 24,
  },
});