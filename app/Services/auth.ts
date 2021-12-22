import axios from 'axios';
import Env from '@ioc:Adonis/Core/Env';

const URI = Env.get('URI_SERVICE_AUTH');
const VERSION = Env.get('API_AUTH_VERSION');

export const getUsers = async (id, headerAuthorization) => {
    try {
        const axiosResponse = await axios.get(`${URI}${VERSION}/addresses`, {
            params: { id: id },
            headers: { authorization: headerAuthorization },
        });

        return axiosResponse.data.results;
    } catch (error) {
        console.error(error);
        return Promise.reject('');
    }
};
