import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Modal, Space } from 'antd';
import React from 'react';
import { RiEditFill, RiEditLine } from 'react-icons/ri';

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
};

export default BaseModal;
