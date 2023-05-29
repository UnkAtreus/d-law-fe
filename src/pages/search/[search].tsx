import {
    ProTable,
    ProColumns,
    ProFormSelect,
    ProForm,
} from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';
import BaseModal from '@baseComponents/BaseModal';
import AuthAction from '@hoc/AuthAction';
import withAuthUserSSR from '@hoc/withAuthUserSSR';
import { TAuthUser, ResponseData, TSearch } from '@interfaces/index';
import { getItem } from '@pages/preview/[preview]';
import FileServicePath from '@services/FileService';
import useRequest, { fetcher } from '@services/useRequest';
import { getAvatarName, showFileIcon } from '@utilities/index';
import logDebug from '@utilities/logDebug';
import useCopyToClipboard from '@utilities/useCopyToClipboard';
import {
    Tag,
    Row,
    Col,
    Space,
    Button,
    Input,
    Dropdown,
    MenuProps,
    message,
    Popover,
    InputRef,
    Typography,
    Badge,
} from 'antd';

import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useCallback, useRef } from 'react';
import {
    RiFile2Fill,
    RiEqualizerLine,
    RiSearchLine,
    RiDeleteBinLine,
    RiDownloadLine,
    RiFileCopyLine,
    RiEyeLine,
    RiMore2Fill,
    RiFilter2Fill,
} from 'react-icons/ri';

