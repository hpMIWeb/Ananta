import axios from "axios";
import {
    AddTask,
    SaveComment,
    SubTask,
    UpdateSubTask,
    AddMultipleTask,
} from "../modules/task/interfaces/ITask";
import { getLocalStorage } from "./utility";
import {
    InsertCompliance,
    Compliance,
    SubCompliance,
    SaveComplianceComment,
    UpdateSubCompliance,
} from "../modules/compliance/interfaces/ICompliance";

import { AddTimesheet } from "../modules/timesheet/interfaces/ITimesheet";
import { AddLeave } from "../modules/aproval/interfaces/IApproval";
import { Settings } from "../modules/Setting/interfaces/Isetting";
import { AddDepartment } from "../modules/master/Department/interfaces/IDeparment";
import { AddDesignation } from "../modules/master/Designation/interfaces/IDesignation";
import { AddRole } from "../modules/master/Role/interfaces/IRole";
import { AddTeam } from "../modules/master/Team/interfaces/ITeam";
import { AddCheckList } from "../modules/master/Checklist/interface/IChecklist";

import { ILogin } from "./globalInterfaces";

const token = getLocalStorage("authtoken");
//const apiURL = "http://localhost:8005/api/v1/";
//const apiURL = "https://api.prod.nccountant.com/api/v1/";
const apiURL = "https://api.staging.nccountant.com/api/v1/";

