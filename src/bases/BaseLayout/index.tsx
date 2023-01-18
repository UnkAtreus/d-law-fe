import { Avatar, Dropdown, Layout, Menu, MenuProps, Space, theme } from 'antd';
import React from 'react';
import Logo from '@assets/dlaw_logo.svg';
import {
    RiComputerLine,
    RiFileCopy2Line,
    RiCalendarTodoLine,
    RiSettings5Line,
    RiArrowDropDownLine,
    RiLogoutBoxLine,
} from 'react-icons/ri';

function BaseLayout({ children }: { children: React.ReactNode }) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
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

    const items: MenuProps['items'] = [
        getItem(
            <div className="flex flex-col items-center justify-center py-5">
                <RiComputerLine className="menu-icon" />
                <div className="menu-text">WORKSPACE</div>
            </div>,
            'workspace'
        ),
        getItem(
            <div className="flex flex-col items-center justify-center py-5">
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
            'workspace',
            <RiLogoutBoxLine className="m-auto h-6 w-6" />
        ),
    ];

    return (
        <Layout className="min-h-screen">
            <Layout.Sider
                style={{
                    background: colorBgContainer,
                    boxShadow: '6px 0px 24px rgba(0, 0, 0, 0.1)',
                }}
                width={120}
            >
                <Logo className="m-4" />
                <Menu
                    defaultSelectedKeys={['workspace']}
                    mode="inline"
                    items={items}
                />
            </Layout.Sider>
            <Layout>
                <Layout.Header
                    style={{
                        padding: 0,
                        backgroundColor: colorBgContainer,
                        boxShadow: '0px 4px 30px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div className="flex items-center justify-between px-6 ">
                        <h1 className="font-bold">Workshop</h1>
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
}

export default BaseLayout;
