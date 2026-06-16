import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../components/Card';

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Guia</Text>
      <Text style={styles.subtitle}>
        BajateApp te ayuda a elegir una linea, marcar tu parada destino y recibir
        una alerta antes de bajarte.
      </Text>

      <Card>
        <Text style={styles.sectionLabel}>Como usar la app</Text>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>1</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Elegi una linea</Text>
            <Text style={styles.description}>
              En la pestana Lineas podes buscar una linea real cargada desde
              datos GTFS.
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>2</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Selecciona el sentido</Text>
            <Text style={styles.description}>
              Cada linea puede tener uno o mas sentidos. Elegi el recorrido que
              corresponde a tu viaje.
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>3</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Marca tu parada destino</Text>
            <Text style={styles.description}>
              Busca la parada donde queres bajarte y guardala como destino.
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>4</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Inicia el seguimiento</Text>
            <Text style={styles.description}>
              En Viaje podes iniciar GPS real o usar modo prueba para verificar
              la alarma.
            </Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionLabel}>Estado actual</Text>

        <Text style={styles.feature}>Datos GTFS procesados</Text>
        <Text style={styles.feature}>Busqueda de lineas y paradas</Text>
        <Text style={styles.feature}>Viaje guardado localmente</Text>
        <Text style={styles.feature}>Mapa del recorrido seleccionado</Text>
        <Text style={styles.feature}>Parada destino y parada de aviso</Text>
        <Text style={styles.feature}>GPS en primer plano</Text>
        <Text style={styles.feature}>Modo prueba para simular ubicacion</Text>
        <Text style={styles.feature}>Alarma con sonido y vibracion</Text>
      </Card>

      <Card>
        <Text style={styles.sectionLabel}>Importante</Text>

        <Text style={styles.description}>
          Por ahora los datos cargados son de Buenos Aires. Si no estas en
          Buenos Aires, tu ubicacion real va a aparecer lejos del recorrido. Para
          probar la logica de la app, usa los botones de modo prueba.
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionLabel}>Proximos pasos</Text>

        <Text style={styles.pending}>Agregar datos de otras ciudades</Text>
        <Text style={styles.pending}>Mejorar rendimiento con mas lineas</Text>
        <Text style={styles.pending}>Agregar notificaciones locales</Text>
        <Text style={styles.pending}>Preparar seguimiento en segundo plano</Text>
        <Text style={styles.pending}>Pulir diseno final e icono de app</Text>
      </Card>
    </ScrollView>
  );
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
  sectionLabel: {
    color: '#8FA1B3',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#5DE2A3',
    color: '#101820',
    textAlign: 'center',
    lineHeight: 34,
    fontSize: 16,
    fontWeight: '900',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  description: {
    color: '#B9C6D3',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
  },
  feature: {
    backgroundColor: '#183326',
    color: '#5DE2A3',
    fontSize: 14,
    fontWeight: '800',
    padding: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  pending: {
    backgroundColor: '#223142',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    padding: 12,
    borderRadius: 14,
    marginTop: 8,
  },
});