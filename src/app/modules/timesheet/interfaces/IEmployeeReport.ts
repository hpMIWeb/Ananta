export interface EmployeeReport {
    _id: string;
    date: string;
    employeeName: string;
    client: string;
    remark: string;
    work_area: string;
    budget_time: string;
    actual_time: string;
    billable: string;
}

export class EmployeeReport implements EmployeeReport {
    _id: string = "";
    date: string = "";
    employeeName: string = "";
    client: string = "";
    work_area: string = "";
    remark: string = "";
    billable: string = "";
    budget_time: string = "";
    actual_time: string = "";
}

export interface EmployeeReportSummary {
    employeeName: string;
    totalBudgetTime: string;
    totalActualTime: string;
    taskCount: string;
}

export class EmployeeReportSummary implements EmployeeReportSummary {
    employeeName: string = "";
    totalBudgetTime: string = "00h 00m";
    totalActualTime: string = "00h 00m";
    taskCount: string = "0";
}
