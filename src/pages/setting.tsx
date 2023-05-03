import {
    ModalForm,
    ProCard,
    ProForm,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';
import BaseLayout from '@baseComponents/BaseLayout';
import AuthAction from '@hoc/AuthAction';
import withAuthUserSSR from '@hoc/withAuthUserSSR';
import { ResponseData, TAuthUser, TUser } from '@interfaces/index';
import UserServicePath from '@services/useAuth';
import useRequest, { fetcher } from '@services/useRequest';
import logDebug from '@utilities/logDebug';
import { Button, Space, message } from 'antd';
import React, { useState } from 'react';
import { RiUserAddFill } from 'react-icons/ri';

function Setting({
    userData: initUserData,
    allUserData: initAllUserData,
    authUser,
}: {
    userData: ResponseData<TUser>;
    allUserData: ResponseData<TUser[]>;
    authUser: TAuthUser;
}) {
    const { token } = authUser;
    const { data: userData, mutate: mutateUser } = useRequest({
        url: UserServicePath.MY_USER,
        token,
        initData: initUserData,
    });
    const { data: allUserData, mutate: mutateAllUser } = useRequest({
        url: UserServicePath.GET_ALL_USER,
        token,
        initData: initAllUserData,
    });

    const [readonly, setReadonly] = useState(true);

    return (
        <BaseLayout.Main path={'setting'}>
            <ProCard
                tabs={{
                    type: 'line',
                }}
            >
                <ProCard.TabPane key="tab1" tab="จัดการโปรโฟล์">
                    <ProForm
                        readonly={readonly}
                        initialValues={{
                            firstName: userData?.data.firstName,
                            lastName: userData?.data.lastName,
                            email: userData?.data.email,
                            id: userData?.data.id,
                        }}
                        onFinish={async (values) => {
                            try {
                                logDebug('🚀 ~ onFinish={ ~ payload:', values);
                                await fetcher(
                                    UserServicePath.UPDATE_FOLDER,
                                    'PATCH',
                                    {
                                        headers: {
                                            Authorization: 'Bearer ' + token,
                                        },
                                        data: values,
                                    }
                                );
                                message.success('แก้ไขผู้ใช้งานสำเร็จ');
                                await mutateUser();

                                return true;
                            } catch (error) {
                                message.error('แก้ไขผู้ใช้งานไม่สำเร็จ');
                                return false;
                            }
                        }}
                        submitter={{
                            render: (props) => {
                                return [
                                    <Button
                                        key="rest"
                                        onClick={() =>
                                            setReadonly((prev) => !prev)
                                        }
                                    >
                                        {readonly ? 'แก้ไข' : 'ยกเลิก'}
                                    </Button>,
                                    <Button
                                        key="submit"
                                        onClick={() => props.form?.submit()}
                                        type="primary"
                                        disabled={readonly}
                                    >
                                        บันทึก
                                    </Button>,
                                ];
                            },
                        }}
                    >
                        <ProFormText
                            name="id"
                            hidden
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        />
                        <ProForm.Group>
                            <ProFormText
                                name="firstName"
                                label="ชื่อจริง"
                                placeholder={'กรุณากรอกชื่อจริง'}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            />
                            <ProFormText
                                name="lastName"
                                label="นามสกุล"
                                placeholder={'กรุณากรอกนามสกุล'}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            />
                        </ProForm.Group>

                        <ProFormText
                            width="lg"
                            name="email"
                            label="อีเมล"
                            placeholder={'กรุณากรอกอีเมล'}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        />
                    </ProForm>
                </ProCard.TabPane>
                <ProCard.TabPane key="tab2" tab="จัดการผู้ใช้งาน">
                    <ProTable
                        dataSource={allUserData?.data}
                        search={false}
                        toolbar={{
                            title: 'ผู้ใช้งานทั้งหมด',
                            actions: [
                                <ModalForm
                                    key={'createUser'}
                                    trigger={
                                        <Button
                                            type="primary"
                                            icon={
                                                <RiUserAddFill className="icon__button mr-2" />
                                            }
                                        >
                                            สร้างผู้ใช้งานใหม่
                                        </Button>
                                    }
                                    title={
                                        <Space>
                                            <RiUserAddFill className="icon" />
                                            <span className="text-base">
                                                สร้างผู้ใช้งานใหม่
                                            </span>
                                        </Space>
                                    }
                                    autoFocusFirstInput
                                    modalProps={{
                                        destroyOnClose: true,
                                    }}
                                    onFinish={async (values) => {
                                        try {
                                            logDebug(
                                                '🚀 ~ onFinish={ ~ payload:',
                                                values
                                            );
                                            await fetcher(
                                                UserServicePath.CREATE_FOLDER,
                                                'POST',
                                                {
                                                    headers: {
                                                        Authorization:
                                                            'Bearer ' + token,
                                                    },
                                                    data: values,
                                                }
                                            );
                                            message.success(
                                                'สร้างผู้ใช้งานสำเร็จ'
                                            );
                                            await mutateAllUser();

                                            return true;
                                        } catch (error) {
                                            message.error(
                                                'สร้างผู้ใช้งานไม่สำเร็จ'
                                            );
                                            return false;
                                        }
                                    }}
                                >
                                    <div className="flex w-full space-x-4">
                                        <ProFormText
                                            name="firstName"
                                            label="ชื่อจริง"
                                            placeholder={'กรุณากรอกชื่อจริง'}
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                            formItemProps={{
                                                className: 'flex-1',
                                            }}
                                        />
                                        <ProFormText
                                            name="lastName"
                                            label="นามสกุล"
                                            placeholder={'กรุณากรอกนามสกุล'}
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                            formItemProps={{
                                                className: 'flex-1',
                                            }}
                                        />
                                    </div>

                                    <ProFormText
                                        name="email"
                                        label="อีเมล"
                                        placeholder={'กรุณากรอกอีเมล'}
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    />
                                    <div className="flex w-full space-x-4">
                                        <ProFormText.Password
                                            name="password"
                                            label="รหัสผ่าน"
                                            placeholder={'กรุณากรอกรหัสผ่าน'}
                                            tooltip={{
                                                title: (
                                                    <ul className="ml-6 list-disc">
                                                        <li>
                                                            ต้องประกอบไปด้วยตัวอักษรอย่างน้อย
                                                            8 ตัวอักษร
                                                        </li>
                                                        <li>
                                                            ต้องประกอบไปด้วยตัวอักษรทั้งพิมพ์ใหญ่
                                                            พิมพ์เล็ก และตัวเลข
                                                        </li>
                                                    </ul>
                                                ),
                                            }}
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                                {
                                                    pattern:
                                                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,

                                                    message: `กรุณากรอกรหัสผ่านให้ถูกต้องตามที่กำหนด`,
                                                },
                                            ]}
                                            formItemProps={{
                                                className: 'flex-1',
                                            }}
                                        />
                                        <ProFormText.Password
                                            name="confirmPassword"
                                            label="ยืนยันรหัสผ่าน"
                                            placeholder={
                                                'กรุณายืนยันรหัสผ่านอีกครั้ง'
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                },

                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (
                                                            !value ||
                                                            getFieldValue(
                                                                'password'
                                                            ) === value
                                                        ) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(
                                                            new Error(
                                                                'รหัสผ่านไม่ตรงกันกรุณากรอกใหม่อีกครั้ง'
                                                            )
                                                        );
                                                    },
                                                }),
                                            ]}
                                            formItemProps={{
                                                className: 'flex-1',
                                            }}
                                        />
                                    </div>
                                </ModalForm>,
                            ],
                        }}
                        columns={[
                            {
                                title: 'ชื่อจริง',
                                dataIndex: 'firstName',
                            },
                            {
                                title: 'นามสกุล',
                                dataIndex: 'lastName',
                            },
                            {
                                title: 'อีเมล',
                                dataIndex: 'email',
                            },
                        ]}
                    ></ProTable>
                </ProCard.TabPane>
            </ProCard>
        </BaseLayout.Main>
    );
}

export const getServerSideProps = withAuthUserSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx: any) => {
    const authUser: TAuthUser = ctx.AuthUser;
    const token = authUser.token;

    const userData = await fetcher(UserServicePath.MY_USER, 'GET', {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    });
    const allUserData = await fetcher(UserServicePath.GET_ALL_USER, 'GET', {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    });

    return {
        props: {
            authUser,
            userData,
            allUserData,
        },
    };
});

export default Setting;