const instance = axios.create({
    baseURL: apiURL,
    headers: {
        "content-type": "application/json;charset=utf-8",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH",
    },
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    login: (loginDetail: ILogin) =>
        instance({
            method: "POST",
            url: "admin/login",
            data: loginDetail,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    getAllTask: (queryString: string) =>
        instance({
            method: "GET",
            url: "task/get-task/" + queryString,
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
            data: task,
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
    createMultipleTask: (multipleTask: AddMultipleTask) =>
        instance({
            method: "POST",
            url: "task/create-multiple-task",
            data: multipleTask,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
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
    updateSubTask: (subTaskId: string, subTask: UpdateSubTask) =>
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
    createCompliance: (compliance: InsertCompliance) =>
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
                subcompliance: compliance.subcompliance,
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
    updateCompliance: (complianceId: string, updateCompliance: Compliance) =>
        instance({
            method: "PUT",
            url: "compliance/update-compliance/id=" + complianceId,
            data: updateCompliance,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    getAllCompliance: (queryString: string) =>
        instance({
            method: "GET",
            url: "compliance/get-compliance/" + queryString,
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
                particulars: timesheet.particulars,
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
    updateSubCompliance: (subCompliance: UpdateSubCompliance) =>
        instance({
            method: "PUT",
            url: "subcompliance/update-subcompliance",
            data: subCompliance,
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
                    const jsondata = JSON.parse(data);
                    return jsondata.payload;
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
    deleteComplianceComment: (
        complianceId: string,
        commentId: string,
        subcomplianceId: string
    ) =>
        instance({
            method: "DELETE",
            url:
                "compliancecomment/delete-compliance-comment?complianceId=" +
                complianceId +
                "&commentId=" +
                commentId +
                "&subcomplianceId=" +
                subcomplianceId,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    updateSubComplianceComment: (comment: SaveComplianceComment) =>
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
    deleteSubComplianceComment: (
        commentId: string,
        subComplianceId: string,
        complianceId: string
    ) =>
        instance({
            method: "DELETE",
            url:
                "compliancecomment/delete-compliance-comment?complianceId=" +
                complianceId +
                "&commentId=" +
                commentId +
                "&subcomplianceId=" +
                subComplianceId,
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
    getEmployeeTimesheetReport: (queryString: string) =>
        instance({
            method: "GET",
            url: "timesheet/employee-timesheet-report" + queryString,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    getClientTimesheetReport: (queryString: string) =>
        instance({
            method: "GET",
            url: "timesheet/client-timesheet-report" + queryString,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    applyLeave: (leave: AddLeave) =>
        instance({
            method: "POST",
            url: "leaveapprovals/create-leave-approvals",
            data: leave,
            transformResponse: [
                function (data) {
                    return data;
                },
            ],
        }),
    getLeave: () =>
        instance({
            method: "GET",
            url: "leaveapprovals/get-leave-approvals",
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    updateLeaveStatus: (id: string, status: string) =>
        instance({
            method: "PATCH",
            url: "leaveapprovals/update-leave-approvals/id=" + id,
            data: { leave_status: status },
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    getSettings: () =>
        instance({
            method: "GET",
            url: "settings/get-settings",
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    createSetting: (setting: Settings) =>
        instance({
            method: "POST",
            url: "settings/create-settings",
            data: setting,
            transformResponse: [
                function (data) {
                    return data;
                },
            ],
        }),
    updateSetting: (setting: Settings) =>
        instance({
            method: "PUT",
            url: "settings/update-settings/id=" + setting._id,
            data: setting,
            transformResponse: [
                function (data) {
                    return data;
                },
            ],
        }),
    getDepartment: () =>
        instance({
            method: "GET",
            url: "department/get-department/",
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    createDepartment: (department: AddDepartment) =>
        instance({
            method: "POST",
            url: "department/create-department/",
            data: department,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    deleteDepartment: (departmentId: string) =>
        instance({
            method: "DELETE",
            url: "department/delete-department/id=" + departmentId,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    updateDepartment: (department: AddDepartment, departmentId: string) =>
        instance({
            method: "PUT",
            url: "department/update-department/id=" + departmentId,
            data: department,
            transformResponse: [
                function (data) {
                    return data;
                },
            ],
        }),

    getDesignation: () =>
        instance({
            method: "GET",
            url: "designation/get-designation/",
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    createDesignation: (designation: AddDesignation) =>
        instance({
            method: "POST",
            url: "designation/create-designation/",
            data: designation,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    deleteDesignation: (designationId: string) =>
        instance({
            method: "DELETE",
            url: "designation/delete-designation/id=" + designationId,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    updateDesignation: (designation: AddDesignation, designationId: string) =>
        instance({
            method: "PUT",
            url: "designation/update-designation/id=" + designationId,
            data: designation,
            transformResponse: [
                function (data) {
                    return data;
                },
            ],
        }),

    getRoleType: () =>
        instance({
            method: "GET",
            url: "role-type/get-role-type/",
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    getRole: () =>
        instance({
            method: "GET",
            url: "role/get-all-role/",
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    createRole: (role: AddRole) =>
        instance({
            method: "POST",
            url: "role/create",
            data: role,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    deleteRole: (roleId: string) =>
        instance({
            method: "DELETE",
            url: "role/id=" + roleId,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    updateRole: (role: AddRole, roleId: string) =>
        instance({
            method: "PUT",
            url: "role/id=" + roleId,
            data: role,
            transformResponse: [
                function (data) {
                    return data;
                },
            ],
        }),

    getTeam: () =>
        instance({
            method: "GET",
            url: "team/get-team",
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),

    getUserList: () =>
        instance({
            method: "GET",
            url: "admin/get-all-users",
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    createTeam: (team: AddTeam) =>
        instance({
            method: "POST",
            url: "team/create-team",
            data: team,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    deleteTeam: (teamId: string) =>
        instance({
            method: "DELETE",
            url: "eam/delete-team/id=" + teamId,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    updateTeam: (team: AddTeam, teamId: string) =>
        instance({
            method: "PUT",
            url: "team/update-team/id=" + teamId,
            data: team,
            transformResponse: [
                function (data) {
                    return data;
                },
            ],
        }),
    getChecklist: () =>
        instance({
            method: "GET",
            url: "checklist/get-checklist",
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    deleteChecklist: (checklistId: string) =>
        instance({
            method: "DELETE",
            url: "checklist/delete-checklist/" + checklistId,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    createChecklist: (checklist: AddCheckList) =>
        instance({
            method: "POST",
            url: "checklist/create-checklist",
            data: checklist,
            transformResponse: [
                function (data) {
                    const json = JSON.parse(data);
                    return json.payload;
                },
            ],
        }),
    updateChecklist: (checklist: AddCheckList, checklistId: string) =>
        instance({
            method: "PUT",
            url: "checklist/update-checklist/" + checklistId,
            data: checklist,
            transformResponse: [
                function (data) {
                    return data;
                },
            ],
        }),
};
