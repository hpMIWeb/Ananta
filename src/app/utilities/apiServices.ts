import axios from "axios";
import {
  AddTask,
  SaveComment,
  SubTask,
  UpdateSubTask,
} from "../modules/task/interfaces/ITask";
import { getLocalStorage } from "./utility";
import {
  AddCompliance,
  SubCompliance,
  SaveComplianceComment,
} from "../modules/compliance/interfaces/ICompliance";

import { AddTimesheet } from "../modules/timesheet/interfaces/ITimesheet";

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
        actual_time: " ",
        mode: task.mode,
        title: task.title,
        remarks: task.remarks,
        workArea: task.workArea,
        priority: task.priority,
        billable: task.billable,
        client: task.client,
        assigned_to: task.assigned_to,
        datapath: " ",
        subtask: task.subTask,
        attachments: [],
        comments: [],
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
      url: "taskcomment/create-task-comment",
      data: comment,
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          return json.payload;
        },
      ],
    }),
  updateTaskComment: (comment: SaveComment) =>
    instance({
      method: "PUT",
      url: "taskcomment/update-task-comment",
      data: comment,
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          return json.payload;
        },
      ],
    }),
  deleteTaskComment: (taskId: string, commentId: string) =>
    instance({
      method: "DELETE",
      url:
        "taskcomment/delete-task-comment?taskId=" +
        taskId +
        "&commentId=" +
        commentId,
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          return json.payload;
        },
      ],
    }),
  updateSubTask: (subTask: UpdateSubTask, subTaskId: string) =>
    instance({
      method: "PUT",
      url: "subtask/update-subtask/" + subTaskId,
      data: subTask,
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          return json.payload;
        },
      ],
    }),
  createCompliance: (compliance: AddCompliance) =>
    instance({
      method: "POST",
      url: "compliance/create-compliance",
      data: {
        start_date: compliance.start_date,
        due_date: compliance.due_date,
        status: compliance.status,
        budget_time: compliance.budget_time,
        actual_time: " ",
        mode: compliance.mode,
        title: compliance.title,
        remark: compliance.remark,
        workArea: compliance.workArea,
        priority: compliance.priority,
        billable: compliance.billable,
        assigned_to: " ",
        datapath: " ",
        clients: compliance.clients,
        subcompliance: compliance.subCompliance,
        attachments: [],
        comments: [],
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
  deleteSubCompliance: (complianceId: string, subComplianceId: string) =>
    instance({
      method: "DELETE",
      url:
        "subcompliance/delete-subcompliance?ComplianceId=" +
        complianceId +
        "&subComplianceId=" +
        subComplianceId,
    }),
  getTimesheet: () =>
    instance({
      method: "GET",
      url: "timesheet/get-timesheet",
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          return json.payload;
        },
      ],
    }),
  createTimesheet: (timesheet: AddTimesheet) =>
    instance({
      method: "POST",
      url: "timesheet/create-timesheet",
      data: {
        start_time: timesheet.start_time,
        end_time: timesheet.end_time,
        remark: timesheet.remark,
        client: timesheet.client,
        work_area: timesheet.work_area,
        pariculars: timesheet.pariculars,
        total_time: timesheet.total_time,
      },
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          return json.payload;
        },
      ],
    }),
  deleteTimesheet: (timeSheetId: string) =>
    instance({
      method: "DELETE",
      url: "timesheet/delete-timesheet/id=" + timeSheetId,
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          return json.payload;
        },
      ],
    }),
  updateTimesheet: (timeSheetId: string, updateTimeSheet: AddTimesheet) =>
    instance({
      method: "PUT",
      url: "timesheet/update-timesheet/id=" + timeSheetId,
      data: updateTimeSheet,
      transformResponse: [
        function (data) {
          return data;
        },
      ],
    }),
  updateSubCompliance: (updateSubCompliance: SubCompliance) =>
    instance({
      method: "PUT",
      url: "subcompliance/update-subcompliance",
      data: {
        subComplianceId: updateSubCompliance._id,
        ComplianceId: updateSubCompliance.complianceId,
        mode: updateSubCompliance.mode,
      },
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          return json.payload;
        },
      ],
    }),
  addComplianceComment: (comment: SaveComplianceComment) =>
    instance({
      method: "POST",
      url: "compliancecomment/create-compliance-comment",
      data: comment,
      transformResponse: [
        function (data) {
          return data;
        },
      ],
    }),
  updateComplianceComment: (comment: SaveComplianceComment) =>
    instance({
      method: "PUT",
      url: "compliancecomment/update-compliance-comment",
      data: comment,
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          return json.payload;
        },
      ],
    }),
  deleteComplianceComment: (complianceId: string, commentId: string) =>
    instance({
      method: "DELETE",
      url:
        "compliancecomment/delete-compliance-comment?taskId=" +
        complianceId +
        "&commentId=" +
        commentId,
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          return json.payload;
        },
      ],
    }),
  createMultipleTimesheet: (timesheet: any[]) =>
    instance({
      method: "POST",
      url: "timesheet/create-multiple-timesheet",
      data: timesheet,
      transformResponse: [
        function (data) {
          const json = JSON.parse(data);
          return json.payload;
        },
      ],
    }),
  downloadTimesheetPDF: () =>
    instance({
      method: "POST",
      url: "timesheet/create-multiple-timesheet",
      data: [],
    }),
};
