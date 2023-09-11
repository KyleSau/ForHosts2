import React from 'react';

interface ListingProps {
    description: string | null;

}


const ListingDescription: React.FC<ListingProps> = ({ description }) => {
    return (
        <div className="">
            <p className="">{description}</p>
        </div>
    );
};

export default ListingDescription;
