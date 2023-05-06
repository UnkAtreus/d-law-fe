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
import { signOut } from '@services/useAuth';
import { getRandomColor } from '@utilities/index';

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
        avatarName = '',
    }: {
        children: React.ReactNode;
        path?: string;
        avatarName: string;
    }) {
        const {
            token: { colorBgContainer },
        } = theme.useToken();

        const router = useRouter();

        const items: MenuProps['items'] = [
            getItem(
                <div
                    onClick={() => router.push('/workspace')}
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
                <div
                    onClick={() => router.push('/appointment')}
                    className="flex flex-col items-center justify-center py-5"
                >
                    <RiCalendarTodoLine className="menu-icon" />
                    <div className="menu-text">APPOINTMENT</div>
                </div>,
                'appointment'
            ),
            getItem(
                <div
                    onClick={() => router.push('/setting')}
                    className="flex flex-col items-center justify-center py-5"
                >
                    <RiSettings5Line className="menu-icon" />
                    <div className="menu-text">SETTING</div>
                </div>,
                'setting'
            ),
        ];

        const nav_menu: MenuProps['items'] = [
            getItem(
                'ออกจากระบบ',
                'logout',
                <RiLogoutBoxLine className="icon__button m-auto" />
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
                        zIndex: 20,
                    }}
                    width={120}
                >
                    <div
                        className="cursor-pointer"
                        onClick={() => {
                            router.push('/workspace');
                        }}
                    >
                        <Logo className="m-4" />
                    </div>
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
                            zIndex: 10,
                            width: '100%',
                        }}
                    >
                        <div className="flex items-center justify-between px-6 ">
                            <Space>
                                <Button
                                    shape="circle"
                                    type="text"
                                    onClick={() => router.back()}
                                    icon={
                                        <RiArrowLeftSLine className="icon__button " />
                                    }
                                />
                                <h1 className="font-bold">
                                    {path.charAt(0).toUpperCase() +
                                        path.slice(1)}
                                </h1>
                            </Space>

                            <div>
                                <Dropdown
                                    menu={{
                                        onClick: async ({ key }) => {
                                            if (key === 'logout') {
                                                await signOut();
                                                router.push('/login');
                                            }
                                        },
                                        items: nav_menu,
                                    }}
                                    trigger={['click']}
                                >
                                    <a onClick={(e) => e.preventDefault()}>
                                        <Space>
                                            <Avatar
                                                style={{
                                                    backgroundColor:
                                                        getRandomColor(
                                                            avatarName
                                                        ),
                                                }}
                                            >
                                                {avatarName}
                                            </Avatar>
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

        const router = useRouter();

        return (
            <Layout className="min-h-screen" hasSider>
                <Layout>
                    <Layout.Header
                        style={{
                            padding: 0,
                            backgroundColor: colorBgContainer,
                            boxShadow: '0px 4px 30px 4px rgba(0, 0, 0, 0.1)',
                            zIndex: 10,
                        }}
                    >
                        <div className="flex items-center justify-between px-6 ">
                            <div
                                className="cursor-pointer"
                                onClick={() => {
                                    router.push('https://www.dlaw-dms.com/');
                                }}
                            >
                                <Logo className="m-4" />
                            </div>

                            <div>
                                <Space size={'middle'}>
                                    <Link
                                        href={`https://www.dlaw-dms.com/search-case`}
                                    >
                                        <Typography.Text className="hover-text">
                                            ค้นหาคดี
                                        </Typography.Text>
                                    </Link>
                                    <Link
                                        href={`https://www.dlaw-dms.com/public-appointment`}
                                    >
                                        <Typography.Text className="hover-text">
                                            นัดหมาย
                                        </Typography.Text>
                                    </Link>
                                    <Divider type="vertical" className="m-0" />
                                    <Link
                                        href={`https://app.dlaw-dms.com/workspace`}
                                    >
                                        <Button type="primary">
                                            สำหรับทนาย
                                        </Button>
                                    </Link>
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
