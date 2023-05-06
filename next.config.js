/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: false,
});

const nextConfig = {
    transpilePackages: [
        'antd',
        '@ant-design/pro-components',
        '@ant-design/pro-layout',
        '@ant-design/pro-list',
        '@ant-design/pro-descriptions',
        '@ant-design/pro-form',
        '@ant-design/pro-skeleton',
        '@ant-design/pro-field',
        '@ant-design/pro-utils',
        '@ant-design/pro-provider',
        '@ant-design/pro-card',
        '@ant-design/pro-table',
        'rc-pagination',
        'rc-picker',
        'rc-util',
        'rc-tree',
        'rc-tooltip',
    ],

    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        config.module.rules.push({
            test: /\.(pdf|doc?x|xls?x)$/i,
            type: 'asset',
            generator: {
                filename: 'static/chunks/[path][name].[hash][ext]',
            },
        });
        config.module.rules.push({
            test: /\.(txt)$/i,
            use: 'raw-loader',
        });

        return config;
    },
};

module.exports = withBundleAnalyzer(nextConfig);
