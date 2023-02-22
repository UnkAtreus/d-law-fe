/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import MockImage from '@assets/testpic.jpg';
import { Space } from 'antd';
import { RiSubtractLine, RiZoomOutLine, RiAddLine } from 'react-icons/ri';

function Image() {
    const [zoom, setZoom] = useState(0);

    const ZOOM_SCALE = [1, 1.25, 1.5, 2, 3];
    return (
        <div className="flex h-full items-center">
            <img
                src={MockImage.src}
                alt=""
                className="transition"
                style={{
                    transform: `scale(${ZOOM_SCALE[zoom]})`,
                }}
            />

            <div className="fixed bottom-4 left-[80px] z-10 flex w-[calc(100vw-80px)] justify-center">
                <div className="rounded bg-white py-2 px-4 shadow-lg">
                    <Space>
                        <div
                            onClick={() => {
                                if (zoom > 0) {
                                    setZoom((prev) => prev - 1);
                                }
                            }}
                            className={`${
                                zoom === 0
                                    ? 'disabled-document__pagination'
                                    : 'hover-document__pagination'
                            } `}
                        >
                            <RiSubtractLine
                                className={`${
                                    zoom === 0
                                        ? 'disabled-icon-document__pagination'
                                        : 'icon-document__pagination'
                                } `}
                            />
                        </div>

                        <div
                            onClick={() => {
                                if (zoom > 0) {
                                    setZoom(0);
                                }
                            }}
                            className={`${
                                zoom > 0
                                    ? 'hover-document__pagination'
                                    : 'disabled-document__pagination'
                            } `}
                        >
                            <RiZoomOutLine
                                className={`${
                                    zoom > 0
                                        ? 'icon-document__pagination'
                                        : 'disabled-icon-document__pagination'
                                } `}
                            />
                        </div>

                        <div
                            onClick={() => {
                                if (zoom < ZOOM_SCALE.length - 1) {
                                    setZoom((prev) => prev + 1);
                                }
                            }}
                            className={`${
                                zoom === ZOOM_SCALE.length - 1
                                    ? 'disabled-document__pagination'
                                    : 'hover-document__pagination'
                            } `}
                        >
                            <RiAddLine
                                className={`${
                                    zoom === ZOOM_SCALE.length - 1
                                        ? 'disabled-icon-document__pagination'
                                        : 'icon-document__pagination'
                                } `}
                            />
                        </div>
                    </Space>
                </div>
            </div>
        </div>
    );
}

export default Image;
