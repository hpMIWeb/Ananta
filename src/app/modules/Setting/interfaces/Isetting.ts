export interface AddSetting {
  _id: string;
  task: Task;
  compliance: Compliance;
  timesheet: Compliance;
}

export class Settings implements AddSetting {
  _id: string = "";
  task: Task = {} as Task;
  compliance: Compliance = {} as Compliance;
  timesheet: Timesheet = {} as Timesheet;
}

export interface Task {
  select_template: string;
  select_feilds: string[];
  client_assignment: boolean;
}

export interface Compliance {
  select_template: string;
  select_feilds: string[];
  client_assignment: boolean;
}
export interface Timesheet {
  select_template: string;
  select_feilds: string[];
  client_assignment: boolean;
}
