import BaseLayout from '@baseComponents/BaseLayout';
import guidelineService from '@services/guidelineService';
import { Button } from 'antd';

import { NextPage } from 'next';

import { AiFillAlert } from 'react-icons/ai';

const Home: NextPage = () => {
    const { data, isLoading } = guidelineService.getData('1');

    if (isLoading) {
        return <div>Loading . . .</div>;
    }
    return (
        <>
            <BaseLayout>
                <h1>Create Next App</h1>
                <h1>ทดสอบ</h1>
                <Button>test</Button>
                <AiFillAlert />
                <div className="text-red-500">{data && data.name}</div>
            </BaseLayout>
        </>
    );
};

export default Home;
