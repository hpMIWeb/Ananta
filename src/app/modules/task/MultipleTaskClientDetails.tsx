import React, { useEffect, useState } from "react";
import { Select, TimePicker, Table, Form, Popconfirm } from "antd";
import {
    priorityOpts,
    assigneeOpts,
    clientOpts,
    formatTime,
    OperationType,
} from "../../utilities/utility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import TextArea from "antd/es/input/TextArea";

import {
    AddTask as IAddTask,
    SubTask as ISubTask,
    AddClientDetails as IAddClientDetails,
    AddClientDetails,
} from "./interfaces/ITask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
const MultipleTaskClientDetails = (props: any) => {
    const newClientItem = {
        _id: "1",
        client_name: "",
        assigned_to: [],
        budget_time: "",
        actual_time: "",
        priority: "",
        remarks: "",
        data_path: "",
        attachments: [],
        status: "",
        parentId: props.parentId ?? -1,
    } as IAddClientDetails;

    const [clients, setClients] = useState<IAddClientDetails[]>(props.data);
    const [selectedTableRow, setSelectedTableRow] = useState(newClientItem);
    const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);

    // Custom Validation for Client row
    const customValidationRule = (
        rule: any,
        value: any,
        record: IAddClientDetails
    ) => {
        if (record.client_name.length === 0) {
            return Promise.resolve();
        }

        if (value === undefined) {
            return Promise.reject(new Error(rule.message));
        } else {
            return Promise.resolve();
        }
    };

    const editColumns = [
        {
            title: "Actions",
            dataIndex: "action",
            key: "action",
            align: "center",
            render: (text: any, record: any, index: number) => (
                <Popconfirm
                    title="Sure to Delete?"
                    onConfirm={() => removeClientRow(record)}
                >
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                        style={{
                            fontSize: "15px",
                            color: "#ec0033",
                            cursor: "pointer",
                        }}
                        title={"Click here to Delete"}
                    />
                </Popconfirm>
            ),
        },
        {
            title: "Client",
            dataIndex: "client",
            key: "client",
            width: "20%",
            render: (text: any, record: any, index: number) => (
                <Form.Item
                    name={
                        "client_name_" + record._id + "_" + props.parentId + ""
                    }
                    rules={[
                        {
                            required: true,
                            message: "Please select Client.",
                            validator: (rule, value) => {
                                return customValidationRule(
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
                        className="w100"
                        onChange={(value, event) => {
                            inputChangeHandler(event, "client_name");
                            const emptyRowExist = clients.find((item) => {
                                return item.client_name.length == 0;
                            });
                            if (!emptyRowExist) {
                                addNewClientRowDetails();
                            }
                        }}
                        defaultValue={
                            record.client_name === ""
                                ? null
                                : record.client_name
                        }
                    />
                </Form.Item>
            ),
        },
        {
            title: "Assign To",
            dataIndex: "assignTo",
            key: "assignTo",
            width: "20%",
            render: (text: any, record: any, index: number) => (
                <Form.Item
                    name={"assignee_to_" + record._id + "_" + props.parentId}
                    rules={[
                        {
                            required: true,
                            message: "Please select Assignee.",
                            validator: (rule, value) => {
                                return customValidationRule(
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
                        placeholder="Assign Person"
                        options={assigneeOpts}
                        className="w100"
                        onChange={(value, event) => {
                            inputChangeHandler(event, "assigned_to");
                        }}
                        defaultValue={record.assigned_to}
                    />
                </Form.Item>
            ),
        },
        {
            title: "Budget Time",
            dataIndex: "budgetTime",
            key: "budgetTime",
            width: "10rem",
            render: (text: any, record: any, index: number) => (
                <Form.Item
                    name={"budget_time_" + record._id + "_" + props.parentId}
                    rules={[
                        {
                            required: true,
                            message: "Please set Budget Time.",
                            validator: (rule, value) => {
                                return customValidationRule(
                                    rule,
                                    value,
                                    record
                                );
                            },
                        },
                    ]}
                >
                    <TimePicker
                        placeholder="Budget Time"
                        name="budget_time"
                        className="w100"
                        format={"HH:mm"}
                        onChange={(date, dateString) => {
                            inputChangeHandler(dateString, "budget_time");
                        }}
                        defaultValue={dayjs(record.budget_time, "HH:mm")}
                    />
                </Form.Item>
            ),
        },
        {
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
            width: "10rem",
            render: (text: any, record: any, index: number) => (
                <Form.Item
                    name={"_priority_" + record._id + "_" + props.parentId}
                    rules={[
                        {
                            required: true,
                            message: "Please set Priority.",
                            validator: (rule, value) => {
                                return customValidationRule(
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
                        placeholder="Priority"
                        options={priorityOpts}
                        className="w100"
                        onChange={(value, event) => {
                            inputChangeHandler(event, "priority");
                        }}
                        defaultValue={record.priority}
                    />
                </Form.Item>
            ),
        },
        {
            title: "Remark",
            dataIndex: "remarks",
            key: "remarks",
            render: (text: any, record: IAddClientDetails, index: number) => (
                <TextArea
                    rows={1}
                    onChange={(value) => {
                        inputChangeHandler(value, "remarks");
                    }}
                    defaultValue={record.remarks}
                />
            ),
        },
        {
            title: "Data Path",
            dataIndex: "data_path",
            key: "data_path",
            render: (text: any, record: IAddClientDetails, index: number) => (
                <TextArea
                    rows={1}
                    onChange={(value) => {
                        inputChangeHandler(value, "remark");
                    }}
                    defaultValue={record.data_path}
                />
            ),
        },
    ];

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

        Object.keys(newClientItem).forEach((keyItem: string) => {
            if (keyItem === nameItem) {
                switch (keyItem) {
                    case "client_name": {
                        selectedTableRow.client_name = value;
                        break;
                    }
                    case "assigned_to": {
                        selectedTableRow.assigned_to = [value];
                        break;
                    }
                    case "budget_time": {
                        selectedTableRow.budget_time = value;
                        break;
                    }
                    case "priority": {
                        selectedTableRow.priority = value;
                        break;
                    }
                    case "remarks": {
                        selectedTableRow.remarks = value;
                        break;
                    }
                    case "data_path": {
                        selectedTableRow.data_path = value;
                        break;
                    }
                }
            }
        });
        selectedTableRow.parentId = props.parentId ?? -1;

        console.log("selectedTableRow", selectedTableRow);

        // update selected rows
        setSelectedTableRow(selectedTableRow);

        // update parent component
        if (props.updateClients) {
            const newDetails = clients.filter(
                (clientItem: AddClientDetails) => {
                    return clientItem.client_name.length > 0;
                }
            );
            props.updateClients(newDetails, OperationType.change);
        }
    };

    const removeClientRow = (item: IAddClientDetails) => {
        const index = clients.indexOf(item);

        if (clients.length > 1 && index > -1) {
            const selectedClients = clients.filter((client: any) => {
                return client._id !== item._id;
            });
            setClients(selectedClients);

            // update parent component
            if (props.updateClients) {
                props.updateClients(selectedClients, OperationType.remove);
            }
        } else {
            toast.error("Cannot delete the first row.", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }
    };

    const addNewClientRowDetails = () => {
        const newClient = newClientItem;
        let newId = clients.length + 1;
        newClient._id = newId.toString();
        newClient.budget_time = "00:00";
        newClient.parentId = props.parentId ?? -1;

        setClients([...clients, newClient]);
    };

    useEffect(() => {
        console.log("props in cliner table", props);
        setIsEdit(props.isEdit);
    }, [props.isEdit]);

    return (
        <>
            <div style={{ display: props.isAllowAdd ? "block" : "none" }}></div>
            <div className="client-details">
                <ToastContainer />
                <Table
                    rowKey={(record) => record.complianceDetailId}
                    dataSource={clients}
                    columns={editColumns}
                    pagination={false}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setSelectedTableRow(record);
                            },
                        };
                    }}
                    className="table-striped-rows"
                    bordered
                    {...props}
                />
            </div>
        </>
    );
};

export default MultipleTaskClientDetails;
