import { ProCard, ProColumns, ProTable } from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';
import { ResponseData, TCasePublic } from '@interfaces/index';
import CaseFolderServicePath from '@services/caseFolderService';
import { fetcher } from '@services/useRequest';
import { showFileIcon } from '@utilities/index';
import { Button, Form, List, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import { RiDownloadFill } from 'react-icons/ri';

function PublicDocument({ data }: { data: ResponseData<TCasePublic[]> }) {
    const [form] = Form.useForm();
    const columns: ProColumns<TCasePublic>[] = [
        {
            title: 'คดีหมายเลขดำ',
            dataIndex: 'blackCaseNumber',
            width: 120,
        },
        {
            title: 'คดีหมายเลขแดง',
            dataIndex: 'redCaseNumber',
            width: 120,
        },
        {
            title: 'ชื่อ',
            dataIndex: 'name',
            width: 256,
        },
        {
            title: 'ชื่อหัวข้อ',
            dataIndex: 'caseTitle',
            width: 512,
        },
        {
            title: 'รายละเอียด',
            dataIndex: 'caseDetail',
            width: 768,
        },
        {
            title: 'จำนวนไฟล์',
            dataIndex: 'files',
            width: 96,
            render: (text: any) => <span>{`${text.length} ไฟล์`}</span>,
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
                    <ProTable<TCasePublic>
                        columns={columns}
                        dataSource={data?.data}
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
                        expandable={{
                            expandedRowRender: (record) => (
                                <List
                                    dataSource={record.files}
                                    renderItem={(item, index) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={showFileIcon('text')}
                                                title={
                                                    <Link
                                                        href={`https://www.dlaw-dms.com/public/${item.id}`}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                }
                                            />
                                            <Link href={item.url}>
                                                <Button
                                                    icon={
                                                        <RiDownloadFill className="icon__button mr-2 text-gray-500" />
                                                    }
                                                >
                                                    ดาวน์โหลด
                                                </Button>
                                            </Link>
                                        </List.Item>
                                    )}
                                ></List>
                            ),
                        }}
                    />
                </ProCard>
            </div>
        </BaseLayout.Landing>
    );
}

export const getServerSideProps = async (ctx: any) => {
    const data = await fetcher(
        CaseFolderServicePath.GET_ALL_PUBLIC_CASE,
        'GET'
    );
    console.log('🚀 ~ getServerSideProps ~ data:', data);

    return {
        props: {
            data,
        },
    };
};

export default PublicDocument;
