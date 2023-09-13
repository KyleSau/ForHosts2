import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faKey, faWifi, faPeopleGroup, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import React from 'react';

type HighlightsDataProps = {
    children: (highlightsData: {
        [key: string]: {
            icon: IconDefinition;
            description: string;
        };
    }) => React.ReactNode;
};

function HighlightsData({ children }: HighlightsDataProps) {
    const highlightsData = {
        "Great For Families": {
            icon: faPeopleGroup,
            description: '100% of families who stayed here recently rated it 5 stars.',
        },
        "Self Check-in": {
            icon: faKey,
            description: 'Check yourself in without the host being required.',
        },
        "Great Location": {
            icon: faLocationDot,
            description: 'Its going to be hard to beat the location of this property!',
        },
    };

    return <>{children(highlightsData)}</>;
}

export default HighlightsData;
