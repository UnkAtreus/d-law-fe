import CaseData from '@mocks/caseData.json';
import ThailandMap from '@mocks/thailandMap.json';
import dynamic from 'next/dynamic';
import BaseLayout from '@baseComponents/BaseLayout';
import { Col, Collapse, Descriptions, Row } from 'antd';
import { useRef, useState } from 'react';
const { AreaMap } = {
    AreaMap: dynamic(
        () => import('@ant-design/maps').then(({ AreaMap }) => AreaMap),
        {
            ssr: false,
        }
    ),
};

const Home = ({
    caseData: initCaseData,
    mapData,
}: {
    caseData: typeof CaseData;
    mapData: typeof ThailandMap;
}) => {
    const [caseData, setCaseData] = useState(initCaseData);

    const activeRef = useRef<string>('');

    const color = ['rgb(255,255,255)', '#fbbf24', '#d97706', '#8e5431'];
    const config: any = {
        map: {
            type: 'mapbox',
            style: 'blank',
            center: [100.54796312925647, 13.751893965131481],
            zoom: 3,
            pitch: 0,
        },
        source: {
            data: mapData,
            parser: {
                type: 'geojson',
            },
        },
        autoFit: true,
        color: {
            field: 'density',
            value: color,
            scale: { type: 'linear' },
        },
        style: {
            opacity: 1,
            stroke: 'rgb(93,112,146)',
            lineType: 'dash',
            lineDash: [1, 1],
            lineWidth: 0.6,
            lineOpacity: 1,
        },
        state: {
            active: true,
            select: true,
        },
        tooltip: {
            title: 'จังหวัดและตำนวนคดี',
            items: ['pro_th', 'density'],
        },
        zoom: {
            position: 'bottomright',
        },
        legend: {
            title: 'จำนวนคดี',
            position: 'bottomleft',
        },
        onReady: (plot: any) => {
            plot.on('areaLayer:click', (event: any) => {
                const code = event?.feature.properties.pro_code;
                const name = event?.feature.properties.pro_th;
                if (activeRef.current === code) {
                    activeRef.current = '';
                    setCaseData(initCaseData);
                } else {
                    activeRef.current = code;

                    setCaseData((prev) => {
                        return prev.filter((data) => data.province === name);
                    });
                }
            });
        },
    };

    const findColor = (case_title: string) => {
        if (case_title.includes('112')) {
            return 'bg-rose-500/80';
        }
        if (case_title.includes('ฉุกเฉิน')) {
            return 'bg-orange-500/80';
        }
        if (case_title.includes('อำนาจศาล')) {
            return 'bg-yellow-500/80';
        }

        return 'bg-slate-500/50';
    };

    return (
        <BaseLayout.Landing>
            <Row className="h-full w-full overflow-hidden">
                <Col span={16} className="h-full w-full">
                    <AreaMap {...config} />
                </Col>
                <Col span={8}>
                    <div className="z-0 flex h-full w-full flex-col justify-between overflow-auto bg-white  pt-12 shadow-[0px_0px_24px_rgba(0,0,0,0.1)]">
                        <div className="space-y-4">
                            <h1 className=" px-6 text-4xl font-medium">
                                สถิติคดีสำคัญทางการเมือง{' '}
                                <span className="flex items-start">
                                    มีจำนวนทั้งสิ้น 114{' '}
                                    <span className="-mt-1 ml-2 text-2xl ">
                                        คดี
                                    </span>
                                </span>
                            </h1>
                            <div className="flex space-x-4 px-6">
                                <span>มาตราที่กระทำผิด</span>
                                <span className="flex items-center space-x-1">
                                    <div className="h-4 w-4 rounded-sm bg-rose-500/80" />
                                    <div>ม.112</div>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <div className="h-4 w-4 rounded-sm bg-orange-500/80" />
                                    <div>พ.ร.ก.ฉุกเฉินฯ</div>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <div className="h-4 w-4 rounded-sm bg-yellow-500/80" />
                                    <div>ละเมิดอำนาจศาล</div>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <div className="h-4 w-4 rounded-sm bg-slate-500/50" />
                                    <div>มาตราอื่นๆ</div>
                                </span>
                            </div>
                            <div className="ml-6 mr-2 h-[calc(100vh-280px)] overflow-y-scroll py-4 pr-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-md">
                                <Collapse bordered={false}>
                                    {caseData.length > 0 ? (
                                        caseData.map((data, i) => {
                                            const tag_color = findColor(
                                                data.case_title
                                            );

                                            return (
                                                <Collapse.Panel
                                                    key={data.case_number + i}
                                                    showArrow={false}
                                                    className="mb-4"
                                                    style={{ border: 'none' }}
                                                    header={
                                                        <div className="flex justify-between rounded-lg border border-solid border-slate-300">
                                                            <div className="flex">
                                                                <div
                                                                    className={`${tag_color} h-full w-6 rounded-l-lg`}
                                                                />
                                                                <div className="flex-1 space-y-1 px-4 py-2">
                                                                    <p className="font-medium">
                                                                        {
                                                                            data.case_title
                                                                        }
                                                                    </p>
                                                                    <p className="">
                                                                        {
                                                                            data.description
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col justify-between px-4 py-2">
                                                                <div className="text-right leading-tight">
                                                                    <div className="whitespace-nowrap text-gray-400">
                                                                        หมายเลขคดี
                                                                    </div>
                                                                    <div className="font-medium">
                                                                        {
                                                                            data.case_number
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-gray-400">
                                                                        {
                                                                            data.province
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                >
                                                    <div className="mt-4 pl-6 pr-4">
                                                        <Descriptions size="small">
                                                            <Descriptions.Item label="ชื่อ">
                                                                {data.name}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item
                                                                label="วันที่กระทำผิด"
                                                                span={4}
                                                            >
                                                                {data.date}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="สถานะ">
                                                                {data.status}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="สถานที่">
                                                                {data.location}
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label="จังหวัด">
                                                                {data.province}
                                                            </Descriptions.Item>
                                                        </Descriptions>
                                                    </div>
                                                </Collapse.Panel>
                                            );
                                        })
                                    ) : (
                                        <div>empty</div>
                                    )}
                                </Collapse>
                            </div>
                        </div>
                        <div className="mb-2 px-4 text-right text-xs text-gray-800">
                            ข้อมูล ณ วันที่ 1 มกราคม 2566 ถึง 31 มีนาคม 2566
                        </div>
                    </div>
                </Col>
            </Row>
        </BaseLayout.Landing>
    );
};

export const getServerSideProps = async (ctx: any) => {
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
            caseData: CaseData,
            mapData: ThailandMap,
        },
    };
};

export default Home;
