import useSwr, { Key } from 'swr';
import axios, { AxiosRequestConfig, Method } from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2/';

const instance = axios.create({
    baseURL: BASE_URL,
});

function fetcher(
    path: string,
    method: Method,
    data: any,
    config?: AxiosRequestConfig
) {
    try {
        switch (method.toUpperCase()) {
            case 'GET':
                return instance
                    .get(path, config)
                    .then((res: { data: any }) => res.data);
            case 'POST':
                return instance
                    .post(path, data, config)
                    .then((res: { data: any }) => res.data);
            case 'DELETE':
                return instance
                    .delete(path, config)
                    .then((res: { data: any }) => res.data);
            case 'PATCH':
                return instance
                    .patch(path, data, config)
                    .then((res: { data: any }) => res.data);
            default:
                return axios
                    .get(BASE_URL + path)
                    .then((res: { data: any }) => res.data);
        }
    } catch (error: any) {
        return error;
    }
}
function useRequest<T>(
    path: Key,
    method: Method,
    payload?: any,
    config?: AxiosRequestConfig
) {
    const { data, error, isLoading, isValidating, mutate } = useSwr<T>(
        [path, method, payload, config],
        ([path, method, payload, config]) =>
            fetcher(path, method, payload, config)
    );

    return { data, error, isLoading, isValidating, mutate };
}

export default useRequest;
