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
    message,
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
    RiCloseFill,
} from 'react-icons/ri';
import { GoLaw } from 'react-icons/go';
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
import {
    ResponseData,
    TAuthUser,
    TChangeDocumentName,
    TFile,
} from '@interfaces/index';
import withAuthUserSSR from '@hoc/withAuthUserSSR';
import AuthAction from '@hoc/AuthAction';
import logDebug from '@utilities/logDebug';
import Link from 'next/link';
import BaseModal from '@baseComponents/BaseModal';

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
    authUser,
    data,
}: {
    path: string;
    type: FileTypes;
    data: ResponseData<TFile>;
    authUser: TAuthUser;
}) {
    logDebug('🚀 ~ FILE_TYPE', fileType);

    const token = authUser.token || '';
    const {
        mutate,
        data: fileData,
        isLoading,
    } = useRequest({
        url: FileServicePath.GET_BY_ID + path,
        token,
        initData: data,
    });

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
                    onClick={() => router.push('/workspace')}
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
            <BaseModal.ChangeName<TChangeDocumentName>
                onFinish={async (values) => {
                    try {
                        logDebug('🚀 ~ onFinish={ ~ payload:', values);
                        await fetcher(
                            FileServicePath.UPDATE_FILE + path,
                            'PATCH',
                            {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                },
                                data: values,
                            }
                        );
                        message.success('แก้ไขชื่อไฟล์สำเร็จ');
                        await mutate();

                        return true;
                    } catch (error) {
                        message.error('แก้ไขชื่อไฟล์ไม่สำเร็จ');
                        return false;
                    }
                }}
                type="file"
            />,
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
        return <FileNotFound download={fileData?.data.url || ''} />;
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
                                {fileData?.data?.name
                                    ? fileData?.data?.name
                                    : ''}
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
                            <Link href={fileData?.data.url || ''}>
                                <Button
                                    icon={
                                        <RiDownloadFill className="icon__button mr-2" />
                                    }
                                >
                                    ดาวน์โหลด
                                </Button>
                            </Link>
                            <Button
                                type="primary"
                                icon={
                                    <RiShareForward2Fill className="icon__button mr-2" />
                                }
                            >
                                เผยแพร่
                            </Button>

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
                                <div>เจ้าของไฟล์</div>
                                <div className="text-base text-gray-500">
                                    {`${authUser.firstName} ${authUser.lastName}`}
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

export const getServerSideProps = withAuthUserSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx: any) => {
    const authUser: TAuthUser = ctx.AuthUser;
    const { params, query } = ctx;
    const { preview } = params;
    const token = authUser.token;

    const data = await fetcher(FileServicePath.GET_BY_ID + preview, 'GET', {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    });

    return {
        props: {
            authUser,
            data,
            path: preview || null,
            type: data.data.type || null,
        },
    };
});

export default Preview;
