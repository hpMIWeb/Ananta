export interface EmployeeReport {
  _id: string;
  date: string;
  employeeName: string;
  clientName: string;
  workArea: string;
  billable: string;
}

export class EmployeeReport implements EmployeeReport {
  _id: string = "";
  date: string = "";
  employeeName: string = "";
  clientName: string = "";
  workArea: string = "";
  billable: string = "";
}
