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
import {
    TCreateFolder,
    TCaseFolder,
    TCreateSubFolder,
    TChangeDocumentName,
} from '@interfaces/index';
import { getItem } from '@pages/preview/[preview]';
import { FileTypeIcons, FileTypes, showFileIcon } from '@utilities/index';
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
import { DOCUMENT_DATASOURCE } from 'mocks/mockTable';
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
                <span className="self-center">??????????????????????????????????????????</span>
            </div>,
            'openfile',
            <RiEyeLine className="icon__button text-gray-500" />
        ),
        getItem(
            <div className="flex">
                <span className="self-center">?????????????????????????????????</span>
            </div>,
            'copylink',
            <RiFileCopyLine className="icon__button text-gray-500" />
        ),
        { type: 'divider' },
        getItem(
            <div className="flex">
                <span className="self-center">???????????????????????????????????????</span>
            </div>,
            'downloadfile',
            <RiDownloadLine className="icon__button text-gray-500" />
        ),
        getItem(
            <div className="flex">
                <span className="self-center">???????????????????????????????????????</span>
            </div>,
            'movefile',
            <RiFolderTransferLine className="icon__button text-gray-500" />
        ),
        getItem(
            <BaseModal.ChangeName<TChangeDocumentName>
                form={changeName_form}
            />,
            'changeDocumentName'
        ),

        { type: 'divider' },
        getItem(
            <div className="flex">
                <span className="self-center">??????????????????</span>
            </div>,
            'delete',
            <RiDeleteBinLine className="icon__button " />,
            undefined,
            undefined,
            true
        ),
    ];

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
            title: '????????????????????????',
            dataIndex: 'title',
            ellipsis: true,
        },
        {
            title: '????????????',
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
            title: '?????????????????????????????????/?????????????????????',
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
            title: '?????????????????????????????????',
            dataIndex: 'share_with',
            render: (text, record) => (
                <Avatar.Group maxCount={4}>
                    <Avatar>{text}</Avatar>
                </Avatar.Group>
            ),
        },
        {
            title: '?????????????????????????????????',
            dataIndex: 'last_edited',
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
            name: '???????????????????????????????????????',
            icon: <TextIcon className="icon" />,
            value: '22',
        },
        {
            key: 'tag_2',
            name: '????????????????????????????????????????????????????????????????????????',
            icon: <IdCardIcon className="icon" />,
            value: '2',
            onClick: () => {
                console.log(`test`);
            },
        },
        {
            key: 'tag_3',
            name: '?????????????????? Excel',
            icon: <ExcelIcon className="icon" />,
            value: '5',
        },
        {
            key: 'tag_4',
            name: '?????????????????? PDF',
            icon: <PdfIcon className="icon" />,
            value: '10',
        },
        {
            key: 'tag_5',
            name: '?????????????????? Word',
            icon: <WordIcon className="icon" />,
            value: '2',
        },
        {
            key: 'tag_6',
            name: '??????????????????',
            icon: <ImageIcon className="icon" />,
            value: '2',
        },
        {
            key: 'tag_7',
            name: '??????????????????',
            icon: <VideoIcon className="icon" />,
            value: '2',
        },
        {
            key: 'tag_8',
            name: '???????????????',
            icon: <MusicIcon className="icon" />,
            value: '1',
        },
        {
            key: 'tag_9',
            name: '??????????????????',
            icon: <ZipIcon className="icon" />,
            value: '2',
        },
        {
            key: 'tag_10',
            name: '?????????????????????????????????',
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
                                ???????????????????????????????????????????????????
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
                    <ProTable<TCaseFolder>
                        columns={columns}
                        dataSource={DOCUMENT_DATASOURCE}
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
                                                ?????????????????????????????????
                                            </Link>
                                        </Breadcrumb.Item>
                                        <Breadcrumb.Item className="h-full text-base font-medium ">
                                            ????????????????????????
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
                                                <span>???????????????????????????????????????????????????</span>
                                            </Space>
                                        }
                                        autoFocusFirstInput
                                        modalProps={{
                                            destroyOnClose: true,
                                            okText: '???????????????????????????????????????',
                                        }}
                                        onFinish={async (values) => {
                                            console.log(values);
                                        }}
                                    >
                                        <ProFormText
                                            name="name"
                                            label="????????????????????????????????????"
                                            placeholder={'????????????????????????????????????'}
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
                                                    ???????????????????????????????????????????????????????????????
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
                                                label="??????????????????????????????"
                                                placeholder="???????????????"
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
                                                    watch: '????????????????????????',
                                                    edit: '?????????????????????????????????',
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
                                                <span>?????????????????????</span>
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
                                        placeholder="?????????????????????????????????"
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
                                    if (record.type === FileTypes.FOLDER) {
                                        router.push(`/document${record.path}`);
                                    } else {
                                        router.push(
                                            `/preview${record.path}?type=${record.type}`,
                                            `/preview${record.path}`
                                        );
                                    }
                                },
                                onContextMenu: (contextmenu) => {
                                    console.log(
                                        '???? ~ file: [...document].tsx:518 ~ Document ~ contextmenu',
                                        contextmenu
                                    );
                                },
                                onClick: (clickEvent) => {
                                    console.log(
                                        '???? ~ file: [...document].tsx:646 ~ Document ~ clickEvent:',
                                        clickEvent
                                    );
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
                                                    ?????????????????????
                                                </div>
                                                <div className="text-white">
                                                    ????????????????????????????????????
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
                title="???????????????????????????????????????"
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
                                    ??????????????? 1 ??????????????????
                                </span>
                            </div>
                            <div className="space-x-2">
                                <FileTypeIcons.IdCardIcon className="icon text-gray-500" />
                                <span className="text-gray-500">
                                    ?????????????????????????????????_171121.pdf
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
                            ???????????????????????? , ???????????????
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
                        ?????????????????????????????????????????? {fileLists.length} ??????????????????
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

export default Document;
