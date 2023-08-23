import dayjs from "dayjs";
import { ClientDetail } from "../../compliance/interfaces/ICompliance";
import {
    Attachment,
    IComment as Comment,
} from "../../../utilities/globalInterfaces";
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
    client: AddClientDetails[];
    assigned_to: string[];
    datapath: string;
    subtask: AddSubTask[];
    attachments: Attachment[];
    comments: Comment[];
    taskType: string;
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
    client: [] = [];
    assigned_to: string[] = [];
    datapath: string = "";
    subtask: SubTask[] = [];
    attachments: Attachment[] = [];
    comments: Comment[] = [];
    taskType: string = "";
}

export interface AddSubTask {
    title: string;
    status: string;
    budget_time: string;
    actual_time: string;
    remarks: string;
    client: string[];
    assigned_to: string[];
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
    client: string[];
    assigned_to: string[];
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
    client: string[];
    assigned_to: string[];
    priority: string;
    datapath: string;
    workArea: string;
    attachments: Attachment[];
    comments: Comment[];
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

export interface AddMultipleTask {
    _id: string;
    start_date: string;
    due_date: string;
    status: string;
    mode: string;
    title: string;
    workArea: string;
    billable: string;
    clients: AddClientDetails[];
    subtask: AddMultipleSubtask[];
    subtaskToggle: boolean;
    remarks: string;
    budget_time: string;
    actual_time: string;
    priority: string;
    taskType: string;
}

export class AddMultipleTaskClass implements AddMultipleTask {
    _id: string = "";
    start_date: string = dayjs().format("YYYY-MM-DD");
    due_date: string = "";
    status: string = "pending";
    mode: string = "";
    title: string = "";
    workArea: string = "";
    billable: string = "";
    clients: AddClientDetails[] = [];
    subtask: AddMultipleSubtask[] = [];
    subtaskToggle: boolean = false;
    remarks: string = "";
    budget_time: string = "";
    actual_time: string = "";
    priority: string = "";
    taskType: string = "";
}
export interface AddClientDetails {
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
    parentId: string;
}
export interface AddMultipleSubtask {
    title: string;
    taskId: string;
    status: string;
    budget_time: string;
    actual_time: string;
    remarks: string;
    clients: ClientDetail[];
    priority: string;
}

export interface MultipleSubtask {
    _id: string;
    title: string;
    taskId: string;
    status: string;
    budget_time: string;
    actual_time: string;
    remarks: string;
    clients: ClientDetail[];
    priority: string;
}
