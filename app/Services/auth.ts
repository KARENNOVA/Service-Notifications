import axios from 'axios';
import Env from '@ioc:Adonis/Core/Env';

const URI = Env.get('URI_SERVICE_AUTH');
const VERSION = Env.get('API_AUTH_VERSION');

export const getUsersByRole = async (role: string, headerAuthorization) => {
    try {
        // {{DOMAIN}}{{API-VERSION}}/users/list?role=Adquisiciones
        const axiosResponse = await axios.get(`${URI}${VERSION}/users/list`, {
            params: { role: role },
            headers: { authorization: headerAuthorization },
        });

        return axiosResponse.data.results;
    } catch (error) {
        console.error(error);
        return Promise.reject('');
    }
};

export const registerSID = async (sid: string, headerAuthorization, id: number) => {
    try {
        // {{DOMAIN}}{{API-VERSION}}/users/list?role=Adquisiciones
        const axiosResponse = await axios.get(`${URI}${VERSION}/auth/sid`, {
            params: { sid, id },
            headers: { authorization: headerAuthorization },
        });

        return axiosResponse.data.results;
    } catch (error) {
        console.error(error);
        return Promise.reject('');
    }
};
