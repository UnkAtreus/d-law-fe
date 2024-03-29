import { TAuthUser } from '@interfaces/index';
import request from 'umi-request';

export async function signIn(email: string, password: string) {
    const data: {
        status: boolean;
        data?: TAuthUser;
        error?: string;
    } = await request.post('/api/login', {
        data: {
            email,
            password,
        },
    });
    return data;
}

export async function signOut() {
    const data = await request.post('/api/logout');
    return data;
}

const UserServicePath = {
    GET_ALL_USER: 'users',
    GET_BY_ID: 'users/',
    CREATE_FOLDER: 'users',
    UPDATE_FOLDER: 'users/',
    MY_USER: 'users/me',
};

export default UserServicePath;
