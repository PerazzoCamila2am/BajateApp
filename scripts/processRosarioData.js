/* global __dirname */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { parse } = require('csv-parse/sync');

const ROSARIO_RAW_DIR = path.join(__dirname, '..', 'data', 'rosario', 'raw');
const ROSARIO_EXTRACTED_DIR = path.join(ROSARIO_RAW_DIR, 'extracted');

const PARADAS_ZIP_PATH = path.join(
  ROSARIO_RAW_DIR,
  'Paradas del Transporte Urbano de Pasajeros.zip'
);

const RAMALES_CSV_PATH = path.join(
  ROSARIO_EXTRACTED_DIR,
  'Ramales del Transporte público de pasajeros.csv'
);

const TRANSIT_DIR = path.join(__dirname, '..', 'data', 'transit');
const ROUTE_DETAILS_DIR = path.join(TRANSIT_DIR, 'rosarioRouteDetails');

const ROUTE_INDEX_OUTPUT_PATH = path.join(
  TRANSIT_DIR,
  'rosarioRouteIndex.ts'
);

const ROUTE_LOADER_OUTPUT_PATH = path.join(
  TRANSIT_DIR,
  'loadRosarioRouteDetails.ts'
);

function readCsvFile(filePath, delimiter) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`No se encontro el archivo: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf8');

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    delimiter,
    relax_column_count: true,
    relax_quotes: true,
    trim: true,
  });
}

function readParadasFromZip() {
  if (!fs.existsSync(PARADAS_ZIP_PATH)) {
    throw new Error(`No se encontro el ZIP de paradas: ${PARADAS_ZIP_PATH}`);
  }

  const zip = new AdmZip(PARADAS_ZIP_PATH);
  const csvEntry = zip
    .getEntries()
    .find((entry) => entry.entryName.toLowerCase().endsWith('.csv'));

  if (!csvEntry) {
    throw new Error('No se encontro ningun CSV dentro del ZIP de paradas.');
  }

  const content = csvEntry.getData().toString('utf8');

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    delimiter: ',',
    relax_column_count: true,
    relax_quotes: true,
    trim: true,
  });
}

function normalizeValue(value) {
  const normalizedValue = String(value ?? '').trim();

  if (!normalizedValue || normalizedValue.toUpperCase() === 'NULL') {
    return '';
  }

  return normalizedValue;
}

function normalizeRamalId(value) {
  return normalizeValue(value);
}

function normalizeSentido(value) {
  const sentido = normalizeValue(value).toUpperCase();

  if (sentido === 'I') {
    return 'ida';
  }

  if (sentido === 'V') {
    return 'vuelta';
  }

  return sentido.toLowerCase() || 'sin-sentido';
}

function getSentidoLabel(sentido) {
  if (sentido === 'ida') {
    return 'Ida';
  }

  if (sentido === 'vuelta') {
    return 'Vuelta';
  }

  return 'Sentido';
}

function toNumber(value) {
  const number = Number(String(value ?? '').replace(',', '.'));

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

function sortByLineAndRamal(a, b) {
  const lineA = normalizeValue(a.linea);
  const lineB = normalizeValue(b.linea);

  const numberA = Number(lineA);
  const numberB = Number(lineB);

  if (!Number.isNaN(numberA) && !Number.isNaN(numberB)) {
    if (numberA !== numberB) {
      return numberA - numberB;
    }
  } else {
    const lineCompare = lineA.localeCompare(lineB, 'es', { numeric: true });

    if (lineCompare !== 0) {
      return lineCompare;
    }
  }

  return normalizeValue(a.ramal).localeCompare(normalizeValue(b.ramal), 'es', {
    numeric: true,
  });
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

function buildStopName(parada) {
  const smsCode = normalizeValue(parada.COD_SMS);
  const stopCode = normalizeValue(parada.PARADA);
  const distrito = normalizeValue(parada.DISTRITO);

  if (smsCode) {
    return `Parada ${smsCode}`;
  }

  if (stopCode) {
    return `Parada ${stopCode}`;
  }

  if (distrito) {
    return `Parada ${distrito}`;
  }

  return 'Parada sin nombre';
}

function buildTransitData() {
  console.log('Leyendo datos de Rosario...');

  const ramales = readCsvFile(RAMALES_CSV_PATH, ';').filter((ramal) => {
    return normalizeValue(ramal.id_ramal) && normalizeValue(ramal.linea);
  });

  const paradas = readParadasFromZip();

  console.log(`Ramales: ${ramales.length}`);
  console.log(`Paradas: ${paradas.length}`);

  const paradasByRamalAndSentido = new Map();

  paradas.forEach((parada) => {
    const ramalId = normalizeRamalId(parada.RAMAL);
    const sentido = normalizeSentido(parada.SENTIDO);

    const longitude = toNumber(parada.PUNTO_X);
    const latitude = toNumber(parada.PUNTO_Y);

    if (!ramalId || !sentido || latitude === null || longitude === null) {
      return;
    }

    const key = `${ramalId}-${sentido}`;

    if (!paradasByRamalAndSentido.has(key)) {
      paradasByRamalAndSentido.set(key, []);
    }

    paradasByRamalAndSentido.get(key).push({
      raw: parada,
      latitude,
      longitude,
      order: toNumber(parada.ORDEN) ?? 0,
    });
  });

  const transitRoutes = [];

  ramales.slice().sort(sortByLineAndRamal).forEach((ramal) => {
    const ramalId = normalizeRamalId(ramal.id_ramal);
    const lineName = normalizeValue(ramal.linea);
    const branchName = normalizeValue(ramal.ramal);
    const description = normalizeValue(ramal.desclinearamal);

    const routeId = `rosario-${ramalId}`;
    const directions = [];

    ['ida', 'vuelta'].forEach((sentido) => {
      const key = `${ramalId}-${sentido}`;
      const stopsForDirection = paradasByRamalAndSentido.get(key) ?? [];

      const sortedStops = stopsForDirection
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((item, index) => {
          const smsCode = normalizeValue(item.raw.COD_SMS);
          const stopCode = normalizeValue(item.raw.PARADA);
          const rowId = normalizeValue(item.raw.SE_ROW_ID);

          return {
            id:
              rowId ||
              `${routeId}-${sentido}-${smsCode || stopCode || index + 1}`,
            name: buildStopName(item.raw),
            latitude: item.latitude,
            longitude: item.longitude,
            sequence: index + 1,
          };
        });

      if (sortedStops.length < 2) {
        return;
      }

      const firstStop = sortedStops[0];
      const lastStop = sortedStops[sortedStops.length - 1];

      directions.push({
        id: `${routeId}-${sentido}`,
        name: `${getSentidoLabel(sentido)}: ${firstStop.name} -> ${lastStop.name}`,
        tripId: `${routeId}-${sentido}`,
        stops: sortedStops,
        shape: [],
      });
    });

    if (directions.length === 0) {
      return;
    }

    transitRoutes.push({
      id: routeId,
      shortName: lineName,
      longName: [branchName, description].filter(Boolean).join(' - '),
      color: undefined,
      textColor: undefined,
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

  const fileContent = `export type RosarioRouteIndexItem = {
  id: string;
  shortName: string;
  longName: string;
  color?: string;
  textColor?: string;
  directionCount: number;
  stopCount: number;
};

export const rosarioRouteIndex: RosarioRouteIndexItem[] = ${JSON.stringify(
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
      return (await import('./rosarioRouteDetails/${fileName}')).routeDetails;`;
    })
    .join('\n\n');

  const fileContent = `import { TransitRoute } from '../../types/transit';

export async function loadRosarioRouteDetails(
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
  console.log('Datos de Rosario procesados correctamente.');
  console.log(`Lineas/ramales generados: ${transitRoutes.length}`);
  console.log(`Indice generado: ${ROUTE_INDEX_OUTPUT_PATH}`);
  console.log(`Loader generado: ${ROUTE_LOADER_OUTPUT_PATH}`);
  console.log(`Detalles generados en: ${ROUTE_DETAILS_DIR}`);

  console.log('');
  console.log('Primeras lineas generadas:');
  transitRoutes.slice(0, 10).forEach((route) => {
    console.log(`- ${route.shortName} ${route.longName}`.trim());
  });
} catch (error) {
  console.error('');
  console.error('Error procesando datos de Rosario:');
  console.error(error);
  process.exit(1);
}