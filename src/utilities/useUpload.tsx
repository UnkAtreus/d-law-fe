import { useState } from 'react';
import { FileTypeIcons } from '.';
import {
    RiCheckboxCircleFill,
    RiLoader5Line,
    RiCloseCircleFill,
} from 'react-icons/ri';
import { UploadFile } from 'antd';

export default function useUpload() {
    const [fileLists, setFileLists] = useState<UploadFile<any>[]>([]);

    return {
        fileLists,
        setFileLists,
    };
}

export function RenderIconUploadType(fileType: string) {
    const { ImageIcon, MoreIcon, MusicIcon, TextIcon, VideoIcon } =
        FileTypeIcons;
    switch (fileType) {
        case 'image':
            return <ImageIcon className={'icon-upload'} />;
        case 'application':
            return <TextIcon className={'icon-upload'} />;
        case 'audio':
            return <MusicIcon className={'icon-upload'} />;
        case 'video':
            return <VideoIcon className={'icon-upload'} />;
        case 'text':
            return <MoreIcon className={'icon-upload'} />;
        default:
            return <MoreIcon className={'icon-upload'} />;
    }
}

export function RenderUploadStatus(status: string) {
    switch (status) {
        case 'success':
            return (
                <RiCheckboxCircleFill className="h-4 w-4 text-emerald-500" />
            );

        case 'done':
            return (
                <RiCheckboxCircleFill className="h-4 w-4 text-emerald-500" />
            );

        case 'uploading':
            return (
                <RiLoader5Line className="h-4 w-4 animate-spin text-primary" />
            );

        case 'error':
            return <RiCloseCircleFill className="h-4 w-4 text-red-500" />;

        case 'removed':
            return <RiCloseCircleFill className="h-4 w-4 text-red-500" />;

        default:
            return (
                <RiCheckboxCircleFill className="h-4 w-4 text-emerald-500" />
            );
    }
}
