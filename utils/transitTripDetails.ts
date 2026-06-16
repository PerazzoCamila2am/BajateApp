import { SelectedTransitTrip } from '../storage/selectedTransitTrip';
import { TransitDirection, TransitRoute, TransitStop } from '../types/transit';

export type TransitTripDetails = {
  selectedRoute: TransitRoute;
  selectedDirection: TransitDirection;
  destinationStop: TransitStop;
  destinationStopIndex: number;
  alertStop: TransitStop;
  alertStopIndex: number;
  alertDistanceInMeters: number;
};

export function getTransitTripDetails(
  selectedTrip: SelectedTransitTrip | null,
  selectedRoute: TransitRoute | null
): TransitTripDetails | null {
  if (!selectedTrip || !selectedRoute) {
    return null;
  }

  const selectedDirection =
    selectedRoute.directions.find(
      (direction) => direction.id === selectedTrip.directionId
    ) ?? null;

  if (!selectedDirection) {
    return null;
  }

  const destinationStop =
    selectedDirection.stops.find(
      (stop) => stop.id === selectedTrip.destinationStopId
    ) ?? null;

  if (!destinationStop) {
    return null;
  }

  const destinationStopIndex = selectedDirection.stops.findIndex(
    (stop) => stop.id === destinationStop.id
  );

  if (destinationStopIndex < 0) {
    return null;
  }

  let alertStopIndex = destinationStopIndex;
  let alertDistanceInMeters = selectedTrip.selectedDistance;

  if (selectedTrip.alertMode === 'stops') {
    alertStopIndex = Math.max(
      destinationStopIndex - selectedTrip.selectedStopAlert,
      0
    );

    alertDistanceInMeters = 120;
  }

  const alertStop = selectedDirection.stops[alertStopIndex] ?? null;

  if (!alertStop) {
    return null;
  }

  return {
    selectedRoute,
    selectedDirection,
    destinationStop,
    destinationStopIndex,
    alertStop,
    alertStopIndex,
    alertDistanceInMeters,
  };
}

export function getStopsWindow(
  selectedDirection: TransitDirection,
  alertStopIndex: number,
  destinationStopIndex: number
) {
  return selectedDirection.stops.slice(
    Math.max(alertStopIndex - 2, 0),
    Math.min(destinationStopIndex + 1, selectedDirection.stops.length)
  );
}