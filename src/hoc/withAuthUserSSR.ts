import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import AuthAction from './AuthAction';
import getUserFromCookies from './getUserFromCookies';
import { TAuthUser } from '@interfaces/index';
import logDebug from '@utilities/logDebug';

const withAuthUserSSR =
    ({
        whenAuthed = AuthAction.RENDER,
        whenUnauthed = AuthAction.RENDER,
    } = {}) =>
    (getServerSidePropsFunc: GetServerSideProps) =>
    async (ctx: GetServerSidePropsContext & { AuthUser: TAuthUser }) => {
        logDebug('🚀 ~ )=> ~ Calling withAuthUserTokenSSR:');
        const { req } = ctx;
        const AuthUser = await getUserFromCookies({ req });
        const AuthUserSerialized = JSON.stringify(AuthUser);

        if (!AuthUser.id && whenUnauthed === AuthAction.REDIRECT_TO_LOGIN) {
            logDebug('[withAuthUserSSR] Redirecting to login.');

            return {
                redirect: {
                    basePath: true,
                    permanent: false,
                    destination: '/login',
                },
            };
        }

        if (AuthUser.id && whenAuthed === AuthAction.REDIRECT_TO_APP) {
            logDebug('[withAuthUserSSR] Redirecting to app.');
            return {
                redirect: {
                    basePath: true,
                    permanent: false,
                    destination: '/',
                },
            };
        }

        let returnData = { props: { AuthUserSerialized } };

        if (getServerSidePropsFunc) {
            ctx.AuthUser = AuthUser;
            const composedProps: any =
                (await getServerSidePropsFunc(ctx)) || {};
            if (composedProps) {
                if (composedProps.props) {
                    returnData = { ...composedProps };
                    returnData.props.AuthUserSerialized = AuthUserSerialized;
                } else if (composedProps.notFound || composedProps.redirect) {
                    returnData = { ...composedProps };
                }
            }
        }
        logDebug('🚀 ~ returnData:', returnData);
        return returnData;
    };

export default withAuthUserSSR;
