import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../components/Card';
import { demoStops } from '../../data/demoStops';
import {
  FavoriteAlert,
  loadFavoriteAlerts,
} from '../../storage/favoriteAlerts';
import { saveTripPreferences } from '../../storage/tripPreferences';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteAlert[]>([]);
  const [selectedFavoriteId, setSelectedFavoriteId] = useState<string | null>(
    null
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadFavorites() {
        const savedFavorites = await loadFavoriteAlerts();

        if (isActive) {
          setFavorites(savedFavorites);
        }
      }

      loadFavorites();

      return () => {
        isActive = false;
      };
    }, [])
  );

  async function applyFavorite(favorite: FavoriteAlert) {
  await saveTripPreferences(favorite.preferences);
  setSelectedFavoriteId(favorite.id);
}

  function getDestinationName(destinationId: number) {
    const destination = demoStops.find((stop) => stop.id === destinationId);

    return destination?.name ?? 'Destino demo';
  }

  function getFavoriteDescription(favorite: FavoriteAlert) {
    const destinationName = getDestinationName(
      favorite.preferences.selectedDestinationId
    );

    if (favorite.preferences.alertMode === 'distance') {
      return `${destinationName} · aviso a ${favorite.preferences.selectedDistance} m`;
    }

    return `${destinationName} · ${favorite.preferences.selectedStopAlert} parada(s) antes`;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.appName}>BajateApp</Text>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>
          Usá alertas rápidas para tus viajes frecuentes.
        </Text>
      </View>

      <Card>
        <Text style={styles.label}>Cómo funciona</Text>
        <Text style={styles.description}>
          Tocá “Usar alerta” para aplicar esa configuración. Después volvé a
          Viaje y vas a ver el destino y aviso seleccionados.
        </Text>
      </Card>

      {selectedFavoriteId && (
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>Alerta aplicada</Text>
          <Text style={styles.successText}>
            Volvé a la pestaña Viaje para iniciar la simulación con esta
            configuración.
          </Text>
        </View>
      )}

      {favorites.map((favorite) => {
        const isSelected = selectedFavoriteId === favorite.id;

        return (
          <Card key={favorite.id}>
            <View style={styles.favoriteHeader}>
              <View style={styles.favoriteIcon}>
                <Text style={styles.favoriteIconText}>⭐</Text>
              </View>

              <View style={styles.favoriteContent}>
                <Text style={styles.favoriteTitle}>{favorite.name}</Text>
                <Text style={styles.favoriteDescription}>
                  {getFavoriteDescription(favorite)}
                </Text>
              </View>
            </View>

            <View style={styles.detailsBox}>
              <Text style={styles.detailText}>
                Destino: {getDestinationName(favorite.preferences.selectedDestinationId)}
              </Text>

              <Text style={styles.detailText}>
                Modo:{' '}
                {favorite.preferences.alertMode === 'distance'
                  ? 'Distancia'
                  : 'Paradas'}
              </Text>

              {favorite.preferences.alertMode === 'distance' ? (
                <Text style={styles.detailText}>
                  Aviso: {favorite.preferences.selectedDistance} m
                </Text>
              ) : (
                <Text style={styles.detailText}>
                  Aviso: {favorite.preferences.selectedStopAlert} parada(s)
                  antes
                </Text>
              )}
            </View>

            <Pressable
              style={[styles.primaryButton, isSelected && styles.selectedButton]}
              onPress={() => applyFavorite(favorite)}
            >
              <Text style={styles.primaryButtonText}>
                {isSelected ? 'Alerta aplicada' : 'Usar alerta'}
              </Text>
            </Pressable>
          </Card>
        );
      })}

      <Card>
        <Text style={styles.label}>Próxima mejora</Text>
        <Text style={styles.description}>
          Más adelante podemos agregar un botón para crear favoritos nuevos desde
          la configuración actual del viaje.
        </Text>
      </Card>
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
  },
  successCard: {
    backgroundColor: '#123326',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#5DE2A3',
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  successText: {
    color: '#B8C2CC',
    fontSize: 15,
    lineHeight: 22,
  },
  favoriteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favoriteIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#223142',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIconText: {
    fontSize: 22,
  },
  favoriteContent: {
    flex: 1,
  },
  favoriteTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  favoriteDescription: {
    color: '#B8C2CC',
    fontSize: 14,
    marginTop: 4,
  },
  detailsBox: {
    backgroundColor: '#101820',
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    gap: 6,
  },
  detailText: {
    color: '#DCE6F0',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#5DE2A3',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 14,
  },
  selectedButton: {
    opacity: 0.75,
  },
  primaryButtonText: {
    color: '#101820',
    fontSize: 15,
    fontWeight: '800',
  },
});