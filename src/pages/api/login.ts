import { setCookie } from '@hoc/cookies';
import { TAuthUser } from '@interfaces/index';
import { request as rawRequest, request } from '@services/useRequest';
import { config } from 'configs/config';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    status: boolean;
    data?: TAuthUser;
    error?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;
            const { data: token } = await rawRequest.post('login', {
                data: { email, password },
            });

            if (!token) {
                throw new Error(
                    'The request must have an Authorization header value, or you should explicitly provide an ID token to "setAuthCookies".'
                );
            }
            let AuthUser = {
                token: null,
                id: '',
                firstName: '',
                lastName: '',
                email: '',
            };

            const { data } = await request.get('users/me', {
                headers: { Authorization: 'Bearer ' + token },
            });

            AuthUser = { token, ...data };

            const cookieOptions = config.cookies;
            setCookie(
                'd-law.AuthUserTokens',
                JSON.stringify(AuthUser),
                { req, res },
                cookieOptions
            );
            return res.status(200).json({ status: true, data: AuthUser });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            return res
                .status(500)
                .json({ status: false, error: 'Unexpected error.' });
        }
    } else {
        return res
            .status(500)
            .json({ status: false, error: 'Method not valid' });
    }
}
