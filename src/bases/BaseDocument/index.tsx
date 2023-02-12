import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfFile from '@assets/testpdf.pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Divider, Input, Space } from 'antd';
import {
    RiAddLine,
    RiArrowDownSLine,
    RiArrowUpSLine,
    RiSubtractLine,
    RiZoomInLine,
} from 'react-icons/ri';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function BaseDocument({ containerRef }: { containerRef: any }) {
    const [numPages, setNumPages] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState('0');

    const pdfRef = useRef<any>([]);
    const pageNumberRef = useRef<number>(1);

    const handleScroll = useCallback(() => {
        if (pdfRef.current[0].clientHeight) {
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
            <Document
                file={pdfFile}
                onLoadSuccess={({ numPages }) => {
                    setNumPages(numPages);
                }}
                className="space-y-6"
            >
                {Array(numPages)
                    .fill(0)
                    .map((_, i) => (
                        <Page
                            pageIndex={i}
                            scale={1}
                            key={i}
                            inputRef={(ref) => {
                                pdfRef.current[i] = ref;
                            }}
                            renderTextLayer={false}
                            className={`bg-transparent shadow-lg`}
                            // width={containerRef.current.clientWidth - 48}
                            loading={''}
                            onRenderSuccess={(page) => {
                                console.log('onRenderSuccess', page);
                            }}
                        />
                    ))}

                <div className="fixed bottom-4 left-[80px] flex w-[calc(100vw-80px)] justify-center">
                    <div className="rounded bg-white py-2 px-4 shadow-lg">
                        <Space>
                            <div className="hover-document__pagination">
                                <RiArrowUpSLine className="icon-document__pagination" />
                            </div>
                            <div className="hover-document__pagination">
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
                            <div className="hover-document__pagination">
                                <RiAddLine className="icon-document__pagination" />
                            </div>
                            <div className="hover-document__pagination">
                                <RiZoomInLine className="icon-document__pagination" />
                            </div>
                            <div className="hover-document__pagination">
                                <RiSubtractLine className="icon-document__pagination" />
                            </div>
                        </Space>
                    </div>
                </div>
            </Document>
        </div>
    );
}

export default BaseDocument;
