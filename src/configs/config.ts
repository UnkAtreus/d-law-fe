const TWELVE_DAYS_IN_MS = 12 * 60 * 60 * 24 * 1000;

export const config = {
    cookies: {
        name: 'd-law',
        keys: [
            process.env.COOKIE_SECRET_CURRENT,
            process.env.COOKIE_SECRET_PREVIOUS,
        ],
        domain: undefined,
        httpOnly: true,
        maxAge: TWELVE_DAYS_IN_MS,
        overwrite: true,
        path: '/',
        sameSite: 'lax',
        secure: 'true',
        signed: true,
    },
};
