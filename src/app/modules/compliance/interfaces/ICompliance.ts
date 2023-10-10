// View / Edit compliance
export interface Compliance {
    _id: string;
    title: string;
    start_date: string;
    due_date: string;
    mode: string;
    status: string;
    workArea: string;
    remark: string;
    budget_time: string;
    actual_time: string;
    timer: ComplianceTimer;
    priority: string;
    billable: string;
    assignee: string;
    dataPath: string;
    clients: IClientDetails[];
    subcompliance: SubCompliance[];
    comments: [];
}

export interface SubCompliance {
    _id: string;
    title: string;
    status: string;
    mode: string;
    budget_time: string;
    actual_time: string;
    remark: string;
    priority: string;
    workArea: string;
    complianceId?: string;
    clients: IClientDetails[];
    comments: [];
}

// Create compliance
export interface InsertCompliance {
    title: string;
    start_date: string;
    due_date: string;
    mode: string;
    status: string;
    workArea: string;
    remark: string;
    budget_time: string;
    actual_time: string;
    timer: ComplianceTimer;
    priority: string;
    billable: string;
    assignee: string;
    dataPath: string;
    clients: IInsertClientDetails[];
    subcompliance: InsertSubCompliance[];
    //comments: [];
}

export interface InsertSubCompliance {
    title: string;
    status: string;
    mode: string;
    budget_time: string;
    actual_time: string;
    remark: string;
    priority: string;
    workArea: string;
    complianceId?: string;
    clients: IInsertClientDetails[];
    //comments: [];
}

export interface UpdateSubCompliance {
    ComplianceId: string;
    subComplianceId: string;
    title: string;
    status: string;
    mode: string;
    budget_time: string;
    actual_time: string;
    remark: string;
    priority: string;
    workArea: string;
    clients: IClientDetails[];
    // comments: [];
}

export interface Attachment {
    fileName: string;
    filePath: string;
}

export interface Comment {
    _id: string;
    comment: string;
    commentDate: string;
    commentBy: string;
}
export interface SaveComplianceComment {
    complianceId: string;
    comment: string;
    commentId: string;
}

export interface SaveSubComplianceComment {
    complianceId: string;
    subcomplianceId: string;
    comment: string;
    commentId: string;
}

export const TimerOpts = {
    play: 1,
    pause: -1,
    stop: 0,
};

export interface ComplianceTimer {
    state: number;
    time: number;
}

export interface TimerDetail {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}

export interface IClientDetails {
    _id: string;
    client_name: string;
    assigned_to: string;
    budget_time: string;
    actual_time: string;
    priority: string;
    remark: string;
    parentId: string;
    status: string;
}

export interface IInsertClientDetails {
    client_name: string;
    assigned_to: string;
    budget_time: string;
    actual_time: string;
    priority: string;
    remark: string;
    parentId: string;
}

export class ClientDetail implements IClientDetails {
    _id: string = "";
    client_name: string = "";
    assigned_to: string = "";
    budget_time: string = "";
    actual_time: string = "";
    priority: string = "";
    remark: string = "";
    parentId: string = "";
    status: string = "";
}
