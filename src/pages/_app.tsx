import type { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import '@styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#8e5431',
                    colorText: '#4B5563',
                    fontSize: 14,
                    borderRadius: 4,
                    wireframe: false,
                    colorBgLayout: '#F1F5F9',
                    colorTextBase: '#4b5563',
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
            <Component {...pageProps} />
        </ConfigProvider>
    );
}
