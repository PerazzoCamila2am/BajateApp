import { TransitRoute } from '../../types/transit';

export async function loadRosarioRouteDetails(
  routeId: string
): Promise<TransitRoute | null> {
  switch (routeId) {
    case "rosario-1":
      return (await import('./rosarioRouteDetails/route_rosario_1')).routeDetails;

    case "rosario-4":
      return (await import('./rosarioRouteDetails/route_rosario_4')).routeDetails;

    case "rosario-5":
      return (await import('./rosarioRouteDetails/route_rosario_5')).routeDetails;

    case "rosario-6":
      return (await import('./rosarioRouteDetails/route_rosario_6')).routeDetails;

    case "rosario-7":
      return (await import('./rosarioRouteDetails/route_rosario_7')).routeDetails;

    case "rosario-8":
      return (await import('./rosarioRouteDetails/route_rosario_8')).routeDetails;

    case "rosario-9":
      return (await import('./rosarioRouteDetails/route_rosario_9')).routeDetails;

    case "rosario-10":
      return (await import('./rosarioRouteDetails/route_rosario_10')).routeDetails;

    case "rosario-11":
      return (await import('./rosarioRouteDetails/route_rosario_11')).routeDetails;

    case "rosario-13":
      return (await import('./rosarioRouteDetails/route_rosario_13')).routeDetails;

    case "rosario-14":
      return (await import('./rosarioRouteDetails/route_rosario_14')).routeDetails;

    case "rosario-67":
      return (await import('./rosarioRouteDetails/route_rosario_67')).routeDetails;

    case "rosario-15":
      return (await import('./rosarioRouteDetails/route_rosario_15')).routeDetails;

    case "rosario-16":
      return (await import('./rosarioRouteDetails/route_rosario_16')).routeDetails;

    case "rosario-17":
      return (await import('./rosarioRouteDetails/route_rosario_17')).routeDetails;

    case "rosario-18":
      return (await import('./rosarioRouteDetails/route_rosario_18')).routeDetails;

    case "rosario-19":
      return (await import('./rosarioRouteDetails/route_rosario_19')).routeDetails;

    case "rosario-21":
      return (await import('./rosarioRouteDetails/route_rosario_21')).routeDetails;

    case "rosario-26":
      return (await import('./rosarioRouteDetails/route_rosario_26')).routeDetails;

    case "rosario-27":
      return (await import('./rosarioRouteDetails/route_rosario_27')).routeDetails;

    case "rosario-28":
      return (await import('./rosarioRouteDetails/route_rosario_28')).routeDetails;

    case "rosario-29":
      return (await import('./rosarioRouteDetails/route_rosario_29')).routeDetails;

    case "rosario-34":
      return (await import('./rosarioRouteDetails/route_rosario_34')).routeDetails;

    case "rosario-35":
      return (await import('./rosarioRouteDetails/route_rosario_35')).routeDetails;

    case "rosario-44":
      return (await import('./rosarioRouteDetails/route_rosario_44')).routeDetails;

    case "rosario-45":
      return (await import('./rosarioRouteDetails/route_rosario_45')).routeDetails;

    case "rosario-46":
      return (await import('./rosarioRouteDetails/route_rosario_46')).routeDetails;

    case "rosario-54":
      return (await import('./rosarioRouteDetails/route_rosario_54')).routeDetails;

    case "rosario-55":
      return (await import('./rosarioRouteDetails/route_rosario_55')).routeDetails;

    case "rosario-56":
      return (await import('./rosarioRouteDetails/route_rosario_56')).routeDetails;

    case "rosario-58":
      return (await import('./rosarioRouteDetails/route_rosario_58')).routeDetails;

    case "rosario-64":
      return (await import('./rosarioRouteDetails/route_rosario_64')).routeDetails;

    case "rosario-96":
      return (await import('./rosarioRouteDetails/route_rosario_96')).routeDetails;

    case "rosario-68":
      return (await import('./rosarioRouteDetails/route_rosario_68')).routeDetails;

    default:
      return null;
  }
}
