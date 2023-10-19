import dayjs from "dayjs";

export const dateFormat = "YYYY-MM-DD";

export const Status = {
    completed: "completed",
    in_progress: "inprogress",
    pending: "pending",
    cancelled: "cancelled",
};

export const OperationType = {
    add: "add",
    remove: "remove",
    change: "change",
    update: "update",
};

export const modeOptions = [
    "Repetitive",
    "Never",
    "Daily",
    "Weekly",
    "Bi Weekly",
    "Fortnightly",
    "Monthly",
    "Quarterly",
    "Yearly",
    "Half Yearly",
].map((item: string) => {
    return {
        value: item.toLowerCase(),
        label: item,
        name: "mode",
    };
});

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

export const employeeOpts = [
    "EMP 1",
    "EMP 2",
    "EMP 3",
    "EMP 4",
    "EMP 5",
    "patil",
].map((item: string) => {
    return {
        value: item.toLowerCase(),
        label: item,
        name: "client",
    };
});

export const complianceReportOpts = ["Client Wise", "Compliance Wise"].map(
    (item: string) => {
        return {
            value: item.toLowerCase().replace(" ", "_"),
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
    "Pending",
    "Inprogress",
    "Completed",
    "Cancelled",
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
    "Paternity Leave",
    "Sabbatical Leave",
    "Bereavement Leave",
    "Marriage Leave",
].map((item: string) => {
    return {
        key: item.toLowerCase().replace(" ", "_"),
        value: item.toLowerCase().replace(" ", "_"),
        label: item,
        name: "leave_type",
    };
});

export const departmentOpts = ["HR", "Account", "IT", "Design"].map(
    (item: string) => {
        return {
            value: item.toLowerCase(),
            label: item,
            name: "workArea",
        };
    }
);

export const taskSettingFields = ["Clients", "Sub Task", "Budget Time"].map(
    (item: string) => {
        return {
            value: item.replace(" ", "_").toLowerCase(),
            label: item,
        };
    }
);

export const taskSettingTemplates = ["Task Template", "Project Template"].map(
    (item: string) => {
        return {
            value: item.replace(" ", "_").toLowerCase(),
            label: item,
        };
    }
);

export const taskSettingFieldsArr = ["Clients", "SubTask", "BudgetTime"];

export const complianceSettingFields = [
    "Remarks",
    "Data Path",
    "Budget Time",
    "Billable",
    "Sub Compliance",
].map((item: string) => {
    return {
        value: item.replace(" ", "_").toLowerCase(),
        label: item,
    };
});

export const capitalize = (value: string) => {
    if (value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
};

export const upperText = (value: string) => {
    if (value) {
        return value.toUpperCase();
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

export const formatTime = (dateValue: string) => {
    if (dateValue === undefined || dateValue === "") return "";

    const date = dayjs(dateValue, "HH:mm");
    const hours = date.format("HH");
    const minutes = date.format("mm");

    let retVal = "";

    if (hours && minutes) {
        retVal = `${hours}h `;

        if (minutes && parseInt(minutes) > 0) {
            retVal += `${minutes}m`;
        }
    }

    return retVal;
};

export const statusColors = (status: string) => {
    let color = "#fb275d";
    let retVal = status;
    switch (status) {
        case "completed":
        case "complete": {
            color = "#00ca72";
            break;
        }
        case "in_progress":
        case "inprogress": {
            color = "#ffcc00";
            break;
        }
        case "cancelled": {
            color = "#808080";
            break;
        }
        case "1":
        case "pending": {
            retVal = "pending";
            break;
        }
        case "2": {
            color = "#00ca72";
            retVal = "completed";
        }
    }

    return color;
};

export const getTotalTime = (actualTimes: string[]) => {
    let sum_minutes = 0;

    if (actualTimes.length > 0) {
        actualTimes.forEach((actualTime: string) => {
            if (actualTime && actualTime !== "" && actualTime !== undefined) {
                const splitTime = actualTime.split(":");
                const hours_item = parseInt(splitTime[0]);
                const minute_item = parseInt(splitTime[1]);

                sum_minutes += minute_item;

                // Convert hours into minutes and add into total minutes
                if (hours_item > 0) {
                    const min_from_hours = hours_item * 60;
                    sum_minutes += min_from_hours;
                }
            }
        });
    }

    return sum_minutes && sum_minutes > 0
        ? timeConvert(sum_minutes)
        : "00:00:00";
};

const timeConvert = (mins: number) => {
    const num = mins;
    const hours = num / 60;
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    const rseconds = rminutes * 60;

    return `${padStartNumber(rhours, 2)}:${padStartNumber(rminutes, 2)}`;
};

const padStartNumber = (num: number, digit: number) => {
    return num.toString().padStart(digit, "0");
};

// Function to calculate the time difference in hours and minutes
export const calculateTimeDifference = (startTime: string, endTime: string) => {
    const format = "HH:mm"; // Assuming the time strings are in HH:mm format.
    const start = dayjs(startTime, format);
    const end = dayjs(endTime, format);

    if (!start.isValid() || !end.isValid()) {
        return "Invalid Time";
    }

    const diffMinutes = end.diff(start, "minute");
    const prefix = diffMinutes >= 0 ? "+" : "-"; // Use + sign for positive difference, - sign for negative difference.
    const diffHours = Math.abs(Math.floor(diffMinutes / 60));
    const diffMins = Math.abs(diffMinutes % 60);

    return `${prefix}${diffHours}h ${diffMins}m`;
};

export const subscriptionCategoryOption = [
    "Remarks",
    "Data Path",
    "Budget Time",
    "Billable",
    "Sub Compliance",
].map((item: string) => {
    return {
        value: item.replace(" ", "_").toLowerCase(),
        label: item,
    };
});

export const featureList: any = [
    { label: "Task Manager", value: "TaskManager" },
    { label: "File Manager", value: "FileManager" },
    { label: "E-Commerce", value: "E_Commerce" },
    {
        label: "Template customization for import",
        value: "Tamplate_Customization_for_import",
    },
    {
        label: "Live Reports Client Mobile App",
        value: "Live_reports_on_client_mobile_app",
    },
    { label: "Client Login Mobile App", value: "Client_login_mobile_app" },
];

export const getCurrentItemNumber = (
    indexNumber: number,
    currentPage: number,
    pageSize: number
) => {
    // Calculate item number into pagination
    // (currentPage - 1) * pageSize + itemNumber
    
    return (currentPage - 1) * pageSize + indexNumber;
};

const randomString = (length: number, chars: any) => {
    var mask = "";
    if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
    if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (chars.indexOf("#") > -1) mask += "0123456789";
    if (chars.indexOf("!") > -1) mask += "~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\";
    var result = "";
    for (var i = length; i > 0; --i)
        result += mask[Math.round(Math.random() * (mask.length - 1))];
    return result;
};

export const getAutoGenerateClientId = () => {
    const str = randomString(16, "aA").slice(0, 2);
    const digit = Math.floor(Math.random() * 90000) + 10000;

    return str.concat(digit.toString().slice(0, 3));
};

export const getAutoGeneratedId = (prefix: string) => {
    // You can use a timestamp or a random number to create a unique ID
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 90000) + 10000;
    return `${prefix}-${random}`;
};
