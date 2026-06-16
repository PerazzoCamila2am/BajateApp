import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { Card } from '../../components/Card';

export default function MoreScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Mas</Text>
      <Text style={styles.subtitle}>
        Ajustes, ayuda y opciones generales de BajateApp.
      </Text>

      <Card>
        <Text style={styles.sectionLabel}>Opciones</Text>

        <Pressable
          style={styles.optionButton}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.optionTitle}>Config</Text>
          <Text style={styles.optionDescription}>
            Sonido, vibracion y ajustes de alarma.
          </Text>
        </Pressable>

        <Pressable
          style={styles.optionButton}
          onPress={() => router.push('/explore')}
        >
          <Text style={styles.optionTitle}>Guia</Text>
          <Text style={styles.optionDescription}>
            Como funciona la app y que cosas faltan.
          </Text>
        </Pressable>
      </Card>

      <Card>
        <Text style={styles.sectionLabel}>Estado del proyecto</Text>

        <Text style={styles.description}>
          La app ya permite elegir lineas reales desde GTFS, guardar un viaje,
          ver el recorrido en mapa y probar la alarma aunque no estes en Buenos
          Aires.
        </Text>
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
  optionButton: {
    backgroundColor: '#223142',
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: '#263544',
    marginTop: 10,
  },
  optionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  optionDescription: {
    color: '#B9C6D3',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  description: {
    color: '#B9C6D3',
    fontSize: 14,
    lineHeight: 21,
  },
});