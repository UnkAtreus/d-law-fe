import { ProColumns, ProTable, ProCard } from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';
import BaseTag, { ITag } from '@baseComponents/BaseTag';

import guidelineService from '@services/guidelineService';
import { Avatar, Col, Form, Row, Tag, Typography } from 'antd';

import { NextPage } from 'next';

import { useDropzone } from 'react-dropzone';
import BaseLoading from '@baseComponents/BaseLoading';
import { FileTypeIcons, FileTypes, showFileIcon } from '@utilities/index';
import { TCaseFolder } from '@interfaces/index';
import router from 'next/router';
import { RiFile2Fill, RiFileUploadFill } from 'react-icons/ri';
import dayjs from 'dayjs';
import { DOCUMENT_DATASOURCE } from 'mocks/mockTable';

const Home: NextPage = () => {
    const { data, isLoading } = guidelineService.getData('1');

    const [form] = Form.useForm<{ name: string; company: string }>();
    const {
        getRootProps,
        acceptedFiles,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        noClick: true,
        noKeyboard: true,
        onDrop: (files) => {
            console.log('🚀 ~ file: index.tsx:32 ~ files', files);
        },
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

    const columns: ProColumns<TCaseFolder>[] = [
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
            dataIndex: 'title',
            ellipsis: true,
        },
        {
            title: 'แท๊ก',
            dataIndex: 'tags',
            render: (_, record) => (
                <div className="flex flex-wrap">
                    {record.tags.map((name) => (
                        <Tag key={name}>{name}</Tag>
                    ))}
                </div>
            ),
        },
        {
            title: 'วันที่สร้าง/เจ้าของ',
            dataIndex: 'created_at',
            // valueType: 'dateTime',
            render: (text: any, record) => (
                <div className="flex flex-col ">
                    <div className="text-gray-400">
                        {dayjs(text).format('DD MMM YYYY - HH:MM')}
                    </div>
                    <div>{record.owner}</div>
                </div>
            ),
        },
        {
            title: 'แชร์ร่วมกับ',
            dataIndex: 'share_with',
            render: (text, record) => (
                <Avatar.Group>
                    <Avatar>{text}</Avatar>
                </Avatar.Group>
            ),
        },
        {
            title: 'แก้ไขล่าสุด',
            dataIndex: 'last_edited',
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

    if (isLoading) {
        return <BaseLoading />;
    }

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
                    <Col
                        xl={19}
                        xxl={20}
                        className="space-y-6"
                        {...getRootProps()}
                    >
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
                                <Col span={4}>
                                    <div
                                        className="hover-btn group flex w-full cursor-pointer items-center space-x-2 rounded border border-gray-200 bg-white py-5 pl-4 pr-6 "
                                        style={{ borderStyle: 'solid' }}
                                    >
                                        <FolderIcon className="icon text-gray-500 transition group-hover:text-primary" />
                                        <span className="overflow-hidden text-ellipsis whitespace-nowrap ">
                                            นายสมชาย
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                        </ProCard>

                        <ProTable<TCaseFolder>
                            columns={columns}
                            dataSource={DOCUMENT_DATASOURCE}
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
                            // request={async (
                            //     params = {},
                            //     sort: any,
                            //     filter: any
                            // ) => {
                            //     return request<{
                            //         data: ItemType[];
                            //     }>(
                            //         'https://proapi.azurewebsites.net/github/issues',
                            //         {
                            //             params,
                            //         }
                            //     );
                            // }}
                            rowKey="id"
                            options={{
                                setting: false,
                                reload: false,
                                density: false,
                            }}
                            search={false}
                            onRow={(record) => {
                                return {
                                    onDoubleClick: () => {
                                        if (record.type === FileTypes.FOLDER) {
                                            router.push(
                                                `/document${record.path}`
                                            );
                                        } else if (
                                            record.type === FileTypes.ZIP
                                        ) {
                                            console.log('download');
                                        } else {
                                            router.push(
                                                `/preview${record.path}`
                                            );
                                        }
                                    },
                                };
                            }}
                            pagination={{
                                pageSize: 50,
                                onChange: (page: any) => console.log(page),
                            }}
                            dateFormatter="string"
                            className="relative"
                            footer={() => {
                                if (isDragActive)
                                    return (
                                        <div
                                            className="justify-cente absolute bottom-16  left-0 flex h-[calc(100%-110px)] w-full items-center border border-primary bg-primary/20"
                                            style={{ borderStyle: 'solid' }}
                                        >
                                            <div className="fixed bottom-4 left-1/2 z-10 flex h-max w-full -translate-x-1/2 flex-col items-center justify-center space-y-2">
                                                <div className="rounded-md bg-primary py-2 px-6 text-center">
                                                    <RiFileUploadFill className="-mt-4 inline-flex h-6 w-6 animate-bounce  items-center justify-center text-white shadow" />
                                                    <div className="-mt-2 text-white">
                                                        วางไฟล์
                                                    </div>
                                                    <div className="text-white">
                                                        เพื่ออัพโหลด
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                            }}
                        />
                    </Col>
                </Row>
            </BaseLayout.Main>
        </>
    );
};

export default Home;
