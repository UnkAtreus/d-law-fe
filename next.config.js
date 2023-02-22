/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
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

module.exports = nextConfig;
