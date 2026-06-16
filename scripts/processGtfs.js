/* global __dirname */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { parse } = require('csv-parse/sync');

const GTFS_ZIP_PATH = path.join(
  __dirname,
  '..',
  'data',
  'gtfs',
  'raw',
  'buenos-aires-gtfs.zip'
);

const TRANSIT_DIR = path.join(__dirname, '..', 'data', 'transit');
const ROUTE_DETAILS_DIR = path.join(TRANSIT_DIR, 'routeDetails');

const ROUTE_INDEX_OUTPUT_PATH = path.join(
  TRANSIT_DIR,
  'buenosAiresRouteIndex.ts'
);

const ROUTE_LOADER_OUTPUT_PATH = path.join(
  TRANSIT_DIR,
  'loadBuenosAiresRouteDetails.ts'
);

const MAX_STOPS_PER_DIRECTION = 140;

function readGtfsFile(zip, fileName) {
  const entry = zip.getEntry(fileName);

  if (!entry) {
    throw new Error(`No se encontro ${fileName} dentro del ZIP GTFS`);
  }

  const content = entry.getData().toString('utf8');

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
  });
}

function normalizeRouteName(value) {
  return String(value || '').trim();
}

function sortBySequence(a, b) {
  return Number(a.stop_sequence) - Number(b.stop_sequence);
}

function sortRoutes(a, b) {
  const routeA = normalizeRouteName(a.route_short_name);
  const routeB = normalizeRouteName(b.route_short_name);

  const numberA = Number(routeA);
  const numberB = Number(routeB);

  if (!Number.isNaN(numberA) && !Number.isNaN(numberB)) {
    return numberA - numberB;
  }

  return routeA.localeCompare(routeB, 'es', { numeric: true });
}

function limitStops(stops) {
  if (stops.length <= MAX_STOPS_PER_DIRECTION) {
    return stops;
  }

  return stops.slice(0, MAX_STOPS_PER_DIRECTION);
}

function createSafeFileName(routeId) {
  return `route_${String(routeId).replace(/[^a-zA-Z0-9_]/g, '_')}`;
}

function clearRouteDetailsDirectory() {
  fs.mkdirSync(ROUTE_DETAILS_DIR, { recursive: true });

  const files = fs.readdirSync(ROUTE_DETAILS_DIR);

  files.forEach((file) => {
    if (file.endsWith('.ts')) {
      fs.unlinkSync(path.join(ROUTE_DETAILS_DIR, file));
    }
  });
}

function buildTransitData() {
  if (!fs.existsSync(GTFS_ZIP_PATH)) {
    throw new Error(`No se encontro el archivo GTFS en: ${GTFS_ZIP_PATH}`);
  }

  const zip = new AdmZip(GTFS_ZIP_PATH);

  console.log('Leyendo GTFS...');

  const routes = readGtfsFile(zip, 'routes.txt');
  const trips = readGtfsFile(zip, 'trips.txt');
  const stops = readGtfsFile(zip, 'stops.txt');
  const stopTimes = readGtfsFile(zip, 'stop_times.txt');

  console.log(`Rutas GTFS: ${routes.length}`);
  console.log(`Trips GTFS: ${trips.length}`);
  console.log(`Paradas GTFS: ${stops.length}`);
  console.log(`Stop times GTFS: ${stopTimes.length}`);

  const stopsById = new Map();

  stops.forEach((stop) => {
    stopsById.set(stop.stop_id, stop);
  });

  const stopTimesByTripId = new Map();

  stopTimes.forEach((stopTime) => {
    const tripId = stopTime.trip_id;

    if (!stopTimesByTripId.has(tripId)) {
      stopTimesByTripId.set(tripId, []);
    }

    stopTimesByTripId.get(tripId).push(stopTime);
  });

  for (const tripStopTimes of stopTimesByTripId.values()) {
    tripStopTimes.sort(sortBySequence);
  }

  const tripsByRouteId = new Map();

  trips.forEach((trip) => {
    const routeId = trip.route_id;

    if (!tripsByRouteId.has(routeId)) {
      tripsByRouteId.set(routeId, []);
    }

    tripsByRouteId.get(routeId).push(trip);
  });

  const sortedRoutes = routes.slice().sort(sortRoutes);
  const transitRoutes = [];

  sortedRoutes.forEach((route) => {
    const routeTrips = tripsByRouteId.get(route.route_id) ?? [];

    if (routeTrips.length === 0) {
      return;
    }

    const tripsByDirection = new Map();

    routeTrips.forEach((trip) => {
      const directionId = trip.direction_id || '0';

      if (!tripsByDirection.has(directionId)) {
        tripsByDirection.set(directionId, []);
      }

      tripsByDirection.get(directionId).push(trip);
    });

    const directions = [];

    Array.from(tripsByDirection.entries())
      .sort(([directionA], [directionB]) => {
        return String(directionA).localeCompare(String(directionB));
      })
      .forEach(([directionId, directionTrips]) => {
        const selectedTrip = directionTrips.find((trip) => {
          const tripStopTimes = stopTimesByTripId.get(trip.trip_id) ?? [];
          return tripStopTimes.length > 1;
        });

        if (!selectedTrip) {
          return;
        }

        const tripStopTimes = stopTimesByTripId.get(selectedTrip.trip_id) ?? [];

        const directionStops = tripStopTimes
          .map((stopTime, index) => {
            const stop = stopsById.get(stopTime.stop_id);

            if (!stop) {
              return null;
            }

            return {
              id: stop.stop_id,
              name: stop.stop_name || `Parada ${index + 1}`,
              latitude: Number(stop.stop_lat),
              longitude: Number(stop.stop_lon),
              sequence: index + 1,
            };
          })
          .filter((stop) => {
            return (
              stop &&
              Number.isFinite(stop.latitude) &&
              Number.isFinite(stop.longitude)
            );
          });

        const limitedStops = limitStops(directionStops);

        if (limitedStops.length < 2) {
          return;
        }

        const firstStop = limitedStops[0];
        const lastStop = limitedStops[limitedStops.length - 1];

        directions.push({
          id: `${route.route_id}-${directionId}`,
          name: `${firstStop.name} -> ${lastStop.name}`,
          tripId: selectedTrip.trip_id,
          stops: limitedStops,
          shape: [],
        });
      });

    if (directions.length === 0) {
      return;
    }

    transitRoutes.push({
      id: route.route_id,
      shortName: normalizeRouteName(route.route_short_name),
      longName: normalizeRouteName(route.route_long_name),
      color: route.route_color || undefined,
      textColor: route.route_text_color || undefined,
      directions,
    });
  });

  return transitRoutes;
}

