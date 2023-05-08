import {
    PageHeader,
    ProFormDateTimePicker,
    ProFormInstance,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    StepsForm,
} from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';
import BaseModal from '@baseComponents/BaseModal';
import AuthAction from '@hoc/AuthAction';
import withAuthUserSSR from '@hoc/withAuthUserSSR';
import { ResponseData, TAppointment, TAuthUser } from '@interfaces/index';
import { getItem } from '@pages/preview/[preview]';
import AppointmentServicePath from '@services/AppointmentService';
import CaseFolderServicePath from '@services/caseFolderService';
import useRequest, { fetcher } from '@services/useRequest';
import { getAvatarName } from '@utilities/index';
import logDebug from '@utilities/logDebug';
import {
    Badge,
    Button,
    Calendar,
    Card,
    Col,
    Dropdown,
    Modal,
    Popover,
    Row,
    Select,
    Space,
    message,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import {
    RiCalendarTodoLine,
    RiDeleteBinLine,
    RiFileList2Line,
    RiFileUserLine,
    RiGroupLine,
    RiMailAddFill,
    RiMailLine,
    RiMapPin2Line,
    RiMore2Fill,
    RiTodoLine,
} from 'react-icons/ri';

function Appointment({
    data: prefAppointment,
    authUser,
}: {
    data: ResponseData<TAppointment[]>;
    authUser: TAuthUser;
}) {
    const token = authUser.token || '';
    const avatarName = getAvatarName(authUser.firstName, authUser.lastName);
    const {
        mutate,
        data: appointmentData,
        isLoading,
    } = useRequest<ResponseData<TAppointment[]>>({
        url: AppointmentServicePath.GET_MY_APPOINTMENT,
        token,
        initData: prefAppointment,
    });

    const [openModal, setOpenModal] = useState(false);

    const formRef = useRef<ProFormInstance>();

    const dateCellRender = (value: Dayjs) => {
        return (
            <ul className="events">
                {appointmentData?.data.map((item) => {
                    const to_date = dayjs(item.dateTime)
                        .utc()
                        .format('DD-MM-YYYY');
                    const to_value = dayjs(value).utc().format('DD-MM-YYYY');
                    if (to_date === to_value) {
                        return (
                            <Popover
                                key={item.id}
                                title={
                                    <>
                                        <div className="flex items-center justify-between">
                                            <div className="text-xl font-medium">
                                                {item.title}
                                            </div>
                                            <Dropdown
                                                menu={{
                                                    onClick: async ({
                                                        key,
                                                    }) => {
                                                        if (
                                                            key === 'publish' &&
                                                            !item.isPublished
                                                        ) {
                                                            try {
                                                                await fetcher(
                                                                    AppointmentServicePath.APPOINTMENT +
                                                                        item.id +
                                                                        AppointmentServicePath.PUBLIC_APPOINTMENT_S,
                                                                    'PATCH',
                                                                    {
                                                                        headers:
                                                                            {
                                                                                Authorization:
                                                                                    'Bearer ' +
                                                                                    token,
                                                                            },
                                                                    }
                                                                );
                                                                message.success(
                                                                    'เผยแพร่นัดหมายสำเร็จ'
                                                                );
                                                                await mutate();

                                                                return true;
                                                            } catch (error) {
                                                                message.error(
                                                                    'เผยแพร่นัดหมายไม่สำเร็จ'
                                                                );
                                                                return false;
                                                            }
                                                        }
                                                        if (
                                                            key === 'publish' &&
                                                            item.isPublished
                                                        ) {
                                                            try {
                                                                await fetcher(
                                                                    AppointmentServicePath.APPOINTMENT +
                                                                        item.id +
                                                                        AppointmentServicePath.UNPUBLIC_APPOINTMENT_S,
                                                                    'PATCH',
                                                                    {
                                                                        headers:
                                                                            {
                                                                                Authorization:
                                                                                    'Bearer ' +
                                                                                    token,
                                                                            },
                                                                    }
                                                                );
                                                                message.success(
                                                                    'ยกเลิกเผยแพร่นัดหมายสำเร็จ'
                                                                );
                                                                await mutate();

                                                                return true;
                                                            } catch (error) {
                                                                message.error(
                                                                    'ยกเลิกเผยแพร่นัดหมายไม่สำเร็จ'
                                                                );
                                                                return false;
                                                            }
                                                        }
                                                        if (key === 'delete') {
                                                            BaseModal.delete({
                                                                title: `ลบนัดหมาย ${item.title}`,
                                                                content: `คุณต้องการที่จะลบ ${item.title} ใช่หรือไม่`,
                                                                onFinish:
                                                                    async () => {
                                                                        try {
                                                                            await fetcher(
                                                                                AppointmentServicePath.DELETE_APPOINTMENT +
                                                                                    item.id,
                                                                                'DELETE',
                                                                                {
                                                                                    headers:
                                                                                        {
                                                                                            Authorization:
                                                                                                'Bearer ' +
                                                                                                token,
                                                                                        },
                                                                                }
                                                                            );
                                                                            message.success(
                                                                                `ลบ ${item.title}สำเร็จ`
                                                                            );
                                                                            await mutate();

                                                                            return true;
                                                                        } catch (error) {
                                                                            message.error(
                                                                                `ลบ ${item.title} ไม่สำเร็จ`
                                                                            );
                                                                            return false;
                                                                        }
                                                                    },
                                                            });
                                                        }
                                                    },
                                                    items: [
                                                        getItem(
                                                            <div className="flex space-x-2">
                                                                <RiCalendarTodoLine className="icon text-gray-500" />
                                                                <span className="self-center">
                                                                    {item.isPublished
                                                                        ? 'ยกเลิกเผยแพร่นัดหมาย'
                                                                        : 'เผยแพร่นัดหมาย'}
                                                                </span>
                                                            </div>,
                                                            'publish'
                                                        ),
                                                        { type: 'divider' },
                                                        getItem(
                                                            <div className="flex">
                                                                <span className="self-center">
                                                                    ลบนัดหมาย
                                                                </span>
                                                            </div>,
                                                            'delete',
                                                            <RiDeleteBinLine className="icon__button " />,
                                                            undefined,
                                                            undefined,
                                                            true
                                                        ),
                                                    ],
                                                }}
                                                trigger={['click']}
                                            >
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    shape="circle"
                                                    icon={
                                                        <RiMore2Fill className="icon_button m-auto text-gray-500" />
                                                    }
                                                />
                                            </Dropdown>
                                        </div>
                                        <div className="font-normal">
                                            {`${dayjs(item.dateTime).format(
                                                'วันdddd, D MMMM - HH:mm น.'
                                            )}`}
                                        </div>
                                    </>
                                }
                                content={
                                    <Row gutter={[4, 0]}>
                                        {item.location && (
                                            <>
                                                <Col span={2}>
                                                    <RiMapPin2Line className="icon__appointment text-slate-400" />
                                                </Col>
                                                <Col span={22}>
                                                    <span>{item.location}</span>
                                                </Col>
                                            </>
                                        )}

                                        {item.detail && (
                                            <>
                                                <Col span={2}>
                                                    <RiFileList2Line className="icon__appointment text-slate-400" />
                                                </Col>
                                                <Col span={22}>
                                                    <span>{item.detail}</span>
                                                </Col>
                                            </>
                                        )}

                                        <Col span={2}>
                                            <RiGroupLine className="icon__appointment text-slate-400" />
                                        </Col>
                                        <Col span={22}>
                                            <span>
                                                ผู้เข้าร่วม {item.emails.length}{' '}
                                                คน
                                            </span>
                                        </Col>
                                        {item.emails.map((email) => (
                                            <Col span={22} push={2} key={email}>
                                                <span>{email}</span>
                                            </Col>
                                        ))}
                                    </Row>
                                }
                                trigger="click"
                                placement="left"
                            >
                                <li>
                                    <Badge
                                        status={
                                            item.isPublished
                                                ? 'processing'
                                                : 'default'
                                        }
                                        text={
                                            <>
                                                <span>
                                                    {dayjs(
                                                        item.dateTime
                                                    ).format('HH:mm น.')}
                                                </span>
                                                <span className="ml-1 font-medium">
                                                    {item.title}
                                                </span>
                                            </>
                                        }
                                    />
                                </li>
                            </Popover>
                        );
                    }
                })}
            </ul>
        );
    };

    return (
        <BaseLayout.Main path={'appointment'} avatarName={avatarName}>
            <Row gutter={24}>
                <Col>
                    <Card>
                        <PageHeader
                            title="นัดหมาย"
                            extra={
                                <Button
                                    type="primary"
                                    icon={
                                        <RiMailAddFill className="icon__button mr-2" />
                                    }
                                    onClick={() => setOpenModal(true)}
                                >
                                    สร้างนัดหมาย
                                </Button>
                            }
                        />
                        <Modal
                            title={
                                <Space>
                                    {/* <RiMailAddFill className="icon" /> */}
                                    <span className="text-base"></span>
                                </Space>
                            }
                            destroyOnClose={true}
                            maskClosable={false}
                            open={openModal}
                            footer={false}
                            width={'max-content'}
                            onCancel={() => setOpenModal(false)}
                        >
                            <StepsForm
                                onFinish={async (values) => {
                                    try {
                                        logDebug(
                                            '🚀 ~ onFinish={ ~ payload:',
                                            values
                                        );

                                        await fetcher(
                                            AppointmentServicePath.CREATE_APPOINTMENT,
                                            'POST',
                                            {
                                                headers: {
                                                    Authorization:
                                                        'Bearer ' + token,
                                                },
                                                data: {
                                                    ...values,
                                                    dateTime: dayjs(
                                                        values.dateTime
                                                    ),
                                                },
                                            }
                                        );
                                        message.success('สร้างนัดหมายสำเร็จ');
                                        await mutate();
                                        formRef.current?.resetFields([
                                            'caseId',
                                            'dateTime',
                                            'title',
                                            'location',
                                            'detail',
                                            'emails',
                                        ]);

                                        setOpenModal(false);

                                        return true;
                                    } catch (error) {
                                        message.error('สร้างนัดหมายไม่สำเร็จ');
                                        return false;
                                    }
                                }}
                                containerStyle={{
                                    textAlign: 'center',
                                }}
                                formRef={formRef}
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
                                        name="caseId"
                                        label="เลือกคดี"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'กรุณาเลือกเคสคดีที่ต้องการนัดหมาย',
                                            },
                                        ]}
                                        className="text-left"
                                        request={async () => {
                                            const { data } = await fetcher(
                                                CaseFolderServicePath.GET_ALL_CASE,
                                                'GET',
                                                {
                                                    headers: {
                                                        Authorization:
                                                            'Bearer ' + token,
                                                    },
                                                }
                                            );

                                            return data.map(
                                                (item: {
                                                    id: string;
                                                    name: string;
                                                }) => ({
                                                    label: item.name,
                                                    value: item.id,
                                                })
                                            );
                                        }}
                                    />
                                    <ProFormText
                                        allowClear
                                        name="title"
                                        label="ชื่อหัวข้อ"
                                        required
                                        placeholder="กรุณาป้อนชื่อหัวข้อ"
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
                                        icon: <RiMailLine className="icon" />,
                                    }}
                                    className="text-left"
                                >
                                    <div className="text-center text-base">
                                        กรอกอีเมลที่ต้องการนัดหมาย
                                    </div>
                                    <ProFormSelect
                                        name="emails"
                                        label="อีเมล"
                                        valueEnum={{
                                            [authUser.email]: authUser.email,
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
                                        icon: <RiTodoLine className="icon" />,
                                    }}
                                    onFinish={async () => {
                                        return true;
                                    }}
                                >
                                    <div className="text-center text-base">
                                        กรอกวันที่และเวลาที่ต้องการนัดหมาย
                                    </div>
                                    <ProFormDateTimePicker
                                        name="dateTime"
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
                        </Modal>
                        <Calendar
                            className="rounded-lg "
                            dateCellRender={dateCellRender}
                            headerRender={({ value, onChange }) => {
                                const start = 0;
                                const end = 12;
                                const monthOptions = [];

                                let current = value.clone();
                                const months = [];
                                for (let i = 0; i < 12; i++) {
                                    current = current.month(i);
                                    months.push(current);
                                }

                                for (let i = start; i < end; i++) {
                                    monthOptions.push(
                                        <Select.Option
                                            key={i}
                                            value={i}
                                            className="month-item"
                                        >
                                            {dayjs(months[i]).format('MMMM')}
                                        </Select.Option>
                                    );
                                }

                                const year = value.year();
                                const month = value.month();
                                const options = [];
                                for (let i = year - 10; i < year + 10; i += 1) {
                                    options.push(
                                        <Select.Option
                                            key={i}
                                            value={i}
                                            className="year-item"
                                        >
                                            {i}
                                        </Select.Option>
                                    );
                                }
                                return (
                                    <div style={{ padding: 8 }}>
                                        <Row gutter={8} className="justify-end">
                                            <Col>
                                                <Select
                                                    dropdownMatchSelectWidth={
                                                        false
                                                    }
                                                    value={month}
                                                    onChange={(newMonth) => {
                                                        const now = value
                                                            .clone()
                                                            .month(newMonth);
                                                        onChange(now);
                                                    }}
                                                >
                                                    {monthOptions}
                                                </Select>
                                            </Col>
                                            <Col>
                                                <Select
                                                    dropdownMatchSelectWidth={
                                                        false
                                                    }
                                                    className="my-year-select"
                                                    value={year}
                                                    onChange={(newYear) => {
                                                        const now = value
                                                            .clone()
                                                            .year(newYear);
                                                        onChange(now);
                                                    }}
                                                >
                                                    {options}
                                                </Select>
                                            </Col>
                                        </Row>
                                    </div>
                                );
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </BaseLayout.Main>
    );
}

export const getServerSideProps = withAuthUserSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx: any) => {
    const authUser: TAuthUser = ctx.AuthUser;
    const token = authUser.token;

    const data = await fetcher(
        AppointmentServicePath.GET_MY_APPOINTMENT,
        'GET',
        {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        }
    );

    return {
        props: {
            authUser,
            data,
        },
    };
});

export default Appointment;
