import {
    ProTable,
    ProColumns,
    ModalForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';
import BaseModal from '@baseComponents/BaseModal';
import BaseTag from '@baseComponents/BaseTag';
import AuthAction from '@hoc/AuthAction';
import withAuthUserSSR from '@hoc/withAuthUserSSR';
import {
    TCreateFolder,
    TCreateSubFolder,
    TChangeDocumentName,
    TAuthUser,
    TMyCaseFolder,
    TDocument,
    ResponseData,
    TRootFolder,
    TMenuFolder,
    TMoveFile,
    TCreatePermission,
    TPermission,
    TUserPermissions,
} from '@interfaces/index';
import { getItem } from '@pages/preview/[preview]';
import FileServicePath from '@services/FileService';
import FolderServicePath from '@services/FolderService';
import useRequest, { fetcher } from '@services/useRequest';
import { FileTypeIcons, showFileIcon } from '@utilities/index';
import logDebug from '@utilities/logDebug';
import useCopyToClipboard from '@utilities/useCopyToClipboard';
import useUpload from '@utilities/useUpload';
import {
    Form,
    Tag,
    Avatar,
    Row,
    Col,
    Space,
    Button,
    Upload,
    Input,
    Drawer,
    Divider,
    Breadcrumb,
    Dropdown,
    MenuProps,
    message,
    FloatButton,
} from 'antd';

import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { memo, useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    RiFile2Fill,
    RiFolderAddFill,
    RiFileUploadFill,
    RiEqualizerLine,
    RiSearchLine,
    RiTeamFill,
    RiHistoryFill,
    RiUserAddFill,
    RiUserLine,
    RiDeleteBinLine,
    RiDownloadLine,
    RiFileCopyLine,
    RiEyeLine,
    RiMore2Fill,
    RiUploadLine,
} from 'react-icons/ri';
import UserServicePath from '@services/useAuth';
import PermissionServicePath from '@services/permissionService';
import CaseFolderServicePath from '@services/caseFolderService';

function Document({
    path,
    authUser,
    prefFolder,
    prefRootFolder,
    prefMenu,
}: {
    path: string;
    authUser: TAuthUser;
    prefFolder: ResponseData<TMyCaseFolder>;
    prefRootFolder: ResponseData<TRootFolder[]>;
    prefMenu: ResponseData<TMenuFolder[]>;
}) {
    const { token } = authUser;
    const {
        data: folderData,
        mutate,
        isLoading,
    } = useRequest({
        url: FolderServicePath.GET_BY_ID + path,
        token,
        initData: prefFolder,
    });
    const { data: breadcrumbData } = useRequest({
        url:
            FolderServicePath.FOLDER +
            path +
            FolderServicePath.GET_ROOT_FOLDER_S,
        token,
        initData: prefRootFolder,
    });
    const { data: menuFolderData, mutate: mutateMenu } = useRequest({
        url: FolderServicePath.FOLDER + path + FolderServicePath.MENU_FOLDER_S,
        token,
        initData: prefMenu,
    });

    const { data: casePermissionData, mutate: mutatePermission } = useRequest<
        ResponseData<TUserPermissions[]>
    >({
        url:
            CaseFolderServicePath.CASE +
            folderData?.data.caseId +
            CaseFolderServicePath.ADD_MEMBER_PERMISSION_S,
        token,
    });

    const subFolders: TDocument[] = folderData?.data.subFolders
        ? folderData.data.subFolders
        : [];
    const files: TDocument[] = folderData?.data.files
        ? folderData.data.files
        : [];

    const dataFileList = [...subFolders, ...files];

    const [isUpload, setIsUpload] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false);
    const [hasFiles, setHasFiles] = useState<boolean>(false);

    const selectedRecordRef = useRef<TDocument>(dataFileList[0]);

    const router = useRouter();
    const [_, copy] = useCopyToClipboard();
    const [subfolder_form] = Form.useForm<TCreateSubFolder>();
    const [share_form] = Form.useForm<TCreateFolder>();

    const { Render, handleUpload } = useUpload();
    const { getRootProps, isDragActive } = useDropzone({
        noClick: true,
        noKeyboard: true,
        onDrop: (files: any[]) => {
            if (files) {
                if (!hasFiles) {
                    setIsUpload(true);
                    setHasFiles(true);
                }

                files.forEach(async (file) => {
                    await handleUpload(file, token, path[0]);
                    await mutate();
                    await mutateMenu();
                });
            }
        },
    });

    const RenderFiles = memo(function RenderFiles() {
        return <Render />;
    });

    const info_file: MenuProps['items'] = [
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
            <BaseModal.MoveFile<TMoveFile>
                onFinish={async (values) => {
                    try {
                        logDebug('🚀 ~ onFinish={ ~ payload:', values);
                        logDebug(selectedRecordRef.current);
                        await fetcher(
                            FileServicePath.FILE +
                                selectedRecordRef.current.id +
                                FileServicePath.MOVE_FILE_S,
                            'PATCH',
                            {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                },
                                data: values,
                            }
                        );
                        message.success('ย้ายไฟล์สำเร็จ');
                        await mutate();
                        await mutateMenu();

                        return true;
                    } catch (error) {
                        message.error('ย้ายไฟล์ไม่สำเร็จ');
                        return false;
                    }
                }}
                token={token}
                path={folderData?.data.caseId || ''}
            />,
            'movefile'
        ),
        getItem(
            <BaseModal.ChangeName<TChangeDocumentName>
                onFinish={async (values) => {
                    try {
                        logDebug('🚀 ~ onFinish={ ~ payload:', values);
                        await fetcher(
                            FileServicePath.UPDATE_FILE +
                                selectedRecordRef.current.id,
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
                        await mutateMenu();

                        return true;
                    } catch (error) {
                        message.error('แก้ไขชื่อไฟล์ไม่สำเร็จ');
                        return false;
                    }
                }}
                type="file"
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

    const info_folder: MenuProps['items'] = [
        getItem(
            <div className="flex">
                <span className="self-center">เปิดโฟลเดอร์</span>
            </div>,
            'openfolder',
            <RiEyeLine className="icon__button text-gray-500" />
        ),
        getItem(
            <div className="flex">
                <span className="self-center">คัดลอกลิงค์โฟลเดอร์</span>
            </div>,
            'copylink',
            <RiFileCopyLine className="icon__button text-gray-500" />
        ),
        { type: 'divider' },
        getItem(
            <BaseModal.ChangeName<TChangeDocumentName>
                onFinish={async (values) => {
                    try {
                        logDebug('🚀 ~ onFinish={ ~ payload:', values);
                        await fetcher(
                            FolderServicePath.UPDATE_FOLDER +
                                selectedRecordRef.current.id,
                            'PATCH',
                            {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                },
                                data: values,
                            }
                        );
                        message.success('แก้ไขชื่อโฟลเดอร์สำเร็จ');
                        await mutate();

                        return true;
                    } catch (error) {
                        message.error('แก้ไขชื่อโฟลเดอร์ไม่สำเร็จ');
                        return false;
                    }
                }}
                type="folder"
            />,
            'changeDocumentName'
        ),

        { type: 'divider' },
        getItem(
            <div className="flex">
                <span className="self-center">ลบโฟลเดอร์</span>
            </div>,
            'delete',
            <RiDeleteBinLine className="icon__button " />,
            undefined,
            undefined,
            true
        ),
    ];

    const contextMenuHandler = useCallback(
        async (key: string, type: 'Folder' | 'File', record: TDocument) => {
            const fileType = type === 'Folder' ? 'โฟลเดอร์' : 'ไฟล์';
            logDebug('🚀 ~ key:', key);
            if (key === 'openfile') {
                router.push(`/preview/${record.id}`);
            }
            if (key === 'openfolder') {
                router.push(`/document/${record.id}`);
            }
            if (key === 'downloadfile') {
                const url = record.url;
                if (url) {
                    router.push(url);
                } else {
                    message.error('เกิดข้อผิดพลาดในการดาวน์โหลด');
                }
            }
            if (key === 'copylink') {
                const origin = window.location.origin;
                const isCopy = await copy(`${origin}/preview/${record.id}`);
                if (isCopy) {
                    message.success('คัดลองลิงค์สำเร็จ');
                } else {
                    message.error('เกิดข้อผิดพลาดในการคัดลอกลิงค์');
                }
            }
            if (key === 'delete') {
                BaseModal.delete({
                    title: `ลบ${fileType} ${record.name}`,
                    content: `คุณต้องการที่จะลบ${fileType} ${record.name} ใช่หรือไม่`,
                    onFinish: async () => {
                        try {
                            await fetcher(
                                FileServicePath.DELETE_FILE + record.id,
                                'DELETE',
                                {
                                    headers: {
                                        Authorization: 'Bearer ' + token,
                                    },
                                }
                            );
                            message.success(`ลบ${fileType}สำเร็จ`);
                            await mutate();
                            await mutateMenu();
                            return true;
                        } catch (error) {
                            message.error(`ลบ${fileType}ไม่สำเร็จ`);
                            return false;
                        }
                    },
                });
            }
        },
        []
    );

    const columns: ProColumns<TDocument>[] = [
        {
            title: <RiFile2Fill className="m-auto" />,
            dataIndex: 'type',
            render: (_, record) => {
                if (record.caseId) return showFileIcon('folder');
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
            title: 'ชนิดไฟล์',
            dataIndex: 'tags',
            render: (_, record) => (
                <div className="flex flex-wrap">
                    {record.tags.map((item) => {
                        if (item.name === 'folder') {
                            return null;
                        }
                        return <Tag key={item.id}>{item.name}</Tag>;
                    })}
                </div>
            ),
        },
        {
            title: 'วันที่สร้าง/เจ้าของ',
            dataIndex: 'createdAt',
            sorter: (a, b) => {
                if (a && b) {
                    return dayjs(a.createdAt).diff(dayjs(b.createdAt));
                } else {
                    return 0;
                }
            },
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
            sorter: (a, b) => {
                if (a && b) {
                    return dayjs(a.createdAt).diff(dayjs(b.createdAt));
                } else {
                    return 0;
                }
            },
            render: (text: any) => (
                <div className="text-gray-400">
                    {dayjs(text).format('DD MMM YYYY - HH:MM')}
                </div>
            ),
        },
        {
            dataIndex: 'operation',
            key: 'operation',
            render: (_, record) => {
                const isFolder = record.caseId;
                return (
                    <Dropdown
                        menu={{
                            onClick: ({ key }) => {
                                selectedRecordRef.current = record;
                                if (isFolder) {
                                    contextMenuHandler(key, 'Folder', record);
                                } else {
                                    contextMenuHandler(key, 'File', record);
                                }
                            },
                            items: isFolder ? info_folder : info_file,
                        }}
                        trigger={['click']}
                    >
                        <Button
                            type="text"
                            shape="circle"
                            icon={
                                <RiMore2Fill className="icon__button text-gray-500" />
                            }
                        ></Button>
                    </Dropdown>
                );
            },
            width: 48,
        },
    ];

    return (
        <BaseLayout.Main path={'document'}>
            <Row gutter={24}>
                <Col xl={5} xxl={4}>
                    <div className="space-y-4">
                        <Upload
                            className="document-upload"
                            multiple
                            showUploadList={false}
                            customRequest={async (options) => {
                                const { file } = options;

                                if (file && !hasFiles) {
                                    setHasFiles(true);
                                }
                                try {
                                    const id = await handleUpload(
                                        file,
                                        token,
                                        path[0]
                                    );
                                    await mutate();
                                    await mutateMenu();
                                } catch (error) {
                                    /* empty */
                                }
                            }}
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
                            items={menuFolderData?.data || []}
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
                        loading={isLoading}
                        components={{
                            body: {
                                row: ({ ...props }) => {
                                    const isFolder =
                                        props.children[0]?.props.record.caseId;
                                    if (props.children[0]) {
                                        const record =
                                            props.children[0]?.props.record;

                                        return (
                                            <Dropdown
                                                menu={{
                                                    onClick: ({ key }) => {
                                                        if (isFolder) {
                                                            contextMenuHandler(
                                                                key,
                                                                'Folder',
                                                                record
                                                            );
                                                        } else {
                                                            contextMenuHandler(
                                                                key,
                                                                'File',
                                                                record
                                                            );
                                                        }
                                                    },
                                                    items: isFolder
                                                        ? info_folder
                                                        : info_file,
                                                }}
                                                trigger={['contextMenu']}
                                            >
                                                <tr
                                                    className={props.className}
                                                    onDoubleClick={() => {
                                                        if (record.caseId) {
                                                            router.push(
                                                                `/document/${record.id}`
                                                            );
                                                        } else {
                                                            router.push(
                                                                `/preview/${record.id}`
                                                            );
                                                        }
                                                    }}
                                                    onContextMenu={() => {
                                                        selectedRecordRef.current =
                                                            record;
                                                    }}
                                                >
                                                    {props.children}
                                                </tr>
                                            </Dropdown>
                                        );
                                    } else {
                                        return (
                                            <tr className={props.className}>
                                                {props.children}
                                            </tr>
                                        );
                                    }
                                },
                            },
                        }}
                        cardBordered
                        cardProps={{
                            headStyle: { marginBottom: '16px' },
                            title: (
                                <div className="mb-6 inline">
                                    <Breadcrumb className="items-center">
                                        <Breadcrumb.Item className="text-lg font-medium">
                                            <Link href={'/document'}>
                                                โฟลเดอร์เคส
                                            </Link>
                                        </Breadcrumb.Item>
                                        {breadcrumbData?.data.map((data, i) => {
                                            const size =
                                                breadcrumbData?.data.length;

                                            if (size < 5) {
                                                if (i === size - 1) {
                                                    return (
                                                        <Breadcrumb.Item
                                                            key={data.id}
                                                            className="h-full text-base font-medium "
                                                        >
                                                            {data.name}
                                                        </Breadcrumb.Item>
                                                    );
                                                }
                                                return (
                                                    <Breadcrumb.Item
                                                        key={data.id}
                                                        className="h-full text-base font-medium "
                                                    >
                                                        <Link
                                                            href={`/document/${data.id}`}
                                                        >
                                                            {data.name}
                                                        </Link>
                                                    </Breadcrumb.Item>
                                                );
                                            } else {
                                                if (size === i + 1) {
                                                    return (
                                                        <Breadcrumb.Item
                                                            key={data.id}
                                                            className="h-full text-base font-medium "
                                                        >
                                                            {data.name}
                                                        </Breadcrumb.Item>
                                                    );
                                                }
                                                if (i === 0) {
                                                    return (
                                                        <Breadcrumb.Item
                                                            key={data.id}
                                                            className="h-full text-base font-medium "
                                                        >
                                                            <Link
                                                                href={`/document/${data.id}`}
                                                            >
                                                                {data.name}
                                                            </Link>
                                                        </Breadcrumb.Item>
                                                    );
                                                }
                                                if (i === size - 2) {
                                                    return (
                                                        <Breadcrumb.Item
                                                            key={data.id}
                                                            className="h-full text-base font-medium "
                                                        >
                                                            <Link
                                                                href={`/document/${data.id}`}
                                                            >
                                                                {data.name}
                                                            </Link>
                                                        </Breadcrumb.Item>
                                                    );
                                                }
                                                if (i === 2) {
                                                    const items =
                                                        breadcrumbData?.data
                                                            .slice(1, -1)
                                                            .map(
                                                                ({
                                                                    id,
                                                                    name,
                                                                }) => ({
                                                                    key: id,
                                                                    label: (
                                                                        <Link
                                                                            href={`/document/${id}`}
                                                                        >
                                                                            {
                                                                                name
                                                                            }
                                                                        </Link>
                                                                    ),
                                                                })
                                                            );
                                                    return (
                                                        <Breadcrumb.Item
                                                            key={data.id}
                                                            className="h-full text-base font-medium "
                                                            menu={{
                                                                expandIcon:
                                                                    false,
                                                                itemIcon: false,
                                                                items: items,
                                                            }}
                                                        >
                                                            ...
                                                        </Breadcrumb.Item>
                                                    );
                                                }
                                            }
                                        })}
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
                                            try {
                                                logDebug(
                                                    '🚀 ~ onFinish={ ~ payload:',
                                                    values
                                                );
                                                await fetcher(
                                                    FolderServicePath.CREATE_FOLDER,
                                                    'POST',
                                                    {
                                                        headers: {
                                                            Authorization:
                                                                'Bearer ' +
                                                                token,
                                                        },
                                                        data: {
                                                            name: values.name,
                                                            parentFolderId:
                                                                path[0],
                                                        },
                                                    }
                                                );
                                                message.success(
                                                    'สร้างโฟลเดอร์สำเร็จ'
                                                );
                                                await mutate();

                                                return true;
                                            } catch (error) {
                                                message.error(
                                                    'สร้างโฟลเดอร์ไม่สำเร็จ'
                                                );
                                                return false;
                                            }
                                        }}
                                    >
                                        <ProFormText
                                            name="name"
                                            label="ชื่อโฟลเดอร์"
                                            placeholder={'ชื่อโฟลเดอร์'}
                                            rules={[{ required: true }]}
                                        />
                                    </ModalForm>
                                    <ModalForm<TCreatePermission>
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
                                            try {
                                                logDebug(
                                                    '🚀 ~ onFinish={ ~ payload:',
                                                    values
                                                );
                                                await fetcher(
                                                    CaseFolderServicePath.CASE +
                                                        folderData?.data
                                                            .caseId +
                                                        CaseFolderServicePath.ADD_MEMBER_PERMISSION_S,
                                                    'POST',
                                                    {
                                                        headers: {
                                                            Authorization:
                                                                'Bearer ' +
                                                                token,
                                                        },
                                                        data: values,
                                                    }
                                                );
                                                message.success(
                                                    'เพิ่มสิทธิการเข้าถึงเคสโฟลเดอร์สำเร็จ'
                                                );
                                                await mutatePermission();

                                                return true;
                                            } catch (error) {
                                                message.error(
                                                    'เพิ่มสิทธิการเข้าถึงเคสโฟลเดอร์ไม่สำเร็จ'
                                                );
                                                return false;
                                            }
                                        }}
                                    >
                                        <div className="flex w-full items-end space-x-2">
                                            <ProFormSelect
                                                name="userId"
                                                label="เพิ่มอีเมล"
                                                placeholder="อีเมล"
                                                mode="multiple"
                                                formItemProps={{
                                                    className: 'w-full',
                                                }}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'กรุณาเลือกอีเมล',
                                                    },
                                                ]}
                                                request={async () => {
                                                    const { data } =
                                                        await fetcher(
                                                            UserServicePath.GET_ALL_USER,
                                                            'GET',
                                                            {
                                                                headers: {
                                                                    Authorization:
                                                                        'Bearer ' +
                                                                        token,
                                                                },
                                                            }
                                                        );

                                                    return data
                                                        .map(
                                                            (
                                                                item: TAuthUser
                                                            ) => {
                                                                if (
                                                                    item.id !==
                                                                    authUser.id
                                                                )
                                                                    return {
                                                                        label: JSON.stringify(
                                                                            {
                                                                                email: item.email,
                                                                                firstName:
                                                                                    item.firstName,
                                                                                lastName:
                                                                                    item.lastName,
                                                                            }
                                                                        ),
                                                                        value: item.id,
                                                                    };
                                                            }
                                                        )
                                                        .filter(
                                                            (item: any) =>
                                                                item !==
                                                                undefined
                                                        );
                                                }}
                                                fieldProps={{
                                                    filterOption: true,

                                                    tagRender: (props: any) => {
                                                        if (props?.label) {
                                                            const { email } =
                                                                JSON.parse(
                                                                    props.label
                                                                );
                                                            return (
                                                                <Tag>
                                                                    {email}
                                                                </Tag>
                                                            );
                                                        }
                                                        return <></>;
                                                    },
                                                    optionItemRender(item) {
                                                        const {
                                                            firstName,
                                                            lastName,
                                                            email,
                                                        } = JSON.parse(
                                                            item.label
                                                        );
                                                        return (
                                                            <div className="flex items-center space-x-2">
                                                                <Avatar
                                                                    icon={
                                                                        <RiUserLine className="icon__button" />
                                                                    }
                                                                />
                                                                <div className="-space-y-1">
                                                                    <div className=" font-medium">
                                                                        {firstName +
                                                                            ' ' +
                                                                            lastName}
                                                                    </div>
                                                                    <div className="text-gray-500">
                                                                        {email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    },
                                                }}
                                            />
                                            <ProFormSelect
                                                name="permission"
                                                allowClear={false}
                                                rules={[{ required: true }]}
                                                style={{
                                                    minWidth: '120px',
                                                }}
                                                request={async () => {
                                                    const { data } =
                                                        await fetcher(
                                                            PermissionServicePath.GET_ALL_PERMISSSION,
                                                            'GET',
                                                            {
                                                                headers: {
                                                                    Authorization:
                                                                        'Bearer ' +
                                                                        token,
                                                                },
                                                            }
                                                        );

                                                    return data
                                                        .map(
                                                            (
                                                                item: TPermission
                                                            ) => {
                                                                const name =
                                                                    item.Name;
                                                                const permission_name: any =
                                                                    {
                                                                        editor: 'สามารถแก้ไข',
                                                                        viewer: 'สามารถดู',
                                                                    };

                                                                if (
                                                                    permission_name[
                                                                        name
                                                                    ]
                                                                ) {
                                                                    return {
                                                                        label: permission_name[
                                                                            name
                                                                        ],
                                                                        value: item.Name,
                                                                    };
                                                                }
                                                            }
                                                        )
                                                        .filter(
                                                            (item: any) =>
                                                                item !==
                                                                undefined
                                                        );
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            {casePermissionData?.data.map(
                                                (item) => {
                                                    const permission_name: any =
                                                        {
                                                            owner: 'เจ้าของ',
                                                            editor: 'สามารถแก้ไข',
                                                            viewer: 'สามารถดู',
                                                        };
                                                    return (
                                                        <div
                                                            className="flex items-center justify-between"
                                                            key={item.email}
                                                        >
                                                            <div className="flex items-center space-x-4">
                                                                <Avatar
                                                                    size={
                                                                        'large'
                                                                    }
                                                                    // icon={
                                                                    //     <RiUserLine className="icon" />
                                                                    // }
                                                                >
                                                                    {`${item.firstName.charAt(
                                                                        0
                                                                    )}${item.lastName.charAt(
                                                                        0
                                                                    )}`}
                                                                </Avatar>
                                                                <div className="">
                                                                    <div className="text-base font-medium">
                                                                        {`${item.firstName} ${item.lastName}`}
                                                                    </div>
                                                                    <div className="text-gray-500">
                                                                        {
                                                                            item.email
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <span>
                                                                {
                                                                    permission_name[
                                                                        item
                                                                            .permission
                                                                    ]
                                                                }
                                                            </span>
                                                        </div>
                                                    );
                                                }
                                            )}
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
                className={`${hasFiles ? 'block' : 'hidden'}`}
                style={{ right: 16, bottom: 24 }}
                open={isUpload}
                onOpenChange={(open) => {
                    setIsUpload(!open);
                }}
                icon={<RiUploadLine className="text-white" />}
            >
                <RenderFiles />
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

    const prefFolder = await fetcher(
        FolderServicePath.GET_BY_ID + document,
        'GET',
        {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        }
    );

    const prefRootFolder = await fetcher(
        FolderServicePath.FOLDER +
            document +
            FolderServicePath.GET_ROOT_FOLDER_S,
        'GET',
        {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        }
    );

    const prefMenu = await fetcher(
        FolderServicePath.FOLDER + document + FolderServicePath.MENU_FOLDER_S,
        'GET',
        {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        }
    );

    return {
        props: {
            authUser,
            prefFolder,
            prefRootFolder,
            prefMenu,
            path: document || null,
        },
    };
});

export default Document;
