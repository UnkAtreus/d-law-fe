import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { FormInstance, Modal, ModalFuncProps, Space } from 'antd';
import React, { useState } from 'react';
import { RiEditFill, RiEditLine } from 'react-icons/ri';

const BaseModal = {
    Form({ children }: { children: React.ReactNode }) {
        const [isModalOpen, setIsModalOpen] = useState(true);

        return (
            <Modal
                title="Basic Modal"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                {children}
            </Modal>
        );
    },
    delete({
        title,
        content,
        okText,
        okType,
        cancelText,
        onOk,
        onCancel,
    }: ModalFuncProps) {
        return Modal.confirm({
            title: title,
            //  icon: <ExclamationCircleFilled />,
            content: content,
            okText: okText || 'Yes',
            okType: okType || 'danger',
            cancelText: cancelText || 'No',
            onOk: onOk,
            onCancel: onCancel,
        });
    },
    ChangeName<T>({
        form,
        type = 'file',
    }: {
        form: FormInstance<T>;
        type?: 'file' | 'folder';
    }) {
        return (
            <ModalForm<T>
                form={form}
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
                onFinish={async (values) => {
                    console.log(values);
                }}
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
