import Env from '@ioc:Adonis/Core/Env';
import axios from 'axios';

import moment from 'moment';
import AuditTrail from 'App/Utils/classes/AuditTrail';
import { IResponseData } from '../interfaces';

export const sum = (num1: number, num2: number): number => {
    return num1 + num2;
};

export const validateDate = (vigencyEnd: number) => {
    let dateNow = moment().valueOf();
    var discharge = moment(vigencyEnd);
    const diff = discharge.diff(dateNow, 'days');

    return diff < 0 ? 'Vencida' : 'Vigente';
};

type Action = 'inactivate' | 'terminate' | 'activate';

export const changeStatus = async (
    model: any,
    id: string | number,
    action: Action,
    token: string,
) => {
    try {
        const data = await model.findOrFail(id);

        const auditTrail = new AuditTrail(token, data.audit_trail);

        if (action === 'inactivate') {
            if (data.status != 0) data.status = 0;
            else
                return {
                    success: false,
                    results: {
                        name: 'Already inactivate',
                        message: 'Already inactivate, please defore inactivate, activate it.',
                    },
                };
        }

        if (action === 'activate') data.status = 1;

        auditTrail.update({ status: data.status }, data);
        const tmpModel = await data.save();

        return { success: true, results: tmpModel };
    } catch (error) {
        console.error(`Error changing status:\n${error}`);
        return { success: false, results: error };
    }
};

// export const capitalize = (str) => {
//   if (typeof str === "string") {
//     return str
//       .trim()
//       .toLowerCase()
//       .replace(
//         /\w\S*/g,
//         (w) =>
//           (w && w.replace(/^\w/, (c) => (c && c.toUpperCase()) || "")) || ""
//       );
//   } else {
//     return "";
//   }
// };

export const getDataUser = async (token: string) => {
    // const { id } = decodeJWT(token);

    // Consulting
    try {
        // User.findOrFail(payload.id);
        const axiosResponse = await axios.get(
            `${Env.get('URI_SERVICE_AUTH')}${Env.get('API_AUTH_VERSION')}/users`,
            {
                // params: { id },
                headers: { authorization: token },
            },
        );
        return axiosResponse.data.results.detailsUser;
    } catch (error) {
        console.error(error);
        // return response.unauthorized({
        //   error: "Debe de ingresar para realizar esta acción",
        // });
    }

    // try {
    //   const detailsUser = await DetailsUser.query().where("user_id", id);

    //   return detailsUser[0];
    // } catch (error) {
    //   console.error(error);
    // }
};

export const validatePagination = (q?, page?, pageSize?) => {
    let tmpQ: string, tmpPage: number, tmpPageSize: number;

    if (!q) tmpQ = '';
    else tmpQ = String(q).toUpperCase().trim();

    if (!pageSize) tmpPageSize = 10;
    else tmpPageSize = Number(pageSize);

    if (!page) tmpPage = 1;
    else tmpPage = Number(page);

    return { q: tmpQ, page: tmpPage, pageSize: tmpPageSize };
};

export const messageError = (
    error: any = {
        name: 'Desconocido',
        message: 'Error desconocido.\nRevisar Terminal.',
    },
    response: any,
    initialMessage: string = 'Ha ocurrido un error inesperado',
    initialStatus: number = 500,
) => {
    let responseData: IResponseData = {
        message: initialMessage,
        status: initialStatus,
    };
    responseData.error = { name: error.name, message: error.message };

    // Error 23505
    if (Number(error.code) === 23505)
        responseData.message =
            'Error interno controlable. Realice la consulta hasta que le funcione. :)';

    if (responseData['status'] === 401)
        responseData['error'] = {
            name: 'Unauthorized',
            message: 'No se encuentra autorizado para obtener la información solicitada.',
        };

    if (responseData['status'] === 400)
        responseData['error'] = {
            name: 'Bad Request',
            message:
                'Sintaxis inválida. El servidor no puede entender la información solicitada o no enviada.',
        };

    console.error(error);
    return response.status(responseData['status']).json(responseData);
};

export * from './jwt';
