export interface AddTask {
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
    budget_time: string;
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
    _id: string;
    comment: string;
    comment_date: string;
    comment_by: string;
}

export interface SaveComment {
    taskId: string;
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

export interface TimerDetail {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}
