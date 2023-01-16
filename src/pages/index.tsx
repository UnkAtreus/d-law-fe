import BaseLayout from '@baseComponents/BaseLayout';
import BaseLoading from '@baseComponents/BaseLoading';
import BaseModal from '@baseComponents/BaseModal';
import BaseTag, { ITag } from '@baseComponents/BaseTag';
import guidelineService from '@services/guidelineService';
import { Button, Col, Row } from 'antd';

import { NextPage } from 'next';

import { AiFillAlert } from 'react-icons/ai';
import {
    RiBankCardFill,
    RiFileExcelFill,
    RiFilePdfFill,
    RiFileTextFill,
    RiFileWordFill,
} from 'react-icons/ri';

const Home: NextPage = () => {
    const { data, isLoading } = guidelineService.getData('1');

    const Tags: ITag[] = [
        {
            key: 'tag_1',
            name: 'สำเนาบัตรประจำตัวประชาชน',
            icon: <RiBankCardFill className="icon" />,
            value: '2',
            onClick: () => {
                console.log(`test`);
            },
        },
        {
            key: 'tag_2',
            name: 'เอกสาร Excel',
            icon: <RiFileExcelFill className="icon" />,
            value: '5',
        },
        {
            key: 'tag_3',
            name: 'เอกสาร PDF',
            icon: <RiFilePdfFill className="icon" />,
            value: '10',
        },
        {
            key: 'tag_4',
            name: 'เอกสารทั้งหมด',
            icon: <RiFileTextFill className="icon" />,
            value: '22',
        },
        {
            key: 'tag_5',
            name: 'เอกสาร Word',
            icon: <RiFileWordFill className="icon" />,
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
                    <Col span={5}>
                        <BaseTag items={Tags} defaultTag="tag_1" />
                    </Col>
                    <Col>
                        <h1>Create Next App</h1>
                        <h1>ทดสอบ</h1>
                        <Button onClick={BaseModal.delete}>test</Button>
                        <AiFillAlert />
                        <div className="text-red-500">{data && data.name}</div>
                    </Col>
                </Row>
            </BaseLayout>
        </>
    );
};

export default Home;
