import React, { useEffect, useState } from "react";
import { Typography, Select, TimePicker, Table, Button, Form } from "antd";
import {
    priorityOpts,
    assigneeOpts,
    clientOpts,
    formatTime,
} from "../../utilities/utility";
import "react-quill/dist/quill.snow.css";

import "react-toastify/dist/ReactToastify.css";
import "./AddCompliance.scss";
import { PlusOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import TextArea from "antd/es/input/TextArea";
import {
    ClientDetails as IClientDetails,
    SubCompliance as ISubCompliance,
} from "./interfaces/ICompliance";
import Stopwatch from "../../components/Stockwatch/Stopwatch";
import dayjs from "dayjs";

const ComplianceDetails = (props: any) => {
    const [clients, setClients] = useState<IClientDetails[]>(props.data);
    //[
    // {
    //     complianceDetailId: "1",
    //     client_name: "",
    //     actual_time: "",
    //     assignee_to: "",
    //     budget_time: "",
    //     priority: "",
    //     remark: "",
    //     parentId: props.parentId,
    // } as IClientDetails,
    //]
    const [selectedTableRow, setSelectedTableRow] = useState({
        complianceDetailId: "1",
        client_name: "",
        actual_time: "",
        assignee_to: "",
        budget_time: "",
        priority: "",
        remark: "",
        parentId: props.parentId,
    } as IClientDetails);
    const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);

    const [subCompliances, setSubCompliances] = useState<ISubCompliance[]>(
        props.subcompliance ?? []
    );

    const editColumns = [
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            align: "center",
            render: (text: any, record: any, index: number) => (
                <FontAwesomeIcon
                    icon={faTrashAlt}
                    style={{
                        fontSize: "15px",
                        color: "#ec0033",
                        cursor: "pointer",
                    }}
                    title={"Click here to Delete"}
                    onClick={() => {
                        removeComplianceDetails(record);
                    }}
                />
            ),
        },
        {
            title: "Client",
            dataIndex: "client",
            key: "client",
            render: (text: any, record: any, index: number) => (
                <Form.Item
                    name={
                        "client_name_" +
                        record.complianceDetailId +
                        "_" +
                        props.parentTitle +
                        "_" +
                        props.parentId
                    }
                    rules={[
                        {
                            required: true,
                            message: "Please select Client.",
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
                        defaultValue={record.client_name}
                    />
                </Form.Item>
            ),
        },
        {
            title: "Assign To",
            dataIndex: "assignTo",
            key: "assignTo",
            render: (text: any, record: any, index: number) => (
                <Form.Item
                    name={
                        "assignee_to_" +
                        record.complianceDetailId +
                        "_" +
                        props.parentTitle +
                        "_" +
                        props.parentId
                    }
                    rules={[
                        {
                            required: true,
                            message: "Please select Assignee.",
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
                            inputChangeHandler(event, "assignee_to");
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
            render: (text: any, record: any, index: number) => (
                <Form.Item
                    name={
                        "budget_time_" +
                        record.complianceDetailId +
                        "_" +
                        props.parentTitle +
                        "_" +
                        props.parentId
                    }
                    rules={[
                        {
                            required: true,
                            message: "Please set Budget Time.",
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
            render: (text: any, record: any, index: number) => (
                <Form.Item
                    name={
                        "_priority_" +
                        record.complianceDetailId +
                        "_" +
                        props.parentTitle +
                        "_" +
                        props.parentId
                    }
                    rules={[
                        {
                            required: true,
                            message: "Please set Priority.",
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
            render: (text: any, record: any, index: number) => (
                <TextArea
                    rows={1}
                    name="remark"
                    onChange={(value) => {
                        inputChangeHandler(value);
                    }}
                    value={record.remak}
                />
            ),
        },
    ];

    const columns = [
        {
            title: "Action",
            dataIndex: "_id",
            key: "_id",
            render: (text: any, record: any, index: number) => (
                <div className="timerbuttons">
                    <Stopwatch />
                </div>
            ),
        },
        {
            title: "Client Name",
            dataIndex: "client_name",
            key: "client_name",
            sorter: (a: any, b: any) =>
                a.client_name.localeCompare(b.client_name),
            //sortDirections: ["descend", "ascend"],
        },
        {
            title: "Assign To",
            dataIndex: "assigned_to",
            key: "assigned_to",
            sorter: (a: any, b: any) =>
                a.assigned_to.localeCompare(b.assigned_to),
        },
        {
            title: "Sub Compliance",
            dataIndex: "subCompliance",
            key: "subCompliance",
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
            render: (item: string) => {
                return formatTime(item);
            },
            //sorter: (a: any, b: any) => a.budget_time - b.budget_time,
        },
        {
            title: "Actual Time",
            dataIndex: "actual_time",
            key: "actual_time",
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

        Object.keys(selectedTableRow).map((keyItem: string) => {
            if (keyItem === name) {
                switch (keyItem) {
                    case "client_name": {
                        selectedTableRow.client_name = value;
                        break;
                    }
                    case "assignee_to": {
                        selectedTableRow.assignee_to = value;
                        break;
                    }
                    case "budget_time": {
                        selectedTableRow.budget_time = value;
                        selectedTableRow.actual_time = value;
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
            props.updateClients(clients);
        }
    };

    const removeComplianceDetails = (item: IClientDetails) => {
        const index = clients.indexOf(item);
        if (index > -1) {
            const compliance = clients.filter((compliance: any) => {
                return (
                    compliance.complianceDetailId !== item.complianceDetailId
                );
            });
            setClients(compliance);
        }
    };

    const addNewComplianceDetails = () => {
        const new_id = clients.length + 1;
        const newClient = {
            complianceDetailId: new_id.toString(),
            client_name: "",
            actual_time: "",
            assignee_to: "",
            budget_time: "",
            priority: "",
            remark: "",
            parentId: props.parentId,
        } as IClientDetails;
        setClients([...clients, newClient]);

        // update parent component
        if (props.updateClients) {
            props.updateClients(clients);
        }
    };

    useEffect(() => {
        setIsEdit(props.isEdit);
    }, [props.isEdit]);

    return (
        <>
            <div
                className="sub-task-add"
                style={{ display: props.isAllowAdd ? "block" : "none" }}
            >
                {/* <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addNewComplianceDetails}
                    style={{ float: "right", marginBottom: "10px" }}
                >
                    Add
                </Button> */}
            </div>
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
                {...props}
            />
        </>
    );
};

export default ComplianceDetails;
