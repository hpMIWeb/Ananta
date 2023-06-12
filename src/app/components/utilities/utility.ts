export const modeOptions = ["Repetitive", "Never", "Daily"].map((item: any) => {
    return {
        value: item.toLowerCase(),
        label: item,
        name: "mode",
    };
});

export const priorityOpts = ["High", "Medium", "Low"].map((item: any) => {
    return {
        value: item.toLowerCase(),
        label: item,
        name: "priority",
    };
});

export const chargesOpts = ["Billable", "Non Billable"].map((item: any) => {
    return {
        value: item.toLowerCase(),
        label: item,
        name: "billable",
    };
});

export const clientOpts = ["Jack John", "Sohan Varani"].map((item: any) => {
    return {
        value: item.toLowerCase(),
        label: item,
        name: "client",
    };
});

export const assigneeOpts = [
    "All Team members",
    "Megha Takker",
    "Sohan Varani",
    "Hitesh Patel",
    "Ankit Patel",
    "Rohit Soni",
].map((item: any) => {
    return {
        value: item.toLowerCase(),
        label: item,
        name: "assignee",
    };
});

export const workAreaOpts = ["GST", "TDS", "Audit", "Accounting"].map(
    (item: any) => {
        return {
            value: item.toLowerCase(),
            label: item,
            name: "workArea",
        };
    }
);

export const statusList = ["Pending", "InProgress", "Complete", "Cancel"].map(
    (item: any) => {
        return {
            value: item.toLowerCase(),
            label: item,
            name: "status",
        };
    }
);
