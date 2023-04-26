import {
    ProTable,
    ProColumns,
    ModalForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';
import BaseModal from '@baseComponents/BaseModal';
import BaseTag, { ITag } from '@baseComponents/BaseTag';
import AuthAction from '@hoc/AuthAction';
import withAuthUserSSR from '@hoc/withAuthUserSSR';
import {
    TCreateFolder,
    TCreateSubFolder,
    TChangeDocumentName,
    TAuthUser,
    TMyCaseFolder,
    TDocument,
} from '@interfaces/index';
import { getItem } from '@pages/preview/[preview]';
import FolderServicePath from '@services/FolderService';
import useRequest, { fetcher } from '@services/useRequest';
import { FileTypeIcons, showFileIcon } from '@utilities/index';
import logDebug from '@utilities/logDebug';
import useUpload, { RenderIconUploadType } from '@utilities/useUpload';
import {
    Form,
    Tag,
    Avatar,
    Row,
    Col,
    Space,
    Button,
    Upload,
    FloatButton,
    Progress,
    Input,
    Drawer,
    Divider,
    Breadcrumb,
    Dropdown,
    MenuProps,
} from 'antd';

import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    RiFile2Fill,
    RiFolderAddFill,
    RiFileUploadFill,
    RiUploadLine,
    RiEqualizerLine,
    RiSearchLine,
    RiTeamFill,
    RiHistoryFill,
    RiUserAddFill,
    RiUserLine,
    RiFolderTransferLine,
    RiDeleteBinLine,
    RiDownloadLine,
    RiFileCopyLine,
    RiEyeLine,
    RiMore2Fill,
} from 'react-icons/ri';

