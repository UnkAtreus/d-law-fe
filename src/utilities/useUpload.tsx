import { useState } from 'react';
import { FileTypeIcons } from '.';
import {
    RiCheckboxCircleFill,
    RiLoader5Line,
    RiCloseCircleFill,
} from 'react-icons/ri';
import { Progress, Tooltip, Upload } from 'antd';
import FileServicePath from '@services/FileService';
import { fetcher } from '@services/useRequest';

function useUpload() {
    const [fileLists, setFileLists] = useState<any>([]);
    const [progress, setProgress] = useState<{
        [x: string]: {
            name: string;
            progress: number;
        };
    }>({});

    const handleUpload = async (
        file: any,
        token: string | null,
        path: string
    ): Promise<string> => {
        const uid = file.name;

        const name = file.name;
        setFileLists((prev: any) => [...prev, file]);

        const fmData = new FormData();

        fmData.append('file', file);
        fmData.append('folderId', path);
        const config = {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            onReqProgress: function (ev: ProgressEvent) {
                const { loaded, total } = ev;
                const percent = Math.floor((loaded / total) * 100);
                setProgress((prev) => {
                    return {
                        ...prev,
                        [uid]: {
                            name,
                            progress: percent,
                        },
                    };
                });
            },
            data: fmData,
        };

        try {
            const { data } = await fetcher(
                FileServicePath.UPLOAD_FILE,
                'POST',
                config
            );
            console.log('🚀 ~ useUpload ~ data:', data);

            return data;
        } catch (err: any) {
            console.log('Error: ', err);
            return '';
        }
    };

    const Render: any = () => {
        return (
            <div className="float-right mb-4  w-80  rounded border border-solid border-primary/70 bg-white px-2 py-2">
                <div className="mt-2 ml-4">
                    อัพโหลดทั้งหมด {fileLists.length} รายการ
                </div>
                <div className="max-h-96 overflow-y-auto py-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-md">
                    <Upload
                        customRequest={({ onSuccess }) => {
                            setTimeout(() => {
                                if (onSuccess) onSuccess('ok');
                            }, 0);
                        }}
                        fileList={fileLists}
                        itemRender={(_, file, _fileList) => {
                            const fileType = file.type?.split('/')[0] || '';
                            const uid = file.name;

                            return (
                                <div className="relative  mt-1 flex items-center rounded px-4 py-2 transition hover:bg-primary/10">
                                    <span role="img" className="mr-2 ">
                                        {RenderIconUploadType(fileType)}
                                    </span>
                                    <Tooltip title={file.name}>
                                        <div
                                            className={`mb-2  flex-1  overflow-hidden text-ellipsis line-clamp-1`}
                                        >
                                            {file.name}
                                        </div>
                                    </Tooltip>

                                    <div className="absolute -bottom-2 left-10 z-10 w-[calc(100%-64px)]">
                                        <Progress
                                            percent={
                                                progress[uid] &&
                                                progress[uid].progress
                                            }
                                            strokeWidth={2}
                                            showInfo={false}
                                        />
                                    </div>
                                    {/* <span className="ml-2">
                                    {RenderUploadStatus(
                                        progress[file.uid] &&
                                            progress[file.uid].status
                                    )}
                                </span> */}
                                </div>
                            );
                        }}
                    ></Upload>
                </div>
            </div>
        );
    };

    return { Render, handleUpload };
}

function RenderIconUploadType(fileType: string) {
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

function RenderUploadStatus(status: string) {
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

export default useUpload;
