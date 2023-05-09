import type { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import '@styles/globals.css';
import thTHIntl from 'antd/es/locale/th_TH';
import dayjs from 'dayjs';
import NextNProgress from 'nextjs-progressbar';
require('dayjs/locale/th');
import utc from 'dayjs/plugin/utc';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.locale('th');
dayjs.extend(utc);
dayjs.extend(buddhistEra);

export default function App({ Component, pageProps, router }: AppProps) {
    return (
        <ConfigProvider
            locale={thTHIntl}
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
            <NextNProgress
                color="#8e5431"
                startPosition={0.3}
                stopDelayMs={200}
                height={2}
                showOnShallow={true}
                options={{ showSpinner: false }}
            />
            <Component {...pageProps} {...router} />
        </ConfigProvider>
    );
}
