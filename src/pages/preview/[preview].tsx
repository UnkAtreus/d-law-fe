import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfFile from '@assets/62070501004_Assignment6.pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export async function getServerSideProps(ctx: any) {
    const { params } = ctx;
    const { preview } = params;

    return {
        props: {
            path: preview || null,
        },
    };
}

function Preview({ path }: { path: string }) {
    console.log(path);

    // const FILE_PATH = path
    return (
        <div>
            Preview
            <Document
                file={pdfFile}
                onLoadSuccess={(numPages) => {
                    console.log(numPages);
                }}
            >
                <Page pageNumber={1} scale={2} />
            </Document>
        </div>
    );
}

export default Preview;
