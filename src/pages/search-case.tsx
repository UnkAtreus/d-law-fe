import {
    ProCard,
    ProColumns,
    ProForm,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';
import { TSearchAppointment, TSearchResult } from '@interfaces/index';
import logDebug from '@utilities/logDebug';
import {
    Button,
    Descriptions,
    Empty,
    Form,
    Space,
    Typography,
    message,
} from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { RiSearch2Line } from 'react-icons/ri';
import request from 'umi-request';

function SearchCase() {
    const [loading, search] = useState(false);
    const [data, setData] = useState<TSearchResult>();

    const [form] = Form.useForm();
    const columns: ProColumns<TSearchAppointment>[] = [
        {
            title: 'วันนัดหมาย',
            dataIndex: 'date',

            render: (text: any) => (
                <div className="">
                    {dayjs(text, 'DD/MM/YYYY').format('วันdddd, D MMM YYYY')}
                </div>
            ),
        },
        {
            title: 'เวลา',
            dataIndex: 'time',
            render: (text: any) => (
                <div className="">
                    {dayjs(text, 'HH.MM').format('HH:MM น.')}
                </div>
            ),
        },
        {
            title: 'ห้องพิจารณา',
            dataIndex: 'room',
        },
        {
            title: 'เหตุที่นัด',
            dataIndex: 'title',
        },
        {
            title: 'หมายเหคุ',
            dataIndex: 'detail',
        },
    ];

    return (
        <BaseLayout.Landing>
            <div className="px-6 pt-6">
                <ProCard
                    split={'vertical'}
                    bordered
                    title={
                        <Typography.Title level={4} className="inline">
                            ค้นหาคดี
                        </Typography.Title>
                    }
                >
                    <ProForm
                        className="p-6"
                        onFinish={async (values) => {
                            if (values) {
                                logDebug(values);
                                search(true);

                                const blackCaseNumber = values.blackCaseNumber
                                    ? values.blackCaseNumber
                                          .trim()
                                          .match(
                                              '^([ก-ฮ]{1,3})\\.?([0-9]{1,4})/([0-9]{1,4})$'
                                          )
                                    : null;

                                const redCaseNumber = values.redCaseNumber
                                    ? values.redCaseNumber
                                          .trim()
                                          .match(
                                              '^([ก-ฮ]{1,3})\\.?([0-9]{1,4})/([0-9]{1,4})$'
                                          )
                                    : null;

                                if (blackCaseNumber || redCaseNumber) {
                                    let blackCase = {};
                                    let redCase = {};
                                    if (blackCaseNumber)
                                        blackCase = {
                                            blackTitle: blackCaseNumber[1],
                                            blackId: blackCaseNumber[2],
                                            blackYear: blackCaseNumber[3],
                                        };
                                    if (redCaseNumber)
                                        redCase = {
                                            redTitle: redCaseNumber[1],
                                            redId: redCaseNumber[2],
                                            redYear: redCaseNumber[3],
                                        };

                                    logDebug(
                                        '🚀 ~ onFinish={ ~ Case:',
                                        redCase,
                                        blackCase
                                    );

                                    try {
                                        const { data } = await request.post(
                                            'https://dlaw-search-ymg4vhbqaa-as.a.run.app/searchcase',
                                            {
                                                data: {
                                                    ...blackCase,
                                                    ...redCase,
                                                },
                                            }
                                        );
                                        console.log(
                                            '🚀 ~ onFinish={ ~ data:',
                                            data
                                        );

                                        search(false);

                                        if (Object.keys(data).length === 0) {
                                            message.warning(
                                                'ไม่พบคดีที่ท่านต้องการค้นหา'
                                            );
                                        }
                                        setData(data);
                                        return true;
                                    } catch (error) {
                                        search(false);
                                        message.error(
                                            'เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง'
                                        );
                                        return false;
                                    }
                                }
                                search(false);
                            }
                        }}
                        submitter={false}
                        form={form}
                    >
                        <Space className="items-end">
                            <ProFormText
                                label="คดีหมายเลขดำ"
                                name="blackCaseNumber"
                                rules={[
                                    {
                                        pattern:
                                            /^[ก-ฮ]{1,3}.?[0-9]{1,4}\/[0-9]{1,4}$/,
                                        message:
                                            'กรุณากรอกคดีหมายเลขให้ถูกต้อง',
                                    },
                                ]}
                            />
                            <ProFormText
                                label="คดีหมายเลขแดง"
                                name="redCaseNumber"
                                rules={[
                                    {
                                        pattern:
                                            /^[ก-ฮ]{1,3}.?[0-9]{1,4}\/[0-9]{1,4}$/,
                                        message:
                                            'กรุณากรอกคดีหมายเลขให้ถูกต้อง',
                                    },
                                ]}
                            />
                            <Button
                                type="primary"
                                icon={
                                    <RiSearch2Line className="icon__button mr-1" />
                                }
                                className="mb-6"
                                onClick={() => form.submit()}
                                loading={loading}
                            >
                                ค้นหา
                            </Button>
                        </Space>
                    </ProForm>
                    <div>
                        <ProCard split={'horizontal'} bordered headerBordered>
                            <ProCard title="รายละเอียดข้อมูลคดี">
                                <Descriptions
                                    size="default"
                                    column={6}
                                    bordered
                                >
                                    <Descriptions.Item
                                        label={
                                            <div className="whitespace-nowrap">
                                                คดีหมายเลขดำ
                                            </div>
                                        }
                                        span={2}
                                    >
                                        {data?.blackCaseNumber}
                                    </Descriptions.Item>
                                    <Descriptions.Item
                                        label="วันที่ฟ้อง"
                                        span={1}
                                    >
                                        {data?.blackCaseDate}
                                    </Descriptions.Item>
                                    <Descriptions.Item
                                        label={
                                            <div className="whitespace-nowrap">
                                                คดีหมายเลขแดง
                                            </div>
                                        }
                                        span={2}
                                    >
                                        {data?.RedCaseNumber}
                                    </Descriptions.Item>
                                    <Descriptions.Item
                                        label="วันที่ออกแดง"
                                        span={1}
                                    >
                                        {data?.redCaseDate}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="ข้อหา" span={6}>
                                        {data?.caseTitle}
                                    </Descriptions.Item>
                                    <Descriptions.Item
                                        label="คำพิพากษา"
                                        span={6}
                                    >
                                        {data?.judgement}
                                    </Descriptions.Item>
                                </Descriptions>
                            </ProCard>
                            <ProCard title="วันนัดหมายที่จะมาถึง">
                                {data?.closestAppointment ? (
                                    <Descriptions
                                        size="default"
                                        column={4}
                                        bordered
                                    >
                                        <Descriptions.Item
                                            label={
                                                <div className="whitespace-nowrap">
                                                    วัดที่และเวลานัดหมาย
                                                </div>
                                            }
                                        >
                                            {dayjs(
                                                `${data?.closestAppointment.date} ${data?.closestAppointment.time}`,
                                                'DD/MM/YYYY HH.MM'
                                            ).format(
                                                'วันdddd, D MMM YYYY HH.MM น.'
                                            )}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="ห้องพิจารณา">
                                            {data?.closestAppointment.room}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="เหตุที่นัด">
                                            {data?.closestAppointment.title}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label="หมายเหคุ
"
                                        >
                                            {data?.closestAppointment.detail}
                                        </Descriptions.Item>
                                    </Descriptions>
                                ) : (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={
                                            <div className="space-y-1">
                                                <div className="text-base text-gray-400">
                                                    ไม่มีวันนัดหมายที่จะมาถึง
                                                </div>
                                            </div>
                                        }
                                    />
                                )}
                                <ProTable
                                    dataSource={data?.appointments}
                                    columns={columns}
                                    rowKey="id"
                                    options={{
                                        setting: false,
                                        reload: false,
                                        density: false,
                                    }}
                                    search={false}
                                    cardProps={{
                                        bodyStyle: {
                                            padding: '0',
                                        },
                                        headStyle: {
                                            padding: '24px 0 24px 0',
                                        },
                                        title: 'วันนัดหมายทั้งหมด',
                                    }}
                                    pagination={false}
                                />
                            </ProCard>
                        </ProCard>
                    </div>
                </ProCard>
            </div>
        </BaseLayout.Landing>
    );
}

export default SearchCase;
