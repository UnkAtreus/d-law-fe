import {
    Avatar,
    Button,
    Divider,
    Dropdown,
    Layout,
    Menu,
    MenuProps,
    Space,
    theme,
    Typography,
} from 'antd';
import React from 'react';
import Logo from '@assets/dlaw_logo.svg';
import {
    RiComputerLine,
    RiFileCopy2Line,
    RiCalendarTodoLine,
    RiSettings5Line,
    RiArrowDropDownLine,
    RiLogoutBoxLine,
    RiArrowLeftSLine,
} from 'react-icons/ri';
import Link from 'next/link';
import { useRouter } from 'next/router';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const BaseLayout = {
    Main({
        children,
        path = 'workspace',
    }: {
        children: React.ReactNode;
        path?: string;
    }) {
        const {
            token: { colorBgContainer },
        } = theme.useToken();

        const router = useRouter();

        const items: MenuProps['items'] = [
            getItem(
                <div
                    onClick={() => router.push('/')}
                    className="flex flex-col items-center justify-center py-5"
                >
                    <RiComputerLine className="menu-icon" />
                    <div className="menu-text">WORKSPACE</div>
                </div>,
                'workspace'
            ),
            getItem(
                <div
                    onClick={() => router.push('/document')}
                    className="flex flex-col items-center justify-center py-5"
                >
                    <RiFileCopy2Line className="menu-icon" />
                    <div className="menu-text">DOCUMENT</div>
                </div>,
                'document'
            ),
            getItem(
                <div className="flex flex-col items-center justify-center py-5">
                    <RiCalendarTodoLine className="menu-icon" />
                    <div className="menu-text">APPOINTMENT</div>
                </div>,
                'appointment'
            ),
            getItem(
                <div className="flex flex-col items-center justify-center py-5">
                    <RiSettings5Line className="menu-icon" />
                    <div className="menu-text">SETTING</div>
                </div>,
                'setting'
            ),
        ];

        const nav_menu: MenuProps['items'] = [
            getItem(
                'Logout',
                'logout',
                <RiLogoutBoxLine className="m-auto h-6 w-6" />
            ),
        ];

        return (
            <Layout className="min-h-screen" hasSider>
                <Layout.Sider
                    style={{
                        background: colorBgContainer,
                        boxShadow: '6px 0px 24px rgba(0, 0, 0, 0.1)',
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        zIndex: 2,
                    }}
                    width={120}
                >
                    <Logo className="m-4" />
                    <Menu selectedKeys={[path]} mode="inline" items={items} />
                </Layout.Sider>
                <Layout className="ml-[120px]">
                    <Layout.Header
                        style={{
                            padding: 0,
                            backgroundColor: colorBgContainer,
                            boxShadow: '0px 4px 30px 4px rgba(0, 0, 0, 0.1)',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                            width: '100%',
                        }}
                    >
                        <div className="flex items-center justify-between px-6 ">
                            <Space>
                                <RiArrowLeftSLine
                                    onClick={() => router.back()}
                                    className="icon cursor-pointer"
                                />
                                <h1 className="font-bold">Workspace</h1>
                            </Space>

                            <div>
                                <Dropdown
                                    menu={{
                                        items: nav_menu,
                                    }}
                                    trigger={['click']}
                                >
                                    <a onClick={(e) => e.preventDefault()}>
                                        <Space>
                                            <Avatar>KD</Avatar>
                                            <RiArrowDropDownLine className="h-6 w-6 text-gray-400" />
                                        </Space>
                                    </a>
                                </Dropdown>
                            </div>
                        </div>
                    </Layout.Header>
                    <Layout.Content className="mx-6 my-12">
                        {children}
                    </Layout.Content>
                </Layout>
            </Layout>
        );
    },
    Landing({ children }: { children: React.ReactNode }) {
        const {
            token: { colorBgContainer },
        } = theme.useToken();

        return (
            <Layout className="min-h-screen" hasSider>
                <Layout>
                    <Layout.Header
                        style={{
                            padding: 0,
                            backgroundColor: colorBgContainer,
                            boxShadow: '0px 4px 30px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div className="flex items-center justify-between px-6 ">
                            <Logo className="m-4" />

                            <div>
                                <Space size={'middle'}>
                                    <Link href={'/'}>
                                        <Typography.Text className="hover-text">
                                            ค้นหาคดี
                                        </Typography.Text>
                                    </Link>
                                    <Link href={'/'}>
                                        <Typography.Text className="hover-text">
                                            นัดหมาย
                                        </Typography.Text>
                                    </Link>
                                    <Divider type="vertical" className="m-0" />
                                    <Button type="primary">สำหรับทนาย</Button>
                                </Space>
                            </div>
                        </div>
                    </Layout.Header>
                    <Layout.Content>{children}</Layout.Content>
                </Layout>
            </Layout>
        );
    },
};

export default BaseLayout;
