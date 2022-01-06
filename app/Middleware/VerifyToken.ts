import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { getToken } from 'App/Utils/functions/jwt';
import axios from 'axios';
import Env from '@ioc:Adonis/Core/Env';
import { IResponseData } from 'App/Utils/interfaces';

export default class VerifyToken {
    public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
        let responseData: IResponseData = {
            message: 'Debe de ingresar para realizar esta acción.',
            error: true,
            status: 401,
        };
        const { token, headerAuthorization, payloadToken } = getToken(request.headers());
        if (payloadToken === undefined) {
            responseData['message'] =
                'Token expirado. Iniciar sesión de nuevo para poder continuar.';
            return response.unauthorized(responseData);
        }

        if (
            token === '' ||
            !payloadToken['iat'] ||
            (payloadToken['iat'] === -1 && payloadToken['id'] === -1)
        ) {
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
