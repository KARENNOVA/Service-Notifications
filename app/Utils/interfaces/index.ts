export interface IResponseData {
    message: string;
    results?: any;
    status: number;
    error?: any;
    page?: number;
    count?: number;
    next_page?: number;
    previous_page?: number;
    total?: number;
    total_results?: number;
    total_no_readed?: number;
}

export interface IDataToken {
    id: number;
    iat: number;
}

export * from './auditTrail';