function writeRouteIndexFile(transitRoutes) {
  const routeIndex = transitRoutes.map((route) => {
    return {
      id: route.id,
      shortName: route.shortName,
      longName: route.longName,
      color: route.color,
      textColor: route.textColor,
      directionCount: route.directions.length,
      stopCount: route.directions.reduce((total, direction) => {
        return total + direction.stops.length;
      }, 0),
    };
  });

  const fileContent = `export type TransitRouteIndexItem = {
  id: string;
  shortName: string;
  longName: string;
  color?: string;
  textColor?: string;
  directionCount: number;
  stopCount: number;
};

export const buenosAiresRouteIndex: TransitRouteIndexItem[] = ${JSON.stringify(
    routeIndex,
    null,
    2
  )};
`;

  fs.writeFileSync(ROUTE_INDEX_OUTPUT_PATH, fileContent, 'utf8');
}

function writeRouteDetailFiles(transitRoutes) {
  transitRoutes.forEach((route) => {
    const fileName = createSafeFileName(route.id);
    const outputPath = path.join(ROUTE_DETAILS_DIR, `${fileName}.ts`);

    const fileContent = `import { TransitRoute } from '../../../types/transit';

export const routeDetails: TransitRoute = ${JSON.stringify(route, null, 2)};
`;

    fs.writeFileSync(outputPath, fileContent, 'utf8');
  });
}

function writeRouteLoaderFile(transitRoutes) {
  const cases = transitRoutes
    .map((route) => {
      const fileName = createSafeFileName(route.id);

      return `    case ${JSON.stringify(route.id)}:
      return (await import('./routeDetails/${fileName}')).routeDetails;`;
    })
    .join('\n\n');

  const fileContent = `import { TransitRoute } from '../../types/transit';

export async function loadBuenosAiresRouteDetails(
  routeId: string
): Promise<TransitRoute | null> {
  switch (routeId) {
${cases}

    default:
      return null;
  }
}
`;

  fs.writeFileSync(ROUTE_LOADER_OUTPUT_PATH, fileContent, 'utf8');
}

try {
  fs.mkdirSync(TRANSIT_DIR, { recursive: true });
  clearRouteDetailsDirectory();

  const transitRoutes = buildTransitData();

  writeRouteIndexFile(transitRoutes);
  writeRouteDetailFiles(transitRoutes);
  writeRouteLoaderFile(transitRoutes);

  console.log('');
  console.log('GTFS procesado correctamente.');
  console.log(`Lineas generadas: ${transitRoutes.length}`);
  console.log(`Maximo de paradas por sentido: ${MAX_STOPS_PER_DIRECTION}`);
  console.log(`Indice generado: ${ROUTE_INDEX_OUTPUT_PATH}`);
  console.log(`Loader generado: ${ROUTE_LOADER_OUTPUT_PATH}`);
  console.log(`Detalles generados en: ${ROUTE_DETAILS_DIR}`);

  if (transitRoutes.length > 0) {
    console.log('');
    console.log('Primeras lineas generadas:');

    transitRoutes.slice(0, 10).forEach((route) => {
      console.log(`- ${route.shortName} ${route.longName}`.trim());
    });
  }
} catch (error) {
  console.error('');
  console.error('Error procesando GTFS:');
  console.error(error);
  process.exit(1);
}