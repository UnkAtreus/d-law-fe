import { ActionType, ProColumns, ProTable } from '@ant-design/pro-table';
import { ProCard } from '@ant-design/pro-card';
import BaseLayout from '@baseComponents/BaseLayout';
import BaseTag, { ITag } from '@baseComponents/BaseTag';
import en_US from 'antd/locale/en_US';

import guidelineService from '@services/guidelineService';
import { Col, ConfigProvider, Form, Row, Space, Tag, Typography } from 'antd';

import { NextPage } from 'next';
import { useRef } from 'react';

import request from 'umi-request';
import { useDropzone } from 'react-dropzone';
import BaseLoading from '@baseComponents/BaseLoading';
import { FileTypeIcons } from '@utilities/index';

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

    type ItemType = {
        [x: string]: any;
    };

    const columns: ProColumns<ItemType>[] = [
        {
            title: 'ชื่อไฟล์',
            dataIndex: 'title',
            ellipsis: true,
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: 'message',
                    },
                ],
            },
        },
        {
            disable: true,
            title: 'title',
            dataIndex: 'labels',
            search: false,
            renderFormItem: (_: any, { defaultRender }: any) => {
                return defaultRender(_);
            },
            render: (_: any, record: any) => (
                <Space>
                    {record.labels.map(
                        ({ name, color }: { name: any; color: any }) => (
                            <Tag color={color} key={name}>
                                {name}
                            </Tag>
                        )
                    )}
                </Space>
            ),
        },
        {
            title: 'showTime',
            key: 'showTime',
            dataIndex: 'created_at',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'created_at',
            dataIndex: 'created_at',
            valueType: 'dateRange',
            hideInTable: true,
            search: {
                transform: (value: any[]) => {
                    return {
                        startTime: value[0],
                        endTime: value[1],
                    };
                },
            },
        },
        {
            title: 'title',
            valueType: 'option',
            key: 'option',
        },
    ];
    const actionRef = useRef<ActionType>();

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
                                            น้องสมชาย
                                        </span>
                                    </div>
                                </Col>
                                <Col span={4}>
                                    <div
                                        className="hover-btn group flex w-full cursor-pointer items-center space-x-2 rounded border border-gray-200 bg-white py-5 pl-4 pr-6 "
                                        style={{ borderStyle: 'solid' }}
                                    >
                                        <FolderIcon className="icon text-gray-500 transition group-hover:text-primary" />
                                        <span className="overflow-hidden text-ellipsis whitespace-nowrap ">
                                            น้องสมชาย
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                        </ProCard>

                        <ConfigProvider locale={en_US}>
                            <ProTable<ItemType>
                                columns={columns}
                                actionRef={actionRef}
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
                                request={async (
                                    params = {},
                                    sort: any,
                                    filter: any
                                ) => {
                                    return request<{
                                        data: ItemType[];
                                    }>(
                                        'https://proapi.azurewebsites.net/github/issues',
                                        {
                                            params,
                                        }
                                    );
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
                                headerTitle=" "
                            />
                        </ConfigProvider>
                    </Col>
                </Row>
            </BaseLayout.Main>
        </>
    );
};

export default Home;
