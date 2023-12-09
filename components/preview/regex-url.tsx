import React from 'react';

function RegExURL({ inputURL }: any) {
    const regex = /^(https?:\/\/)?([\w.-]+)/;
    const match = inputURL.match(regex);

    let domain = '';
    let restOfURL = '';

    if (match && match[2]) {
        domain = match[2];
        restOfURL = inputURL.replace(regex, '').trim();
    }

    return (
        <div className="flex">
            <span className="text-white">{domain}</span>
            <span className="text-zinc-400">{restOfURL}</span>
        </div>
    );
}

export default RegExURL;