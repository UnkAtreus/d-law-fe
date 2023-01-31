import useSwr, { Key } from 'swr';
import { RequestOptionsInit, extend } from 'umi-request';

const BASE_URL = 'https://pokeapi.co/api/v2/';

type Method =
    | 'get'
    | 'GET'
    | 'delete'
    | 'DELETE'
    | 'head'
    | 'HEAD'
    | 'options'
    | 'OPTIONS'
    | 'post'
    | 'POST'
    | 'put'
    | 'PUT'
    | 'patch'
    | 'PATCH'
    | 'purge'
    | 'PURGE'
    | 'link'
    | 'LINK'
    | 'unlink'
    | 'UNLINK';

const request = extend({
    prefix: BASE_URL,
});

function fetcher(
    path: string,
    method: Method,
    options?: RequestOptionsInit | undefined
) {
    try {
        switch (method.toUpperCase()) {
            case 'GET':
                return request.get(path, options).then((res) => res);
            case 'POST':
                return request.post(path, options).then((res) => res);
            case 'DELETE':
                return request.delete(path, options).then((res) => res);
            case 'PATCH':
                return request.patch(path, options).then((res) => res);
            default:
                return request.get(BASE_URL + path, options).then((res) => res);
        }
    } catch (error: any) {
        return error;
    }
}
function useRequest<T>(
    path: Key,
    method: Method,
    options?: RequestOptionsInit | undefined
) {
    const { data, error, isLoading, isValidating, mutate } = useSwr<T>(
        [path, method, options],
        ([path, method, options]: [string, Method, any]) =>
            fetcher(path, method, options)
    );

    return { data, error, isLoading, isValidating, mutate };
}

export default useRequest;
