import { TransitRoute } from '../../../types/transit';

export const routeDetails: TransitRoute = {
  "id": "1249",
  "shortName": "195H",
  "longName": "JNAMBA195",
  "directions": [
    {
      "id": "1249-0",
      "name": "562 ALEM LEANDRO N. AV. -> AVENIDA 44_CALLE 6",
      "tripId": "1249DI0",
      "stops": [
        {
          "id": "206568",
          "name": "562 ALEM LEANDRO N. AV.",
          "latitude": -34.601147,
          "longitude": -58.37049,
          "sequence": 1
        },
        {
          "id": "205498",
          "name": "195 PASEO COLON AV.",
          "latitude": -34.609857,
          "longitude": -58.369488,
          "sequence": 2
        },
        {
          "id": "2031836",
          "name": "112 BRASIL AV.",
          "latitude": -34.625187,
          "longitude": -58.366723,
          "sequence": 3
        },
        {
          "id": "6441114131",
          "name": "ROTONDA PRESIDENTE NÉSTOR KIRCHNER Y CALLE 120",
          "latitude": -34.889309,
          "longitude": -57.956885,
          "sequence": 4
        },
        {
          "id": "6441113008",
          "name": "AVENIDA 44_CALLE 6",
          "latitude": -34.909497,
          "longitude": -57.954069,
          "sequence": 5
        }
      ],
      "shape": []
    },
    {
      "id": "1249-1",
      "name": "DIAGONAL 74 Y ROTONDA 120 -> 631 ALEM LEANDRO N. AV.",
      "tripId": "1249DI1",
      "stops": [
        {
          "id": "6441103996",
          "name": "DIAGONAL 74 Y ROTONDA 120",
          "latitude": -34.889521,
          "longitude": -57.956438,
          "sequence": 1
        },
        {
          "id": "205499",
          "name": "186 PASEO COLON AV.",
          "latitude": -34.609686,
          "longitude": -58.369415,
          "sequence": 2
        },
        {
          "id": "206550",
          "name": "631 ALEM LEANDRO N. AV.",
          "latitude": -34.600279,
          "longitude": -58.37062,
          "sequence": 3
        }
      ],
      "shape": []
    }
  ]
};
