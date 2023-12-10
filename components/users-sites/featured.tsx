import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function Featured() {
    const notableFeatureStyle = {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        paddingLeft: '8px',
        marginBottom: '20px',
    };

    const iconStyle = {
        fontSize: '24px',
        marginRight: '16px',
        color: '#555',
    };

    const contentStyle = {
        flex: 1,
    };

    return (
        <div className="col-start-1 rounded-sm mt-2 md:col-span-3 md:col-start-3">
            <div style={notableFeatureStyle}>
                <FontAwesomeIcon icon={faStar} style={iconStyle} />
                <div style={contentStyle}>
                    <h4 className="text-xl font-semibold">
                        Sylas is a Super Star
                    </h4>
                    <p className="text-gray-500">Superhosts are experienced, highly rated Hosts.</p>
                </div>
            </div>
            <div style={notableFeatureStyle}>
                <FontAwesomeIcon icon={faStar} style={iconStyle} />
                <div style={contentStyle}>
                    <h4 className="text-xl font-semibold">
                        Great location
                    </h4>
                    <p className="text-gray-500">95% of recent guests gave the location a 5-star rating.</p>
                </div>
            </div>
            <div style={notableFeatureStyle}>
                <FontAwesomeIcon icon={faStar} style={iconStyle} />
                <div style={contentStyle}>
                    <h4 className="text-xl font-semibold">
                        Great check-in experience
                    </h4>
                    <p className="text-gray-500">90% of recent guests gave the check-in process a 5-star rating.</p>
                </div>
            </div>
        </div>
    );
}