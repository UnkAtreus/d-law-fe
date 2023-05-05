import React, { useEffect, useState } from 'react';

function Text({ file }: { file: string }) {
    const [text, setText] = useState('');
    useEffect(() => {
        (async () => {
            try {
                fetch(file).then(function (response) {
                    response.text().then(function (text) {
                        setText(text);
                    });
                });
            } catch (error) {
                console.log(error);
            }
        })();
    }, [file]);

    return (
        <div className="h-full w-full max-w-screen-xl scale-100 rounded bg-white p-6 shadow-lg">
            <pre>{text}</pre>
        </div>
    );
}

export default Text;
