export interface AddCompliance {
  _id: string;
  title: string;
  start_date: string;
  due_date: string;
  mode: string;
  status: string;
  workArea: string;
  remark: string;
  budget_time: string;
  actual_time: string;
  timer: ComplianceTimer;
  priority: string;
  billable: string;
  assignee: string;
  dataPath: string;
  clients: ClientDetails[];
  subCompliance: SubCompliance[];
  comments: [];
}

export interface SubCompliance {
  _id?: string;
  title: string;
  status: string;
  budget_time: string;
  remark: string;
  priority: string;
  workArea: string;
  complianceId?: string;
  clients: ClientDetails[];
}

export interface Attachment {
  fileName: string;
  filePath: string;
}

export interface Comment {
  comment: string;
  commentDate: string;
  commentBy: string;
}
export interface SaveComplianceComment {
  complianceId: string;
  comment: string;
  commentId: string;
}

export const TimerOpts = {
  play: 1,
  pause: -1,
  stop: 0,
};

export interface ComplianceTimer {
  state: number;
  time: number;
}

export interface TimerDetail {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export interface ClientDetails {
  complianceDetailId: string;
  client_name: string;
  assignee_to: string;
  budget_time: string;
  actual_time: string;
  priority: string;
  remark: string;
  parentId: string;
}
