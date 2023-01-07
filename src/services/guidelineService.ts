import useRequest from './useRequest';

const guidelineService = {
    getData(id: string) {
        const response = useRequest<{ name: string }>(`pokemon/${id}`, 'GET');
        return response;
    },
    postData(data: any) {
        return useRequest<{ name: string }>(`pokemon`, 'POST', data);
    },
};

export default guidelineService;
