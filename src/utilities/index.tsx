/* eslint-disable unused-imports/no-unused-vars */
import {
    RiBankCardFill,
    RiFileExcelFill,
    RiFileList2Fill,
    RiFilePdfFill,
    RiFileTextFill,
    RiFileWordFill,
    RiFolder5Fill,
    RiImage2Fill,
    RiVideoFill,
    RiFileZipFill,
    RiFileMusicFill,
    RiFilePptFill,
} from 'react-icons/ri';

export function changeNumberTo1k(number: string): string {
    const num = Number(number);
    if (num > 1000) {
        return `${(num / 1000).toFixed(1)}k`;
    } else {
        return number;
    }
}

export enum FileTypes {
    FOLDER = 'folder',
    PDF = 'pdf',
    DOC = 'word',
    XLS = 'excel',
    PTT = 'powerpoint',
    IMAGE = 'image',
    VIDEO = 'video',
    AUDIO = 'audio',
    ZIP = 'compress',
    TEXT = 'text',
    ID = 'idCard',
}

export type TFileTypes =
    | 'folder'
    | 'pdf'
    | 'word'
    | 'excel'
    | 'powerpoint'
    | 'image'
    | 'video'
    | 'audio'
    | 'compress'
    | 'text'
    | 'idCard';

export const FileTypeIcons = {
    IdCardIcon(props: any) {
        return <RiBankCardFill {...props} />;
    },
    ExcelIcon(props: any) {
        return <RiFileExcelFill {...props} />;
    },
    MoreIcon(props: any) {
        return <RiFileList2Fill {...props} />;
    },
    PdfIcon(props: any) {
        return <RiFilePdfFill {...props} />;
    },
    TextIcon(props: any) {
        return <RiFileTextFill {...props} />;
    },
    WordIcon(props: any) {
        return <RiFileWordFill {...props} />;
    },
    PowerPointIcon(props: any) {
        return <RiFilePptFill {...props} />;
    },
    FolderIcon(props: any) {
        return <RiFolder5Fill {...props} />;
    },
    ImageIcon(props: any) {
        return <RiImage2Fill {...props} />;
    },
    VideoIcon(props: any) {
        return <RiVideoFill {...props} />;
    },
    MusicIcon(props: any) {
        return <RiFileMusicFill {...props} />;
    },
    ZipIcon(props: any) {
        return <RiFileZipFill {...props} />;
    },
};

export function showFileIcon(fileType: TFileTypes, color = 'text-gray-500') {
    const { DOC, FOLDER, ID, IMAGE, AUDIO, PDF, PTT, TEXT, VIDEO, XLS, ZIP } =
        FileTypes;
    const {
        ExcelIcon,
        FolderIcon,
        IdCardIcon,
        PowerPointIcon,
        ImageIcon,
        MoreIcon,
        MusicIcon,
        PdfIcon,
        TextIcon,
        VideoIcon,
        WordIcon,
        ZipIcon,
    } = FileTypeIcons;
    switch (fileType) {
        case FOLDER:
            return <FolderIcon className={`icon ${color}`} />;
        case ID:
            return <IdCardIcon className={`icon ${color}`} />;
        case DOC:
            return <WordIcon className={`icon ${color}`} />;
        case XLS:
            return <ExcelIcon className={`icon ${color}`} />;
        case PTT:
            return <PowerPointIcon className={`icon ${color}`} />;
        case PDF:
            return <PdfIcon className={`icon ${color}`} />;
        case TEXT:
            return <TextIcon className={`icon ${color}`} />;
        case ZIP:
            return <ZipIcon className={`icon ${color}`} />;
        case VIDEO:
            return <VideoIcon className={`icon ${color}`} />;
        case IMAGE:
            return <ImageIcon className={`icon ${color}`} />;
        case AUDIO:
            return <MusicIcon className={`icon ${color}`} />;

        default:
            return <MoreIcon className={`icon ${color}`} />;
    }
}
