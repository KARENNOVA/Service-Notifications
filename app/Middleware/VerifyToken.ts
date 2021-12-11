import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { decodeJWT, getToken } from 'App/Utils/functions/jwt';
import axios from 'axios';
import Env from '@ioc:Adonis/Core/Env';
import { IDataToken, IResponseData } from 'App/Utils/interfaces';

export default class VerifyToken {
    public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
        let responseData: IResponseData = {
            message: 'Debe de ingresar para realizar esta acción.',
            error: true,
            status: 200,
        };
        const { token, headerAuthorization } = getToken(request.headers());

        // Get data of Token
        let payload: IDataToken = { id: -1, iat: -1 };
        if (token !== '') payload = decodeJWT(token);

        if (token === '' || (payload['iat'] === -1 && payload['id'] === -1)) {
            return response.unauthorized(responseData);
        }

        // Consulting
        try {
            // User.findOrFail(payload.id);
            await axios.get(`${Env.get('URI_SERVICE_AUTH')}${Env.get('API_AUTH_VERSION')}/users`, {
                headers: { authorization: headerAuthorization },
            });
        } catch (error) {
            console.error(error);
            return response.unauthorized({
                error: 'Debe de ingresar para realizar esta acción',
            });
        }

        await next();
    }
}
