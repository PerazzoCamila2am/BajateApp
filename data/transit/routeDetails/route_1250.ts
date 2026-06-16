import { TransitRoute } from '../../../types/transit';

export const routeDetails: TransitRoute = {
  "id": "1250",
  "shortName": "195I",
  "longName": "JNAMBA195",
  "directions": [
    {
      "id": "1250-0",
      "name": "112 BRASIL AV. -> AVENIDA 44_CALLE 6",
      "tripId": "1250HI0",
      "stops": [
        {
          "id": "2031836",
          "name": "112 BRASIL AV.",
          "latitude": -34.625187,
          "longitude": -58.366723,
          "sequence": 1
        },
        {
          "id": "6441114131",
          "name": "ROTONDA PRESIDENTE NÉSTOR KIRCHNER Y CALLE 120",
          "latitude": -34.889309,
          "longitude": -57.956885,
          "sequence": 2
        },
        {
          "id": "6441113008",
          "name": "AVENIDA 44_CALLE 6",
          "latitude": -34.909497,
          "longitude": -57.954069,
          "sequence": 3
        }
      ],
      "shape": []
    },
    {
      "id": "1250-1",
      "name": "DIAGONAL 74 Y ROTONDA 120 -> 821 GARAY JUAN DE AV.",
      "tripId": "1250HI1",
      "stops": [
        {
          "id": "6441103996",
          "name": "DIAGONAL 74 Y ROTONDA 120",
          "latitude": -34.889521,
          "longitude": -57.956438,
          "sequence": 1
        },
        {
          "id": "201478",
          "name": "373 GARAY JUAN DE AV.",
          "latitude": -34.62423,
          "longitude": -58.370763,
          "sequence": 2
        },
        {
          "id": "201490",
          "name": "621 GARAY JUAN DE AV.",
          "latitude": -34.624481,
          "longitude": -58.374402,
          "sequence": 3
        },
        {
          "id": "201501",
          "name": "821 GARAY JUAN DE AV.",
          "latitude": -34.625242,
          "longitude": -58.377082,
          "sequence": 4
        }
      ],
      "shape": []
    }
  ]
};
