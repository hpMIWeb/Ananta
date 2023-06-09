export interface AddTimesheet {
  _id: string;
  start_time: string;
  end_time: string;
  remark: string;
  client: string;
  work_area: string;
  pariculars: string;
  total_time: string;
  is_new: boolean;
}

export class Timesheet implements AddTimesheet {
  _id: string = "";
  start_time: string = "";
  end_time: string = "";
  remark: string = "";
  client: string = "";
  work_area: string = "";
  pariculars: string = "";
  total_time: string = "";
  is_new: boolean = false;
}
