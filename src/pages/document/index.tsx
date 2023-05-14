import {
    ModalForm,
    ProFormText,
    ProFormTextArea,
    ProColumns,
    ProTable,
    ProForm,
    ProFormSelect,
} from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';
import {
    Avatar,
    Badge,
    Button,
    Col,
    Collapse,
    Dropdown,
    Form,
    Input,
    InputRef,
    MenuProps,
    Popover,
    Row,
    Space,
    Tooltip,
    Tour,
    TourProps,
    Typography,
    message,
} from 'antd';
import React, { useCallback, useRef, useState } from 'react';

import {
    RiDeleteBinLine,
    RiEqualizerLine,
    RiEyeLine,
    RiFile2Fill,
    RiFileCopyLine,
    RiFilter2Fill,
    RiFolder5Fill,
    RiFolderAddFill,
    RiMore2Fill,
    RiSearchLine,
} from 'react-icons/ri';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import {
    TCreateFolder,
    TCaseFolder,
    TAuthUser,
    TChangeDocumentName,
    ResponseData,
} from '@interfaces/index';
import withAuthUserSSR from '@hoc/withAuthUserSSR';
import AuthAction from '@hoc/AuthAction';
import useRequest, { fetcher } from '@services/useRequest';
import { getItem } from '@pages/preview/[preview]';
import BaseModal from '@baseComponents/BaseModal';
import useCopyToClipboard from '@utilities/useCopyToClipboard';
import logDebug from '@utilities/logDebug';
import caseFolderService from '@services/caseFolderService';
import CaseFolderServicePath from '@services/caseFolderService';
import { getAvatarName, getRandomColor } from '@utilities/index';
import request from 'umi-request';

