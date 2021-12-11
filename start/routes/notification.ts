import Route from '@ioc:Adonis/Core/Route';
import Env from '@ioc:Adonis/Core/Env';

const apiVersion = Env.get('API_VERSION');

Route.group(() => {
    Route.get('/', async (ctx) => {
        const { default: NotificationsController } = await import(
            'App/Controllers/Http/NotificationsController'
        );
        if (ctx.request.qs().id) return new NotificationsController().show(ctx);
        return new NotificationsController().showAll(ctx);
    });
    Route.get('/store', async (ctx) => {
        const { default: NotificationsController } = await import(
            'App/Controllers/Http/NotificationsController'
        );
        return new NotificationsController().store(ctx);
    });

    Route.post('/', async (ctx) => {
        const { default: NotificationsController } = await import(
            'App/Controllers/Http/NotificationsController'
        );
        return new NotificationsController().create(ctx);
    });
})
    .prefix(`${apiVersion}/notifications`)
    .middleware(['logRegistered', 'verifyToken']);
