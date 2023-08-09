import React, { useEffect, useState } from "react";
import { Select, TimePicker, Table, Form, Popconfirm } from "antd";
import {
    priorityOpts,
    assigneeOpts,
    clientOpts,
    formatTime,
    OperationType,
} from "../../utilities/utility";
import "react-quill/dist/quill.snow.css";

import "./AddCompliance.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import TextArea from "antd/es/input/TextArea";
import {
    IClientDetails,
    ClientDetail,
    SubCompliance as ISubCompliance,
} from "./interfaces/ICompliance";
import Stopwatch from "../../components/Stockwatch/Stopwatch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
const ComplianceDetails = (props: any) => {
    const newClientItem = {
        _id: nanoid(),
        budget_time: "00:00:00",
        parentId: props.parentId ?? -1,
        client_name: "",
        priority: "",
        assigned_to: "",
        remark: "",
    } as IClientDetails;

    const [clients, setClients] = useState<IClientDetails[]>(props.data);

    const [selectedTableRow, setSelectedTableRow] = useState(newClientItem);
    const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);

    const [subCompliances, setSubCompliances] = useState<ISubCompliance[]>(
        props.subcompliance ?? []
    );

    // Custom Validation for Client row
    const customValidationRule = (
        rule: any,
        value: any,
        record: ClientDetail
    ) => {
        if (record.client_name === "") {
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
                    onConfirm={() => removeComplianceDetails(record)}
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
                        "client_name_" +
                        record._id +
                        "_" +
                        props.parentTitle +
                        "_" +
                        props.parentId
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
                                return item.client_name === "";
                            });
                            if (!emptyRowExist) {
                                addNewComplianceDetails();
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
                    name={
                        "assignee_to_" +
                        record._id +
                        "_" +
                        props.parentTitle +
                        "_" +
                        props.parentId
                    }
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
                    name={
                        "budget_time_" +
                        record._id +
                        "_" +
                        props.parentTitle +
                        "_" +
                        props.parentId
                    }
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
                    name={
                        "_priority_" +
                        record._id +
                        "_" +
                        props.parentTitle +
                        "_" +
                        props.parentId
                    }
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
            dataIndex: "remark",
            key: "remark",
            render: (text: any, record: ClientDetail, index: number) => (
                <TextArea
                    rows={1}
                    onChange={(value) => {
                        inputChangeHandler(value, "remark");
                    }}
                    defaultValue={record.remark}
                />
            ),
        },
    ];

    const columns = [
        {
            title: "Action",
            dataIndex: "_id",
            key: "_id",
            align: "center",
            width: "15rem",
            render: (text: any, record: any, index: number) => (
                <div className="timerbuttons">
                    <Stopwatch
                        label={"compliance"}
                        parentId={record._id}
                        handleTaskStatus={props.handleTaskStatus} //TODO: need to implement
                        status={record.status}
                        showSeconds={true}
                    />
                </div>
            ),
        },
        {
            title: "Client Name",
            dataIndex: "client_name",
            key: "client_name",
            width: "15rem",
            sorter: (a: any, b: any) =>
                a.client_name.localeCompare(b.client_name),
            //sortDirections: ["descend", "ascend"],
        },
        {
            title: "Assign To",
            dataIndex: "assigned_to",
            key: "assigned_to",
            width: "15rem",
            sorter: (a: any, b: any) =>
                a.assigned_to.localeCompare(b.assigned_to),
        },
        {
            title: "Sub Compliance",
            dataIndex: "subCompliance",
            key: "subCompliance",
            width: "12rem",
            render: (text: any, record: any) => {
                let currentClientCount = 0;
                let completedCount = 0;

                // subcompliance count as per client
                if (subCompliances) {
                    subCompliances.map((item: ISubCompliance) => {
                        const matchedItem = item.clients.filter(
                            (client: any) => {
                                return (
                                    client.client_name === record.client_name
                                );
                            }
                        );

                        if (matchedItem && matchedItem.length > 0) {
                            currentClientCount += matchedItem.length;
                            if (matchedItem.length > 0) {
                                if (item.status === "completed") {
                                    completedCount++;
                                }
                            }
                        }
                    });
                }

                return `${completedCount} / ${currentClientCount}`;
            },
            sorter: (a: any, b: any) => a.subCompliances - b.subCompliances,
        },
        {
            title: "Remarks",
            dataIndex: "remark",
            key: "remark",
            sorter: (a: any, b: any) => a.remark.localeCompare(b.remark),
        },
        {
            title: "Budget Time",
            dataIndex: "budget_time",
            key: "budget_time",
            align: "center",
            width: "10rem",
            render: (item: string) => {
                return formatTime(item);
            },
            //sorter: (a: any, b: any) => a.budget_time - b.budget_time,
        },
        {
            title: "Actual Time",
            dataIndex: "actual_time",
            key: "actual_time",
            align: "center",
            width: "10rem",
            render: (item: string) => {
                return formatTime(item);
            },
            //sorter: (a: any, b: any) => a.actual_time - b.actual_time,
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

        Object.keys(new ClientDetail()).map((keyItem: string) => {
            if (keyItem === nameItem) {
                switch (keyItem) {
                    case "client_name": {
                        selectedTableRow.client_name = value;
                        break;
                    }
                    case "assigned_to": {
                        selectedTableRow.assigned_to = value;
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
                    case "remark": {
                        selectedTableRow.remark = value;
                        break;
                    }
                }
            }
        });

        // update selected rows
        setSelectedTableRow(selectedTableRow);

        // update parent component
        if (props.updateClients) {
            const newDetails = clients.filter((clientItem: IClientDetails) => {
                return clientItem.client_name !== "";
            });
            console.log("newDetails", newDetails);
            props.updateClients(newDetails, OperationType.change);
        }
    };

    const removeComplianceDetails = (item: IClientDetails) => {
        const index = clients.indexOf(item);

        if (clients.length > 1 && index > -1) {
            const selectedClients = clients.filter((compliance: any) => {
                return compliance._id !== item._id;
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

    const addNewComplianceDetails = () => {
        const newClient = newClientItem;
        newClient._id = nanoid();
        setClients([...clients, newClient]);

        // // update parent component
        // if (props.addClients) {
        //     props.addClients(clients, OperationType.add);
        // }
    };

    useEffect(() => {
        setClients(props.isEdit ? [newClientItem, ...props.data] : props.data);
        setIsEdit(props.isEdit);
    }, [props.isEdit]);

    return (
        <>
            <div style={{ display: props.isAllowAdd ? "block" : "none" }}>
                {/* <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addNewComplianceDetails}
                    style={{ float: "right", marginBottom: "10px" }}
                >
                    Add
                </Button> */}
            </div>
            <div className="client-details">
                <ToastContainer />
                <Table
                    rowKey={(record) => record.complianceDetailId}
                    dataSource={clients}
                    columns={isEdit ? editColumns : columns}
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

export default ComplianceDetails;
