import { createContext, useContext, useState } from 'react';
import useRequest from './useRequest';

export const authContext = createContext(null);

export const useAuth = () => {
    return useContext(authContext);
};

export function useAuthState() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     const { data, error, isLoading, isValidating, mutate } =
    //         useRequest<null>(`profile`, 'GET');
    //     // setUser(data);
    //     if (error) setError(error);
    //     if (isLoading) setLoading(true);
    //     return () => {};
    // }, []);

    return {
        loading,
        error,
        user,
    };
}

export function signIn(email: string, password: string) {
    const data = useRequest(`login`, 'POST', {
        email,
        password,
    });
    return data;
}

export function signOut() {}
