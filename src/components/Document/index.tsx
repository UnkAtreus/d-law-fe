import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Document as RenderDocument, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Divider, Input, Space } from 'antd';
import {
    RiAddLine,
    RiArrowDownSLine,
    RiArrowUpSLine,
    RiSubtractLine,
    RiZoomInLine,
    RiZoomOutLine,
} from 'react-icons/ri';
import BaseLoading from '@baseComponents/BaseLoading';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Document({ containerRef, file }: { containerRef: any; file: string }) {
    const [numPages, setNumPages] = useState<number>(0);
    const [value, setValue] = useState('1');
    const [zoom, setZoom] = useState(0);
    const [rendered, setRendered] = useState(false);

    const pdfRef = useRef<any>([]);
    const pageNumberRef = useRef<number>(1);

    const ZOOM_SCALE = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];

    const handleScroll = useCallback(() => {
        if (pdfRef.current[0]?.clientHeight) {
            const num =
                Math.round(
                    containerRef.current.scrollTop /
                        pdfRef.current[0].clientHeight
                ) + 1;

            if (num !== pageNumberRef.current && num <= numPages) {
                pageNumberRef.current = num;
                setValue(num.toString());
            }
        }
    }, [containerRef, numPages]);

    useEffect(() => {
        const div = containerRef.current;

        if (div) {
            div.addEventListener('scroll', handleScroll);
        }
        return () => {
            div.removeEventListener('scroll', handleScroll);
        };
    }, [containerRef, handleScroll]);

    return (
        <div>
            <RenderDocument
                file={file}
                onLoadSuccess={({ numPages }) => {
                    setNumPages(numPages);
                }}
                loading={<BaseLoading></BaseLoading>}
                className="space-y-6"
            >
                {Array(numPages)
                    .fill(0)
                    .map((_, i) => (
                        <Page
                            pageIndex={i}
                            scale={ZOOM_SCALE[zoom]}
                            key={i}
                            inputRef={(ref) => {
                                pdfRef.current[i] = ref;
                            }}
                            renderTextLayer={false}
                            className={`bg-transparent shadow-lg ${
                                rendered ? 'block' : 'hidden'
                            }`}
                            width={containerRef.current.clientWidth - 48}
                            loading={''}
                            onRenderSuccess={() => {
                                // console.log('onRenderSuccess', page);
                                setRendered(true);
                            }}
                        />
                    ))}

                <div className="fixed bottom-4 left-[80px] z-10 flex w-[calc(100vw-80px)] justify-center">
                    <div className="rounded bg-white py-2 px-4 shadow-lg">
                        <Space>
                            <div
                                onClick={() => {
                                    const currentPageValue = parseInt(value);
                                    if (
                                        currentPageValue <= numPages &&
                                        currentPageValue > 1
                                    ) {
                                        setValue(
                                            (currentPageValue - 1).toString()
                                        );
                                        pdfRef.current[
                                            currentPageValue - 2
                                        ].scrollIntoView();
                                    }
                                }}
                                className="hover-document__pagination"
                            >
                                <RiArrowUpSLine className="icon-document__pagination" />
                            </div>
                            <div
                                onClick={() => {
                                    const currentPageValue = parseInt(value);
                                    if (
                                        currentPageValue < numPages &&
                                        currentPageValue > 0
                                    ) {
                                        pdfRef.current[
                                            currentPageValue
                                        ].scrollIntoView();
                                    }
                                }}
                                className="hover-document__pagination"
                            >
                                <RiArrowDownSLine className="icon-document__pagination" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    value={value}
                                    size="small"
                                    className="w-10 text-center"
                                    onChange={(e) => {
                                        const { value: inputValue } = e.target;
                                        const reg = /^\d+$/;
                                        if (
                                            reg.test(inputValue) ||
                                            inputValue === ''
                                        ) {
                                            setValue(inputValue);
                                        }
                                    }}
                                    onPressEnter={() => {
                                        const currentPageValue =
                                            parseInt(value);
                                        if (
                                            currentPageValue <= numPages &&
                                            currentPageValue > 0
                                        ) {
                                            pdfRef.current[
                                                currentPageValue - 1
                                            ].scrollIntoView();
                                        } else {
                                            setValue('');
                                        }
                                    }}
                                />
                                <span>/</span>
                                <span>{numPages}</span>
                            </div>
                            <Divider type="vertical" className="mx-1" />
                            <div
                                onClick={() => {
                                    if (zoom > 0) {
                                        setRendered(false);
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
                            {zoom === 0 ? (
                                <div
                                    onClick={() => {
                                        setRendered(false);
                                        setZoom(ZOOM_SCALE.length);
                                    }}
                                    className="hover-document__pagination"
                                >
                                    <RiZoomInLine className="icon-document__pagination" />
                                </div>
                            ) : (
                                <div
                                    onClick={() => {
                                        setRendered(false);
                                        setZoom(0);
                                    }}
                                    className="hover-document__pagination"
                                >
                                    <RiZoomOutLine className="icon-document__pagination" />
                                </div>
                            )}

                            <div
                                onClick={() => {
                                    if (zoom < ZOOM_SCALE.length - 2) {
                                        setRendered(false);
                                        setZoom((prev) => prev + 1);
                                    }
                                }}
                                className={`${
                                    zoom === ZOOM_SCALE.length - 2
                                        ? 'disabled-document__pagination'
                                        : 'hover-document__pagination'
                                } `}
                            >
                                <RiAddLine
                                    className={`${
                                        zoom === ZOOM_SCALE.length - 2
                                            ? 'disabled-icon-document__pagination'
                                            : 'icon-document__pagination'
                                    } `}
                                />
                            </div>
                        </Space>
                    </div>
                </div>
            </RenderDocument>
        </div>
    );
}

export default Document;
