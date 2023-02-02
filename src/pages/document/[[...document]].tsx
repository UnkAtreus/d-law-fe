import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import BaseLayout from '@baseComponents/BaseLayout';
import { Avatar, Col, ConfigProvider, Form, Row, Tag, Typography } from 'antd';
import React, { useRef } from 'react';
import { useDropzone } from 'react-dropzone';

import en_US from 'antd/locale/en_US';
import { RiFileUploadFill } from 'react-icons/ri';
import dayjs from 'dayjs';

function Document({ state }: { state: any }) {
    const query = state?.query?.document || [];
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

    type CaseFolder = {
        title: string;
        tags: string[];
        created_at: Date;
        owner: string;
        share_with: string[];
        last_edited: Date;
    };

    const columns: ProColumns<CaseFolder>[] = [
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
    const actionRef = useRef<ActionType>();

    return (
        <BaseLayout.Main path={'document'}>
            <Row gutter={24}>
                <Col {...getRootProps()}>
                    <ConfigProvider locale={en_US}>
                        <ProTable<CaseFolder>
                            columns={columns}
                            dataSource={[
                                {
                                    title: 'น้องสมชาย',
                                    tags: ['อ. 266/2565', 'ม.112'],
                                    created_at: new Date(),
                                    owner: 'Kittipat Dechkul',
                                    share_with: ['KD'],
                                    last_edited: new Date(),
                                },
                            ]}
                            actionRef={actionRef}
                            cardBordered
                            cardProps={{
                                headStyle: { marginBottom: '16px' },
                                title: (
                                    <Typography.Title
                                        level={4}
                                        className="inline"
                                        style={{ marginBottom: '24px' }}
                                    >
                                        โฟลเดอร์เคส
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
                    </ConfigProvider>
                </Col>
            </Row>
        </BaseLayout.Main>
    );
}

export default Document;
