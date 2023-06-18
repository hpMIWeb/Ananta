export interface AddTask {
    taskId: number;
    title: string;
    startDate: string;
    dueDate: string;
    mode: string;
    status: string;
    workArea: string;
    remark: string;
    budgetTime: string;
    timer: TaskTimer;
    priority: string;
    billable: string;
    client: string;
    assignee: string;
    dataPath: string;
    subTask: SubTask[];
    attachments: Attachment[];
    comments: Comment[];
}

export interface SubTask {
    subTaskId: number;
    title: string;
    startDate: string;
    dueDate: string;
    status: string;
    budgetTime: string;
    timer: TaskTimer;
    remark: string;
    client: string;
    assignee: string;
    priority: string;
    dataPath: string;
    attachments: Attachment[];
}

export interface Attachment {
    fileName: string;
    filePath: string;
}

export interface Comment {
    comment: string;
    commentDate: string;
    commentBy: string;
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

export interface TimerDetail {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}
