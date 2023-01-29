/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        config.module.rules.push({
            test: /\.(pdf)$/,
            type: 'asset',
            generator: {
                filename: 'static/chunks/[path][name].[hash][ext]',
            },
        });
        return config;
    },
};

module.exports = nextConfig;
