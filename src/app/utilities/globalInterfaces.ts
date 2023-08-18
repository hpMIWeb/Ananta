export interface IClientDetails {
    _id: string;
    client_name: string;
    assigned_to: string[];
    budget_time: string;
    actual_time: string;
    priority: string;
    remarks?: string;
    data_path?: string;
    attachments?: Attachment[];
    status: string;
}

export interface Attachment {
    fileName: string;
    filePath: string;
}

export interface IComment {
    _id: string;
    comment: string;
    comment_date: string;
    comment_by: string;
}

export interface ILogin {
    email: string;
    password: string;
}
