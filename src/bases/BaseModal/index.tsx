import { Modal } from 'antd';
import React, { useState } from 'react';

const BaseModal = {
    form() {
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
            </Modal>
        );
    },
    delete() {
        return Modal.confirm({
            title: 'Are you sure delete this task?',
            //  icon: <ExclamationCircleFilled />,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    },
};

export default BaseModal;
