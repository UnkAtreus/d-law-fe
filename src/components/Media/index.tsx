import React from 'react';
import 'vidstack/styles/base.css';
// the following styles are optional - remove to go headless.
import 'vidstack/styles/ui/buttons.css';
import 'vidstack/styles/ui/sliders.css';

import { MediaOutlet, MediaPlayer } from '@vidstack/react';

function Media() {
    return (
        <div className="flex h-full w-full max-w-screen-xl flex-col items-center justify-center  px-6">
            <MediaPlayer
                src="https://media-files.vidstack.io/720p.mp4"
                poster="https://media-files.vidstack.io/poster.png"
                controls
                aspectRatio={16 / 9}
            >
                <MediaOutlet />
            </MediaPlayer>
        </div>
    );
}

export default Media;
