import { useEffect, useState } from "react";
import {
    faCancel,
    faCross,
    faEdit,
    faTrash,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nanoid } from "nanoid";

import {
    Tabs,
    Typography,
    Table,
    DatePicker,
    Row,
    Col,
    Form,
    Select,
    Divider,
    Input,
    Button,
    TimePicker,
    Popconfirm,
} from "antd";
import type { TabsProps } from "antd";
import "./TimeSheet.scss";
import { Link } from "react-router-dom";

import {
    AddTimesheet,
    AddTimesheet as ITimesheet,
    Timesheet,
} from "./interfaces/ITimesheet";
import { PlusOutlined, ClockCircleOutlined } from "@ant-design/icons";
import api from "../../utilities/apiServices";
import { workAreaOpts, clientOpts } from "../../utilities/utility";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import "./TimeSheet.scss";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/en"; // Import the locale if needed

const { Title } = Typography;
const pageSize = 20;
dayjs.extend(utc);

const TimeSheet = () => {
    const [current, setCurrent] = useState(1);
    const dateFormat = "YYYY-MM-DD";
    const [filterDate, setFilterDate] = useState(dayjs().format(dateFormat));
    const [timesheetData, setTimesheetData] = useState<ITimesheet[]>([]);
    const [timesheetAction, setTimesheetAction] = useState<ITimesheet[]>([]);
    const [selectedTableRow, setSelectedTableRow] = useState<ITimesheet>(
        {} as ITimesheet
    );
    const [newRowCount, setNewRowCount] = useState<number>(1);

    //Time sheet List

    useEffect(() => {
        getTimeSheetData();
    }, []);

    const getTimeSheetData = () => {
        api.getTimesheet().then((resp: any) => {
            setTimesheetData(resp.data);
        });
    };

    useEffect(() => {
        // getData is called whenever timesheetData changes
        getData(filterDate.toString());
    }, [timesheetData]);

    const getData = (currentDate: string) => {
        // Create blank Timesheet
        const newBlankTimeSheet = new Timesheet();
        newBlankTimeSheet._id = nanoid();
        newBlankTimeSheet.date = currentDate.toString();

        let returnVal = timesheetData.filter((item: ITimesheet) => {
            return dayjs(item.date, dateFormat).isSame(currentDate);
        });

        // Add new blank item at the top
        returnVal.unshift(newBlankTimeSheet);

        const cTimeSheet = returnVal.map((item: any, index: number) => {
            item.key = index;
            return item;
        });
        setTimesheetAction(cTimeSheet);
    };

    // Custom Validation for time sheet
    const anyValidation = (rule: any, value: any, record: any) => {
        const fieldId = rule.field; // Replace 'field' with the actual field name or identifier in the rule.

        if (record.is_edit) {
            // For new or edited records, skip validation and use the existing data as the default value.
            if (fieldId in record) {
                return Promise.resolve(record[fieldId]);
            } else {
                return Promise.resolve();
            }
        }
        if (record.start_time === "" && record.end_time === "") {
            return Promise.resolve();
        }

        if (value === undefined) {
            return Promise.reject(new Error(rule.message));
        } else {
            return Promise.resolve();
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Tab") {
            if (
                event.currentTarget.name === "end_time" &&
                selectedTableRow.is_new
            ) {
                event.preventDefault(); // Prevent form submission on Enter press
                addNewTimesheetRow();
            }
        }
    };
    const columns = [
        {
            title: "Start Time",
            dataIndex: "start_time",
            key: "start_time",
            width: "10%",
            sorter: (a: Timesheet, b: Timesheet) =>
                dayjs(a.start_time).unix() - dayjs(b.start_time).unix(),
            render: (start_time: string, record: Timesheet) => {
                if (record.is_new) {
                    return (
                        <Form.Item
                            name={`start_time_${record._id}`}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter start time.",
                                    validator: (rule, value) => {
                                        return anyValidation(
                                            rule,
                                            value,
                                            record
                                        );
                                    },
                                },
                                {
                                    pattern: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
                                    message:
                                        "Please enter a valid time in the format HH:mm.",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (value !== "00:00") {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                "Budget Time cannot be set to 00:00."
                                            )
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input
                                placeholder="Start Time"
                                name="start_time"
                                onInput={(event) => {
                                    const inputElement =
                                        event.target as HTMLInputElement;
                                    let input = inputElement.value;
                                    input = input.replace(/[^0-9]/g, ""); // Remove non-numeric characters

                                    if (input.length >= 3) {
                                        input =
                                            input.slice(0, 2) +
                                            ":" +
                                            input.slice(2);
                                    }

                                    inputElement.value = input;
                                    inputChangeHandler(event);
                                }}
                                className="w100"
                                maxLength={5}
                            />
                        </Form.Item>
                    );
                } else if (!record.is_edit) {
                    return (
                        <span className="start-time">
                            <ClockCircleOutlined
                                style={{
                                    color: "#2c7be5",
                                    marginRight: "10px",
                                }}
                            />
                            {dayjs.utc(record.start_time).format("HH:mm")}
                        </span>
                    );
                }
                return (
                    <Form.Item
                        name={`start_time_${record._id}`}
                        rules={[
                            {
                                required: true,
                                message: "Please enter start time.",
                                validator: (rule, value) => {
                                    return anyValidation(rule, value, record);
                                },
                            },
                            {
                                pattern: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
                                message:
                                    "Please enter a valid time in the format HH:mm.",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value !== "00:00") {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "Budget Time cannot be set to 00:00."
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input
                            placeholder="Start Time"
                            name={`start_time_${record._id}`}
                            onInput={(event) => {
                                const inputElement =
                                    event.target as HTMLInputElement;
                                let input = inputElement.value;
                                input = input.replace(/[^0-9]/g, ""); // Remove non-numeric characters

                                if (input.length >= 3) {
                                    input =
                                        input.slice(0, 2) +
                                        ":" +
                                        input.slice(2);
                                }

                                inputElement.value = input;
                                inputChangeHandler(event);
                            }}
                            defaultValue={dayjs.utc(start_time).format("HH:mm")}
                            className="w100"
                            maxLength={5}
                        />
                    </Form.Item>
                );
            },
        },
        {
            title: "End Time",
            dataIndex: "end_time",
            key: "end_time",
            sorter: (a: Timesheet, b: Timesheet) =>
                dayjs(a.end_time).unix() - dayjs(b.end_time).unix(),
            width: "10%",
            render: (end_time: string, record: Timesheet) => {
                if (record.is_new) {
                    return (
                        <Form.Item
                            name={`end_time_${record._id}`}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter end time.",
                                    validator: (rule, value) => {
                                        return anyValidation(
                                            rule,
                                            value,
                                            record
                                        );
                                    },
                                },
                                {
                                    pattern: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
                                    message:
                                        "Please enter a valid time in the format HH:mm.",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (value !== "00:00") {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                "Budget Time cannot be set to 00:00."
                                            )
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input
                                placeholder="End Time"
                                name="end_time"
                                onInput={(event) => {
                                    const inputElement =
                                        event.target as HTMLInputElement;
                                    let input = inputElement.value;
                                    input = input.replace(/[^0-9]/g, ""); // Remove non-numeric characters

                                    if (input.length >= 3) {
                                        input =
                                            input.slice(0, 2) +
                                            ":" +
                                            input.slice(2);
                                    }

                                    inputElement.value = input;
                                    inputChangeHandler(event);
                                }}
                                maxLength={5}
                                className="w100"
                            />
                        </Form.Item>
                    );
                } else if (!record.is_edit) {
                    return (
                        <span className="start-time">
                            <ClockCircleOutlined
                                style={{
                                    color: "#2c7be5",
                                    marginRight: "10px",
                                }}
                            />
                            {dayjs.utc(record.end_time).format("HH:mm")}
                        </span>
                    );
                }
                return (
                    <Form.Item
                        name={`end_time_${record._id}`}
                        rules={[
                            {
                                required: true,
                                message: "Please enter end time.",
                                validator: (rule, value) => {
                                    return anyValidation(rule, value, record);
                                },
                            },
                            {
                                pattern: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
                                message:
                                    "Please enter a valid time in the format HH:mm.",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value !== "00:00") {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "Budget Time cannot be set to 00:00."
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input
                            placeholder="End Time"
                            name="end_time"
                            onInput={(event) => {
                                const inputElement =
                                    event.target as HTMLInputElement;
                                let input = inputElement.value;
                                input = input.replace(/[^0-9]/g, ""); // Remove non-numeric characters

                                if (input.length >= 3) {
                                    input =
                                        input.slice(0, 2) +
                                        ":" +
                                        input.slice(2);
                                }

                                inputElement.value = input;
                                inputChangeHandler(event);
                            }}
                            defaultValue={dayjs.utc(end_time).format("HH:mm")}
                            className="w100"
                            maxLength={5}
                        />
                    </Form.Item>
                );
            },
        },
        {
            title: "Client Name",
            dataIndex: "client",
            key: "client",
            width: "10%",
            sorter: (a: Timesheet, b: Timesheet) =>
                a.client.localeCompare(b.client),
            render: (client: string, record: Timesheet) => {
                if (record.is_new) {
                    return (
                        <Form.Item
                            name={`client_${record._id}`}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter Client.",
                                    validator: (rule, value) => {
                                        return anyValidation(
                                            rule,
                                            value,
                                            record
                                        );
                                    },
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder="Client"
                                options={clientOpts}
                                defaultValue={client}
                                className="w100"
                                onChange={(value, event) => {
                                    inputChangeHandler(event, "client");
                                }}
                            />
                        </Form.Item>
                    );
                } else if (!record.is_edit) {
                    return <span>{record.client}</span>;
                }
                return (
                    <Form.Item
                        name={`client_${record._id}`}
                        rules={[
                            {
                                required: true,
                                message: "Please enter Client.",
                                validator: (rule, value) => {
                                    return anyValidation(rule, value, record);
                                },
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            showSearch
                            placeholder="Client"
                            options={clientOpts}
                            defaultValue={client}
                            className="w100"
                            onChange={(value, event) => {
                                inputChangeHandler(event, "client");
                            }}
                        />
                    </Form.Item>
                );
            },
        },
        {
            title: "Work Area",
            dataIndex: "work_area",
            key: "work_area",
            width: "10%",
            sorter: (a: Timesheet, b: Timesheet) =>
                a.work_area.localeCompare(b.work_area),
            render: (work_area: string, record: Timesheet) => {
                if (record.is_new) {
                    return (
                        <Form.Item
                            name={`work_area_${record._id}`}
                            rules={[
                                {
                                    required: true,
                                    message: "Please select Work Area.",
                                    validator: (rule, value) => {
                                        return anyValidation(
                                            rule,
                                            value,
                                            record
                                        );
                                    },
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder="Work Area"
                                className="w102"
                                options={workAreaOpts}
                                defaultValue={work_area}
                                onChange={(value, event) => {
                                    inputChangeHandler(event, "work_area");
                                }}
                            />
                        </Form.Item>
                    );
                } else if (!record.is_edit) {
                    return <span>{record.work_area}</span>;
                }
                return (
                    <Form.Item
                        name={`work_area_${record._id}`}
                        rules={[
                            {
                                required: true,
                                message: "Please select Work Area.",
                                validator: (rule, value) => {
                                    return anyValidation(rule, value, record);
                                },
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            showSearch
                            placeholder="Work Area"
                            className="w102"
                            options={workAreaOpts}
                            defaultValue={work_area}
                            onChange={(value, event) => {
                                inputChangeHandler(event, "work_area");
                            }}
                        />
                    </Form.Item>
                );
            },
        },
        {
            title: "Particulars",
            dataIndex: "particulars",
            key: "particulars",
            width: "20%",
            sorter: (a: Timesheet, b: Timesheet) =>
                a.particulars.localeCompare(b.particulars),
            render: (particulars: string, record: Timesheet) => {
                if (record.is_new) {
                    return (
                        <Form.Item
                            name={`particulars_${record._id}`}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter Particulars.",
                                    validator: (rule, value) => {
                                        return anyValidation(
                                            rule,
                                            value,
                                            record
                                        );
                                    },
                                },
                            ]}
                        >
                            <Input
                                placeholder="Particulars"
                                type="text"
                                name="particulars"
                                defaultValue={particulars}
                                className="w102"
                                onChange={(value) => {
                                    inputChangeHandler(value);
                                }}
                            />
                        </Form.Item>
                    );
                } else if (!record.is_edit) {
                    return (
                        <div className="scrollbar-td">{record.particulars}</div>
                    );
                }
                return (
                    <Form.Item
                        name={`particulars_${record._id}`}
                        rules={[
                            {
                                required: true,
                                message: "Please enter Particulars .",
                                validator: (rule, value) => {
                                    return anyValidation(rule, value, record);
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder="Particulars"
                            type="text"
                            name="particulars"
                            defaultValue={particulars}
                            className="w102"
                            onChange={(value) => {
                                inputChangeHandler(value);
                            }}
                        />
                    </Form.Item>
                );
            },
        },
        {
            title: "Remark",
            dataIndex: "remark",
            key: "remark",
            width: "20%",
            sorter: (a: Timesheet, b: Timesheet) =>
                a.remark.localeCompare(b.remark),
            render: (remark: string, record: Timesheet) => {
                if (record.is_new) {
                    return (
                        <Form.Item
                            name={`remark_${record._id}`}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a remark.",
                                    validator: (rule, value) => {
                                        return anyValidation(
                                            rule,
                                            value,
                                            record
                                        );
                                    },
                                },
                            ]}
                        >
                            <Input
                                placeholder="Remark"
                                type="text"
                                name="remark"
                                defaultValue={remark}
                                className="w102"
                                onChange={(value) => {
                                    inputChangeHandler(value);
                                }}
                            />
                        </Form.Item>
                    );
                } else if (!record.is_edit) {
                    return <div className="scrollbar-td">{record.remark}</div>;
                }
                return (
                    <Form.Item
                        name={`remark_${record._id}`}
                        rules={[
                            {
                                required: true,
                                message: "Please enter a remark.",
                                validator: (rule, value) => {
                                    return anyValidation(rule, value, record);
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder="Remark"
                            type="text"
                            name="remark"
                            defaultValue={remark}
                            className="w102"
                            onChange={(value) => {
                                inputChangeHandler(value);
                            }}
                        />
                    </Form.Item>
                );
            },
        },
        {
            title: "Total Time",
            dataIndex: "total_time",
            key: "total_time",
            width: "10%",

            sorter: (a: Timesheet, b: Timesheet) => {
                const aMinutes = convertTimeToMinutes(a.total_time);
                const bMinutes = convertTimeToMinutes(b.total_time);
                return aMinutes - bMinutes;
            },
            render: (total_time: string, record: Timesheet) => {
                if (!record.is_edit) {
                    if (record.total_time !== "") {
                        return (
                            <span>
                                <ClockCircleOutlined
                                    style={{
                                        color: "#2c7be5",
                                        marginRight: "10px",
                                    }}
                                />
                                {record.total_time}
                            </span>
                        );
                    }
                }
                if (record.is_new || !record.start_time || !record.end_time) {
                    return null; // Hide the column for new entries or if start time or end time is empty
                }

                return (
                    <span id={`total_time_${record._id}`}>
                        {record.total_time}
                    </span>
                );
            },
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            width: "5%",

            render: (_: any, record: Timesheet) => {
                if (record.is_new) {
                    return (
                        <span
                            className=""
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                float: "right",
                            }}
                        >
                            <Popconfirm
                                title="Sure to delete?"
                                onConfirm={() => removeRow(record._id)}
                            >
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="btn-at"
                                    title="Delete Timesheet"
                                    style={{ color: "#fa5c7c" }}
                                />
                            </Popconfirm>
                        </span>
                    );
                }
                if (record.is_edit) {
                    return (
                        <span
                            className="totalTimeDisplay"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                float: "right",
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faXmark}
                                className="btn-at"
                                title="Edit Timesheet"
                                style={{
                                    color: "#2c7be5",
                                    marginLeft: "15px",
                                }}
                                onClick={() => editClickHandler(record)}
                            />
                            <Divider type="vertical" />
                            <Popconfirm
                                title="Sure to delete?"
                                onConfirm={() => deleteClickHandler(record._id)}
                            >
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="btn-at"
                                    title="Delete Timesheet"
                                    style={{ color: "#fa5c7c" }}
                                />
                            </Popconfirm>
                        </span>
                    );
                }
                return (
                    <span
                        className="totalTimeDisplay"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            float: "right",
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faEdit}
                            className="btn-at"
                            title="Edit Timesheet"
                            style={{
                                color: "#2c7be5",
                                marginLeft: "15px",
                            }}
                            onClick={() => editClickHandler(record)}
                        />
                        <Divider type="vertical" />
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => deleteClickHandler(record._id)}
                        >
                            <FontAwesomeIcon
                                icon={faTrash}
                                className="btn-at"
                                title="Delete Timesheet"
                                style={{ color: "#fa5c7c" }}
                            />
                        </Popconfirm>
                    </span>
                );
            },
        },
    ];

    const convertTimeToMinutes = (time: any) => {
        const [hours, minutes] = time.split(":");
        return parseInt(hours) * 60 + parseInt(minutes);
    };

    const addNewTimesheetRow = () => {
        const newAddTimesheet = new Timesheet();
        newAddTimesheet._id = nanoid();
        newAddTimesheet.date = filterDate;

        if (
            !timesheetData.some(
                (row) => row.start_time === "" && row.end_time === ""
            )
        ) {
            const selectedRowIndex = timesheetData.findIndex(
                (row) => row === selectedTableRow
            );
            const updatedTimesheet = [
                ...timesheetAction.slice(0, selectedRowIndex + 1),
                newAddTimesheet,
                ...timesheetAction.slice(selectedRowIndex + 1),
            ];
            setTimesheetAction(updatedTimesheet);
            setNewRowCount(newRowCount + 1);
        }
    };

    const [activeTab, setActiveTab] = useState<string>("1");

    const onTabChange = (key: string) => {
        setActiveTab(key);
    };

    // Edit time sheet data
    const editClickHandler = (record: Timesheet) => {
        record.is_edit = !record.is_edit;
        setTimesheetAction([...timesheetAction]);
    };

    // delete time sheet data
    const deleteClickHandler = (timeSheetId: string) => {
        // Delete from  DB
        api.deleteTimesheet(timeSheetId)
            .then((resp: any) => {
                // Set timesheet to `localStorage`
                const updatedData = timesheetAction.filter(
                    (item: Timesheet) => item._id !== timeSheetId
                );
                setTimesheetAction(updatedData);
                toast.success("Timesheet successfully deleted.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .catch((error) => {
                toast.error("Technical error while deleting timesheet", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    const removeRow = (timeSheetId: string) => {
        if (newRowCount === 1) {
            toast.error("Cannot delete the first new row.", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }
        const updatedData = timesheetAction.filter(
            (item: Timesheet) => item._id !== timeSheetId
        );

        setTimesheetAction(updatedData);
        setNewRowCount(newRowCount - 1);
        toast.success("Timesheet successfully removed.", {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    // save time sheet data
    const saveTimeSheetHandler = () => {
        const selectedDate = dayjs(filterDate).format(dateFormat);
        // Read all existing timesheet from `localStorage`
        const newTimesheets = timesheetAction.filter((entry) => {
            return (
                (entry.is_new || entry.is_edit) &&
                entry.start_time !== "" &&
                entry.end_time !== ""
            );
        });

        // Check if any new timesheets are present
        if (newTimesheets.length === 0) {
            toast.error("No new timesheet entries to save.", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }

        // Check if every new timesheet entry has non-blank values
        const isEveryEntryValid = newTimesheets.every((entry) =>
            Object.values(entry).every((value) => value !== "")
        );

        // If any entry is not valid, display an error message
        if (!isEveryEntryValid) {
            toast.error("Please complete all required fields.", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }

        // Create an array of timesheet data
        const timesheetPayload = newTimesheets.map((entry) => {
            console.log("entry.start_time", entry.start_time);
            const startTime = entry.is_edit
                ? dayjs.utc(entry.start_time).format("YYYY-MM-DD HH:mm")
                : selectedDate + " " + entry.start_time;
            const endTime = entry.is_edit
                ? dayjs.utc(entry.end_time).format("YYYY-MM-DD HH:mm")
                : selectedDate + " " + entry.end_time;

            const payload = {
                start_time: startTime,
                end_time: endTime,
                remark: entry.remark,
                client: entry.client,
                work_area: entry.work_area,
                particulars: entry.particulars,
                total_time: entry.total_time,
                date: selectedDate,
                ...(entry.is_edit && { _id: entry._id }), // Conditionally add _id property
            };

            return payload;
        });

        // Make a single API call to save/edit the multiple timesheet entries
        try {
            api.createMultipleTimesheet(timesheetPayload)
                .then((resp) => {
                    toast.success("Timesheet entries successfully saved.", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    getTimeSheetData();
                })
                .catch((error) => {
                    toast.error("Technical error while Timesheet entries.", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                });
        } catch (ex) {
            toast.error("Technical error while Timesheet entries.", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const inputChangeHandler = (event: any, nameItem: string = "") => {
        let name = "";
        let value = "";
        if (event && event.target) {
            name = event.target.name;
            value = event.target.value;
        } else if (nameItem !== "" && event !== "" && event !== undefined) {
            name = nameItem;
            value = event.value ?? event;
        } else if (event) {
            name = event.name;
            value = event.value;
        }

        Object.keys(selectedTableRow).forEach((recordItem: string) => {
            if (recordItem === name) {
                switch (recordItem) {
                    case "start_time": {
                        selectedTableRow.start_time = value;
                        let startTime = dayjs(
                            selectedTableRow.start_time,
                            "HH:mm"
                        );
                        if (startTime.isAfter(startTime)) {
                            toast.error(
                                "Start time should not be greater than start time.",
                                {
                                    position: toast.POSITION.TOP_RIGHT,
                                }
                            );
                            return;
                        }
                        selectedTableRow.total_time =
                            calculateTotalTime(selectedTableRow);

                        break;
                    }
                    case "end_time": {
                        selectedTableRow.end_time = value;
                        selectedTableRow.total_time =
                            calculateTotalTime(selectedTableRow);

                        if (
                            value &&
                            /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)
                        ) {
                            // Assuming you have an isNew flag indicating if it's a new row
                            if (selectedTableRow.is_new) {
                                addNewTimesheetRow();
                            }
                        }
                        break;
                    }
                    case "client": {
                        selectedTableRow.client = value;

                        break;
                    }
                    case "particulars": {
                        selectedTableRow.particulars = value;
                        break;
                    }
                    case "remark": {
                        selectedTableRow.remark = value;
                        break;
                    }
                    case "work_area": {
                        selectedTableRow.work_area = value;
                        break;
                    }
                }
            }
        });

        // update selected rows
        setSelectedTableRow(selectedTableRow);
    };

    const dateFilter = (date: string) => {
        setFilterDate(date);
        getData(date);
    };

    const calculateTotalTime = (record: Timesheet) => {
        let endTime = record.is_edit
            ? dayjs(record.end_time).format("HH:mm").toString()
            : dayjs(record.end_time, "HH:mm");
        let startTime = record.is_edit
            ? dayjs(record.start_time).format("HH:mm").toString()
            : dayjs(record.start_time, "HH:mm");
        let diff = 0;

        if (startTime) {
            diff = dayjs(endTime).diff(
                dayjs(record.start_time, "HH:mm"),
                "minute"
            );
        }
        // if (startTime.isAfter(endTime)) {
        //     toast.error("Start time should not be greater than end time.", {
        //         position: toast.POSITION.TOP_RIGHT,
        //     });
        //     return "";
        // }

        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        const formattedDuration = `${hours}:${minutes
            .toString()
            .padStart(2, "0")}`;

        return formattedDuration ? formattedDuration : "";
    };
    // save time sheet code end

    //End Time sheet List
    const tabContent: TabsProps["items"] = [
        {
            key: "1",
            label: (
                <Link to="/timesheet" style={{ color: "black" }}>
                    My Timesheet
                </Link>
            ),
        },
        {
            key: "2",
            label: (
                <Link to="/emp-time-sheet" style={{ color: "black" }}>
                    Employee Timesheet Report
                </Link>
            ),
        },
        {
            key: "3",
            label: (
                <Link to="/client-time-sheet" style={{ color: "black" }}>
                    Client Timesheet Report
                </Link>
            ),
        },
    ];

    return (
        <>
            <div>
                <Title level={5}>Timesheet</Title>
            </div>

            <div
                className="task-list-header"
                style={{ borderBottom: "2px solid #d8e2ef" }}
            >
                <ToastContainer />
                <div>
                    <Tabs
                        defaultActiveKey="1"
                        items={tabContent}
                        onChange={onTabChange}
                        style={{ width: "100%" }}
                    />
                </div>
            </div>
            <Row
                gutter={[8, 8]}
                className="form-row"
                style={{ marginTop: "10px" }}
            >
                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 21 }}
                ></Col>
                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 3 }}
                    className="border-bottom"
                >
                    <DatePicker
                        placeholder="Date"
                        name="date"
                        className="w100"
                        style={{ float: "right" }}
                        defaultValue={dayjs()}
                        format={dateFormat}
                        bordered={false}
                        onChange={(date, dateString) => {
                            dateFilter(dateString);
                        }}
                    />
                </Col>
            </Row>

            <div>
                <Form>
                    <Row
                        gutter={[8, 8]}
                        className="form-row"
                        style={{ marginTop: "10px" }}
                    >
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        >
                            <div className="client-details">
                                <Table
                                    id="time-sheet-table"
                                    columns={columns}
                                    dataSource={timesheetAction}
                                    rowKey="_id"
                                    onRow={(record, rowIndex) => {
                                        return {
                                            onClick: (event) => {
                                                setSelectedTableRow(record);
                                            },
                                        };
                                    }}
                                    className="table-striped-rows center-align-header time-sheet-table"
                                    bordered
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={[8, 8]} className="form-row">
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<PlusOutlined />}
                            onClick={saveTimeSheetHandler}
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                            Save
                        </Button>
                    </Row>
                </Form>
            </div>
        </>
    );
};
export default TimeSheet;
