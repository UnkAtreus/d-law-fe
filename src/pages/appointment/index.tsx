import {
    ModalForm,
    PageHeader,
    ProFormDateTimePicker,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    StepsForm,
} from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';
import type { BadgeProps } from 'antd';
import { Badge, Button, Calendar, Card, Col, Form, Row, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import {
    RiFileUserLine,
    RiMailAddFill,
    RiMailLine,
    RiTodoLine,
} from 'react-icons/ri';

const getListData = (value: Dayjs) => {
    let listData;
    switch (value.date()) {
        case 8:
            listData = [
                { type: 'warning', content: 'This is warning event.' },
                { type: 'success', content: 'This is usual event.' },
            ];
            break;
        case 10:
            listData = [
                { type: 'warning', content: 'This is warning event.' },
                { type: 'success', content: 'This is usual event.' },
                { type: 'error', content: 'This is error event.' },
            ];
            break;
        case 15:
            listData = [
                { type: 'warning', content: 'This is warning event' },
                {
                    type: 'success',
                    content: 'This is very long usual event。。....',
                },
                { type: 'error', content: 'This is error event 1.' },
                { type: 'error', content: 'This is error event 2.' },
                { type: 'error', content: 'This is error event 3.' },
                { type: 'error', content: 'This is error event 4.' },
            ];
            break;
        default:
    }
    return listData || [];
};

const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
        return 1394;
    }
};

function Appointment() {
    const [form] = Form.useForm<any>();

    const monthCellRender = (value: Dayjs) => {
        const num = getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null;
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item) => (
                    <li key={item.content}>
                        <Badge
                            status={item.type as BadgeProps['status']}
                            text={item.content}
                        />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <BaseLayout.Main path={'appointment'}>
            <Row gutter={24}>
                <Col>
                    <Card>
                        <PageHeader
                            title="นัดหมาย"
                            extra={
                                <ModalForm<any>
                                    trigger={
                                        <Button
                                            type="primary"
                                            icon={
                                                <RiMailAddFill className="icon__button mr-2" />
                                            }
                                        >
                                            สร้างนัดหมาย
                                        </Button>
                                    }
                                    submitter={false}
                                    form={form}
                                    title={
                                        <Space>
                                            {/* <RiMailAddFill className="icon" /> */}
                                            <span className="text-base"></span>
                                        </Space>
                                    }
                                    autoFocusFirstInput
                                    modalProps={{
                                        destroyOnClose: true,
                                        maskClosable: false,
                                    }}
                                >
                                    <StepsForm
                                        onFinish={async (values) => {
                                            console.log(values);
                                        }}
                                        formProps={{}}
                                        containerStyle={{
                                            textAlign: 'center',
                                        }}
                                    >
                                        <StepsForm.StepForm
                                            name="caseinfo"
                                            title="นัดหมายคดี"
                                            stepProps={{
                                                icon: (
                                                    <RiFileUserLine className="icon" />
                                                ),
                                            }}
                                            className="text-left"
                                        >
                                            <div className="text-center text-base">
                                                เลือกเคสคดีที่ต้องการนัดหมาย
                                            </div>
                                            <ProFormSelect
                                                options={[
                                                    {
                                                        value: 'id_somchai',
                                                        label: 'นายสมชาย',
                                                    },
                                                ]}
                                                name="case"
                                                label="เลือกคดี"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'กรุณาเลือกเคสคดีที่ต้องการนัดหมาย',
                                                    },
                                                ]}
                                                className="text-left"
                                            />

                                            <ProFormText
                                                name="location"
                                                label="สถานที่"
                                                placeholder="กรุณาป้อนรายละเอียดสถานที่"
                                            />
                                            <ProFormTextArea
                                                allowClear
                                                name="detail"
                                                label="รายละเอียด"
                                                placeholder="กรุณาป้อนรายละเอียดเพิ่มเติม"
                                            />
                                        </StepsForm.StepForm>
                                        <StepsForm.StepForm
                                            name="email"
                                            title="ข้อมูลติดต่อ"
                                            stepProps={{
                                                icon: (
                                                    <RiMailLine className="icon" />
                                                ),
                                            }}
                                            className="text-left"
                                        >
                                            <div className="text-center text-base">
                                                กรอกอีเมลที่ต้องการนัดหมาย
                                            </div>
                                            <ProFormSelect
                                                name="email"
                                                label="อีเมล"
                                                valueEnum={{
                                                    'kittipat@gmail.com':
                                                        'kittipat@gmail.com',
                                                }}
                                                fieldProps={{
                                                    mode: 'tags',
                                                }}
                                                placeholder="กรุณากรอกอีเมลที่ต้องการนัดหมาย"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'กรุณากรอกหรือเลือกอีเมลที่ต้องการนัดหมาย',
                                                        type: 'array',
                                                    },
                                                ]}
                                            />
                                        </StepsForm.StepForm>
                                        <StepsForm.StepForm
                                            name="datetime"
                                            title="วันที่และเวลา"
                                            stepProps={{
                                                icon: (
                                                    <RiTodoLine className="icon" />
                                                ),
                                            }}
                                            onFinish={async () => {
                                                return true;
                                            }}
                                        >
                                            <div className="text-center text-base">
                                                กรอกวันที่และเวลาที่ต้องการนัดหมาย
                                            </div>
                                            <ProFormDateTimePicker
                                                name="datetime"
                                                label="วันที่และเวลา"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'กรุณากรอกวันที่และเวลาที่ต้องการนัดหมาย',
                                                    },
                                                ]}
                                                placeholder="กรุณากรอกวันที่และเวลาที่ต้องการนัดหมาย"
                                                width={'xl'}
                                            />
                                        </StepsForm.StepForm>
                                    </StepsForm>
                                </ModalForm>
                            }
                        />
                        <Calendar
                            className="rounded-lg "
                            dateCellRender={dateCellRender}
                            monthCellRender={monthCellRender}
                        />
                    </Card>
                </Col>
            </Row>
        </BaseLayout.Main>
    );
}

export default Appointment;
