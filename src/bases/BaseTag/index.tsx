import { changeNumberTo1k } from '@utilities/index';
import React, { HTMLAttributes, ReactNode, useState } from 'react';
import { FC } from 'react';

interface IBaseTag {
    items: ITag[];
    defaultTag?: string;
    onChange: (_key: string, _tag: ITag) => void;
}
export interface ITag extends HTMLAttributes<HTMLDivElement> {
    key: string;
    name: string;
    icon: ReactNode;
    value: string;
    active?: boolean;
}

const BaseTag: FC<IBaseTag> = ({ items, defaultTag, onChange }) => {
    const [selectTag, setSelectTag] = useState<string>(defaultTag || '');
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

    return (
        <div className="space-y-2">
            {items.map((tag) => {
                return (
                    <Tag
                        key={tag.key}
                        icon={tag.icon}
                        name={tag.name}
                        value={tag.value}
                        onClick={(event) => {
                            if (tag.onClick) {
                                tag.onClick(event);
                            }

                            onChange(tag.key, tag);

                            setSelectTag(tag.key);
                        }}
                        active={selectTag === tag.key}
                    />
                );
            })}
        </div>
    );
};

export default BaseTag;
