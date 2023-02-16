import React, { memo, useRef, useState } from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button, Layout, Menu, MenuProps, Space, theme, Tooltip } from 'antd';
import {
    RiComputerLine,
    RiFileCopy2Line,
    RiCalendarTodoLine,
    RiSettings5Line,
    RiArrowLeftSLine,
    RiInformationLine,
} from 'react-icons/ri';
import { GoLaw } from 'react-icons/go';
import { useRouter } from 'next/router';
import Document from '@components/Document';
import Media from '@components/Media';

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
        },
    };
}

function Preview({ path }: { path: string }) {
    const [isMoreInfo, setIsMoreInfo] = useState<boolean>(true);

    const containerRef = useRef<any>();

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const router = useRouter();
    const FILE_PATH = path;

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

    const RenderDocument = memo(function RenderDocument() {
        return <Document containerRef={containerRef} />;
    });
    const RenderMedia = memo(function RenderMedia() {
        return <Media />;
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
                            <RiArrowLeftSLine
                                onClick={() => router.back()}
                                className="icon cursor-pointer"
                            />
                            <h1 className="font-bold">
                                {FILE_PATH.charAt(0).toUpperCase() +
                                    FILE_PATH.slice(1)}
                            </h1>
                        </Space>

                        <Space className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                            <a
                                target="_blank"
                                href="https://twitter.com/"
                                rel="noopener noreferrer"
                            >
                                <div>cneter1</div>
                            </a>
                            <div>cneter2</div>
                        </Space>

                        <Space>
                            <Button>เผยแพร่</Button>
                            <div
                                className="z-10"
                                onClick={() => {
                                    console.log(isMoreInfo);
                                    setIsMoreInfo(!isMoreInfo);
                                }}
                            >
                                <RiInformationLine className="icon text-gray-500" />
                            </div>
                        </Space>
                    </div>
                </Layout.Header>
                <Layout>
                    <Layout.Content
                        className="relative flex h-[calc(100vh-64px)] flex-col items-center overflow-y-scroll py-6"
                        ref={containerRef}
                    >
                        {/* Main Content */}
                        {/* <RenderDocument /> */}
                        <RenderMedia />
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
                        <div>test</div>
                    </Layout.Sider>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default Preview;
