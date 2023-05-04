/* eslint-disable @next/next/no-img-element */
import BaseLayout from '@baseComponents/BaseLayout';
import React, { useState } from 'react';
import HeroBanner from '@assets/hero_login.jpg';
import { Button, Checkbox, Form, Input, Typography, message } from 'antd';
import Link from 'next/link';
import { RiLockLine, RiUser3Line } from 'react-icons/ri';
import { signIn } from '@services/useAuth';
import { useRouter } from 'next/router';

function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    async function onFinish(value: {
        email: string;
        password: string;
        remember: boolean;
    }) {
        try {
            setIsLoading(true);
            const { status } = await signIn(value.email, value.password);
            if (status) {
                message.success('เข้าสู่ระบบสำเร็จ');
                router.push('/workspace');
            } else {
                message.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (error) {
            message.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
        setIsLoading(false);
    }

    return (
        <BaseLayout.Landing>
            <div className="flex h-full min-h-[calc(100vh-64px)] items-center justify-center ">
                <div className="my-8 flex w-full max-w-screen-lg space-x-4 rounded-2xl bg-white p-16 2xl:max-w-screen-xl">
                    <div className="hidden h-auto w-auto flex-1 md:block">
                        <img src={HeroBanner.src} alt="" />
                    </div>
                    <div className="flex max-w-md flex-1 flex-col justify-center">
                        <div className="mb-4 text-center md:text-left">
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
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoading}
                                    block
                                >
                                    เข้าสู่ระบบ
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
