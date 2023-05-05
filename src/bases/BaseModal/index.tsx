/* eslint-disable unused-imports/no-unused-vars */
import {
    ModalForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import CaseFolderServicePath from '@services/caseFolderService';

import { fetcher } from '@services/useRequest';
import { Modal, Space } from 'antd';
import React from 'react';
import { RiEditFill, RiEditLine, RiFolderTransferLine } from 'react-icons/ri';

const BaseModal = {
    delete({
        title,
        content,
        onFinish,
    }: {
        title: string;
        content: string;
        onFinish: () => void;
    }) {
        return Modal.confirm({
            title: title,
            //  icon: <ExclamationCircleFilled />,
            content: content,
            onOk: onFinish,
            okType: 'danger',
        });
    },
    ChangeName<T>({
        onFinish,
        type = 'file',
    }: {
        onFinish:
            | (((formData: T) => Promise<boolean | void>) &
                  ((formData: T) => Promise<any>))
            | undefined;
        type?: 'file' | 'folder';
    }) {
        return (
            <ModalForm<T>
                trigger={
                    <div className="flex space-x-2">
                        <RiEditLine className="icon__button text-gray-500" />
                        <span className="self-center">เปลี่ยนชื่อ</span>
                    </div>
                }
                title={
                    <Space>
                        <RiEditFill className="icon" />
                        <span>
                            เปลี่ยนชื่อ{type === 'file' ? 'ไฟล์' : 'โฟลเดอร์'}
                        </span>
                    </Space>
                }
                autoFocusFirstInput
                modalProps={{
                    destroyOnClose: true,
                    okText: 'เปลี่ยนชื่อ',
                }}
                onFinish={onFinish}
            >
                <ProFormText
                    name="name"
                    label={`ชื่อ${type === 'file' ? 'ไฟล์' : 'โฟลเดอร์'}`}
                    placeholder={'ชื่อโฟลเดอร์หรือไฟล์ใหม่'}
                    rules={[{ required: true }]}
                />
            </ModalForm>
        );
    },
    MoveFile<T>({
        onFinish,
        token,
        path,
    }: {
        onFinish:
            | (((formData: T) => Promise<boolean | void>) &
                  ((formData: T) => Promise<any>))
            | undefined;
        token: string | null;
        path: string;
    }) {
        return (
            <ModalForm<T>
                trigger={
                    <div className="flex space-x-2">
                        <RiFolderTransferLine className="icon__button text-gray-500" />
                        <span className="self-center">ย้ายไฟล์ไปที่</span>
                    </div>
                }
                title={
                    <Space>
                        <RiFolderTransferLine className="icon" />
                        <span>ย้ายไฟล์ไปที่</span>
                    </Space>
                }
                autoFocusFirstInput
                modalProps={{
                    destroyOnClose: true,
                    okText: 'ย้าย',
                }}
                onFinish={onFinish}
            >
                <ProFormSelect
                    name="targetFolderId"
                    label={'ชื่อโฟลเดอร์'}
                    placeholder={'ต้องการย้ายไฟล์ไปที่โฟลเดอร์'}
                    rules={[{ required: true }]}
                    request={async () => {
                        const { data } = await fetcher(
                            CaseFolderServicePath.CASE +
                                path +
                                CaseFolderServicePath.GET_ALL_FOLDER_IN_CASE_S,
                            'GET',
                            {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                },
                            }
                        );

                        return data.map(
                            (item: { id: string; name: string }) => ({
                                label: item.name,
                                value: item.id,
                            })
                        );
                    }}
                />
            </ModalForm>
        );
    },
};

export default BaseModal;
