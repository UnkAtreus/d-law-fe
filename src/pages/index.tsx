import BaseLayout from '@baseComponents/BaseLayout';
import BaseTag, { ITag } from '@baseComponents/BaseTag';
import guidelineService from '@services/guidelineService';
import { Button, Col, Row, Spin } from 'antd';

import { NextPage } from 'next';

import { AiFillAlert } from 'react-icons/ai';
import { RiBankCardFill } from 'react-icons/ri';

const Home: NextPage = () => {
    const { data, isLoading } = guidelineService.getData('1');

    const Tags: ITag[] = [
        {
            key: 'tag_1',
            name: 'สำเนาบัตรประจะตัวประชาชน',
            icon: <RiBankCardFill className="icon" />,
            value: '22',
            onClick: () => {
                console.log(`test`);
            },
        },
        {
            key: 'tag_2',
            name: 'สำเนาบัตรประจะตัวประชาชน',
            icon: <RiBankCardFill className="icon" />,
            value: '22',
        },
    ];

    return (
        <>
            <Spin spinning={isLoading}>
                <BaseLayout>
                    <Row>
                        <Col span={5}>
                            <BaseTag items={Tags} defaultTag="tag_1" />
                        </Col>
                        <Col></Col>
                    </Row>
                    <h1>Create Next App</h1>
                    <h1>ทดสอบ</h1>
                    <Button>test</Button>
                    <AiFillAlert />
                    <div className="text-red-500">{data && data.name}</div>
                </BaseLayout>
            </Spin>
        </>
    );
};

export default Home;
