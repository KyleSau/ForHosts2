export default function approximateLocation(lat: number, lng: number, maxOffsetInKm: number) {
    const latRadian = lat * (Math.PI / 180);
    const lngRadian = lng * (Math.PI / 180);
    const earthRadius = 6371;
    const randomDirection = Math.random() * 2 * Math.PI;
    const randomDistance = Math.random() * maxOffsetInKm;
    const deltaLat = (randomDistance / earthRadius) * (180 / Math.PI) / Math.cos(latRadian);
    const deltaLng = (randomDistance / earthRadius) * (180 / Math.PI) / Math.cos(lngRadian);
    const newLat = lat + deltaLat * Math.sin(randomDirection);
    const newLng = lng + deltaLng * Math.cos(randomDirection);

    return { lat: newLat, lng: newLng };
}