import React, { memo } from 'react';
import 'vidstack/styles/base.css';
// the following styles are optional - remove to go headless.
import 'vidstack/styles/ui/buttons.css';
import 'vidstack/styles/ui/sliders.css';

import { MediaOutlet, MediaPlayer } from '@vidstack/react';
import { FileTypes, TFileTypes } from '@utilities/index';
import { Button, Empty, Space } from 'antd';
import { RiDownloadFill } from 'react-icons/ri';

interface IMediaProps {
    type: TFileTypes;
    poster?: string;
}

function Media({ type, poster }: IMediaProps) {
    const RenderMedia = memo(function RenderMedia() {
        const { MUSIC, VIDEO } = FileTypes;
        switch (type) {
            case VIDEO:
                return (
                    <MediaPlayer
                        src="https://media-files.vidstack.io/720p.mp4"
                        poster="https://media-files.vidstack.io/poster.png"
                        controls
                    >
                        <MediaOutlet />
                    </MediaPlayer>
                );
            case MUSIC:
                return (
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
                );

            default:
                return (
                    <div className="round w-full max-w-screen-sm rounded-lg bg-white px-6 py-12 shadow-lg">
                        <Empty
                            description={
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <div className="text-base">
                                            ??????????????????????????????????????????
                                        </div>
                                        <div>
                                            ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                                        </div>
                                    </div>
                                    <Space>
                                        <Button
                                            type="primary"
                                            icon={
                                                <RiDownloadFill className="icon__button mr-2" />
                                            }
                                        >
                                            ???????????????????????????
                                        </Button>
                                        <Button>????????????????????????</Button>
                                    </Space>
                                </div>
                            }
                        />
                    </div>
                );
        }
    });
    return (
        <div className="flex h-full w-full max-w-screen-xl flex-col items-center justify-center px-6">
            <RenderMedia />
        </div>
    );
}

export default Media;
