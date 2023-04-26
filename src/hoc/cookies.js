import { encodeBase64, decodeBase64 } from '@utilities/encoding';
import Cookies from 'cookies';

const createCookieMgr = ({ req, res }, { keys, secure } = {}) => {
    const cookies = Cookies(req, res, {
        keys,
        secure,
    });
    return cookies;
};

export const getCookie = (
    name,
    {
        req,
        res = {
            getHeader: () => [],
            setHeader: () => ({
                call: () => {},
            }),
        },
    },
    { keys, secure, signed } = {}
) => {
    if (signed) {
        const areCookieKeysDefined =
            keys &&
            keys.length &&
            (keys.filter
                ? keys.filter((item) => item !== undefined).length
                : true);
        if (!areCookieKeysDefined) {
            throw new Error(
                'The "keys" value must be provided when using signed cookies.'
            );
        }
    }
    if (!req) {
        throw new Error(
            'The "req" argument is required when calling `getCookie`.'
        );
    }

    const cookies = createCookieMgr({ req, res }, { keys, secure });

    const cookieVal = cookies.get(name, { signed });
    return cookieVal ? decodeBase64(cookieVal) : undefined;
};

export const setCookie = (
    name,
    cookieVal,
    { req, res },
    {
        keys,
        domain,
        httpOnly,
        maxAge,
        overwrite,
        path,
        sameSite,
        secure,
        signed,
    } = {}
) => {
    if (signed && !keys) {
        throw new Error(
            'The "keys" value must be provided when using signed cookies.'
        );
    }
    if (!res) {
        throw new Error(
            'The "res" argument is required when calling `setCookie`.'
        );
    }

    const cookies = createCookieMgr({ req, res }, { keys, secure });

    const valToSet = cookieVal == null ? undefined : encodeBase64(cookieVal);

    cookies.set(name, valToSet, {
        domain,
        httpOnly,
        maxAge,
        overwrite,
        path,
        sameSite,
        secure,
        signed,
    });
};

export const deleteCookie = (name, reqResObj, options) => {
    setCookie(name, undefined, reqResObj, options);
};
