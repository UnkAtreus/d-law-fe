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
    media: string;
}

function Media({ type, poster, media }: IMediaProps) {
    const RenderMedia = memo(function RenderMedia() {
        const { AUDIO, VIDEO } = FileTypes;
        switch (type) {
            case VIDEO:
                return (
                    <MediaPlayer
                        src={media}
                        // poster="https://media-files.vidstack.io/poster.png"
                        controls
                    >
                        <MediaOutlet />
                    </MediaPlayer>
                );
            case AUDIO:
                return (
                    <MediaPlayer
                        src={[
                            {
                                src: media,
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
                                            เกิดข้อผิดพลาด
                                        </div>
                                        <div>
                                            ไม่สามารถเปิดตัวอย่างไฟล์เสียงหรือไฟล์วิดีโอได้
                                        </div>
                                    </div>
                                    <Space>
                                        <Button
                                            type="primary"
                                            icon={
                                                <RiDownloadFill className="icon__button mr-2 text-gray-500" />
                                            }
                                        >
                                            ดาวน์โหลด
                                        </Button>
                                        <Button>ย้อนกลับ</Button>
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
