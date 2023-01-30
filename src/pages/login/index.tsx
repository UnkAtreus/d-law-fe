import BaseLayout from '@baseComponents/BaseLayout';
import React from 'react';
import HeroBanner from '@assets/hero_login.jpg';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import Link from 'next/link';
import { RiLockLine, RiUser3Line } from 'react-icons/ri';
import { signIn } from '@services/useAuth';

function Login() {
    function onFinish(value: {
        email: string;
        password: string;
        remember: boolean;
    }) {
        const { data } = signIn(value.email, value.password);
    }

    return (
        <BaseLayout.Landing>
            <div className="flex h-full min-h-[calc(100vh-64px)] items-center justify-center">
                <div className="flex w-full max-w-screen-xl space-x-4 rounded-2xl bg-white p-16">
                    <img
                        src={HeroBanner.src}
                        alt=""
                        className="w-full flex-1"
                    />
                    <div className="flex flex-1 flex-col justify-center">
                        <div className="mb-4">
                            <h1 className="text-2xl text-gray-600">
                                Welcome to D-Law
                            </h1>
                            <Typography.Text className="text-gray-400">
                                Document management system for lawyer
                            </Typography.Text>
                        </div>
                        <Form<{
                            email: string;
                            password: string;
                            remember: boolean;
                        }>
                            layout="vertical"
                            autoComplete="false"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<RiUser3Line />}
                                    type="email"
                                    placeholder="example@gmail.com"
                                    allowClear
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={<RiLockLine />}
                                    placeholder="Password"
                                />
                            </Form.Item>

                            <Form.Item className="mb-2">
                                <Form.Item
                                    name="remember"
                                    valuePropName="checked"
                                    noStyle
                                >
                                    <Checkbox>จดจำรหัสผ่าน</Checkbox>
                                </Form.Item>
                                <Link
                                    className="float-right mt-1 text-xs text-gray-400 hover:text-primary"
                                    href={'/'}
                                >
                                    ลืมรหัสผ่าน?
                                </Link>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Login now
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </BaseLayout.Landing>
    );
}

export default Login;
