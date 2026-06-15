import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAudioPlayer } from "expo-audio";
import { useFocusEffect } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";

import { Card } from "../../components/Card";
import { OptionButton } from "../../components/OptionButton";
import {
  alertDistances,
  demoStops,
  simulationStep,
  stopAlerts,
} from "../../data/demoStops";
import {
  defaultAlarmSettings,
  loadAlarmSettings,
} from "../../storage/alarmSettings";
import {
  loadTripPreferences,
  saveTripPreferences,
} from "../../storage/tripPreferences";
import {
  AlarmSettings,
  AlertMode,
  SimulationSpeed,
  TripStatus,
} from "../../types/trip";

const alarmSound = require("../../assets/sounds/alarm.mp3");

const simulationSpeedOptions: {
  label: string;
  value: SimulationSpeed;
  delay: number;
}[] = [
  { label: "Lenta", value: "slow", delay: 1500 },
  { label: "Normal", value: "normal", delay: 1000 },
  { label: "Rápida", value: "fast", delay: 500 },
];

export default function HomeScreen() {
  const alarmPlayer = useAudioPlayer(alarmSound);

  const [alertMode, setAlertMode] = useState<AlertMode>("distance");
  const [selectedDestinationId, setSelectedDestinationId] = useState(5);
  const [selectedDistance, setSelectedDistance] = useState(300);
  const [selectedStopAlert, setSelectedStopAlert] = useState(1);
  const [currentDistanceFromStart, setCurrentDistanceFromStart] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [tripStatus, setTripStatus] = useState<TripStatus>("Sin viaje activo");
  const [hasLoadedPreferences, setHasLoadedPreferences] = useState(false);

  const [alarmSettings, setAlarmSettings] =
    useState<AlarmSettings>(defaultAlarmSettings);

  const selectedDestinationIndex = useMemo(() => {
    const foundIndex = demoStops.findIndex(
      (stop) => stop.id === selectedDestinationId,
    );

    return foundIndex >= 0 ? foundIndex : 4;
  }, [selectedDestinationId]);

  const selectedDestination = demoStops[selectedDestinationIndex];

  const destinationDistance = selectedDestination.distanceFromStart;

  const remainingDistance = Math.max(
    destinationDistance - currentDistanceFromStart,
    0,
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
    0,
  );

  const alertStop = demoStops[alertStopIndex];

  const progress = Math.min(
    Math.max(currentDistanceFromStart / destinationDistance, 0),
    1,
  );

  const progressPercent = Math.round(progress * 100);

  const isAlarmActive = tripStatus === "Alarma activada";
  const isNearDestination = tripStatus === "Cerca del destino";

  const selectedSimulationSpeed = simulationSpeedOptions.find(
    (option) => option.value === alarmSettings.simulationSpeed,
  )!;

  useEffect(() => {
    let isMounted = true;

    async function loadSavedPreferences() {
      const preferences = await loadTripPreferences();

      if (!isMounted) {
        return;
      }

      if (preferences) {
        setAlertMode(preferences.alertMode);
        setSelectedDestinationId(preferences.selectedDestinationId);
        setSelectedDistance(preferences.selectedDistance);
        setSelectedStopAlert(preferences.selectedStopAlert);
        setCurrentDistanceFromStart(0);
        setTripStatus("Sin viaje activo");
      }

      setHasLoadedPreferences(true);
    }

    loadSavedPreferences();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedPreferences) {
      return;
    }

    saveTripPreferences({
      alertMode,
      selectedDestinationId,
      selectedDistance,
      selectedStopAlert,
    });
  }, [
    alertMode,
    hasLoadedPreferences,
    selectedDestinationId,
    selectedDistance,
    selectedStopAlert,
  ]);

  useFocusEffect(
  useCallback(() => {
    let isActive = true;

    async function refreshAlarmSettings() {
      const savedSettings = await loadAlarmSettings();

      if (isActive) {
        setAlarmSettings(savedSettings);
      }
    }

    refreshAlarmSettings();

    return () => {
      isActive = false;
    };
  }, [])
);

  useEffect(() => {
    if (!isSimulating) {
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentDistanceFromStart((currentDistance) => {
        const nextDistance = Math.min(
          currentDistance + simulationStep,
          destinationDistance,
        );

        const nextRemainingDistance = Math.max(
          destinationDistance - nextDistance,
          0,
        );

        const reachedDistanceAlert =
          alertMode === "distance" && nextRemainingDistance <= selectedDistance;

        const reachedStopAlert =
          alertMode === "stops" && nextDistance >= alertStop.distanceFromStart;

        if (reachedDistanceAlert || reachedStopAlert) {
          setTripStatus("Alarma activada");
          setIsSimulating(false);

          if (alarmSettings.isVibrationEnabled) {
            Vibration.vibrate([0, 500, 250, 500, 250, 800]);
          }

          if (alarmSettings.isSoundEnabled) {
            alarmPlayer.seekTo(0);
            alarmPlayer.play();
          }
        } else if (nextRemainingDistance <= selectedDistance + 200) {
          setTripStatus("Cerca del destino");
        } else if (nextDistance >= destinationDistance) {
          setTripStatus("Destino alcanzado");
          setIsSimulating(false);
        } else {
          setTripStatus("Simulando viaje");
        }

        return nextDistance;
      });
    }, selectedSimulationSpeed.delay);

    return () => clearInterval(intervalId);
  }, [
    alarmPlayer,
    alarmSettings.isSoundEnabled,
    alarmSettings.isVibrationEnabled,
    alertMode,
    alertStop.distanceFromStart,
    destinationDistance,
    isSimulating,
    selectedDistance,
    selectedSimulationSpeed.delay,
  ]);

  function selectDestination(destinationId: number) {
    if (isSimulating) {
      return;
    }

    setSelectedDestinationId(destinationId);
    setCurrentDistanceFromStart(0);
    setTripStatus("Sin viaje activo");
  }

  function startSimulation() {
    setCurrentDistanceFromStart(0);
    setTripStatus("Simulando viaje");
    setIsSimulating(true);
    Vibration.cancel();

    alarmPlayer.pause();
    alarmPlayer.seekTo(0);
  }

  function stopSimulation() {
    setIsSimulating(false);
    setCurrentDistanceFromStart(0);
    setTripStatus("Sin viaje activo");
    Vibration.cancel();

    alarmPlayer.pause();
    alarmPlayer.seekTo(0);
  }


  function getStatusMessage() {
    if (isAlarmActive && alertMode === "distance") {
      return `Te avisamos porque faltan ${selectedDistance} m o menos.`;
    }

    if (isAlarmActive && alertMode === "stops") {
      return `Te avisamos en ${alertStop.name}, ${selectedStopAlert} parada(s) antes.`;
    }

    if (isNearDestination) {
      return "Prestá atención, falta poco.";
    }

    if (isSimulating) {
      return "Estamos siguiendo tu viaje demo.";
    }

    return "Configurá tu alerta e iniciá la simulación.";
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.appName}>BajateApp</Text>
        <Text style={styles.title}>Dormite tranquilo.</Text>
        <Text style={styles.subtitle}>Te avisamos antes de llegar.</Text>
        <Text style={styles.savedText}>
          Tus preferencias se guardan automáticamente.
        </Text>
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

      <Card>
        <Text style={styles.label}>Tipo de aviso</Text>

        <View style={styles.optionsRow}>
          <OptionButton
            label="Distancia"
            selected={alertMode === "distance"}
            onPress={() => setAlertMode("distance")}
          />

          <OptionButton
            label="Paradas"
            selected={alertMode === "stops"}
            onPress={() => setAlertMode("stops")}
          />
        </View>
      </Card>

      <Card>
        <Text style={styles.label}>Destino demo</Text>

        <View style={styles.wrapRow}>
          {demoStops.slice(4).map((stop) => (
            <OptionButton
              key={stop.id}
              label={stop.name}
              selected={selectedDestinationId === stop.id}
              onPress={() => selectDestination(stop.id)}
              disabled={isSimulating}
              compact
            />
          ))}
        </View>

        <Text style={styles.selectedText}>
          Destino elegido: {selectedDestination.name} · {destinationDistance} m
        </Text>
      </Card>

      {alertMode === "distance" && (
        <Card>
          <Text style={styles.label}>Avisarme cuando falten</Text>

          <View style={styles.optionsRow}>
            {alertDistances.map((distance) => (
              <OptionButton
                key={distance}
                label={`${distance} m`}
                selected={selectedDistance === distance}
                onPress={() => setSelectedDistance(distance)}
              />
            ))}
          </View>

          <Text style={styles.selectedText}>
            Distancia elegida: {selectedDistance} m
          </Text>
        </Card>
      )}

      {alertMode === "stops" && (
        <Card>
          <Text style={styles.label}>Avisarme antes de llegar</Text>

          <View style={styles.optionsRow}>
            {stopAlerts.map((amount) => (
              <OptionButton
                key={amount}
                label={`${amount} parada${amount > 1 ? "s" : ""}`}
                selected={selectedStopAlert === amount}
                onPress={() => setSelectedStopAlert(amount)}
              />
            ))}
          </View>

          <Text style={styles.selectedText}>
            La alarma sonará en: {alertStop.name}
          </Text>
        </Card>
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
            {isSimulating ? "Simulación en curso" : "Iniciar simulación"}
          </Text>
        </Pressable>

        <Pressable style={styles.stopButton} onPress={stopSimulation}>
          <Text style={styles.stopButtonText}>Detener</Text>
        </Pressable>
      </View>

      <Card>
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
      </Card>

      <Card>
        <Text style={styles.label}>Parada actual aproximada</Text>
        <Text style={styles.stopName}>{currentStop.name}</Text>
        <Text style={styles.selectedText}>
          Recorridos: {currentDistanceFromStart} m
        </Text>
      </Card>

      <Card>
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
      </Card>

      <Card>
        <Text style={styles.label}>Recorrido demo</Text>

        {demoStops.map((stop, index) => {
          const isPast = index <= currentStopIndex;
          const isDestination = stop.id === selectedDestinationId;
          const isAlertStop = alertMode === "stops" && index === alertStopIndex;

          return (
            <View key={stop.id} style={styles.stopRow}>
              <Text style={[styles.stopDot, isPast && styles.stopDotPast]}>
                ●
              </Text>

              <Text style={styles.stopText}>
                {stop.name}
                {isAlertStop ? " · aviso" : ""}
                {isDestination ? " · destino" : ""}
              </Text>
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#101820",
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
    color: "#5DE2A3",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    color: "#B8C2CC",
    fontSize: 17,
    marginTop: 5,
  },
  savedText: {
    color: "#5DE2A3",
    fontSize: 13,
    marginTop: 8,
    fontWeight: "700",
  },
  alarmCard: {
    backgroundColor: "#3A1F1F",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#FF6B6B",
    alignItems: "center",
  },
  alarmEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  alarmTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  alarmText: {
    color: "#FFD1D1",
    fontSize: 15,
    textAlign: "center",
    marginTop: 6,
  },
  label: {
    color: "#8FA1B3",
    fontSize: 14,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  wrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  selectedText: {
    color: "#B8C2CC",
    fontSize: 14,
    marginTop: 10,
  },
  actions: {
    gap: 10,
  },
  startButton: {
    backgroundColor: "#5DE2A3",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  startButtonDisabled: {
    opacity: 0.65,
  },
  startButtonText: {
    color: "#101820",
    fontSize: 16,
    fontWeight: "800",
  },
  stopButton: {
    backgroundColor: "#263544",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  stopButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressText: {
    color: "#5DE2A3",
    fontSize: 14,
    fontWeight: "800",
  },
  bigNumber: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#263544",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 14,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#5DE2A3",
    borderRadius: 999,
  },
  stopName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  settingTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  settingDescription: {
    color: "#8FA1B3",
    fontSize: 13,
    marginTop: 4,
    maxWidth: 220,
  },
  settingDivider: {
    height: 1,
    backgroundColor: "#263544",
    marginVertical: 14,
  },
  status: {
    color: "#F6C85F",
    fontSize: 21,
    fontWeight: "800",
  },
  statusNear: {
    color: "#FFD166",
  },
  statusAlarm: {
    color: "#FF6B6B",
  },
  statusMessage: {
    color: "#B8C2CC",
    fontSize: 14,
    marginTop: 6,
  },
  stopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  stopDot: {
    color: "#425466",
    fontSize: 18,
    marginRight: 10,
  },
  stopDotPast: {
    color: "#5DE2A3",
  },
  stopText: {
    color: "#DCE6F0",
    fontSize: 15,
  },
});
