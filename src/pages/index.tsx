import { ProFormText } from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';
import BaseLoading from '@baseComponents/BaseLoading';
import BaseModal from '@baseComponents/BaseModal';
import BaseTag, { ITag } from '@baseComponents/BaseTag';
import guidelineService from '@services/guidelineService';
import { Button, Col, Form, Row, Typography } from 'antd';

import { NextPage } from 'next';

import { AiFillAlert } from 'react-icons/ai';
import {
    RiBankCardFill,
    RiFileExcelFill,
    RiFileList2Fill,
    RiFilePdfFill,
    RiFileTextFill,
    RiFileWordFill,
    RiFolder5Fill,
    RiImage2Fill,
    RiVideoFill,
} from 'react-icons/ri';

const Home: NextPage = () => {
    const { data, isLoading } = guidelineService.getData('1');

    const [form] = Form.useForm<{ name: string; company: string }>();

    const Tags: ITag[] = [
        {
            key: 'tag_1',
            name: 'เอกสารทั้งหมด',
            icon: <RiFileTextFill className="icon" />,
            value: '22',
        },
        {
            key: 'tag_2',
            name: 'สำเนาบัตรประจำตัวประชาชน',
            icon: <RiBankCardFill className="icon" />,
            value: '2',
            onClick: () => {
                console.log(`test`);
            },
        },
        {
            key: 'tag_3',
            name: 'เอกสาร Excel',
            icon: <RiFileExcelFill className="icon" />,
            value: '5',
        },
        {
            key: 'tag_4',
            name: 'เอกสาร PDF',
            icon: <RiFilePdfFill className="icon" />,
            value: '10',
        },
        {
            key: 'tag_5',
            name: 'เอกสาร Word',
            icon: <RiFileWordFill className="icon" />,
            value: '2',
        },
        {
            key: 'tag_6',
            name: 'รูปภาพ',
            icon: <RiImage2Fill className="icon" />,
            value: '2',
        },
        {
            key: 'tag_7',
            name: 'วิดีโอ',
            icon: <RiVideoFill className="icon" />,
            value: '2',
        },
        {
            key: 'tag_8',
            name: 'เอกสารอื่นๆ',
            icon: <RiFileList2Fill className="icon" />,
            value: '2',
        },
    ];

    if (isLoading) {
        return <BaseLoading />;
    }

    return (
        <>
            <BaseLayout>
                <Row gutter={24}>
                    <Col xl={5} xxl={4}>
                        <BaseTag
                            items={Tags}
                            defaultTag="tag_1"
                            onChange={(key, tag) => {
                                console.log(key, tag);
                            }}
                        />
                    </Col>
                    <Col flex={'auto'} className="space-y-6">
                        <div className="space-y-4">
                            <Typography.Title level={3}>
                                โฟลเดอร์ที่ใช้บ่อย (2)
                            </Typography.Title>
                            <Row gutter={8}>
                                <Col span={4}>
                                    <div className="hover-btn group flex w-full cursor-pointer items-center space-x-2 rounded bg-white py-5 pl-4 pr-6">
                                        <RiFolder5Fill className="icon text-gray-500 transition group-hover:text-primary" />
                                        <span className="overflow-hidden text-ellipsis whitespace-nowrap ">
                                            น้องสมชาย
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="space-y-4">
                            <Typography.Title level={3}>
                                เอกสารที่เปิดล่าสุด (1)
                            </Typography.Title>
                        </div>
                        <h1>Create Next App</h1>
                        <h1>ทดสอบ</h1>
                        <Button
                            onClick={() => {
                                BaseModal.delete({ title: 'test' });
                            }}
                        >
                            test
                        </Button>
                        <Button
                            onClick={() => {
                                BaseModal.delete({ title: 'test' });
                            }}
                        >
                            test
                        </Button>

                        <ProFormText />

                        <AiFillAlert />
                        <div className="text-red-500">{data && data.name}</div>
                    </Col>
                </Row>
            </BaseLayout>
        </>
    );
};

export default Home;
