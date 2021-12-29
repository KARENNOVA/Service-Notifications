import { registerSID } from 'App/Services/auth';
import Ws from 'App/Services/Ws';
Ws.boot();

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', (socket) => {
    console.log('New connection with ID: ', socket.id);
    socket.emit('init', { id: socket.id });

    socket.on('register:user', async (data) => {
        await registerSID(socket.id, data['headerAuthorization'], Number(data['id']));
    });

    socket.on('read:notification', async (data) => {
        const { default: NotificationsController } = await import(
            'App/Controllers/Http/NotificationsController'
        );
        return new NotificationsController().update({ id: data['id'], readed: true });
    });

    socket.on('receive:notification', async (data) => {
        console.log(data);
        const { default: NotificationsController } = await import(
            'App/Controllers/Http/NotificationsController'
        );
        return new NotificationsController().update({ id: data['id'], received: true });
    });
});
