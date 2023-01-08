import { changeNumberTo1k } from '@utilities/index';
import React, { HTMLAttributes, ReactNode, useState } from 'react';
import { FC } from 'react';

interface IBaseTag {
    items: ITag[];
    defaultTag?: string;
}
export interface ITag extends HTMLAttributes<HTMLDivElement> {
    key: string;
    name: string;
    icon: ReactNode;
    value: string;
    active?: boolean;
}

const BaseTag: FC<IBaseTag> = ({ items, defaultTag }) => {
    const [selectTag, setSelectTag] = useState<string>(defaultTag || '');
    const Tag: FC<ITag> = ({ name, icon, value, active, onClick }) => {
        return (
            <div
                onClick={onClick}
                className={`group flex w-full cursor-pointer items-center justify-between rounded bg-white px-5 py-2 transition-all duration-200 hover:bg-primary/10 ${
                    active && 'bg-primary hover:bg-primary/90'
                } `}
            >
                <div className="flex items-center space-x-2 ">
                    <div
                        className={`text-gray-400 transition-all duration-200 group-hover:text-primary ${
                            active && 'text-white group-hover:text-white'
                        }`}
                    >
                        {icon}
                    </div>
                    <div
                        className={`text-sm text-gray-500 transition-all duration-200 group-hover:text-primary ${
                            active && 'text-white group-hover:text-white'
                        }`}
                    >
                        {name}
                    </div>
                </div>
                <span
                    className={`rounded-full bg-slate-300/50 px-2 text-xs text-gray-500 transition-all duration-200 group-hover:text-primary ${
                        active && 'text-white group-hover:text-white'
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
