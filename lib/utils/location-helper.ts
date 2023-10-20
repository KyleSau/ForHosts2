export default function randomizeLocation(lat: number, lng: number) {
    const mileInDegreesLat = 1 / 69;
    const mileInDegreesLng = 1 / (69 * Math.abs(Math.cos(lat * (Math.PI / 180))));

    // Function to get a random value between a range
    function getRandomBetween(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    // Function to get a random sign, either +1 or -1
    function getRandomSign() {
        return Math.random() < 0.5 ? -1 : 1;
    }

    // Randomize latitude
    const randomLatShift = getRandomBetween(mileInDegreesLat / 2, mileInDegreesLat) * getRandomSign();
    const newLat = lat + randomLatShift;

    // Randomize longitude
    const randomLngShift = getRandomBetween(mileInDegreesLng / 2, mileInDegreesLng) * getRandomSign();
    const newLng = lng + randomLngShift;

    return { newLat, newLng };
}
