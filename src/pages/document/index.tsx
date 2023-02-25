import ProTable, { ProColumns } from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import BaseLayout from '@baseComponents/BaseLayout';
import {
    Avatar,
    Badge,
    Button,
    Col,
    Collapse,
    ConfigProvider,
    Form,
    Input,
    Row,
    Space,
    Tag,
    Typography,
} from 'antd';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import en_US from 'antd/locale/en_US';
import {
    RiEqualizerLine,
    RiFile2Fill,
    RiFolder5Fill,
    RiFolderAddFill,
    RiSearchLine,
} from 'react-icons/ri';
import dayjs from 'dayjs';
import thTH from '@locales/th_TH';
import useUpload from '@utilities/useUpload';
import { useRouter } from 'next/router';
import { TCreateFolder, TCaseFolder } from '@interfaces/index';

function CaseFolder() {
    const [isUpload, setIsUpload] = useState(false);

    const router = useRouter();
    const { fileLists, setFileLists } = useUpload();
    const [form] = Form.useForm<TCreateFolder>();
    const { getRootProps, isDragActive } = useDropzone({
        noClick: true,
        noKeyboard: true,
        onDrop: (files: any[]) => {
            console.log(files);

            if (files) {
                setFileLists([...fileLists, ...files]);
                setIsUpload(true);
            }
        },
    });

    const columns: ProColumns<TCaseFolder>[] = [
        {
            title: <RiFile2Fill className="m-auto" />,
            dataIndex: 'type',
            render: (type) => {
                if (type === 'folder') {
                    return <RiFolder5Fill className="icon text-gray-500" />;
                }
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

    return (
        <BaseLayout.Main path={'document'}>
            <Row gutter={24}>
                <Col {...getRootProps()}>
                    <ConfigProvider locale={en_US}>
                        <ProTable<TCaseFolder>
                            columns={columns}
                            dataSource={[
                                {
                                    id: '00000001',
                                    type: 'folder',
                                    title: 'น้องสมชาย',
                                    tags: ['อ. 266/2565', 'ม.112'],
                                    created_at: new Date(),
                                    owner: 'Kittipat Dechkul',
                                    share_with: ['KD'],
                                    last_edited: new Date(),
                                    path: '/11012323112',
                                },
                            ]}
                            cardBordered
                            cardProps={{
                                headStyle: { marginBottom: '16px' },
                                title: (
                                    <Typography.Title
                                        level={4}
                                        className="inline"
                                        style={{ marginBottom: '24px' }}
                                    >
                                        โฟลเดอร์เคส{' '}
                                        <Badge count={1} color={'#8e5531'} />
                                    </Typography.Title>
                                ),
                                extra: (
                                    <Space>
                                        <ConfigProvider locale={thTH}>
                                            <ModalForm<TCreateFolder>
                                                trigger={
                                                    <Button
                                                        type="primary"
                                                        size="large"
                                                        icon={
                                                            <RiFolderAddFill className="icon mr-2" />
                                                        }
                                                    >
                                                        สร้างเคสใหม่
                                                    </Button>
                                                }
                                                form={form}
                                                title={
                                                    <Space>
                                                        <RiFolderAddFill className="icon" />
                                                        <span className="text-base">
                                                            สร้างเคสใหม่
                                                        </span>
                                                    </Space>
                                                }
                                                autoFocusFirstInput
                                                modalProps={{
                                                    destroyOnClose: true,
                                                }}
                                                onFinish={async (values) => {
                                                    console.log(values);
                                                }}
                                            >
                                                <ProFormText
                                                    name="name"
                                                    label="ชื่อเคส"
                                                    placeholder={'ชื่อเคส'}
                                                    rules={[{ required: true }]}
                                                />
                                                <ProFormText
                                                    name="caseNumber"
                                                    label="หมายเลขคดี"
                                                    rules={[{ required: true }]}
                                                    placeholder={
                                                        'หมายเลขคดีดำ/แดง'
                                                    }
                                                />
                                                <Collapse
                                                    ghost
                                                    expandIconPosition="end"
                                                >
                                                    <Collapse.Panel
                                                        header={
                                                            <div className="p-0">
                                                                รายละเอียดเพิ่มเติม
                                                            </div>
                                                        }
                                                        key="moreDetails"
                                                    >
                                                        <ProFormText
                                                            name="email"
                                                            label="อีเมลลูกความ"
                                                            placeholder={
                                                                'อีเมลของลูกความ'
                                                            }
                                                            rules={[
                                                                {
                                                                    type: 'email',
                                                                    message:
                                                                        'กรุณากรอกอีเมลให้ถูกต้อง',
                                                                },
                                                            ]}
                                                        />
                                                        <ProFormText
                                                            name="title"
                                                            label="ข้อหา"
                                                            placeholder={
                                                                'ข้อหา'
                                                            }
                                                        />
                                                        <ProFormTextArea
                                                            name="discription"
                                                            label="รายละเอียด"
                                                            placeholder={
                                                                'รายละเอียดเพิ่มเติม'
                                                            }
                                                        />
                                                    </Collapse.Panel>
                                                </Collapse>
                                            </ModalForm>
                                        </ConfigProvider>
                                        <Input
                                            size="large"
                                            placeholder="ค้นหาเอกสาร"
                                            prefix={
                                                <RiSearchLine className="h-5 w-5 cursor-pointer text-gray-500" />
                                            }
                                            suffix={
                                                <RiEqualizerLine className="h-5 w-5 cursor-pointer text-gray-500" />
                                            }
                                        />
                                    </Space>
                                ),
                            }}
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
                                        console.log(record.path);
                                        router.push(`/document${record.path}`);
                                    },
                                };
                            }}
                            pagination={false}
                            dateFormatter={(value) =>
                                dayjs(value).format('DD MMM YYYY')
                            }
                        />
                    </ConfigProvider>
                </Col>
            </Row>
        </BaseLayout.Main>
    );
}

export default CaseFolder;
