


export const amenities = [
    {
        label: 'pool',
        description: 'This property has a pool'
    }
];

const Amenities = () => {
    return (
        <div>
            {/* You can use the pool SVG like this */}
            {amenities.map((amenity) => (
                <div key={amenity.label}>
                    <span>{amenity.label}</span>
                </div>
            ))}
        </div>
    );
};

export default amenities;

