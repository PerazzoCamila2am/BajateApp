const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { parse } = require('csv-parse/sync');

const RAW_GTFS_PATH = path.join(
  process.cwd(),
  'data',
  'gtfs',
  'raw',
  'buenos-aires-gtfs.zip'
);

const OUTPUT_PATH = path.join(
  process.cwd(),
  'data',
  'transit',
  'buenosAiresSample.ts'
);

const MAX_ROUTES = 12;
const MAX_SHAPE_POINTS = 300;

function main() {
  if (!fs.existsSync(RAW_GTFS_PATH)) {
    console.error('\nNo se encontró el archivo GTFS.');
    console.error('Guardalo en esta ruta:');
    console.error(RAW_GTFS_PATH);
    process.exit(1);
  }

  console.log('Leyendo GTFS de Buenos Aires...');

  const zip = new AdmZip(RAW_GTFS_PATH);

  const routes = readCsvFromZip(zip, 'routes.txt');
  const trips = readCsvFromZip(zip, 'trips.txt');
  const stops = readCsvFromZip(zip, 'stops.txt');
  const stopTimes = readCsvFromZip(zip, 'stop_times.txt');
  const shapes = readOptionalCsvFromZip(zip, 'shapes.txt');

  console.log(`routes.txt: ${routes.length} filas`);
  console.log(`trips.txt: ${trips.length} filas`);
  console.log(`stops.txt: ${stops.length} filas`);
  console.log(`stop_times.txt: ${stopTimes.length} filas`);
  console.log(`shapes.txt: ${shapes.length} filas`);

  const selectedRoutes = selectRoutes(routes);
  const selectedRouteIds = new Set(selectedRoutes.map((route) => route.route_id));

  const tripsByRouteId = groupTripsByRouteId(trips, selectedRouteIds);
  const selectedTripIds = new Set();

  const directionsByRouteId = new Map();

  selectedRoutes.forEach((route) => {
    const routeTrips = tripsByRouteId.get(route.route_id) ?? [];
    const directions = pickTripsByDirection(routeTrips);

    directionsByRouteId.set(route.route_id, directions);

    directions.forEach((trip) => {
      selectedTripIds.add(trip.trip_id);
    });
  });

  const stopsById = new Map(
    stops.map((stop) => [
      stop.stop_id,
      {
        id: stop.stop_id,
        name: stop.stop_name || 'Parada sin nombre',
        latitude: Number(stop.stop_lat),
        longitude: Number(stop.stop_lon),
      },
    ])
  );

  const stopTimesByTripId = groupStopTimesByTripId(stopTimes, selectedTripIds);
  const shapesById = groupShapesById(shapes);

  const processedRoutes = selectedRoutes.map((route) => {
    const selectedTrips = directionsByRouteId.get(route.route_id) ?? [];

    return {
      id: route.route_id,
      shortName: route.route_short_name || route.route_id,
      longName: route.route_long_name || route.route_short_name || route.route_id,
      color: normalizeColor(route.route_color),
      textColor: normalizeColor(route.route_text_color),
      directions: selectedTrips.map((trip) => {
        const tripStopTimes = stopTimesByTripId.get(trip.trip_id) ?? [];

        const directionStops = tripStopTimes
          .sort((a, b) => Number(a.stop_sequence) - Number(b.stop_sequence))
          .map((stopTime) => {
            const stop = stopsById.get(stopTime.stop_id);

            if (!stop) {
              return null;
            }

            return {
              ...stop,
              sequence: Number(stopTime.stop_sequence),
            };
          })
          .filter(Boolean);

        const shape = getShapePoints(shapesById, trip.shape_id);

        return {
          id: trip.direction_id || '0',
          name:
            trip.trip_headsign ||
            `Sentido ${trip.direction_id || '0'}`,
          tripId: trip.trip_id,
          stops: directionStops,
          shape,
        };
      }),
    };
  });

  writeOutput(processedRoutes);

  console.log('\nGTFS procesado correctamente.');
  console.log(`Archivo generado: ${OUTPUT_PATH}`);
  console.log(`Rutas generadas: ${processedRoutes.length}`);
}

