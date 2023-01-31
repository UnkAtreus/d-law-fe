import { ActionType, ProColumns, ProTable } from '@ant-design/pro-table';
import { ProCard } from '@ant-design/pro-card';
import BaseLayout from '@baseComponents/BaseLayout';
import BaseLoading from '@baseComponents/BaseLoading';
import BaseTag, { ITag } from '@baseComponents/BaseTag';
import en_US from 'antd/locale/en_US';

import guidelineService from '@services/guidelineService';
import { Col, ConfigProvider, Form, Row, Space, Tag, Typography } from 'antd';

import { NextPage } from 'next';
import { useRef } from 'react';

import {
    RiBankCardFill,
    RiFileExcelFill,
    RiFileList2Fill,
    RiFilePdfFill,
    RiFileTextFill,
    RiFileWordFill,
    RiFolder5Fill,
    RiImage2Fill,
    RiVideoFill,
} from 'react-icons/ri';
import request from 'umi-request';
import { useDropzone } from 'react-dropzone';

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
        accept: {
            'image/jpeg': ['.jpeg', '.png'],
        },
        noClick: true,
        noKeyboard: true,
    });

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
            icon: <RiFileTextFill className="icon" />,
            value: '22',
        },
        {
            key: 'tag_2',
            name: 'สำเนาบัตรประจำตัวประชาชน',
            icon: <RiBankCardFill className="icon" />,
            value: '2',
            onClick: () => {
                console.log(`test`);
            },
        },
        {
            key: 'tag_3',
            name: 'เอกสาร Excel',
            icon: <RiFileExcelFill className="icon" />,
            value: '5',
        },
        {
            key: 'tag_4',
            name: 'เอกสาร PDF',
            icon: <RiFilePdfFill className="icon" />,
            value: '10',
        },
        {
            key: 'tag_5',
            name: 'เอกสาร Word',
            icon: <RiFileWordFill className="icon" />,
            value: '2',
        },
        {
            key: 'tag_6',
            name: 'รูปภาพ',
            icon: <RiImage2Fill className="icon" />,
            value: '2',
        },
        {
            key: 'tag_7',
            name: 'วิดีโอ',
            icon: <RiVideoFill className="icon" />,
            value: '2',
        },
        {
            key: 'tag_8',
            name: 'เอกสารอื่นๆ',
            icon: <RiFileList2Fill className="icon" />,
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
                        {isDragActive && (
                            <div className="t-0 r-0 absolute z-50 h-24 w-24 bg-black"></div>
                        )}
                        <ProCard
                            title={
                                <Typography.Title level={4} className="inline">
                                    โฟลเดอร์ที่ใช้บ่อย (2)
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
                                        <RiFolder5Fill className="icon text-gray-500 transition group-hover:text-primary" />
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
                                        <RiFolder5Fill className="icon text-gray-500 transition group-hover:text-primary" />
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
                                            เอกสารที่เปิดล่าสุด (1)
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
