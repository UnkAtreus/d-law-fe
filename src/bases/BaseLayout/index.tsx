import React from 'react';

function BaseLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div>layout</div>
            {children}
        </div>
    );
}

export default BaseLayout;
