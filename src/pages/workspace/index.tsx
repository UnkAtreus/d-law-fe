import { ProColumns, ProTable, ProCard } from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';
import BaseTag, { ITag } from '@baseComponents/BaseTag';

import { Col, Row, Typography } from 'antd';

import { FileTypeIcons, showFileIcon } from '@utilities/index';
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

    const {
        ExcelIcon,
        FolderIcon,
        IdCardIcon,
        ImageIcon,
        MoreIcon,
        PdfIcon,
        TextIcon,
        VideoIcon,
        WordIcon,
        MusicIcon,
        ZipIcon,
    } = FileTypeIcons;

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
        // {
        //     title: 'ชนิดไฟล์',
        //     dataIndex: 'tags',
        //     render: (_, record) => (
        //         <div className="flex flex-wrap">
        //             {record.tags.map((tag) => (
        //                 <Tag key={tag.id}>{tag.name}</Tag>
        //             ))}
        //         </div>
        //     ),
        // },
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

    const Tags: ITag[] = [
        {
            key: 'tag_1',
            name: 'เอกสารทั้งหมด',
            icon: <TextIcon className="icon" />,
            value: '22',
        },
        {
            key: 'tag_2',
            name: 'สำเนาบัตรประจำตัวประชาชน',
            icon: <IdCardIcon className="icon" />,
            value: '2',
            onClick: () => {
                console.log(`test`);
            },
        },
        {
            key: 'tag_3',
            name: 'เอกสาร Excel',
            icon: <ExcelIcon className="icon" />,
            value: '5',
        },
        {
            key: 'tag_4',
            name: 'เอกสาร PDF',
            icon: <PdfIcon className="icon" />,
            value: '10',
        },
        {
            key: 'tag_5',
            name: 'เอกสาร Word',
            icon: <WordIcon className="icon" />,
            value: '2',
        },
        {
            key: 'tag_6',
            name: 'รูปภาพ',
            icon: <ImageIcon className="icon" />,
            value: '2',
        },
        {
            key: 'tag_7',
            name: 'วิดีโอ',
            icon: <VideoIcon className="icon" />,
            value: '2',
        },
        {
            key: 'tag_8',
            name: 'เสียง',
            icon: <MusicIcon className="icon" />,
            value: '1',
        },
        {
            key: 'tag_9',
            name: 'บีบอัด',
            icon: <ZipIcon className="icon" />,
            value: '2',
        },
        {
            key: 'tag_10',
            name: 'เอกสารอื่นๆ',
            icon: <MoreIcon className="icon" />,
            value: '2',
        },
    ];

    // if (isLoading) {
    //     return <BaseLoading />;
    // }

    return (
        <>
            <BaseLayout.Main>
                <Row gutter={24}>
                    <Col xl={5} xxl={4}>
                        <BaseTag
                            items={Tags}
                            defaultTag="tag_1"
                            onChange={(key, tag) => {
                                console.log(key, tag);
                            }}
                        />
                    </Col>
                    <Col xl={19} xxl={20} className="space-y-6">
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
                                    ))}
                            </Row>
                        </ProCard>

                        <ProTable<TFile>
                            columns={columns}
                            dataSource={recentFileData?.data}
                            onRow={(record) => {
                                return {
                                    onDoubleClick: () => {
                                        router.push(`/preview/${record.id}`);
                                    },
                                };
                            }}
                            cardBordered
                            cardProps={{
                                collapsible: true,
                                title: (
                                    <Typography.Title
                                        level={4}
                                        className="inline"
                                    >
                                        เอกสารที่เปิดล่าสุด
                                    </Typography.Title>
                                ),
                            }}
                            rowKey="id"
                            options={{
                                setting: false,
                                reload: false,
                                density: false,
                            }}
                            search={false}
                            pagination={{
                                pageSize: 50,
                                onChange: (page: any) => console.log(page),
                            }}
                            dateFormatter="string"
                            className="relative"
                        />
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
