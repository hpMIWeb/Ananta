import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Select,
    Row,
    Col,
    Upload,
    Divider,
    TimePicker,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
    assigneeOpts,
    clientOpts,
    priorityOpts,
    workAreaOpts,
} from "../../utilities/utility";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { SubTask as ISubTask } from "./interfaces/ITask";
import "./subTask.scss";
import MultipleTaskClientDetails from "./MultipleTaskClientDetails";
import {
    AddMultipleTask as IAddMultipleTask,
    AddClientDetails as IAddClientDetails,
    AddMultipleSubtask as IAddMultipleSubtask,
} from "./interfaces/ITask";

import { nanoid } from "@reduxjs/toolkit";

const MultipleSubtask = (props: any) => {
    const subTaskObj = { _id: "1", status: "Pending" } as ISubTask;
    const [subTasks, setSubTasks] = useState<ISubTask[]>([subTaskObj]);
    const [clients, setClients] = useState<IAddClientDetails[]>(
        props.clientData
    );
    const addNewTask = () => {
        subTaskObj._id = (subTasks.length + 1).toString();
        setSubTasks([...subTasks, subTaskObj]);
    };

    const removeTask = (item: ISubTask) => {
        const index = subTasks.indexOf(item);
        if (index > -1) {
            const tasks = [...subTasks].filter((task: any) => {
                return task._id !== item._id;
            });
            setSubTasks(tasks);
        }
    };

    const clientDetailsHandler = (details: IAddClientDetails[]) => {
        console.log("subTasks", subTasks);
        console.log("details", details);
        const matchedItem = subTasks.find((item: any) => {
            return (
                item._id ===
                (details && details.length > 0 && details[0].parentId)
            );
        });
        console.log("matchedItem", matchedItem);
        if (matchedItem) {
            let newDataWithoutId = [];
            //TODO: need with API team _id Parameter discuss
            const clientData = JSON.parse(JSON.stringify(details));

            for (const obj of clientData) {
                const newObj = { ...obj }; // Create a shallow copy of the object
                delete newObj._id;
                newDataWithoutId.push(newObj);
            }
            matchedItem.client = newDataWithoutId;
            console.log("matchedItem", matchedItem);

            setClients(newDataWithoutId);

            if (props.subComponentsHandler) {
                console.log("newDataWithoutId", newDataWithoutId);
                props.subComponentsHandler(newDataWithoutId);
            }
        }
    };

    const inputChangeHandler = (
        event: any,
        subTask: ISubTask,
        nameItem: string = ""
    ) => {
        let name: any = "";
        let value: any = "";

        if (event && event.target) {
            name = event.target.name;
            value = event.target.value;
        } else if (nameItem !== "" && event !== "") {
            name = nameItem;
            value = event;
        } else if (event) {
            name = event.name;
            value = event.value;
        }

        const updatedTasks = [...subTasks].map((item: any) => {
            if (item._id === subTask._id) {
                item[name] = value;
            }
            return item;
        });

        console.log("Sub task OBj ", updatedTasks);
        setSubTasks(updatedTasks);
    };

    useEffect(() => {
        let new_Id = 0;
        const updatedData = props.clientData.map((item: IAddClientDetails) => {
            console.log("props.parentId", props.parentId);
            new_Id++;
            return {
                ...item,
                _id: 1, // Generate a unique Nano ID
                parentId: props.parentId ?? -1,
            };
        });
        console.log("updatedData", updatedData);
        setClients(updatedData);

        if (props.subComponentsHandler) {
            props.subComponentsHandler(subTasks);
        }
    }, [subTasks]);

    return (
        <div>
            {subTasks.map((subTaskItem: ISubTask, index: number) => (
                <>
                    {index !== 0 && <Divider />}
                    <div key={index}>
                        <div className="sub-task-header">
                            <div className="sub-task-number">{index + 1}</div>
                            <div className="sub-task-delete">
                                <Button
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => {
                                        removeTask(subTaskItem);
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                        <div>
                            <Row gutter={[8, 8]} className="form-row">
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 15 }}
                                >
                                    <Form.Item
                                        name={"title_" + index}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please enter sub task title.",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Sub Task"
                                            name="title"
                                            onChange={(event) => {
                                                inputChangeHandler(
                                                    event,
                                                    subTaskItem
                                                );
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 3 }}
                                >
                                    <Form.Item
                                        name={"budget_time_" + index}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select budget time.",
                                            },
                                        ]}
                                    >
                                        <TimePicker
                                            placeholder="Time"
                                            name="budget_time"
                                            onChange={(date, dateString) => {
                                                inputChangeHandler(
                                                    dateString,
                                                    subTaskItem,
                                                    "budget_time"
                                                );
                                            }}
                                            format={"HH:mm"}
                                            className="w100"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 6 }}
                                >
                                    <Form.Item
                                        name={"workArea_" + index}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select work area.",
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder="Select Work Area"
                                            options={workAreaOpts}
                                            value={subTaskItem.workArea}
                                            className="w100"
                                            onChange={(value, event) => {
                                                inputChangeHandler(
                                                    event,
                                                    subTaskItem
                                                );
                                            }}
                                        ></Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[8, 8]} className="form-row">
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 18 }}
                                >
                                    <Form.Item name={"remark_" + index}>
                                        <ReactQuill
                                            theme="snow"
                                            value={subTaskItem.remarks}
                                            placeholder="Remark"
                                            onChange={(event) => {
                                                inputChangeHandler(
                                                    event,
                                                    subTaskItem,
                                                    "remarks"
                                                );
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 4 }}
                                >
                                    <Form.Item
                                        name={"priority_" + index}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select priority.",
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder="Priority"
                                            options={priorityOpts}
                                            onChange={(value, event) => {
                                                inputChangeHandler(
                                                    event,
                                                    subTaskItem
                                                );
                                            }}
                                            className="w100"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[8, 8]} className="form-row">
                                <Divider />
                            </Row>
                            <MultipleTaskClientDetails
                                updateClients={clientDetailsHandler}
                                isAllowAdd={true}
                                scroll={{ x: 1000 }}
                                parentTitle={"sub_task"}
                                parentId={subTaskItem._id}
                                data={clients}
                                isEdit={true}
                            />
                            <Row gutter={[8, 8]} className="form-row">
                                <Divider />
                            </Row>
                        </div>
                    </div>
                </>
            ))}
            <div className="sub-task-add">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addNewTask}
                >
                    Add
                </Button>
            </div>
        </div>
    );
};

export default MultipleSubtask;
