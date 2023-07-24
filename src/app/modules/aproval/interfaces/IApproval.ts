export interface AddLeave {
  _id: string;
  employee_name: string;
  department: string;
  leave_reason: string;
  leave_type: string;
  leave_status: string;
  leave_date: LeaveDates;
}

export class Leave implements AddLeave {
  _id: string = "";
  employee_name: string = "";
  department: string = "";
  leave_reason: string = "";
  leave_type: string = "";
  leave_status: string = "";
  leave_date: LeaveDates = {} as LeaveDates;
}

export interface LeaveDates {
  start_date: string;
  end_date: string;
}

export class LeaveDate implements LeaveDates {
  start_date: string = "";
  end_date: string = "";
}
