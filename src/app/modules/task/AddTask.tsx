import React, { useEffect, useState, useRef } from "react";
import {
    Form,
    Input,
    Button,
    Typography,
    DatePicker,
    Select,
    Switch,
    Row,
    Col,
    TimePicker,
    Upload,
    Divider,
} from "antd";
import SubTask from "./SubTask";
import {
    priorityOpts,
    chargesOpts,
    assigneeOpts,
    clientOpts,
    modeOptions,
    workAreaOpts,
} from "../../utilities/utility";
import dayjs from "dayjs";
import { CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    AddTask as IAddTask,
    TaskTimer,
    TimerOpts,
    Task,
    AddSubTask,
} from "./interfaces/ITask";
import api from "../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddTask.scss";
const { Title } = Typography;

const AddTask = () => {
    const dateFormat = "YYYY-MM-DD";
    const navigate = useNavigate();
    const selectModeRef = useRef(null);
    const [form] = Form.useForm();

    // local states
    const [showSubTask, setShowSubTask] = useState<boolean>(false);
    const [addTask, setAddTask] = useState<IAddTask>(new Task());

    // Handllers
    const onSwitchSubTask = () => {
        setShowSubTask(!showSubTask);
    };
    const cancelNewTaskHandler = () => {
        navigate("/task");
    };

    const inputChangeHandler = (event: any, nameItem: string = "") => {
        let name = "";
        let value = "";
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

        setAddTask({
            ...addTask,
            [name]: value,
        });
    };

    const validate = () => {
        let returnFlag = true;

        if (addTask.hasOwnProperty("start_date") && addTask.start_date === "") {
            returnFlag = false;
        } else if (
            addTask.hasOwnProperty("due_date") &&
            addTask.due_date === ""
        ) {
            returnFlag = false;
        } else if (addTask.hasOwnProperty("mode") && addTask.mode === "") {
            returnFlag = false;
        } else if (addTask.hasOwnProperty("title") && addTask.title === "") {
            returnFlag = false;
        } else if (addTask.hasOwnProperty("client") && addTask.client === "") {
            returnFlag = false;
        } else if (
            addTask.hasOwnProperty("workArea") &&
            addTask.workArea === ""
        ) {
            returnFlag = false;
        } else if (
            addTask.hasOwnProperty("remarks") &&
            addTask.remarks === ""
        ) {
            returnFlag = false;
        } else if (
            addTask.hasOwnProperty("budget_time") &&
            addTask.budget_time === ""
        ) {
            returnFlag = false;
        } else if (
            addTask.hasOwnProperty("priority") &&
            addTask.priority === ""
        ) {
            returnFlag = false;
        } else if (
            addTask.hasOwnProperty("billable") &&
            addTask.billable === ""
        ) {
            returnFlag = false;
        } else if (
            addTask.hasOwnProperty("assigned_to") &&
            addTask.assigned_to === ""
        ) {
            returnFlag = false;
        }

        console.log(returnFlag);
        return returnFlag;
    };

    const handleAddTask = () => {
        if (!validate()) {
            toast.error("Please set mandatory fields", {
                position: toast.POSITION.TOP_RIGHT,
            });

            return false;
        } else {
            // Read all existing task from `localStorage`
            const taskList = localStorage.getItem("task");

            // set timer
            const timer = {} as TaskTimer;
            timer.state = TimerOpts.stop;
            timer.time = 0;
            addTask.timer = timer;
            addTask.actual_time = addTask.budget_time;

            let allTask =
                taskList && taskList.length > 0 ? JSON.parse(taskList) : [];
            addTask._id =
                allTask && allTask.length > 0 ? allTask.length + 1 : 1;
            allTask.push(addTask);

            console.log("ALL TASK", allTask);

            // Save to DB
            try {
                api.createTask(addTask).then((resp: any) => {
                    // Set Task to `localStorage`
                    localStorage.setItem("task", JSON.stringify(allTask));
                    toast.success("Successfully Created Task", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                });
            } catch (ex) {
                toast.error("Technical error while creating Task", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }
    };

    const updateSubComponents = (subTasks: AddSubTask[]) => {
        addTask.subTask = subTasks.map((subTaskItem: AddSubTask) => {
            return {
                title: subTaskItem.title,
                status: "pending",
                budget_time: subTaskItem.budget_time,
                actual_time: " ",
                remarks: subTaskItem.remarks,
                priority: subTaskItem.priority,
                workArea: subTaskItem.workArea,
                client: subTaskItem.client,
                assigned_to: subTaskItem.assigned_to,
                dataPath: subTaskItem.dataPath,
                attachments: [], //TODO: once attachement available then implement this
                mode: " ",
                comments: [],
            };
        });
    };

    const handleInputKeyDown = () => {
        if (selectModeRef.current) {
            // selectModeRef.current.blur();
            console.log(selectModeRef.current);
        }
    };

    // render
    return (
        <>
            <div className="add-task-header">
                <ToastContainer autoClose={25000} />
                <div>
                    <Title level={5}>Add Task</Title>
                </div>
                <div className="add-task-cancel">
                    <Button
                        type="primary"
                        danger
                        icon={<CloseOutlined />}
                        onClick={cancelNewTaskHandler}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
            <Form
                form={form}
                initialValues={{
                    start_date: dayjs(),
                }}
            >
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
                            name="start_date"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select start date.",
                                },
                            ]}
                        >
                            <DatePicker
                                placeholder="Start Date"
                                name="start_date"
                                format={dateFormat}
                                className="w100"
                                onChange={(date, dateString) => {
                                    inputChangeHandler(
                                        dateString,
                                        "start_date"
                                    );
                                }}
                                onPanelChange={() => {}}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
                            name="due_date"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select due date.",
                                },
                            ]}
                        >
                            <DatePicker
                                placeholder="Due Date"
                                name="due_date"
                                //value={addTask.dueDate}
                                onChange={(date, dateString) => {
                                    inputChangeHandler(dateString, "due_date");
                                }}
                                className="w100"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
                            name="mode"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select task mode.",
                                },
                            ]}
                        >
                            <Select
                                ref={selectModeRef}
                                allowClear
                                placeholder="Select Task Mode"
                                options={modeOptions}
                                onChange={(value, event) => {
                                    inputChangeHandler(event);
                                }}
                                value={addTask.mode}
                                onInputKeyDown={(event) => {
                                    if (event.keyCode === 9) {
                                        // console.log(event.keyCode, event);
                                        // inputChangeHandler(event);
                                        handleInputKeyDown();
                                    }
                                }}
                                // onBlur={(event) => {
                                //     console.log("onBlur", event.target);
                                // }}
                                className="w100"
                            ></Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 16 }}>
                        <Form.Item
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter title.",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Task"
                                name="title"
                                value={addTask.title}
                                onChange={(event) => {
                                    inputChangeHandler(event);
                                }}
                                className="w100"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
                            name="workArea"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select work area.",
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                placeholder="Select Work Area"
                                options={workAreaOpts}
                                value={addTask.workArea}
                                className="w100"
                                onChange={(value, event) => {
                                    inputChangeHandler(event);
                                }}
                            ></Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        <Form.Item
                            name="remarks"
                            rules={[
                                {
                                    required: true,
                                    message: "Please entre remark.",
                                },
                            ]}
                        >
                            <ReactQuill
                                theme="snow"
                                value={addTask.remarks}
                                placeholder="Remark"
                                onChange={(event) => {
                                    inputChangeHandler(event, "remarks");
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
                            name="budget_time"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select budget time.",
                                },
                            ]}
                        >
                            <TimePicker
                                placeholder="Budget Time"
                                name="budget_time"
                                onChange={(date, dateString) => {
                                    inputChangeHandler(
                                        dateString,
                                        "budget_time"
                                    );
                                }}
                                className="w100"
                                format={"HH:mm"}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
                            name="priority"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select priority.",
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                placeholder="Priority"
                                options={priorityOpts}
                                value={addTask.priority}
                                onChange={(value, event) => {
                                    inputChangeHandler(event);
                                }}
                                className="w100"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
                            name="billable"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select billable.",
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                placeholder="Billable"
                                value={addTask.billable}
                                options={chargesOpts}
                                onChange={(value, event) => {
                                    inputChangeHandler(event);
                                }}
                                className="w100"
                            ></Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
                            name="client"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select client.",
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder="Client"
                                value={addTask.client}
                                options={clientOpts}
                                onChange={(value, event) => {
                                    inputChangeHandler(event);
                                }}
                                className="w100"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
                            name="assigned_to"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select assignee.",
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder="Assign Person"
                                value={addTask.assigned_to}
                                options={assigneeOpts}
                                onChange={(value, event) => {
                                    inputChangeHandler(event);
                                }}
                                // onInputKeyDown={(event) => {
                                //     if (event.keyCode === 9) {
                                //         console.log(event.keyCode);
                                //     }
                                // }}
                                className="w100"
                            ></Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }}>
                        <Upload showUploadList={{ showPreviewIcon: true }}>
                            <Button type="primary">Attach Files</Button>
                        </Upload>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 20 }}>
                        <Input
                            placeholder="Data Path"
                            name="datapath"
                            defaultValue={addTask.dataPath}
                            onChange={(event) => {
                                inputChangeHandler(event);
                            }}
                            className="w100"
                        />
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Divider />
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col>
                        <Title level={5}>Sub Task</Title>
                    </Col>
                    <Col>
                        <Switch onChange={onSwitchSubTask}></Switch>
                    </Col>
                </Row>

                <Row
                    gutter={[8, 8]}
                    className={"form-row " + (!showSubTask ? "hide" : "")}
                >
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        <SubTask subComponentsHandler={updateSubComponents} />
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Button
                        htmlType="submit"
                        type="primary"
                        className="w100"
                        onClick={handleAddTask}
                    >
                        Add Task
                    </Button>
                </Row>
            </Form>
        </>
    );
};

export default AddTask;
