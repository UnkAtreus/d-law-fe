import { ProColumns, ProTable, ProCard } from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';

import { Button, Col, Empty, Row, Space, Tag, Typography } from 'antd';

import { FileTypeIcons, getAvatarName, showFileIcon } from '@utilities/index';
import {
    ResponseData,
    TAuthUser,
    TFile,
    TFreqCaseFolder,
} from '@interfaces/index';
import router from 'next/router';
import { RiFile2Fill } from 'react-icons/ri';
import dayjs from 'dayjs';
import withAuthUserSSR from '@hoc/withAuthUserSSR';
import AuthAction from '@hoc/AuthAction';
import useRequest, { fetcher } from '@services/useRequest';
import FolderServicePath from '@services/FolderService';
import CaseFolderServicePath from '@services/caseFolderService';
import FileServicePath from '@services/FileService';
import Link from 'next/link';

const Workspace = ({
    freqData,
    recentData,
    authUser,
}: {
    freqData: ResponseData<TFreqCaseFolder[]>;
    recentData: ResponseData<TFile[]>;
    authUser: TAuthUser;
}) => {
    const { token } = authUser;
    const avatarName = getAvatarName(authUser.firstName, authUser.lastName);
    const { data: feqFolderData } = useRequest({
        url: FolderServicePath.GET_ALL_FOLDER,
        token,
        initData: freqData,
    });
    const { data: recentFileData } = useRequest({
        url: FileServicePath.RECENT_FILE,
        token,
        initData: recentData,
    });

    const { FolderIcon } = FileTypeIcons;

    const columns: ProColumns<TFile>[] = [
        {
            title: <RiFile2Fill className="m-auto" />,
            dataIndex: 'type',
            render: (type: any) => {
                return showFileIcon(type);
            },
            align: 'center',
            width: 48,
        },
        {
            title: 'ชื่อไฟล์',
            dataIndex: 'name',
            ellipsis: true,
        },
        {
            title: 'ชนิดไฟล์',
            dataIndex: 'type',
            render: (text, record) => (
                <div className="flex flex-wrap">
                    <Tag>{text}</Tag>
                </div>
            ),
        },
        {
            title: 'วันที่สร้าง/เจ้าของ',
            dataIndex: 'createdAt',
            // valueType: 'dateTime',
            render: (text: any, record) => (
                <div className="flex flex-col ">
                    <div className="text-gray-400">
                        {dayjs(text).format('DD MMM YYYY - HH:MM')}
                    </div>
                    {/* <div>{record}</div> */}
                </div>
            ),
        },
        // {
        //     title: 'แชร์ร่วมกับ',
        //     dataIndex: 'share_with',
        //     render: (text, record) => (
        //         <Avatar.Group>
        //             <Avatar>{text}</Avatar>
        //         </Avatar.Group>
        //     ),
        // },
        {
            title: 'แก้ไขล่าสุด',
            dataIndex: 'updatedAt',
            render: (text: any) => (
                <div className="text-gray-400">
                    {dayjs(text).format('DD MMM YYYY - HH:MM')}
                </div>
            ),
        },
    ];

    // if (isLoading) {
    //     return <BaseLoading />;
    // }

    return (
        <>
            <BaseLayout.Main
                avatarName={avatarName}
                hasTour={feqFolderData?.data.length === 0}
            >
                <Row gutter={24}>
                    <Col span={24} className="space-y-6">
                        <ProCard
                            title={
                                <Typography.Title level={4} className="inline">
                                    โฟลเดอร์ที่ใช้บ่อย
                                </Typography.Title>
                            }
                            bordered
                            collapsible
                        >
                            <Row gutter={[8, 8]}>
                                {feqFolderData?.data &&
                                feqFolderData.data.length > 0 ? (
                                    feqFolderData.data.map((folder) => (
                                        <Col span={4} key={folder.id}>
                                            <div
                                                className="hover-btn group flex w-full cursor-pointer items-center space-x-2 rounded border border-solid border-gray-200 bg-white py-5 pl-4 pr-6"
                                                onClick={() => {
                                                    router.push(
                                                        `/document/${folder.folderId}`
                                                    );
                                                }}
                                            >
                                                <FolderIcon className="icon text-gray-500 transition group-hover:text-primary" />
                                                <span className="overflow-hidden text-ellipsis whitespace-nowrap ">
                                                    {folder.name}
                                                </span>
                                            </div>
                                        </Col>
                                    ))
                                ) : (
                                    <Col span={24}>
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={
                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <div className="text-base text-gray-600">
                                                            ยังไม่มีโฟลเดอร์ที่เปิดล่าสุด
                                                        </div>
                                                        <div className="text-gray-500">
                                                            ไปที่หน้า doucument
                                                            เพือทำการสร้างเคสโฟลเดอร์
                                                        </div>
                                                    </div>
                                                    <Space>
                                                        <Link
                                                            href={'/document'}
                                                        >
                                                            <Button type="primary">
                                                                เริ่มต้น
                                                            </Button>
                                                        </Link>
                                                    </Space>
                                                </div>
                                            }
                                        />
                                    </Col>
                                )}
                            </Row>
                        </ProCard>
                        <ProCard
                            title={
                                <Typography.Title level={4} className="inline">
                                    เอกสารที่เปิดล่าสุด
                                </Typography.Title>
                            }
                            collapsible
                        >
                            <ProTable<TFile>
                                columns={columns}
                                dataSource={recentFileData?.data}
                                onRow={(record) => {
                                    return {
                                        onDoubleClick: () => {
                                            router.push(
                                                `/preview/${record.id}`
                                            );
                                        },
                                    };
                                }}
                                cardProps={{
                                    bodyStyle: {
                                        padding: 0,
                                    },
                                }}
                                cardBordered
                                rowKey="id"
                                options={{
                                    setting: false,
                                    reload: false,
                                    density: false,
                                }}
                                search={false}
                                pagination={{
                                    hideOnSinglePage: true,
                                }}
                                dateFormatter="string"
                                className="relative"
                            />
                        </ProCard>
                    </Col>
                </Row>
            </BaseLayout.Main>
        </>
    );
};

export const getServerSideProps = withAuthUserSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx: any) => {
    const authUser: TAuthUser = ctx.AuthUser;
    const token = authUser.token;

    const freqData = await fetcher(CaseFolderServicePath.FREQ_USED, 'GET', {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    });
    const recentData = await fetcher(FileServicePath.RECENT_FILE, 'GET', {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    });

    return {
        props: {
            authUser,
            freqData,
            recentData,
        },
    };
});

export default Workspace;
