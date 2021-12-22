import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Notification from './../../Models/Notification';
import { IResponseData } from './../../Utils/interfaces/index';
import CreateNotificationValidator from './../../Validators/CreateNotificationValidator';
import { INotification } from './../../Utils/interfaces/notification';
import { getToken, validatePagination } from 'App/Utils/functions';
import { decodeJWT } from './../../Utils/functions/jwt';
import { IDataToken } from 'App/Utils/interfaces';
import AuditTrail from './../../Utils/classes/AuditTrail';
import Ws from 'App/Services/Ws';

export default class NotificationsController {
    public async index({}: HttpContextContract) {}

    public async create({ response, request }: HttpContextContract) {
        let responseData: IResponseData = { message: '', status: 200 };
        const { token } = getToken(request.headers());
        const payloadToken: IDataToken = decodeJWT(token);

        const payloadValidator = await request.validate(CreateNotificationValidator);

        const auditTrail: AuditTrail = new AuditTrail(token);
        await auditTrail.init();

        const tmpDataToCreate = {
            ...payloadValidator,
        };

        if (payloadValidator['toRole']) {
            delete tmpDataToCreate['toRole'];
        }

        let dataToCreate: INotification = {
            ...payloadValidator,
            received: false,
            readed: false,
            from: payloadToken['id'],
            status: 1,
            audit_trail: auditTrail.getAsJson(),
        };

        try {
            const notificationCreated = await Notification.create(dataToCreate);
            responseData['message'] = 'Notificación creada satisfactoriamente.';
            responseData['results'] = notificationCreated;
            Ws.io
                .to(request.headers()['sec-websocket-key'] as string)
                .emit('new:notification', responseData['results']);
            return response.status(responseData['status']).json(responseData);
        } catch (error) {
            console.log(error);

            responseData['message'] =
                'Error inesperado al crear la Notificación.\nRevisar Terminal.';
            responseData['status'] = 500;
            return response.status(responseData['status']).json(response);
        }
    }

    public async store({ response }: HttpContextContract) {
        const flag = Ws.io.emit('new:notification', { username: 'virk' });
        return response.json({
            flag,
        });
    }

    public async show({ response, request }: HttpContextContract) {
        const responseData: IResponseData = { message: '', status: 200 };
        const { id } = request.qs();

        // Validaciones de Query Params
        if (!id) {
            responseData['status'] = 400;
            responseData['message'] = 'Ingrese el ID a buscar.';
            return response.status(responseData['status']).json(responseData);
        }

        try {
            let notifications = await Notification.query().preload('status_info').where('id', id);
            const notification = {
                ...notifications[0]['$attributes'],
            };
            console.log(notifications);

            responseData['message'] = 'Notificación';
            responseData['results'] = notification;
        } catch (error) {
            responseData['error'] = error;
            responseData[
                'message'
            ] = `Error inesperado al obtener la información de la notificación con ID: ${id}.\nRevisar Terminal.`;
            responseData['status'] = 500;
            console.error(error);

            return response.status(responseData['status']).json(responseData);
        }

        return response.status(responseData['status']).json(responseData);
    }

    public async showAll({ response, request }: HttpContextContract) {
        const responseData: IResponseData = { message: '', status: 200 };
        const payloadQS = request.qs();
        const { to, last, f, page, pageSize } = payloadQS;

        const pagination = validatePagination(undefined, page, pageSize);

        let count: number = pagination['page'] * pagination['pageSize'] - pagination['pageSize'];

        const { payloadToken } = getToken(request.headers());

        let whereTo = to ? to : payloadToken.id;

        try {
            let notifications =
                // payloadQS.with ?
                await Notification.query()
                    .preload('status_info')
                    .where('to', whereTo)
                    .where('status', 1)
                    .limit(last)
                    .orderBy('id', 'desc')
                    .offset(count);
            // : [];

            if (f) {
                if (f === 'no-readed')
                    notifications = notifications.filter((notification) => !notification.readed);
            }

            // if (to) {
            //     notifications = notifications.filter(
            //         (notification) => notification.to === Number(to),
            //     );
            // }

            responseData['message'] = 'Notificaciones';
            responseData['results'] = notifications;
            responseData['total'] = (await Notification.query().where('status', 1)).length;
            responseData['total_results'] = notifications.length;
            responseData['total_no_readed'] = (
                await Notification.query().where('readed', false).where('status', 1)
            ).length;

            return response.status(responseData['status']).json(responseData);
        } catch (error) {
            responseData['error'] = error;
            responseData[
                'message'
            ] = `Error inesperado al obtener la información de las notificaciones.\nRevisar Terminal.`;
            responseData['status'] = 500;
        }
    }

    public async edit({}: HttpContextContract) {}

    public async update({
        id,
        readed,
        received,
    }: {
        id: number;
        readed?: boolean;
        received?: boolean;
    }) {
        const notification = (await Notification.query().where('id', id))[0];
        if (readed) notification.merge({ readed });
        if (received) notification.merge({ received });

        const newDataNotification = await notification.save();
        console.log(newDataNotification);
    }

    public async destroy({}: HttpContextContract) {}
}
