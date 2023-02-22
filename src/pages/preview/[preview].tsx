import React, { memo, useRef, useState } from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import {
    Button,
    Divider,
    Dropdown,
    Layout,
    Menu,
    MenuProps,
    Space,
    theme,
    Tooltip,
} from 'antd';
import {
    RiComputerLine,
    RiFileCopy2Line,
    RiCalendarTodoLine,
    RiSettings5Line,
    RiArrowLeftSLine,
    RiDownloadFill,
    RiShareForward2Fill,
    RiMore2Fill,
    RiInformationLine,
    RiFolderTransferLine,
    RiEditLine,
} from 'react-icons/ri';
import { GoLaw } from 'react-icons/go';
import { useRouter } from 'next/router';
import Document from '@components/Document';
import Media from '@components/Media';
import { FileTypes } from '@utilities/index';

import Text from '@components/Text';
import FileNotFound from '@components/FileNotFound';
import dayjs from 'dayjs';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

export async function getServerSideProps(ctx: any) {
    const { params } = ctx;
    const { preview } = params;

    return {
        props: {
            path: preview || null,
            type: 'pdf',
        },
    };
}

function Preview({
    path: FILE_PATH,
    type: FILE_TYPE,
}: {
    path: string;
    type: FileTypes;
}) {
    const [isMoreInfo, setIsMoreInfo] = useState<boolean>(true);

    const containerRef = useRef<any>();

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const router = useRouter();

    const items: MenuProps['items'] = [
        getItem(
            <Tooltip placement="right" title={'Workshop'} color={'#4a4a4a'}>
                <div
                    onClick={() => router.push('/')}
                    className="flex flex-col items-center justify-center py-4"
                >
                    <RiComputerLine className="menu-icon text-gray-500" />
                </div>
            </Tooltip>,
            'workspace'
        ),
        getItem(
            <Tooltip placement="right" title={'Document'} color={'#4a4a4a'}>
                <div
                    onClick={() => router.push('/document')}
                    className="flex flex-col items-center justify-center py-4"
                >
                    <RiFileCopy2Line className="menu-icon text-gray-500" />
                </div>
            </Tooltip>,
            'document'
        ),
        getItem(
            <Tooltip placement="right" title={'Appointment'} color={'#4a4a4a'}>
                <div className="flex flex-col items-center justify-center py-4">
                    <RiCalendarTodoLine className="menu-icon text-gray-500" />
                </div>
            </Tooltip>,
            'appointment'
        ),
        getItem(
            <Tooltip placement="right" title={'Setting'} color={'#4a4a4a'}>
                <div className="flex flex-col items-center justify-center py-4">
                    <RiSettings5Line className="menu-icon text-gray-500" />
                </div>
            </Tooltip>,
            'setting'
        ),
    ];

    const info_items: MenuProps['items'] = [
        getItem(
            <div className="flex space-x-2">
                <RiFolderTransferLine className="icon text-gray-500" />
                <span className="self-center">ย้ายไปที่</span>
            </div>,
            'movefile'
        ),
        getItem(
            <div className="flex space-x-2">
                <RiEditLine className="icon text-gray-500" />
                <span className="self-center">เปลี่ยนชื่อ</span>
            </div>,
            'changename'
        ),
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
        return <Document containerRef={containerRef} />;
    });
    const RenderTxt = memo(function RenderTxt() {
        return <Text />;
    });
    const RenderMedia = memo(function RenderMedia() {
        return <Media type={'video'} />;
    });
    const RenderNotFound = memo(function RenderNotFound() {
        return <FileNotFound />;
    });

    return (
        <Layout className="min-h-screen" hasSider>
            <Layout.Sider
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
            </Layout.Sider>

            <Layout className="ml-[80px]">
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
                                {FILE_PATH.charAt(0).toUpperCase() +
                                    FILE_PATH.slice(1)}
                            </h1>
                        </Space>

                        {/* <Space className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                            <a
                                target="_blank"
                                href="https://twitter.com/"
                                rel="noopener noreferrer"
                            >
                                <div>cneter1</div>
                            </a>
                            <div>cneter2</div>
                        </Space> */}

                        <Space>
                            <Button
                                icon={
                                    <RiDownloadFill className="icon__button mr-2" />
                                }
                            >
                                ดาวน์โหลดไฟล์
                            </Button>
                            <Button
                                type="primary"
                                icon={
                                    <RiShareForward2Fill className="icon__button mr-2" />
                                }
                            >
                                เผยแพร่
                            </Button>

                            <Dropdown
                                menu={{ items: info_items }}
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
                        <RenderDocument />
                        {/* <RenderMedia /> */}
                        {/* <RenderMicrosoft /> */}
                        {/* <RenderTxt /> */}
                        {/* <RenderNotFound /> */}
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
                        <div>
                            <div className="px-6 pt-6 text-xl">
                                รายละเอียดไฟล์
                            </div>
                        </div>
                        <Divider className="my-6" />
                        <div className="flex flex-col space-y-4 px-6 pb-6">
                            <div>
                                <div>ชนิดไฟล์</div>
                                <div className="text-base text-gray-500">
                                    เอกสาร PDF
                                </div>
                            </div>
                            <div>
                                <div>ขนาดไฟล์</div>
                                <div className="text-base text-gray-500">
                                    37.4 ไบต์
                                </div>
                            </div>
                            <div>
                                <div>เจ้าของไฟล์</div>
                                <div className="text-base text-gray-500">
                                    Kittipat Dechkul
                                </div>
                            </div>
                            <div>
                                <div>แก้ไขวันที่</div>
                                <div className="text-base text-gray-500">
                                    {'-'}
                                </div>
                            </div>
                            <div>
                                <div>สร้างขึ้นวันที่</div>
                                <div className="text-base text-gray-500">
                                    {dayjs().format('DD MMM YYYY')}
                                </div>
                            </div>
                        </div>
                    </Layout.Sider>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default Preview;
