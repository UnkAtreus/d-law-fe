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
                },
            }}
        >
            <Component {...pageProps} />
        </ConfigProvider>
    );
}
