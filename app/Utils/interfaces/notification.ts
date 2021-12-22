import { IAuditTrail } from 'App/Utils/interfaces';
export interface INotification {
    id?: number;

    title: string;
    description: string;
    priority: number;
    action: string;

    received: boolean;
    readed: boolean;

    to: number | undefined;
    from: number;

    status?: number;
    audit_trail?: IAuditTrail;

    status_info?: { id?: number; status: string };
}
