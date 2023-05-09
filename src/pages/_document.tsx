import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="icon" href="/logo.ico" />
                <Script src={'/js/prod_hotjar.js'}></Script>
            </Head>
            <body>
                <title>D-Law | DMS-Platform</title>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
