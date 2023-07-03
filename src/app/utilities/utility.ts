export const dateFormat = "YYYY-MM-DD";

export const modeOptions = ["Repetitive", "Never", "Daily"].map(
  (item: string) => {
    return {
      value: item.toLowerCase(),
      label: item,
      name: "mode",
    };
  }
);

export const priorityOpts = ["High", "Medium", "Low"].map((item: string) => {
  return {
    value: item.toLowerCase(),
    label: item,
    name: "priority",
  };
});

export const chargesOpts = ["Billable", "Non Billable"].map((item: string) => {
  return {
    value: item.toLowerCase(),
    label: item,
    name: "billable",
  };
});

export const clientOpts = ["Jack John", "Sohan Varani"].map((item: string) => {
  return {
    value: item.toLowerCase(),
    label: item,
    name: "client",
  };
});

export const complianceReportOpts = ["Client Wise", "Compliance Wise"].map(
  (item: string) => {
    return {
      value: item.toLowerCase(),
      label: item,
      name: "complianceReportType",
    };
  }
);

export const assigneeOpts = [
  "All Team members",
  "Megha Takker",
  "Sohan Varani",
  "Hitesh Patel",
  "Ankit Patel",
  "Rohit Soni",
].map((item: string) => {
  return {
    value: item.toLowerCase(),
    label: item,
    name: "assigned_to",
  };
});

export const workAreaOpts = ["GST", "TDS", "Audit", "Accounting"].map(
  (item: string) => {
    return {
      value: item.toLowerCase(),
      label: item,
      name: "workArea",
    };
  }
);

export const statusList = [
  "pending",
  "in_progress",
  "complete",
  "cancelled",
].map((item: string) => {
  return {
    value: item.toLowerCase(),
    label: item,
    name: "status",
  };
});

export const leaveTypeOpts = [
  "Casual Leave",
  "Privilege Leave",
  "Sick Leave",
  "Maternity Leave",
  "Paternity leaves",
  "Sabbatical Leave",
  "Bereavement leave",
  "Marriage leave",
].map((item: string) => {
  return {
    value: item.toLowerCase(),
    label: item,
    name: "workArea",
  };
});

export const capitalize = (value: string) => {
  if (value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value;
};

// set, get and remove items from `localStorage`
export const setLocalstorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const removeLocalstorage = (key: string) => {
  localStorage.removeItem(key);
};

export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};
