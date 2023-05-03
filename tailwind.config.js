/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/bases/**/*.{js,ts,jsx,tsx}',
        './src/utilities/**/*.{js,ts,jsx,tsx}',
    ],
    important: false,
    theme: {
        extend: {
            colors: {
                primary: '#8e5431',
            },
        },
    },
    plugins: [
        require('vidstack/tailwind.cjs'),
        require('@tailwindcss/line-clamp'),
    ],
    corePlugins: {
        preflight: false,
    },
};
