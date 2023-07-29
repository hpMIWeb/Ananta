import dayjs from "dayjs";
export interface AddTask {
    _id: string;
    title: string;
    start_date: string;
    due_date: string;
    mode: string;
    status: string;
    workArea: string;
    remarks: string;
    budget_time: string;
    actual_time: string;
    timer: TaskTimer;
    priority: string;
    billable: string;
    client: string;
    assigned_to: string;
    datapath: string;
    subTask: AddSubTask[];
    attachments: Attachment[];
    comments: Comment[];
}

export class Task implements AddTask {
    _id: string = "";
    title: string = "";
    start_date: string = dayjs().format("YYYY-MM-DD");
    due_date: string = "";
    mode: string = "";
    status: string = "pending";
    workArea: string = "";
    remarks: string = "";
    budget_time: string = "";
    actual_time: string = "";
    timer: TaskTimer = {} as TaskTimer;
    priority: string = "";
    billable: string = "";
    client: string = "";
    assigned_to: string = "";
    datapath: string = "";
    subTask: SubTask[] = [];
    attachments: Attachment[] = [];
    comments: Comment[] = [];
}

export interface AddSubTask {
    title: string;
    status: string;
    budget_time: string;
    actual_time: string;
    remarks: string;
    client: string;
    assigned_to: string;
    priority: string;
    datapath: string;
    workArea: string;
    attachments: Attachment[];
    comments: Comment[];
}

export interface SubTask {
    _id: string;
    taskId: string;
    title: string;
    status: string;
    budget_time: string;
    actual_time: string;
    remarks: string;
    client: string;
    assigned_to: string;
    priority: string;
    datapath: string;
    workArea: string;
    attachments: Attachment[];
    comments: Comment[];
}

export interface UpdateSubTask {
    _id: string;
    taskId: string;
    title: string;
    status: string;
    budget_time: string;
    actual_time: string;
    remarks: string;
    client: string;
    assigned_to: string;
    priority: string;
    datapath: string;
    workArea: string;
    attachments: Attachment[];
    comments: Comment[];
}

export interface Attachment {
    fileName: string;
    filePath: string;
}

export interface Comment {
    _id: string;
    comment: string;
    comment_date: string;
    comment_by: string;
}

export interface SaveComment {
    taskId: string;
    subtaskId?: string;
    comment: string;
    commentId: string;
}

export const TimerOpts = {
    play: 1,
    pause: -1,
    stop: 0,
};

export interface TaskTimer {
    state: number;
    time: number;
}
