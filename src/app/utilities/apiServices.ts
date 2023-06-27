import axios from "axios";
import { AddTask } from "../modules/task/interfaces/ITask";
import { getLocalStorage } from "./utility";
import {
  AddCompliance,
  SubCompliance,
} from "../modules/compliance/interfaces/ICompliance";

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
      url: "task/get-task",
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          console.log("all task", json.payload);
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
  createCompliance: (compliance: AddCompliance) =>
    instance({
      method: "POST",
      url: "compliance/create-compliance",
      data: {
        start_date: compliance.start_date,
        due_date: compliance.due_date,
        status: "cancelled",
        budget_time: compliance.budget_time,
        actual_time: compliance.budget_time,
        mode: compliance.mode,
        title: compliance.title,
        remark: compliance.remark,
        workArea: compliance.workArea,
        priority: compliance.priority,
        billable: compliance.billable,
        client: " ", // Discuss with API for this field, as it's no require
        assignee: " ", // Discuss with API for this field, as it's no require
        datapath: " ",
        clients: compliance.clients,
      },
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          return json.payload;
        },
      ],
    }),
  updateCompliance: (complianceId: string, updateCompliance: AddCompliance) =>
    instance({
      method: "PUT",
      url: "compliance/update-compliance/id=" + complianceId,
      data: updateCompliance,
      transformResponse: [
        function (data) {
          return data;
        },
      ],
    }),
  getAllCompliance: () =>
    instance({
      method: "GET",
      url: "compliance/get-compliance",
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          console.log("all compliance", json.payload);
          return json.payload;
        },
      ],
    }),
  createSubCompliance: (subCompliance: SubCompliance) =>
    instance({
      method: "POST",
      url: "subcompliance/create-subcompliance",
      data: {
        complianceId: subCompliance.complianceId,
        status: subCompliance.status,
        budget_time: subCompliance.budget_time,
        actual_time: subCompliance.budget_time,
        title: subCompliance.title,
        remark: subCompliance.remark,
        workArea: subCompliance.workArea,
        priority: subCompliance.priority,
        clients: subCompliance.clients,
      },
    }),
  getSubCompliance: (subComplianceId: string, complianceId: string) =>
    instance({
      method: "GET",
      url:
        "subcompliance/get-subcompliance?subComplianceId=" +
        subComplianceId +
        "&ComplianceId=" +
        complianceId,
    }),
  updateSubCompliance: (updateSubCompliance: SubCompliance) =>
    instance({
      method: "PUT",
      url: "subcompliance/update-subcompliance",
      data: updateSubCompliance,
    }),
  deleteSubCompliance: (complianceId: string, subComplianceId: string) =>
    instance({
      method: "DELETE",
      url:
        "subcompliance/delete-subcompliance?ComplianceId=" +
        complianceId +
        "&subComplianceId=" +
        subComplianceId,
    }),
};
