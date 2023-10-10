export interface ClientReport {
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

export class ClientReport implements ClientReport {
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

export interface ClientReportSummary {
    employeeName: string;
    totalBudgetTime: string;
    totalActualTime: string;
    taskCount: string;
}

export class ClientReportSummary implements ClientReportSummary {
    employeeName: string = "";
    totalBudgetTime: string = "00h 00m";
    totalActualTime: string = "00h 00m";
    taskCount: string = "0";
}