function CaseFolder({
    data,
    authUser,
}: {
    data: ResponseData<TCaseFolder[]>;
    authUser: TAuthUser;
}) {
    const token = authUser.token || '';
    const avatarName = getAvatarName(authUser.firstName, authUser.lastName);
    const {
        mutate,
        data: casesFolderData,
        isLoading,
    } = useRequest({
        url: caseFolderService.GET_ALL_CASE,
        token,
        initData: data,
    });

    const selectedRecordRef = useRef<TCaseFolder>(data.data[0]);
    const searchRef = useRef<InputRef>(null);

    const [tour, setTour] = useState<boolean>(
        casesFolderData?.data.length === 0
    );
    const createCaseTour = useRef(null);
    const searchTour = useRef(null);

    const router = useRouter();
    const [_, copy] = useCopyToClipboard();
    const [form] = Form.useForm<TCreateFolder>();

    const steps: TourProps['steps'] = [
        {
            title: 'ยินดีต้อนรับเข้าสู่หน้าเคสโฟลเดอร์',
            description:
                'หน้านี้จะเป็นหน้าที่จะแสดงเคสโฟลเดอร์ทั้งหมด โดยจะสามารถสร้าง แก้ไข ลบเคสโฟลเดอร์ที่เป็นเจ้าของอยู่ได้ ',
            target: null,
            nextButtonProps: {
                children: 'ถัดไป',
            },
            prevButtonProps: {
                children: 'ย้อนกลับ',
            },
        },
        {
            title: 'สร้างเคสใหม่',
            description:
                'คุณสามารถสร้างเคสโฟลเดอร์ใหม่ โดยการกรอกชื่อและหมายเลขคดี',
            target: () => createCaseTour.current,
            nextButtonProps: {
                children: 'ถัดไป',
            },
            prevButtonProps: {
                children: 'ย้อนกลับ',
            },
        },
        {
            title: 'ค้นหาเอกสาร',
            description:
                'สามารถกรอกชื่อไฟล์ หรือชนิดของไฟล์ที่ต้องการค้นหาได้ โดยหลังจากกรอกเสร็จแล้ว ให้กดปุ่มแว่นขยายเพื่อทำการ ค้นหาไฟล์ตามที่กรอกไว้',
            target: () => searchTour.current,
            nextButtonProps: {
                children: 'เข้าใจแล้ว',
            },
            prevButtonProps: {
                children: 'ย้อนกลับ',
            },
        },
    ];

    const info_items: MenuProps['items'] = [
        getItem(
            <div className="flex">
                <span className="self-center">เปิดโฟลเดอร์</span>
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
            <BaseModal.ChangeName<TChangeDocumentName>
                onFinish={async (values) => {
                    try {
                        logDebug('🚀 ~ onFinish={ ~ payload:', values);
                        await fetcher(
                            CaseFolderServicePath.UPDATE_CASE +
                                selectedRecordRef.current.id,
                            'PATCH',
                            {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                },
                                data: values,
                            }
                        );
                        message.success('แก้ไขชื่อเคสโฟลเดอร์สำเร็จ');
                        await mutate();

                        return true;
                    } catch (error) {
                        message.error('แก้ไขชื่อเคสโฟลเดอร์ไม่สำเร็จ');
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
        async (key: string, record: TCaseFolder) => {
            logDebug('🚀 ~ key:', key);
            if (key === 'openfile') {
                console.log('🚀 ~ CaseFolder ~ openfile:');
                router.push(`/document/${record.folderId}`);
            }
            if (key === 'copylink') {
                const origin = window.location.origin;
                const isCopy = await copy(
                    `${origin}/document/${record.folderId}`
                );
                if (isCopy) {
                    message.success('คัดลองลิงค์สำเร็จ');
                } else {
                    message.error('เกิดข้อผิดพลาดในการคัดลอกลิงค์');
                }
            }
            if (key === 'delete') {
                BaseModal.delete({
                    title: `ลบโฟลเดอร์ ${record.name}`,
                    content: `คุณต้องการที่จะลบโฟลเดอร์ ${record.name} ใช่หรือไม่`,
                    onFinish: async () => {
                        try {
                            await fetcher(
                                CaseFolderServicePath.DELETE_CASE + record.id,
                                'DELETE',
                                {
                                    headers: {
                                        Authorization: 'Bearer ' + token,
                                    },
                                }
                            );
                            message.success('ลบเคสโฟลเดอร์สำเร็จ');
                            await mutate();
                            return true;
                        } catch (error) {
                            message.error('ลบเคสโฟลเดอร์ไม่สำเร็จ');
                            return false;
                        }
                    },
                });
            }
        },
        []
    );

    const columns: ProColumns<TCaseFolder>[] = [
        {
            title: <RiFile2Fill className="m-auto" />,
            dataIndex: 'type',
            render: () => {
                return <RiFolder5Fill className="icon text-gray-500" />;
            },
            align: 'center',
            width: 48,
        },
        {
            title: 'ชื่อไฟล์',
            dataIndex: 'name',
            ellipsis: true,
        },
        // {
        //     title: 'ชนิดไฟล์',
        //     dataIndex: 'tags',
        //     render: (_, record) => (
        //         <div className="flex flex-wrap">
        //             {/* {record.Folders[0].Tags.map((name) => (
        //                 <Tag key={name}>{name}</Tag>
        //             ))} */}
        //         </div>
        //     ),
        // },
        {
            title: 'วันที่สร้าง/เจ้าของ',
            dataIndex: 'createdAt',
            // valueType: 'dateTime',
            render: (text: any, record) => (
                <div className="flex flex-col ">
                    <div className="text-gray-400">
                        {dayjs(text).format('DD MMM YYYY - HH:MM')}
                    </div>
                    <div>{record.owner.email}</div>
                </div>
            ),
        },
        {
            title: 'แชร์ร่วมกับ',
            dataIndex: 'shareWith',
            render: (text, record) => (
                <Avatar.Group
                    maxCount={4}
                    // maxStyle={{
                    //     color: '#ffffff',
                    //     backgroundColor: '#8e5531bf',
                    // }}
                >
                    {record.shareWith.map((item) => {
                        const color = getRandomColor(item.firstName);
                        const avatarName = getAvatarName(
                            item.firstName,
                            item.lastName
                        );

                        return (
                            <Tooltip
                                title={item.email}
                                placement="top"
                                key={item.id}
                            >
                                <Avatar
                                    style={{
                                        backgroundColor: color,
                                    }}
                                    alt="tset"
                                >
                                    {avatarName}
                                </Avatar>
                            </Tooltip>
                        );
                    })}
                </Avatar.Group>
            ),
        },
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
            render: (_, record) => (
                <Dropdown
                    menu={{
                        onClick: ({ key }) => {
                            selectedRecordRef.current = record;
                            contextMenuHandler(key, record);
                        },
                        items: info_items,
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
            ),
            width: 48,
        },
    ];

    return (
        <BaseLayout.Main path={'document'} avatarName={avatarName}>
            <Row gutter={24}>
                <Col>
                    <ProTable<TCaseFolder>
                        columns={columns}
                        dataSource={casesFolderData?.data}
                        loading={isLoading}
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
                                    <Badge
                                        count={casesFolderData?.data.length}
                                        color={'#8e5531'}
                                    />
                                </Typography.Title>
                            ),
                            extra: (
                                <Space>
                                    <ModalForm<TCreateFolder>
                                        trigger={
                                            <Button
                                                type="primary"
                                                size="large"
                                                ref={createCaseTour}
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
                                            // const casenum = 'อ.6/2566'
                                            try {
                                                const caseNumberSplit =
                                                    values.caseNumber
                                                        .trim()
                                                        .match(
                                                            '^([ก-ฮ]{1,3})\\.?([0-9]{1,4})/([0-9]{1,4})$'
                                                        );
                                                if (caseNumberSplit) {
                                                    const { data } =
                                                        await request.post(
                                                            'https://dlaw-search-ymg4vhbqaa-as.a.run.app/searchcase',
                                                            {
                                                                data: {
                                                                    blackTitle:
                                                                        caseNumberSplit[1],
                                                                    blackId:
                                                                        caseNumberSplit[2],
                                                                    blackYear:
                                                                        caseNumberSplit[3],
                                                                },
                                                            }
                                                        );
                                                    const caseTitle =
                                                        values.caseTitle ||
                                                        data.caseTitle;

                                                    const caseContent =
                                                        values.caseContent ||
                                                        data.caseContent;

                                                    const payload = {
                                                        blackCaseNumber:
                                                            values.caseNumber,
                                                        RedCaseNumber:
                                                            data.RedCaseNumber ||
                                                            '',
                                                        name: values.name,
                                                        email:
                                                            values.email || '',
                                                        caseTitle:
                                                            caseTitle || '',
                                                        caseContent:
                                                            caseContent || '',
                                                    };
                                                    logDebug(
                                                        '🚀 ~ onFinish={ ~ payload:',
                                                        payload
                                                    );
                                                    await fetcher(
                                                        CaseFolderServicePath.CREATE_CASE,
                                                        'POST',
                                                        {
                                                            headers: {
                                                                Authorization:
                                                                    'Bearer ' +
                                                                    token,
                                                            },
                                                            data: payload,
                                                        }
                                                    );
                                                    message.success(
                                                        'สร้างเคสโฟลเดอร์สำเร็จ'
                                                    );
                                                    await mutate();

                                                    return true;
                                                }
                                            } catch (error) {
                                                message.error(
                                                    'สร้างเคสโฟลเดอร์ไม่สำเร็จ'
                                                );
                                                return false;
                                            }
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
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                                {
                                                    pattern:
                                                        /^[ก-ฮ]{1,3}.?[0-9]{1,4}\/[0-9]{1,4}$/,
                                                    message:
                                                        'กรุณากรอกหมายเลขคดีให้ถูกต้อง',
                                                },
                                            ]}
                                            placeholder={'หมายเลขคดีดำ/แดง'}
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
                                                    name="caseTitle"
                                                    label="ข้อหา"
                                                    placeholder={'ข้อหา'}
                                                />
                                                <ProFormTextArea
                                                    name="caseContent"
                                                    label="รายละเอียด"
                                                    placeholder={
                                                        'รายละเอียดเพิ่มเติม'
                                                    }
                                                />
                                            </Collapse.Panel>
                                        </Collapse>
                                    </ModalForm>

                                    <div ref={searchTour}>
                                        <Input
                                            size="large"
                                            placeholder="ค้นหาเอกสาร"
                                            ref={searchRef}
                                            onChange={() => {}}
                                            prefix={
                                                <RiSearchLine
                                                    onClick={() => {
                                                        const value =
                                                            searchRef.current
                                                                ?.input?.value;

                                                        router.push(
                                                            `/search/${value}`
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
                                                            <RiFilter2Fill className="icon" />
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
                                                                const value =
                                                                    searchRef
                                                                        .current
                                                                        ?.input
                                                                        ?.value;

                                                                const urlParam =
                                                                    new URLSearchParams(
                                                                        values
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
                                                                    const {
                                                                        data,
                                                                    } =
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
                                                                    const {
                                                                        data,
                                                                    } =
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
                                    </div>
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
                                    router.push(`/document/${record.folderId}`);
                                },
                                onContextMenu: () => {
                                    selectedRecordRef.current = record;
                                },
                            };
                        }}
                        pagination={false}
                        dateFormatter={(value) =>
                            dayjs(value).format('DD MMM YYYY')
                        }
                        components={{
                            body: {
                                wrapper: ({ ...props }) => {
                                    return (
                                        <Dropdown
                                            menu={{
                                                onClick: ({ key }) =>
                                                    contextMenuHandler(
                                                        key,
                                                        selectedRecordRef.current
                                                    ),
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
                    />
                </Col>
            </Row>

            <Tour
                open={tour}
                steps={steps}
                onClose={() => {
                    setTour(false);
                }}
            />
        </BaseLayout.Main>
    );
}

export const getServerSideProps = withAuthUserSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx: any) => {
    const authUser: TAuthUser = ctx.AuthUser;
    const token = authUser.token;

    const data = await fetcher(caseFolderService.GET_ALL_CASE, 'GET', {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    });

    return {
        props: {
            authUser,
            data,
        },
    };
});

export default CaseFolder;
