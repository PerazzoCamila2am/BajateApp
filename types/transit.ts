export type TransitStop = {
    id: string;
    name: string;
    latitud: number;
    longitude: number;
    sequence: number;
};

export type TransitShapePoint = {
    latitude: number;
    longitude: number;
};

export type TransitDirection = {
    id: string;
    name: string;
    tripId: string;
    stops: TransitStop[];
    shape: TransitShapePoint[];
};

export type TransitRoute = {
    id: string;
    shortName: string;
    longName: string;
    color?: string;
    textColor: string;
    directions: TransitDirection[];
};