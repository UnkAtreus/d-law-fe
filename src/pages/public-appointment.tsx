import {
    ProCard,
    ProColumns,
    ProForm,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';
import { Button, Form, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { RiSearch2Line } from 'react-icons/ri';

function PublicAppointment() {
    const [form] = Form.useForm();
    const columns: ProColumns<any>[] = [
        {
            title: 'หมายเลขคดีดำ',
            dataIndex: 'blackCaseNumber',
        },
        {
            title: 'หมายเลขคดีแดง',
            dataIndex: 'redCaseNumber',
        },
        {
            title: 'ชื่อหัวข้อ',
            dataIndex: 'title',
            width: 768,
        },
        {
            title: 'รายละเอียด',
            dataIndex: 'detail',
        },
        {
            title: 'วันเวลานัดหมายที่กำลังถึง',
            dataIndex: 'dateTime',
            render: (text: any) => (
                <div className="text-gray-400">
                    {dayjs(text).format('DD MMM YYYY - HH:MM')}
                </div>
            ),
        },
        {
            title: 'สถานที่',
            dataIndex: 'redCaseNumber',
        },
    ];
    return (
        <BaseLayout.Landing>
            <div className="px-6 pt-6">
                <ProCard
                    bordered
                    title={
                        <Typography.Title level={4} className="inline">
                            ค้นหาคดี
                        </Typography.Title>
                    }
                >
                    <ProTable
                        columns={columns}
                        dataSource={[]}
                        loading={false}
                        cardProps={{
                            bodyStyle: {
                                padding: 0,
                            },
                        }}
                        tableExtraRender={(_, data) => {
                            return (
                                <ProForm
                                    onFinish={async (values) => {
                                        console.log(values);
                                    }}
                                    submitter={false}
                                    form={form}
                                >
                                    <Space className="items-end">
                                        <ProFormText
                                            label="หมายเลขคดีดำ"
                                            name="blackCaseNumber"
                                        />
                                        <ProFormText
                                            label="หมายเลขคดีแดง"
                                            name="blackCaseNumber"
                                        />
                                        <Button
                                            type="primary"
                                            icon={
                                                <RiSearch2Line className="icon__button mr-1" />
                                            }
                                            className="mb-6"
                                        >
                                            ค้นหา
                                        </Button>
                                    </Space>
                                </ProForm>
                            );
                        }}
                        rowKey="id"
                        options={{
                            setting: false,
                            reload: false,
                            density: false,
                        }}
                        search={false}
                        pagination={false}
                        // dateFormatter={(value) => dayjs(value).format('DD MMM YYYY')}
                    />
                </ProCard>
            </div>
        </BaseLayout.Landing>
    );
}

export default PublicAppointment;
