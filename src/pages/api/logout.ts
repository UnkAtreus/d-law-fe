import { deleteCookie } from '@hoc/cookies';
import { config } from 'configs/config';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    status: boolean;
    error?: string;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        const cookieOptions = config.cookies;
        deleteCookie('d-law.AuthUserTokens', { req, res }, cookieOptions);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        return res
            .status(500)
            .json({ status: false, error: 'Unexpected error.' });
    }
    return res.status(200).json({ status: true });
}
