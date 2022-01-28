import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm';
import { IAuditTrail } from 'App/Utils/interfaces';
import Status from './Status';

export default class Notification extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column()
    public subject: string;
    @column()
    public description: string;
    @column()
    public priority: number;
    @column()
    public action: string;

    @column()
    public received: boolean;
    @column()
    public readed: boolean;

    @column()
    public to: number;
    @column()
    public from: number;

    @column()
    public status: number;
    @column()
    public audit_trail: IAuditTrail;

    @hasOne(() => Status, { foreignKey: 'id', localKey: 'status' })
    public status_info: HasOne<typeof Status>;
}
