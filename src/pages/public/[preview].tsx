import React, { memo, useRef, useState } from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import {
    Button,
    Divider,
    Dropdown,
    Layout,
    MenuProps,
    Space,
    theme,
} from 'antd';
import {
    RiArrowLeftSLine,
    RiDownloadFill,
    RiMore2Fill,
    RiInformationLine,
    RiCloseFill,
} from 'react-icons/ri';
import { useRouter } from 'next/router';
import Document from '@components/Document';
import Media from '@components/Media';
import { FileTypes } from '@utilities/index';

import Text from '@components/Text';
import FileNotFound from '@components/FileNotFound';
import dayjs from 'dayjs';
import Image from '@components/Image';
import useRequest, { fetcher } from '@services/useRequest';
import FileServicePath from '@services/FileService';
import { ResponseData, TFile } from '@interfaces/index';
import logDebug from '@utilities/logDebug';
import Link from 'next/link';

type MenuItem = Required<MenuProps>['items'][number];

export function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    onClick?: () => void,
    type?: 'group',
    danger?: boolean
): MenuItem {
    return {
        key,
        icon,
        onClick,
        label,
        type,
        danger,
    } as MenuItem;
}

function Preview({
    path,
    type: fileType,
    data,
}: {
    path: string;
    type: FileTypes;
    data: ResponseData<TFile>;
}) {
    logDebug('🚀 ~ FILE_TYPE', fileType);

    const { data: fileData } = useRequest({
        url: FileServicePath.GET_BY_ID + path,
        token: '',
        initData: data,
    });

    const [isMoreInfo, setIsMoreInfo] = useState<boolean>(true);

    const containerRef = useRef<any>();

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const router = useRouter();

    const info_items: MenuProps['items'] = [
        getItem(
            <div
                className="flex space-x-2"
                onClick={() => {
                    console.log(isMoreInfo);
                    setIsMoreInfo(!isMoreInfo);
                }}
            >
                <RiInformationLine className="icon text-gray-500" />
                <span className="self-center">รายละเอียด</span>
            </div>,
            'moreinfo'
        ),
    ];

    const RenderDocument = memo(function RenderDocument() {
        return (
            <Document
                containerRef={containerRef}
                file={fileData?.data.previewUrl || ''}
            />
        );
    });
    const RenderTxt = memo(function RenderTxt() {
        return <Text file={fileData?.data.previewUrl || ''} />;
    });
    const RenderMedia = memo(function RenderMedia({
        type,
    }: {
        type: 'video' | 'audio';
    }) {
        return <Media type={type} media={fileData?.data.previewUrl || ''} />;
    });
    const RenderImage = memo(function RenderImage() {
        // eslint-disable-next-line jsx-a11y/alt-text
        return <Image image={fileData?.data.previewUrl || ''} />;
    });
    const RenderNotFound = memo(function RenderNotFound() {
        return (
            <FileNotFound
                download={fileData?.data.url || ''}
                name={fileData?.data.name || ''}
            />
        );
    });

    const RenderFile = memo(function RenderFile() {
        const { DOC, IMAGE, AUDIO, PDF, PTT, TEXT, VIDEO, XLS, ZIP } =
            FileTypes;
        switch (fileType) {
            case VIDEO:
                return <RenderMedia type={'video'} />;
            case AUDIO:
                return <RenderMedia type={'audio'} />;
            case PDF:
                return <RenderDocument />;
            case DOC:
                return <RenderNotFound />;
            case PTT:
                return <RenderNotFound />;
            case XLS:
                return <RenderNotFound />;
            case IMAGE:
                return <RenderImage />;
            case TEXT:
                return <RenderTxt />;
            case ZIP:
                return <RenderNotFound />;
            default:
                return <RenderNotFound />;
        }
    });

    return (
        <Layout className="min-h-screen" hasSider>
            {/* <Layout.Sider
                style={{
                    background: colorBgContainer,
                    boxShadow: '6px 0px 24px rgba(0, 0, 0, 0.1)',
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 2,
                }}
                width={80}
            >
                <GoLaw className="icon mx-7 my-4 text-gray-700" />
                <Menu mode="inline" items={items} />
            </Layout.Sider> */}

            <Layout>
                <Layout.Header
                    style={{
                        padding: 0,
                        backgroundColor: colorBgContainer,
                        boxShadow: '0px 4px 30px 4px rgba(0, 0, 0, 0.1)',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        width: '100%',
                    }}
                >
                    <div className="relative flex items-center justify-between px-6">
                        <Space>
                            <Button
                                shape="circle"
                                type="text"
                                onClick={() => router.back()}
                                icon={
                                    <RiArrowLeftSLine className="icon__button " />
                                }
                            />

                            <h1 className="font-bold">
                                {fileData?.data?.name
                                    ? fileData?.data?.name
                                    : ''}
                            </h1>
                        </Space>

                        <Space>
                            <Link href={fileData?.data.url || ''}>
                                <Button
                                    icon={
                                        <RiDownloadFill className="icon__button mr-2 text-gray-500" />
                                    }
                                >
                                    ดาวน์โหลด
                                </Button>
                            </Link>

                            <Dropdown
                                menu={{
                                    onClick: ({ key }) => {
                                        console.log('🚀 ~ key:', key);
                                    },
                                    items: info_items,
                                }}
                                trigger={['click']}
                                overlayClassName="w-64"
                            >
                                <Button
                                    shape="circle"
                                    type="text"
                                    icon={
                                        <RiMore2Fill className="icon__button w-" />
                                    }
                                />
                            </Dropdown>
                        </Space>
                    </div>
                </Layout.Header>
                <Layout>
                    <Layout.Content
                        className="relative flex h-[calc(100vh-64px)] flex-col items-center overflow-y-scroll py-6"
                        ref={containerRef}
                    >
                        {/* Main Content */}
                        <RenderFile />
                    </Layout.Content>
                    <Layout.Sider
                        collapsed={isMoreInfo}
                        collapsedWidth={0}
                        style={{
                            background: colorBgContainer,
                            boxShadow: '6px 0px 24px rgba(0, 0, 0, 0.1)',
                            height: 'calc(100vh-64px)',
                            overflowY: 'auto',
                        }}
                        width={320}
                    >
                        <div className="flex items-end justify-between">
                            <div className="px-6 pt-6 text-xl">
                                รายละเอียดไฟล์
                            </div>
                            <Button
                                type="text"
                                shape="circle"
                                className="mr-4"
                                onClick={() => setIsMoreInfo(!isMoreInfo)}
                                icon={
                                    <RiCloseFill className="icon text-gray-600" />
                                }
                            />
                        </div>
                        <Divider className="my-6" />
                        <div className="flex flex-col space-y-4 px-6 pb-6">
                            <div>
                                <div>ชนิดไฟล์</div>
                                <div className="text-base text-gray-500">
                                    {fileData?.data.type}
                                </div>
                            </div>
                            <div>
                                <div>ขนาดไฟล์</div>
                                <div className="text-base text-gray-500">
                                    {fileData?.data.size}
                                </div>
                            </div>
                            <div>
                                <div>แก้ไขวันที่</div>
                                <div className="text-base text-gray-500">
                                    {dayjs(fileData?.data.updatedAt)
                                        .utc()
                                        .format('DD MMM YYYY')}
                                </div>
                            </div>
                            <div>
                                <div>สร้างขึ้นวันที่</div>
                                <div className="text-base text-gray-500">
                                    {dayjs(fileData?.data.createdAt)
                                        .utc()
                                        .format('DD MMM YYYY')}
                                </div>
                            </div>
                        </div>
                    </Layout.Sider>
                </Layout>
            </Layout>
        </Layout>
    );
}

export const getServerSideProps = async (ctx: any) => {
    const { params } = ctx;
    const { preview } = params;

    const data = await fetcher(
        FileServicePath.GET_PUBLIC_BY_ID + preview,
        'GET'
    );

    return {
        props: {
            data,
            path: preview || null,
            type: data.data.type || null,
        },
    };
};

export default Preview;
