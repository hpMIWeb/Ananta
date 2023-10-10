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

const SubTask = (props: any) => {
    const subTaskObj = { _id: "1", status: "Pending" } as ISubTask;
    const [subTasks, setSubTasks] = useState<ISubTask[]>([subTaskObj]);

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
                if (name === "assigned_to") {
                    const transformedValues = event.map(
                        (item: any) => item.value
                    );
                    item[name] = transformedValues;
                    setSubTasks({ ...subTasks, [name]: transformedValues });
                } else {
                    item[name] = value;
                }
            }
            return item;
        });

        setSubTasks(updatedTasks);
    };

    useEffect(() => {
        console.log(subTasks);
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
                                            {
                                                pattern:
                                                    /^(?:[01]\d|2[0-3]):[0-5]\d$/,
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
                                            placeholder="Budget Time"
                                            name="budget_time"
                                            onInput={(event) => {
                                                const inputElement =
                                                    event.target as HTMLInputElement;
                                                let input = inputElement.value;
                                                input = input.replace(
                                                    /[^0-9]/g,
                                                    ""
                                                ); // Remove non-numeric characters

                                                if (input.length >= 3) {
                                                    input =
                                                        input.slice(0, 2) +
                                                        ":" +
                                                        input.slice(2);
                                                }

                                                inputElement.value = input;
                                                inputChangeHandler(
                                                    event,
                                                    subTaskItem
                                                );
                                            }}
                                            className="w100"
                                            maxLength={5}
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
                            <Row
                                gutter={[8, 8]}
                                className="form-row add-form-row"
                            >
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 24 }}
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
                            </Row>
                            <Row
                                gutter={[8, 10]}
                                className="form-row add-form-row"
                            >
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 8 }}
                                >
                                    <Form.Item
                                        name={"client_" + index}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select client.",
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            showSearch
                                            placeholder="Client"
                                            options={clientOpts}
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
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 8 }}
                                >
                                    <Form.Item
                                        name={"assigned_to_" + index}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select assignee.",
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            showSearch
                                            placeholder="Assign Person"
                                            options={assigneeOpts}
                                            onChange={(value, event) => {
                                                inputChangeHandler(
                                                    event,
                                                    subTaskItem,
                                                    "assigned_to"
                                                );
                                            }}
                                            mode="multiple"
                                            className="w100"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 8 }}
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
                            <Row
                                gutter={[8, 8]}
                                className="form-row add-form-row"
                            >
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 4 }}
                                >
                                    <Upload>
                                        <Button type="primary">
                                            Attach Files
                                        </Button>
                                    </Upload>
                                </Col>
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 20 }}
                                >
                                    <Input
                                        placeholder="Data Path"
                                        name="dataPath"
                                        onChange={(event) => {
                                            inputChangeHandler(
                                                event,
                                                subTaskItem
                                            );
                                        }}
                                        className="w100"
                                    />
                                </Col>
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

export default SubTask;
