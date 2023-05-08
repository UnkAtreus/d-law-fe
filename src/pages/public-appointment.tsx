import { ProCard, ProColumns, ProTable } from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';
import { ResponseData, TAppointment } from '@interfaces/index';
import AppointmentServicePath from '@services/AppointmentService';
import { fetcher } from '@services/useRequest';
import { Form, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

function PublicAppointment({
    prefAppointment,
}: {
    prefAppointment: ResponseData<TAppointment[]>;
}) {
    const [form] = Form.useForm();
    const columns: ProColumns<any>[] = [
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
            title: 'วันนัดหมายที่กำลังถึง',
            dataIndex: 'dateTime',
            render: (text: any) => (
                <div className="text-gray-400">
                    {dayjs(text).format('DD MMM YYYY')}
                </div>
            ),
        },
        {
            title: 'เวลา',
            dataIndex: 'dateTime',
            render: (text: any) => (
                <div className="text-gray-400">
                    {dayjs(text).format('HH:MM น.')}
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
                            นัดหมายคดี
                        </Typography.Title>
                    }
                >
                    <ProTable
                        columns={columns}
                        dataSource={prefAppointment?.data}
                        loading={false}
                        cardProps={{
                            bodyStyle: {
                                padding: 0,
                            },
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

export const getServerSideProps = async (ctx: any) => {
    const prefAppointment = await fetcher(
        AppointmentServicePath.GET_PUBLIC_APPOINTMENT,
        'GET'
    );
    console.log('🚀 ~ getServerSideProps ~ prefAppointment:', prefAppointment);

    return {
        props: {
            prefAppointment,
        },
    };
};

export default PublicAppointment;