function readCsvFromZip(zip, fileName) {
  const entry = findEntry(zip, fileName);

  if (!entry) {
    throw new Error(`No se encontró ${fileName} dentro del ZIP`);
  }

  const content = entry.getData().toString('utf8');

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });
}

function readOptionalCsvFromZip(zip, fileName) {
  const entry = findEntry(zip, fileName);

  if (!entry) {
    return [];
  }

  const content = entry.getData().toString('utf8');

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });
}

function findEntry(zip, fileName) {
  return zip
    .getEntries()
    .find(
      (entry) =>
        entry.entryName === fileName || entry.entryName.endsWith(`/${fileName}`)
    );
}

function selectRoutes(routes) {
  return routes
    .filter((route) => route.route_id)
    .sort((a, b) =>
      String(a.route_short_name || a.route_id).localeCompare(
        String(b.route_short_name || b.route_id),
        'es',
        { numeric: true }
      )
    )
    .slice(0, MAX_ROUTES);
}

function groupTripsByRouteId(trips, selectedRouteIds) {
  const map = new Map();

  trips.forEach((trip) => {
    if (!selectedRouteIds.has(trip.route_id)) {
      return;
    }

    const currentTrips = map.get(trip.route_id) ?? [];
    currentTrips.push(trip);
    map.set(trip.route_id, currentTrips);
  });

  return map;
}

function pickTripsByDirection(trips) {
  const map = new Map();

  trips.forEach((trip) => {
    const directionId = trip.direction_id || '0';

    if (!map.has(directionId)) {
      map.set(directionId, trip);
    }
  });

  return Array.from(map.values()).slice(0, 2);
}

function groupStopTimesByTripId(stopTimes, selectedTripIds) {
  const map = new Map();

  stopTimes.forEach((stopTime) => {
    if (!selectedTripIds.has(stopTime.trip_id)) {
      return;
    }

    const currentStopTimes = map.get(stopTime.trip_id) ?? [];
    currentStopTimes.push(stopTime);
    map.set(stopTime.trip_id, currentStopTimes);
  });

  return map;
}

function groupShapesById(shapes) {
  const map = new Map();

  shapes.forEach((shapePoint) => {
    const shapeId = shapePoint.shape_id;

    if (!shapeId) {
      return;
    }

    const currentShape = map.get(shapeId) ?? [];
    currentShape.push(shapePoint);
    map.set(shapeId, currentShape);
  });

  return map;
}

function getShapePoints(shapesById, shapeId) {
  if (!shapeId || !shapesById.has(shapeId)) {
    return [];
  }

  const points = shapesById
    .get(shapeId)
    .sort((a, b) => Number(a.shape_pt_sequence) - Number(b.shape_pt_sequence))
    .map((point) => ({
      latitude: Number(point.shape_pt_lat),
      longitude: Number(point.shape_pt_lon),
    }))
    .filter(
      (point) =>
        Number.isFinite(point.latitude) && Number.isFinite(point.longitude)
    );

  if (points.length <= MAX_SHAPE_POINTS) {
    return points;
  }

  const step = Math.ceil(points.length / MAX_SHAPE_POINTS);

  return points.filter((_, index) => index % step === 0);
}

function normalizeColor(color) {
  if (!color) {
    return undefined;
  }

  return `#${String(color).replace('#', '')}`;
}

function writeOutput(routes) {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

  const content = `// Archivo generado automáticamente por scripts/processGtfs.js
// No editar manualmente.

import { TransitRoute } from '../../types/transit';

export const buenosAiresSampleRoutes: TransitRoute[] = ${JSON.stringify(
    routes,
    null,
    2
  )};
`;

  fs.writeFileSync(OUTPUT_PATH, content, 'utf8');
}

main();