function Search({
    path,
    authUser,
    data,
    params,
}: {
    path: string;
    authUser: TAuthUser;
    data: ResponseData<TSearch[]>;
    params: Record<string, string>;
}) {
    const { token } = authUser;
    const folderId = params?.folderId || '';

    const avatarName = getAvatarName(authUser.firstName, authUser.lastName);
    const {
        data: searchData,
        mutate,
        isLoading,
    } = useRequest({
        url: FileServicePath.SEARCH_FILE + path,
        token,
        initData: data,
        params: params,
    });

    const dataFileList = searchData?.data || [];

    const selectedRecordRef = useRef<TSearch>(dataFileList[0]);
    const searchRef = useRef<InputRef>(null);

    const router = useRouter();
    const [_, copy] = useCopyToClipboard();

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

    const contextMenuHandler = useCallback(
        async (key: string, type: 'Folder' | 'File', record: TSearch) => {
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

                            return true;
                        } catch (error) {
                            message.error(`ลบ${fileType}ไม่สำเร็จ`);
                            return false;
                        }
                    },
                });
            }
        },
        [copy, mutate, router, token]
    );

    const columns: ProColumns<TSearch>[] = [
        {
            title: <RiFile2Fill className="m-auto" />,
            dataIndex: 'type',
            render: (_, record) => {
                if (record?.tags?.length === 0) return showFileIcon('text');
                if (record?.tags?.length > 0)
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
                    {record?.tags?.map((item) => {
                        if (item.name === 'folder') {
                            return null;
                        }
                        return <Tag key={item.id}>{item.displayName}</Tag>;
                    })}
                </div>
            ),
        },
        {
            title: 'วันที่สร้าง',
            dataIndex: 'createdAt',

            // valueType: 'dateTime',
            render: (text: any) => (
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
                return (
                    <Dropdown
                        menu={{
                            onClick: ({ key }) => {
                                selectedRecordRef.current = record;

                                contextMenuHandler(key, 'File', record);
                            },
                            items: info_file,
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
        <BaseLayout.Main path={'document'} avatarName={avatarName}>
            <Row>
                <Col span={24} className="space-y-6">
                    <ProTable<TSearch>
                        columns={columns}
                        dataSource={dataFileList}
                        loading={isLoading}
                        components={{
                            body: {
                                row: ({ ...props }) => {
                                    if (props.children[0]) {
                                        const record =
                                            props.children[0]?.props.record;

                                        return (
                                            <Dropdown
                                                menu={{
                                                    onClick: ({ key }) => {
                                                        contextMenuHandler(
                                                            key,
                                                            'File',
                                                            record
                                                        );
                                                    },
                                                    items: info_file,
                                                }}
                                                trigger={['contextMenu']}
                                            >
                                                <tr
                                                    className={props.className}
                                                    onDoubleClick={() => {
                                                        router.push(
                                                            `/preview/${record.id}`
                                                        );
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
                                    <Typography.Title
                                        level={4}
                                        className="inline"
                                        style={{ marginBottom: '24px' }}
                                    >
                                        ค้าหาไฟล์เอกสาร{' '}
                                        <Badge
                                            count={
                                                searchData?.pagination?.total
                                            }
                                            color={'#8e5531'}
                                        />
                                    </Typography.Title>
                                </div>
                            ),
                            extra: (
                                <Space size={'middle'}>
                                    <Input
                                        size="large"
                                        placeholder="ค้นหาเอกสาร"
                                        ref={searchRef}
                                        onChange={() => {}}
                                        prefix={
                                            <RiSearchLine
                                                onClick={() => {
                                                    const value =
                                                        searchRef.current?.input
                                                            ?.value;

                                                    const urlParam =
                                                        new URLSearchParams(
                                                            folderId
                                                        );
                                                    router.push(
                                                        `/search/${value}?${urlParam}`
                                                    );
                                                }}
                                                className="mr-2 h-5 w-5 cursor-pointer text-gray-500"
                                            />
                                        }
                                        suffix={
                                            <Popover
                                                placement="bottomRight"
                                                title={
                                                    <Space>
                                                        <RiFilter2Fill className="icon " />
                                                        <span>
                                                            ค้นหาแบบละเอียด
                                                        </span>
                                                    </Space>
                                                }
                                                content={
                                                    <ProForm<{
                                                        tags: string;
                                                        type: string;
                                                    }>
                                                        onFinish={async (
                                                            values
                                                        ) => {
                                                            logDebug(
                                                                values,
                                                                folderId
                                                            );

                                                            const value =
                                                                searchRef
                                                                    .current
                                                                    ?.input
                                                                    ?.value;

                                                            const urlParam =
                                                                new URLSearchParams(
                                                                    {
                                                                        ...values,
                                                                        folderId,
                                                                    }
                                                                ).toString();

                                                            router.push(
                                                                `/search/${value}?${urlParam}`
                                                            );
                                                        }}
                                                        submitter={{
                                                            searchConfig: {
                                                                submitText:
                                                                    'ค้นหา',
                                                            },
                                                        }}
                                                    >
                                                        <ProFormSelect
                                                            name="tags"
                                                            label="หมวดหมู่ไฟล์"
                                                            width={'sm'}
                                                            request={async () => {
                                                                const { data } =
                                                                    await fetcher(
                                                                        'file_types',
                                                                        'GET',
                                                                        {
                                                                            headers:
                                                                                {
                                                                                    Authorization:
                                                                                        'Bearer ' +
                                                                                        token,
                                                                                },
                                                                        }
                                                                    );

                                                                return data.map(
                                                                    (item: {
                                                                        name: string;
                                                                        id: string;
                                                                    }) => {
                                                                        return {
                                                                            label: item.name,
                                                                            value: item.name,
                                                                        };
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                        <ProFormSelect
                                                            name="type"
                                                            label="ชนิดไฟล์"
                                                            width={'sm'}
                                                            request={async () => {
                                                                const { data } =
                                                                    await fetcher(
                                                                        'tags/menu',
                                                                        'GET',
                                                                        {
                                                                            headers:
                                                                                {
                                                                                    Authorization:
                                                                                        'Bearer ' +
                                                                                        token,
                                                                                },
                                                                        }
                                                                    );

                                                                return data.map(
                                                                    (item: {
                                                                        name: string;
                                                                        id: string;
                                                                    }) => {
                                                                        return {
                                                                            label: item.name,
                                                                            value: item.name,
                                                                        };
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                    </ProForm>
                                                }
                                                trigger={['click']}
                                            >
                                                <RiEqualizerLine className="icon__button cursor-pointer text-gray-500" />
                                            </Popover>
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
                                    router.push(`/preview/${record.id}`);
                                },
                            };
                        }}
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
    );
}
export const getServerSideProps = withAuthUserSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx: any) => {
    const authUser: TAuthUser = ctx.AuthUser;
    const token = authUser.token;

    const { params, query } = ctx;
    const { search } = params;
    console.log('🚀 ~ query:', query);
    console.log('🚀 ~ search:', search);

    const data = await fetcher(FileServicePath.SEARCH_FILE + search, 'GET', {
        headers: {
            Authorization: 'Bearer ' + token,
        },
        params: query,
    });

    return {
        props: {
            authUser,
            data,
            path: search || null,
            params: query || null,
        },
    };
});

export default Search;
