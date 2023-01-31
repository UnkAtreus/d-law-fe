import useRequest from './useRequest';

const guidelineService = {
    getData(id: string, params?: object | URLSearchParams) {
        const response = useRequest<{ name: string }>(`pokemon/${id}`, 'GET', {
            params,
        });
        return response;
    },
    postData(data: any) {
        return useRequest<{ name: string }>(`pokemon`, 'POST', { data });
    },
};

export default guidelineService;
