import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CreateNotificationValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        title: schema.string({ trim: true }),
        description: schema.string({ trim: true }),
        priority: schema.number(),
        action: schema.string({ trim: true }),
        to: schema.number.optional(),
        toRole: schema.string.optional(),
    });

    /**
     * Custom messages for validation failures. You can make use of dot notation `(.)`
     * for targeting nested fields and array expressions `(*)` for targeting all
     * children of an array. For example:
     *
     * {
     *   'profile.username.required': 'Username is required',
     *   'scores.*.number': 'Define scores as valid numbers'
     * }
     *
     */
    public messages = {};
}
