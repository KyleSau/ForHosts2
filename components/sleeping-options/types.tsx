import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface Bed {
    name: string;
    icon: IconDefinition;
}

export interface Bedroom {
    name: string;
    description: string;
    beds: Bed[];
}
