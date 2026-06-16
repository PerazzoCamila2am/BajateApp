type Coordinates = {
    latitude: number;
    longitude: number;
};

export function calculateDistanceInMeters(
    origin: Coordinates,
    destination: Coordinates
) {
    const earthRadiusInMeters = 6371000;

    const originLatitude = toRadians(origin.latitude);
    const destinationLatitude = toRadians(destination.latitude);

    const latitudeDifference = toRadians(
        destination.latitude - origin.latitude
    );

    const longitudeDifference = toRadians(
        destination.longitude - origin.longitude
    );

    const haversineValue =
    Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
    Math.cos(originLatitude) * 
    Math.cos(destinationLatitude) * 
    Math.sin(longitudeDifference / 2) * 
    Math.sin(longitudeDifference / 2);

    const centralAngle = 
    2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue));

    return Math.round(earthRadiusInMeters * centralAngle);
}

function toRadians(value: number) {
    return (value * Math.PI) / 180;
}