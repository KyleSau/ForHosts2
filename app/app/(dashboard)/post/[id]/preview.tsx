import React from 'react';

interface PreviewComponentProps {
    children: React.ReactNode;
}

function PreviewComponent({ children }: PreviewComponentProps) {
    const style: React.CSSProperties = {
        pointerEvents: 'none', // Disable pointer events on the container
    };

    return (
        <div style={style}>
            {children}
        </div>
    );
}

export default PreviewComponent;
