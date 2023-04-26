import { createContext, useContext } from 'react';

export const AuthUserContext = createContext({
    token: null,
    id: null,
    firstName: null,
    lastName: null,
    email: null,
});

const useAuthUser = () => {
    const authUser = useContext(AuthUserContext);
    if (!authUser) {
        throw new Error(
            'When using `useAuthUser`, the page must be wrapped in `withAuthUser`.'
        );
    }
    return authUser;
};

export default useAuthUser;
