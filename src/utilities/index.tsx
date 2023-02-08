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
} from 'react-icons/ri';

export function changeNumberTo1k(number: string): string {
    const num = Number(number);
    if (num > 1000) {
        return `${(num / 1000).toFixed(1)}k`;
    } else {
        return number;
    }
}

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
