import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="icon" href="/logo.ico" />
                <script src={'/js/prod_hotjar.js'} defer />
            </Head>
            <body>
                <title>D-Law | DMS-Platform</title>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
