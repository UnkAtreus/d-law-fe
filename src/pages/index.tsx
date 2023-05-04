import CaseData from '@mocks/caseData.json';

const Home = ({ data }: { data: typeof CaseData }) => {
    console.log('🚀 ~ Landing ~ data:', data);

    return <div>Landing</div>;
};

export const getServerSideProps = async (ctx: any) => {
    const data = CaseData;
    const hostname = ctx.req.headers.host;
    console.log('🚀 ~ hostname:', hostname);

    if (hostname === 'app.dlaw-dms.com') {
        return {
            redirect: {
                permanent: false,
                destination: '/workspace',
            },
        };
    }

    return {
        props: {
            data,
        },
    };
};

export default Home;
