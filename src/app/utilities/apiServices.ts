import axios from "axios";
import { AddTask, SaveComment } from "../modules/task/interfaces/ITask";
import { getLocalStorage } from "./utility";

const token = getLocalStorage("authtoken");
const apiURL = "http://localhost:8005/api/v1/";

const instance = axios.create({
    baseURL: apiURL,
    headers: {
        "content-type": "application/json;charset=utf-8",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
    },
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getAllTask: () =>
        instance({
            method: "GET",
            url: "task/get-all-tasks",
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    createTask: (task: AddTask) =>
        instance({
            method: "POST",
            url: "task/create-task",
            data: {
                start_date: task.start_date,
                due_date: task.due_date,
                status: task.status,
                budget_time: task.budget_time,
                actual_time: task.budget_time,
                mode: task.mode,
                title: task.title,
                remark: task.remark,
                priority: task.priority,
                billable: task.billable,
                client: task.client,
                assignee: task.assignee,
                datapath: " ",
                subtask: [
                    {
                        title: "Work on NV Dashboard Task 1",
                        start_time: "05:00",
                        end_time: "05:00",
                        remark: "",
                        client: "NV Dashboard",
                        assignee: "Hitesh",
                        mode: "daily",
                        priority: "High",
                        datapath: " ",
                        attachments: [],
                    },
                    {
                        title: "Work on NV Dashboard Task 2",
                        start_time: "02:00",
                        end_time: "02:00",
                        remark: "",
                        client: "NV Dashboard",
                        assignee: "Hitesh",
                        mode: "daily",
                        priority: "High",
                        datapath: " ",
                        attachments: [],
                    },
                ],
                attachments: [],
                comments: [
                    {
                        comment: "Test",
                        comment_date: "2023-06-18",
                        comment_by: "6488250c60b24a314488c359",
                    },
                ],
            },
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    updateTask: (taskId: string, updateTask: AddTask) =>
        instance({
            method: "PUT",
            url: "task/update-task/id=" + taskId,
            data: updateTask,
            transformResponse: [
                function (data) {
                    return data;
                },
            ],
        }),
    createMultileTask: (tasks: AddTask[]) =>
        instance({
            method: "POST",
            url: "task/create-multiple-task",
            data: tasks,
        }),
    addTaskComment: (comment: SaveComment) =>
        instance({
            method: "POST",
            url: "comment/create-comment",
            data: comment,
            transformResponse: [
                function (data) {
                    return data;
                },
            ],
        }),
    updateTaskComment: (comment: SaveComment) =>
        instance({
            method: "PUT",
            url: "comment/update-comment",
            data: comment,
            transformResponse: [
                function (data) {
                    return data;
                },
            ],
        }),
    deleteTaskComment: (taskId: string, commentId: string) =>
        instance({
            method: "DELETE",
            url:
                "comment/delete-comment?taskId=" +
                taskId +
                "&commentId=" +
                commentId,
            transformResponse: [
                function (data) {
                    return data;
                },
            ],
        }),
};
