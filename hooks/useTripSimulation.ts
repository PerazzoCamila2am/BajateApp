import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAudioPlayer } from 'expo-audio';
import { Vibration } from 'react-native';

import { demoStops, simulationStep } from '../data/demoStops';
import { loadTripPreferences, saveTripPreferences } from '../storage/tripPreferences';
import { AlarmSettings, AlertMode, TripStatus } from '../types/trip';

const alarmSound = require('../assets/sounds/alarm.mp3');

type UseTripSimulationParams = {
  alarmSettings: AlarmSettings;
  simulationDelay: number;
};

export function useTripSimulation({
  alarmSettings,
  simulationDelay,
}: UseTripSimulationParams) {
  const alarmPlayer = useAudioPlayer(alarmSound);

  const [alertMode, setAlertMode] = useState<AlertMode>('distance');
  const [selectedDestinationId, setSelectedDestinationId] = useState(5);
  const [selectedDistance, setSelectedDistance] = useState(300);
  const [selectedStopAlert, setSelectedStopAlert] = useState(1);
  const [currentDistanceFromStart, setCurrentDistanceFromStart] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [tripStatus, setTripStatus] = useState<TripStatus>('Sin viaje activo');
  const [hasLoadedPreferences, setHasLoadedPreferences] = useState(false);

  const selectedDestinationIndex = useMemo(() => {
    const foundIndex = demoStops.findIndex(
      (stop) => stop.id === selectedDestinationId
    );

    return foundIndex >= 0 ? foundIndex : 4;
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

 useFocusEffect(
  useCallback(() => {
    let isActive = true;

    async function loadSavedPreferences() {
      const preferences = await loadTripPreferences();

      if (!isActive) {
        return;
      }

      if (preferences && !isSimulating) {
        setAlertMode(preferences.alertMode);
        setSelectedDestinationId(preferences.selectedDestinationId);
        setSelectedDistance(preferences.selectedDistance);
        setSelectedStopAlert(preferences.selectedStopAlert);
        setCurrentDistanceFromStart(0);
        setTripStatus('Sin viaje activo');
      }

      setHasLoadedPreferences(true);
    }

    loadSavedPreferences();

    return () => {
      isActive = false;
    };
  }, [isSimulating])
);

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

          if (alarmSettings.isVibrationEnabled) {
            Vibration.vibrate([0, 500, 250, 500, 250, 800]);
          }

          if (alarmSettings.isSoundEnabled) {
            alarmPlayer.seekTo(0);
            alarmPlayer.play();
          }
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
    }, simulationDelay);

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
    simulationDelay,
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
    stopAlarm();
  }

  function stopSimulation() {
    setIsSimulating(false);
    setCurrentDistanceFromStart(0);
    setTripStatus('Sin viaje activo');
    stopAlarm();
  }

  function stopAlarm() {
    Vibration.cancel();

    alarmPlayer.pause();
    alarmPlayer.seekTo(0);

    if (tripStatus === 'Alarma activada') {
      setTripStatus('Sin viaje activo');
    }
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

  return {
    alertMode,
    setAlertMode,
    selectedDestinationId,
    selectedDistance,
    setSelectedDistance,
    selectedStopAlert,
    setSelectedStopAlert,
    currentDistanceFromStart,
    isSimulating,
    tripStatus,
    selectedDestination,
    destinationDistance,
    remainingDistance,
    currentStopIndex,
    currentStop,
    alertStopIndex,
    alertStop,
    progressPercent,
    isAlarmActive,
    isNearDestination,
    selectDestination,
    startSimulation,
    stopSimulation,
    stopAlarm,
    getStatusMessage,
  };
}