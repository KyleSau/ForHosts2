"use client"
// sleepingOptions.ts
import { faBed, faCouch /* Add other FontAwesome icons as needed */ } from "@fortawesome/free-solid-svg-icons";
import { Bedroom, Bed } from './types';

export const sleepingOptions: Bedroom[] = [
    {
        name: 'Bedroom 1',
        description: 'Description for Bedroom 1',
        beds: [
            {
                name: 'Single Bed',
                icon: faBed,
            },
            {
                name: 'Single Bed',
                icon: faBed,
            },
            // Add more single beds if needed
        ],
    },
    {
        name: 'Bedroom 2',
        description: 'Description for Bedroom 2',
        beds: [
            {
                name: 'Double Bed',
                icon: faBed,
            },
            {
                name: 'Double Bed',
                icon: faBed,
            },
            // Add more double beds if needed
        ],
    },
    // Add more bedrooms if needed
    {
        name: 'Living Room',
        description: 'Description for Living Room',
        beds: [
            {
                name: 'Couch',
                icon: faCouch,
            },
        ],
    },
];
