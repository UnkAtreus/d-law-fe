import { Modal, ModalFuncProps } from 'antd';
import React, { useState } from 'react';

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
};

export default BaseModal;
