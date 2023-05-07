import {
    ProCard,
    ProColumns,
    ProForm,
    ProFormText,
} from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';
import logDebug from '@utilities/logDebug';
import { Button, Descriptions, Form, Space, Typography, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { RiSearch2Line } from 'react-icons/ri';
import request from 'umi-request';

function SearchCase() {
    const [loading, search] = useState(false);
    const [data, setData] = useState();
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
            title: 'ข้อหา',
            dataIndex: 'caseTitle',
            width: 768,
        },
        {
            title: 'วันที่ฟ้อง',
            dataIndex: 'createdAt',

            render: (text: any) => (
                <div className="text-gray-400">
                    {dayjs(text).format('DD MMM YYYY - HH:MM')}
                </div>
            ),
        },
        {
            title: 'วันนัดหมายที่กำลังถึง',
            dataIndex: 'updatedAt',
            render: (text: any) => (
                <div className="text-gray-400">
                    {dayjs(text).format('DD MMM YYYY - HH:MM')}
                </div>
            ),
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
                    <ProForm
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
                                            '/api/searchcase',
                                            {
                                                data: {
                                                    ...blackCase,
                                                    ...redCase,
                                                },
                                            }
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
                                label="หมายเลขคดีดำ"
                                name="blackCaseNumber"
                                rules={[
                                    {
                                        pattern:
                                            /^[ก-ฮ]{1,3}.?[0-9]{1,4}\/[0-9]{1,4}$/,
                                        message:
                                            'กรุณากรอกหมายเลขคดีให้ถูกต้อง',
                                    },
                                ]}
                            />
                            <ProFormText
                                label="หมายเลขคดีแดง"
                                name="redCaseNumber"
                                rules={[
                                    {
                                        pattern:
                                            /^[ก-ฮ]{1,3}.?[0-9]{1,4}\/[0-9]{1,4}$/,
                                        message:
                                            'กรุณากรอกหมายเลขคดีให้ถูกต้อง',
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
                    <Descriptions>
                        <Descriptions.Item label="หมายเลขคดีดำ">
                            test
                        </Descriptions.Item>
                    </Descriptions>
                </ProCard>
            </div>
        </BaseLayout.Landing>
    );
}

export default SearchCase;
