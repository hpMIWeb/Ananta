export interface AddCompliance {
  _id: number;
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
  client: string;
  assignee: string;
  dataPath: string;
  subCompliance: SubCompliance[];
  attachments: Attachment[];
  comments: Comment[];
  complianceDetails: ComplianceDetails[];
}

export interface SubCompliance {
  subComplianceId: number;
  title: string;
  startDate: string;
  dueDate: string;
  status: string;
  budget_time: string;
  timer: ComplianceTimer;
  remark: string;
  client: string;
  assignee: string;
  priority: string;
  dataPath: string;
  attachments: Attachment[];
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

export interface ComplianceDetails {
  complianceDetailId: number;
  client: string;
  assignee: string;
  budget_time: string;
  timer: ComplianceTimer;
  priority: string;
  remark: string;
  key: number;
}
