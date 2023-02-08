import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import BaseLayout from '@baseComponents/BaseLayout';
import { TCreateFolder, TCaseFolder } from '@interfaces/index';
import thTH from '@locales/th_TH';
import useUpload, { RenderIconUploadType } from '@utilities/useUpload';
import {
    Form,
    Tag,
    Avatar,
    Row,
    Col,
    ConfigProvider,
    Typography,
    Badge,
    Space,
    Button,
    Collapse,
    Upload,
    FloatButton,
    Progress,
} from 'antd';
import en_US from 'antd/locale/en_US';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    RiFile2Fill,
    RiFolder5Fill,
    RiFolderAddFill,
    RiFileUploadFill,
    RiUploadLine,
} from 'react-icons/ri';

export async function getServerSideProps(ctx: any) {
    const { params } = ctx;
    const { document } = params;

    return {
        props: {
            path: document || null,
        },
    };
}

function Document({ path }: { path: string[] }) {
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

    const basePath = path.join('/');
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
                                                        size="middle"
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
                                                        <span>
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
                                        <Upload
                                            multiple
                                            showUploadList={false}
                                            onChange={(info) => {
                                                const file = info.file;
                                                if (
                                                    info.file.status !==
                                                    'uploading'
                                                ) {
                                                    console.log(
                                                        info.file,
                                                        info.fileList
                                                    );
                                                }
                                                if (
                                                    info.file.status === 'done'
                                                ) {
                                                    setFileLists((prev) => [
                                                        ...prev,
                                                        file,
                                                    ]);
                                                }
                                            }}
                                        >
                                            <Button></Button>
                                        </Upload>
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
                            onRow={(record, rowIndex) => {
                                return {
                                    onDoubleClick: (event) => {
                                        console.log(record.path);
                                        router.push(`/document/${record.path}`);
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
                    </ConfigProvider>
                </Col>
            </Row>

            <FloatButton.Group
                trigger="click"
                type="primary"
                className={`${fileLists.length > 0 ? 'block' : 'hidden'}`}
                style={{ right: 24 }}
                open={isUpload}
                onOpenChange={(open) => {
                    setIsUpload(!open);
                }}
                icon={<RiUploadLine className="text-white" />}
            >
                <div className="float-right mb-4 w-80 rounded border border-solid border-primary/70 bg-white px-2 py-2">
                    <div className="mt-2 ml-4">อัพโหลดทั้งหมด {1} รายการ</div>
                    <Upload
                        customRequest={({ onSuccess }) => {
                            setTimeout(() => {
                                if (onSuccess) onSuccess('ok');
                            }, 0);
                        }}
                        fileList={fileLists}
                        itemRender={(_, file, fileList) => {
                            // console.log('file', file);
                            // console.log('fileList', fileList);

                            const fileType = file.type?.split('/')[0] || '';
                            // console.log(file.type?.split('/')[0]);

                            return (
                                <div className="relative  mt-1 flex items-center rounded px-4 py-2 transition hover:bg-primary/10">
                                    <span role="img" className="mr-2 ">
                                        {RenderIconUploadType(fileType)}
                                    </span>

                                    <div
                                        className={`flex-1 ${
                                            file ? 'mb-2' : ''
                                        }`}
                                    >
                                        {file.name}
                                    </div>
                                    {/* <span className="">
                                        {RenderUploadStatus(file.status)}
                                    </span> */}
                                    <div className="absolute -bottom-2 left-10 z-10 w-[calc(100%-48px)]">
                                        <Progress
                                            percent={30}
                                            strokeWidth={2}
                                            showInfo={false}
                                            // status="exception"
                                        />
                                    </div>
                                </div>
                            );
                        }}
                    ></Upload>
                </div>
            </FloatButton.Group>
        </BaseLayout.Main>
    );
}

export default Document;
