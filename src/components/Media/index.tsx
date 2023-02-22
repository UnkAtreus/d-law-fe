import React from 'react';
import 'vidstack/styles/base.css';
// the following styles are optional - remove to go headless.
import 'vidstack/styles/ui/buttons.css';
import 'vidstack/styles/ui/sliders.css';

import { MediaOutlet, MediaPlayer } from '@vidstack/react';
import { TFileTypes } from '@utilities/index';

interface IMediaProps {
    type: TFileTypes;
    poster?: string;
}

function Media({ type, poster }: IMediaProps) {
    return (
        <div className="flex h-full w-full max-w-screen-xl flex-col items-center justify-center px-6">
            {/* <MediaPlayer
                src="https://media-files.vidstack.io/720p.mp4"
                poster="https://media-files.vidstack.io/poster.png"
                controls
            >
                <MediaOutlet />
            </MediaPlayer> */}
            <MediaPlayer
                src={[
                    {
                        src: 'https://media-files.vidstack.io/audio.mp3',
                        type: 'audio/mpeg',
                    },
                    {
                        src: 'https://media-files.vidstack.io/audio.ogg',
                        type: 'audio/ogg',
                    },
                ]}
                controls
                className="w-96 rounded-full shadow-md"
            >
                <MediaOutlet />
            </MediaPlayer>
        </div>
    );
}

export default Media;
