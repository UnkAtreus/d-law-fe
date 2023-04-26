import { config } from 'configs/config';
import { getCookie } from './cookies';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { NextIncomingMessage } from 'next/dist/server/request-meta';
import logDebug from '@utilities/logDebug';

const getUserFromCookies = async ({
    req,
}: {
    req: NextIncomingMessage & {
        cookies: NextApiRequestCookies;
    };
}) => {
    const { keys, secure, signed } = config.cookies;
    let user = {
        token: null,
        id: null,
        firstName: null,
        lastName: null,
        email: null,
    };

    if (!signed) {
        throw new Error('Cookies must be signed when using withAuthUserSSR.');
    }

    const cookieValStr = getCookie(
        'd-law.AuthUserTokens',
        {
            req,
        },
        { keys, secure, signed }
    );

    if (cookieValStr) {
        logDebug(
            '[getUserFromCookies] Successfully retrieved the user info from cookies.'
        );
    } else {
        logDebug(
            '[getUserFromCookies] Failed to retrieve the user info from cookies. The provided cookie values might be invalid or not align with your cookie settings. The user will be unauthenticated.'
        );
        return user;
    }

    user = JSON.parse(cookieValStr);
    return user;
};

export default getUserFromCookies;
