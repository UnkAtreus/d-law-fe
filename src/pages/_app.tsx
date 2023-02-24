import type { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import '@styles/globals.css';
import thTH from '@locales/th_TH';
import { authContext, useAuthState } from '@services/useAuth';
import dayjs from 'dayjs';
require('dayjs/locale/th');

dayjs.locale('th');

export default function App({ Component, pageProps, router }: AppProps) {
    const { user } = useAuthState();
    return (
        <authContext.Provider value={user}>
            <ConfigProvider
                locale={thTH}
                theme={{
                    token: {
                        colorPrimary: '#8e5431',
                        colorText: '#4B5563',
                        fontSize: 14,
                        borderRadius: 4,
                        wireframe: false,
                        colorBgLayout: '#F1F5F9',
                        colorTextBase: '#4b5563',
                        colorFillSecondary: 'rgb(142 84 49 / 0.06)',
                    },
                    components: {
                        Menu: {
                            colorText: '#9ca3af',
                            colorTextBase: '#9ca3af',
                        },
                        Dropdown: {
                            colorText: '#4B5563',
                            colorTextBase: '#4B5563',
                        },
                    },
                }}
            >
                <Component {...pageProps} {...router} />
            </ConfigProvider>
        </authContext.Provider>
    );
}
