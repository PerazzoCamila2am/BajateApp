import { TransitRoute } from '../../../types/transit';

export const routeDetails: TransitRoute = {
  "id": "1762",
  "shortName": "57R",
  "longName": "JNAMBA057",
  "directions": [
    {
      "id": "1762-0",
      "name": "1247 JUJUY AV. -> COLECTORA ACC. OESTE Y AV. VICTORICA - NINE",
      "tripId": "1762DI0",
      "stops": [
        {
          "id": "204416",
          "name": "1247 JUJUY AV.",
          "latitude": -34.62444,
          "longitude": -58.402009,
          "sequence": 1
        },
        {
          "id": "6560135120",
          "name": "COLECTORA ACC. OESTE Y AV. VICTORICA - NINE",
          "latitude": -34.633713,
          "longitude": -58.790739,
          "sequence": 2
        }
      ],
      "shape": []
    },
    {
      "id": "1762-1",
      "name": "3630 SAN JUAN AV. -> 2853 RIVADAVIA AV.",
      "tripId": "1762DI1",
      "stops": [
        {
          "id": "204026",
          "name": "3630 SAN JUAN AV.",
          "latitude": -34.625482,
          "longitude": -58.416596,
          "sequence": 1
        },
        {
          "id": "203175",
          "name": "3228 SAN JUAN AV.",
          "latitude": -34.624841,
          "longitude": -58.410946,
          "sequence": 2
        },
        {
          "id": "203178",
          "name": "3014 SAN JUAN AV.",
          "latitude": -34.62442,
          "longitude": -58.407387,
          "sequence": 3
        },
        {
          "id": "202742",
          "name": "2853 RIVADAVIA AV.",
          "latitude": -34.610208,
          "longitude": -58.406872,
          "sequence": 4
        }
      ],
      "shape": []
    }
  ]
};
