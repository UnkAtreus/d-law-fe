import React from 'react';
import CaseData from '@mocks/caseData.json';

function Landing({ data }: { data: typeof CaseData }) {
    console.log('🚀 ~ Landing ~ data:', data);

    return <div>Landing</div>;
}

export const getServerSideProps = () => {
    const data = CaseData;
    return {
        props: {
            data,
        },
    };
};

export default Landing;
