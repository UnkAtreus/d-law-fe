import { TMenuFolder } from '@interfaces/index';
import { FileTypeIcons, changeNumberTo1k } from '@utilities/index';
import React, { HTMLAttributes, ReactNode, useState } from 'react';
import { FC } from 'react';

interface IBaseTag {
    items: TMenuFolder[];
    defaultTag?: string;
    onChange: (
        _key: string,
        _items: TMenuFolder,
        _tag: {
            key: string;
            name: string;
            icon: React.ReactNode;
        }
    ) => void;
}

interface Tags {
    [x: string]: {
        key: string;
        name: string;
        icon: React.ReactNode;
    };
}
export interface ITag extends HTMLAttributes<HTMLDivElement> {
    key: string;
    name: string;
    icon: ReactNode;
    value: string | number;
    active?: boolean;
}
const {
    ExcelIcon,
    FolderIcon,
    IdCardIcon,
    ImageIcon,
    MoreIcon,
    PdfIcon,
    TextIcon,
    VideoIcon,
    WordIcon,
    MusicIcon,
    ZipIcon,
    PowerPointIcon,
} = FileTypeIcons;

const tags: Tags = {
    all: {
        key: 'all',
        name: 'เอกสารทั้งหมด',
        icon: <TextIcon className="icon" />,
    },
    idCard: {
        key: 'idCard',
        name: 'สำเนาบัตรประจำตัวประชาชน',
        icon: <IdCardIcon className="icon" />,
    },
    excel: {
        key: 'excel',
        name: 'เอกสาร Excel',
        icon: <ExcelIcon className="icon" />,
    },
    powerpoint: {
        key: 'powerpoint',
        name: 'เอกสาร Powerpoint',
        icon: <PowerPointIcon className="icon" />,
    },
    pdf: {
        key: 'pdf',
        name: 'เอกสาร PDF',
        icon: <PdfIcon className="icon" />,
    },
    word: {
        key: 'word',
        name: 'เอกสาร Word',
        icon: <WordIcon className="icon" />,
    },
    image: {
        key: 'image',
        name: 'รูปภาพ',
        icon: <ImageIcon className="icon" />,
    },
    video: {
        key: 'video',
        name: 'วิดีโอ',
        icon: <VideoIcon className="icon" />,
    },
    audio: {
        key: 'audio',
        name: 'เสียง',
        icon: <MusicIcon className="icon" />,
    },
    compress: {
        key: 'compress',
        name: 'บีบอัด',
        icon: <ZipIcon className="icon" />,
    },
    text: {
        key: 'text',
        name: 'เอกสาร',
        icon: <MoreIcon className="icon" />,
    },
    etc: {
        key: 'etc',
        name: 'เอกสารอื่นๆ',
        icon: <MoreIcon className="icon" />,
    },
};

const Tag: FC<ITag> = ({ name, icon, value, active, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`group flex w-full cursor-pointer items-center justify-between rounded  px-5 py-2 transition-all duration-200  ${
                active
                    ? 'bg-primary hover:bg-primary/90'
                    : 'bg-white hover:bg-primary/10'
            }  `}
        >
            <div className="flex items-center space-x-2 ">
                <div
                    className={` transition-all duration-200  ${
                        active
                            ? 'text-white group-hover:text-white'
                            : 'text-gray-400 group-hover:text-primary'
                    }`}
                >
                    {icon}
                </div>
                <div
                    className={`text-sm transition-all duration-200 ${
                        active
                            ? 'text-white group-hover:text-white'
                            : 'text-gray-500 group-hover:text-primary'
                    }`}
                >
                    {name}
                </div>
            </div>
            <span
                className={`rounded-full bg-slate-300/50 px-2 text-xs  transition-all duration-200 ${
                    active
                        ? 'text-white group-hover:text-white'
                        : 'text-gray-500 group-hover:text-primary'
                }`}
            >
                {changeNumberTo1k(value)}
            </span>
        </div>
    );
};

const BaseTag: FC<IBaseTag> = ({ items, defaultTag = 'all', onChange }) => {
    const [selectTag, setSelectTag] = useState<string>(defaultTag);

    const total = items.reduce((total, item) => total + item.count, 0);

    return (
        <div className="space-y-2">
            <Tag
                key={'all'}
                icon={tags.all.icon}
                name={tags.all.name}
                value={total}
                onClick={() => {
                    onChange(
                        tags.all.key,
                        {
                            name: 'all',
                            id: '',
                            count: total,
                        },
                        tags.all
                    );

                    setSelectTag(tags.all.key);
                }}
                active={selectTag === tags.all.key}
            />
            {items.map((item) => {
                const tag = tags[item.name];
                if (tag && item.count > 0)
                    return (
                        <Tag
                            key={tag.key}
                            icon={tag.icon}
                            name={tag.name}
                            value={item.count}
                            onClick={() => {
                                onChange(tag.key, item, tag);
                                setSelectTag(tag.key);
                            }}
                            active={selectTag === tag.key}
                        />
                    );

                return null;
            })}
        </div>
    );
};

export default BaseTag;
