import useSwr from 'swr';
import { RequestOptionsInit, extend } from 'umi-request';
import progressMiddleware from 'umi-request-progress';

export const BASE_URL = process.env.NEXT_PUBLIC_API_ROUTE;

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

export const request = extend({
    prefix: BASE_URL,
    headers: {
        'x-organization': 'iLaw',
    },
});

request.use(progressMiddleware, { core: true });

export function fetcher(
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
                return request.get(path, options).then((res) => res);
        }
    } catch (error: any) {
        return error;
    }
}

function useRequest<T>({
    url,
    payload,
    token,
    initData,
    params,
}: {
    url: string | null;
    payload?: any;
    token: string | null;
    initData?: T;
    params?: Record<string, string>;
}) {
    const method = payload ? 'POST' : 'GET';
    const defaultOptions = {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    };
    const { data, error, isLoading, isValidating, mutate } = useSwr<T>(
        [url, token],
        ([url, token]: [string, string]) =>
            fetcher(url, method, {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                params: params,
                ...(payload && { data: payload }),
            }),
        { ...defaultOptions, fallbackData: initData }
    );

    return { data, error, isLoading, isValidating, mutate };
}

export default useRequest;
