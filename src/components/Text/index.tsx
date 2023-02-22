import React from 'react';
import txt from '@assets/flag.txt';

function Text() {
    return (
        <div className="h-full w-full max-w-screen-xl scale-100 rounded bg-white p-6 shadow-lg">
            <pre>{txt}</pre>
        </div>
    );
}

export default Text;
