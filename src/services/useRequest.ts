import useSwr, { Key } from 'swr';
import { extend } from 'umi-request';

const BASE_URL = 'https://pokeapi.co/api/v2/';

type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';

const request = extend({
  prefix: BASE_URL,
});

function fetcher(
    path: string,
    method: Method,
    data: any,
) {
    try {
        switch (method.toUpperCase()) {
            case 'GET':
                return request
                    .get(path)
                    .then((res) => res);
            case 'POST':
                return request
                    .post(path, {
                        data,
                    })
                    .then((res) => res);
            case 'DELETE':
                return request
                    .delete(path)
                    .then((res) => res);
            case 'PATCH':
                return request
                    .patch(path, {
                        data,
                    })
                    .then((res) => res);
            default:
                return request
                    .get(BASE_URL + path)
                    .then((res) => res);
        }
    } catch (error: any) {
        return error;
    }
}
function useRequest<T>(
    path: Key,
    method: Method,
    payload?: any,
) {
    const { data, error, isLoading, isValidating, mutate } = useSwr<T>(
        [path, method, payload],
        ([path, method, payload]: [string, Method, any]) =>
            fetcher(path, method, payload)
    );

    return { data, error, isLoading, isValidating, mutate };
}

export default useRequest;
