import { TransitRoute } from '../../../types/transit';

export const routeDetails: TransitRoute = {
  "id": "2718",
  "shortName": "621RND12",
  "longName": "JMLMTZ621",
  "directions": [
    {
      "id": "2718-0",
      "name": "METROBUS CRISTIANÍA -> GUILLERMO MARCONI",
      "tripId": "2718DI0",
      "stops": [
        {
          "id": "6427101708",
          "name": "METROBUS CRISTIANÍA",
          "latitude": -34.708432,
          "longitude": -58.587039,
          "sequence": 1
        },
        {
          "id": "6427100101",
          "name": "GUILLERMO MARCONI",
          "latitude": -34.713708,
          "longitude": -58.592286,
          "sequence": 2
        }
      ],
      "shape": []
    },
    {
      "id": "2718-1",
      "name": "METROBUS CARLOS CASARES -> METROBUS ROMA",
      "tripId": "2718DI1",
      "stops": [
        {
          "id": "6427100591",
          "name": "METROBUS CARLOS CASARES",
          "latitude": -34.719764,
          "longitude": -58.596417,
          "sequence": 1
        },
        {
          "id": "6427100100",
          "name": "GUILLERMO MARCONI",
          "latitude": -34.713741,
          "longitude": -58.592192,
          "sequence": 2
        },
        {
          "id": "6427101707",
          "name": "METROBUS CRISTIANÍA",
          "latitude": -34.7085,
          "longitude": -58.58697,
          "sequence": 3
        },
        {
          "id": "6427100230",
          "name": "METROBUS ROMA",
          "latitude": -34.703197,
          "longitude": -58.581906,
          "sequence": 4
        }
      ],
      "shape": []
    }
  ]
};
