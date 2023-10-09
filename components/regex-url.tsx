import React from 'react';

function RegExURL({ inputURL }: any) {
    const regex = /^(https?:\/\/)?([\w.-]+)/;
    const match = inputURL.match(regex);

    let protocolAndDomain = inputURL;
    let restOfURL = '';

    if (match && match[0]) {
        protocolAndDomain = match[0];
        restOfURL = inputURL.replace(protocolAndDomain, '');
    }

    return (
        <div className="flex">
            <span className="text-white">{protocolAndDomain}</span>
            <span className="text-gray-500">{restOfURL}</span>
        </div>
    );
}

export default RegExURL;