function Document({
    path,
    authUser,
    data,
}: {
    path: string[];
    authUser: TAuthUser;
    data: TMyCaseFolder;
}) {
    const { token } = authUser;
    const { data: folderData } = useRequest({
        url: FolderServicePath.GET_BY_ID + path,
        token,
        initData: data,
    });

    const subFolders: TDocument[] = folderData ? folderData.subFolders : [];
    const files: TDocument[] = folderData ? folderData.files : [];

    const hasFolder = subFolders && files;

    const dataFileList: TDocument[] = hasFolder ? subFolders.concat(files) : [];
    logDebug(dataFileList);

    const [isUpload, setIsUpload] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false);
    const [openChangeNameModal, setOpenChangeNameModal] =
        useState<boolean>(false);

    const router = useRouter();
    const { fileLists, setFileLists } = useUpload();
    const [subfolder_form] = Form.useForm<TCreateSubFolder>();
    const [share_form] = Form.useForm<TCreateFolder>();
    const [changeName_form] = Form.useForm<TChangeDocumentName>();
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

    const info_items: MenuProps['items'] = [
        getItem(
            <div className="flex">
                <span className="self-center">ดูตัวอย่างไฟล์</span>
            </div>,
            'openfile',
            <RiEyeLine className="icon__button text-gray-500" />
        ),
        getItem(
            <div className="flex">
                <span className="self-center">คัดลอกลิงค์</span>
            </div>,
            'copylink',
            <RiFileCopyLine className="icon__button text-gray-500" />
        ),
        { type: 'divider' },
        getItem(
            <div className="flex">
                <span className="self-center">ดาวน์โหลดไฟล์</span>
            </div>,
            'downloadfile',
            <RiDownloadLine className="icon__button text-gray-500" />
        ),
        getItem(
            <div className="flex">
                <span className="self-center">ย้ายไฟล์ไปที่</span>
            </div>,
            'movefile',
            <RiFolderTransferLine className="icon__button text-gray-500" />
        ),
        getItem(
            <BaseModal.ChangeName<TChangeDocumentName>
                onFinish={async (value) => {
                    console.log(value);
                }}
                type="folder"
            />,
            'changeDocumentName'
        ),

        { type: 'divider' },
        getItem(
            <div className="flex">
                <span className="self-center">ลบไฟล์</span>
            </div>,
            'delete',
            <RiDeleteBinLine className="icon__button " />,
            undefined,
            undefined,
            true
        ),
    ];

    const columns: ProColumns<TDocument>[] = [
        {
            title: <RiFile2Fill className="m-auto" />,
            dataIndex: 'type',
            render: (_, record) => {
                if (record.tags.length === 0) return showFileIcon('folder');
                if (record.tags.length > 0)
                    return showFileIcon(record.tags[0].name);
            },
            align: 'center',
            width: 48,
        },
        {
            title: 'ชื่อไฟล์',
            dataIndex: 'name',
            ellipsis: true,
            width: 512,
        },
        {
            title: 'แท๊ก',
            dataIndex: 'tags',
            render: (_, record) => (
                <div className="flex flex-wrap">
                    {record.tags.map((item) => (
                        <Tag key={item.id}>{item.name}</Tag>
                    ))}
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
        //         <Avatar.Group maxCount={4}>
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
        {
            dataIndex: 'operation',
            key: 'operation',
            render: () => (
                <Dropdown menu={{ items: info_items }} trigger={['click']}>
                    <Button
                        type="text"
                        shape="circle"
                        icon={
                            <RiMore2Fill className="icon__button text-gray-500" />
                        }
                    ></Button>
                </Dropdown>
            ),
            width: 48,
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

    return (
        <BaseLayout.Main path={'document'}>
            <Row gutter={24}>
                <Col xl={5} xxl={4}>
                    <div className="space-y-4">
                        <Upload
                            multiple
                            showUploadList={false}
                            onChange={(info) => {
                                const file = info.file;
                                if (info.file.status !== 'uploading') {
                                    console.log(info.file, info.fileList);
                                }
                                if (info.file.status === 'done') {
                                    setFileLists((prev) => [...prev, file]);
                                }
                            }}
                            className="document-upload"
                        >
                            <Button
                                icon={
                                    <RiFileUploadFill className="icon__button mr-2" />
                                }
                                size="large"
                                block
                            >
                                อัพโหลดไฟล์เอกสาร
                            </Button>
                        </Upload>
                        <BaseTag
                            items={Tags}
                            defaultTag="tag_1"
                            onChange={(key, tag) => {
                                console.log(key, tag);
                            }}
                        />
                    </div>
                </Col>
                <Col xl={19} xxl={20} className="space-y-6" {...getRootProps()}>
                    <ProTable<TDocument>
                        columns={columns}
                        dataSource={dataFileList}
                        components={{
                            body: {
                                wrapper: ({ ...props }) => {
                                    return (
                                        <Dropdown
                                            menu={{
                                                items: info_items,
                                            }}
                                            trigger={['contextMenu']}
                                        >
                                            <tbody className={props.className}>
                                                {props.children}
                                            </tbody>
                                        </Dropdown>
                                    );
                                },
                            },
                        }}
                        cardBordered
                        cardProps={{
                            headStyle: { marginBottom: '16px' },
                            title: (
                                <div className="mb-6 inline">
                                    <Breadcrumb
                                        separator=">"
                                        className="items-cennter"
                                    >
                                        <Breadcrumb.Item className="text-lg font-medium">
                                            <Link href={'/document'}>
                                                โฟลเดอร์เคส
                                            </Link>
                                        </Breadcrumb.Item>
                                        <Breadcrumb.Item className="h-full text-base font-medium ">
                                            {folderData?.name}
                                        </Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                            ),
                            extra: (
                                <Space size={'middle'}>
                                    <ModalForm<TCreateSubFolder>
                                        trigger={
                                            <Button
                                                type="text"
                                                size="large"
                                                shape="circle"
                                                icon={
                                                    <RiFolderAddFill className="icon text-gray-500" />
                                                }
                                            />
                                        }
                                        form={subfolder_form}
                                        title={
                                            <Space>
                                                <RiFolderAddFill className="icon" />
                                                <span>สร้างโฟลเดอร์ใหม่</span>
                                            </Space>
                                        }
                                        autoFocusFirstInput
                                        modalProps={{
                                            destroyOnClose: true,
                                            okText: 'สร้างโฟลเดอร์',
                                        }}
                                        onFinish={async (values) => {
                                            console.log(values);
                                        }}
                                    >
                                        <ProFormText
                                            name="name"
                                            label="ชื่อโฟลเดอร์"
                                            placeholder={'ชื่อโฟลเดอร์'}
                                            rules={[{ required: true }]}
                                        />
                                    </ModalForm>
                                    <ModalForm<TCreateFolder>
                                        width="640px"
                                        trigger={
                                            <Button
                                                type="text"
                                                size="large"
                                                shape="circle"
                                                icon={
                                                    <RiTeamFill className="icon text-gray-500" />
                                                }
                                            ></Button>
                                        }
                                        form={share_form}
                                        title={
                                            <Space>
                                                <RiUserAddFill className="icon" />
                                                <span className="text-base">
                                                    จัดการสิทธิการเข้าถึง
                                                </span>
                                            </Space>
                                        }
                                        // autoFocusFirstInput
                                        modalProps={{
                                            destroyOnClose: true,
                                            footer: (
                                                <Button key="back">
                                                    Return
                                                </Button>
                                            ),
                                        }}
                                        onFinish={async (values) => {
                                            console.log(values);
                                        }}
                                        initialValues={{
                                            permission: 'watch',
                                        }}
                                    >
                                        <div className="flex w-full items-end space-x-2">
                                            <ProFormSelect
                                                name="name"
                                                label="เพิ่มอีเมล"
                                                placeholder="อีเมล"
                                                mode="multiple"
                                                formItemProps={{
                                                    className: 'w-full',
                                                }}
                                                fieldProps={{
                                                    filterOption: true,
                                                    onChange: (item) => {
                                                        setSelectedItems(item);
                                                    },
                                                    optionItemRender(item) {
                                                        return (
                                                            <div className="flex items-center space-x-2">
                                                                <Avatar
                                                                    icon={
                                                                        <RiUserLine className="icon__button" />
                                                                    }
                                                                />
                                                                <div className="-space-y-1">
                                                                    <div className="text-base font-medium">
                                                                        {
                                                                            item.label
                                                                        }
                                                                    </div>
                                                                    <div className="text-gray-500">
                                                                        {
                                                                            item.value
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    },
                                                    options: [
                                                        {
                                                            label: 'Choolerk T',
                                                            value: 'choolerk@gmail.com',
                                                        },
                                                        {
                                                            label: 'Unresolved',
                                                            value: 'open',
                                                        },
                                                        {
                                                            label: 'Resolved',
                                                            value: 'closed',
                                                        },
                                                        {
                                                            label: 'Resolving',
                                                            value: 'processing',
                                                        },
                                                    ].filter(
                                                        (item) =>
                                                            !selectedItems.includes(
                                                                item.value
                                                            )
                                                    ),
                                                }}
                                            />
                                            <ProFormSelect
                                                name="permission"
                                                valueEnum={{
                                                    watch: 'สามารถดู',
                                                    edit: 'สามารถแก้ไข',
                                                }}
                                                allowClear={false}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar
                                                        size={'large'}
                                                        icon={
                                                            <RiUserLine className="icon" />
                                                        }
                                                    />
                                                    <div className="">
                                                        <div className="text-base font-medium">
                                                            Kittipat Dechkul
                                                        </div>
                                                        <div className="text-gray-500">
                                                            kittipat2544@gmail.com
                                                        </div>
                                                    </div>
                                                </div>
                                                <span>เจ้าของ</span>
                                            </div>
                                        </div>
                                    </ModalForm>
                                    <Button
                                        type="text"
                                        size="large"
                                        shape="circle"
                                        icon={
                                            <RiHistoryFill className="icon text-gray-500" />
                                        }
                                        onClick={() => setOpenMoreInfo(true)}
                                    ></Button>
                                    <Input
                                        size="large"
                                        placeholder="ค้นหาเอกสาร"
                                        prefix={
                                            <RiSearchLine className="h-5 w-5 cursor-pointer text-gray-500" />
                                        }
                                        suffix={
                                            <Dropdown
                                                menu={{ items: [] }}
                                                trigger={['click']}
                                            >
                                                <RiEqualizerLine className="icon__button cursor-pointer text-gray-500" />
                                            </Dropdown>
                                        }
                                        className="w-96"
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
                                    if (record.caseId) {
                                        router.push(`/document/${record.id}`);
                                    } else {
                                        router.push(`/preview/${record.id}`);
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
                                    <div className="absolute bottom-16 left-0  flex h-[calc(100%-110px)] w-full items-center justify-center border border-solid border-primary bg-primary/20">
                                        <div className="fixed bottom-4 z-10 flex h-max w-full  flex-col items-center justify-center space-y-2 ">
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

            <Drawer
                title="บันทึกกิจกรรม"
                placement="right"
                onClose={() => setOpenMoreInfo(false)}
                open={openMoreInfo}
            >
                <div className="space-y-4">
                    <div className="text-gray-500">
                        {dayjs().format('DD MMM YYYY')}
                    </div>
                    <div className="flex space-x-4">
                        <Avatar
                            size={'large'}
                            icon={<RiUserLine className="icon" />}
                        />
                        <div className="flex-1">
                            <div className="h-10 space-x-2 line-clamp-2">
                                <span className="font-medium text-gray-600">
                                    Kittipat Dechkul
                                </span>
                                <span className="text-gray-400">
                                    สร้าง 1 รายการ
                                </span>
                            </div>
                            <div className="space-x-2">
                                <FileTypeIcons.IdCardIcon className="icon text-gray-500" />
                                <span className="text-gray-500">
                                    บัตรประชาชน_171121.pdf
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Avatar
                                size={'small'}
                                icon={
                                    <RiUserLine className="inline-flex h-4 w-4 items-center justify-center" />
                                }
                            />
                            <span className="text-xs text-gray-500">
                                Chooleark T
                            </span>
                        </div>
                        <span className="text-xs text-gray-500">
                            สามารถดู , แก้ไข
                        </span>
                    </div>
                </div>
                <Divider />
            </Drawer>

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
                    <div className="mt-2 ml-4">
                        อัพโหลดทั้งหมด {fileLists.length} รายการ
                    </div>
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

export const getServerSideProps = withAuthUserSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx: any) => {
    const authUser: TAuthUser = ctx.AuthUser;
    const params = ctx.params;
    const { document } = params;
    const token = authUser.token;

    const { data } = await fetcher(
        FolderServicePath.GET_BY_ID + document,
        'GET',
        {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        }
    );

    console.log('🚀 ~ document:', document);
    console.log('🚀 ~ data:', data);
    return {
        props: {
            authUser,
            data,
            path: document || null,
        },
    };
});

export default Document;
