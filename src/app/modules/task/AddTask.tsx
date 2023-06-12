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
} from "../../components/utilities/utility";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AddTask as IAddTask, SubTask as ISubTask } from "./interfaces/ITask";
import "./AddTask.scss";
const { Title } = Typography;

dayjs.extend(weekday);
dayjs.extend(localeData);

const AddTask = () => {
    const dateFormat = "YYYY-MM-DD";
    const addTaskObj = {
        status: "Pending",
        startDate: dayjs().toString(),
    } as IAddTask;
    const navigate = useNavigate();
    const selectModeRef = useRef(null);

    // local states
    const [showSubTask, setShowSubTask] = useState<boolean>(false);
    const [addTask, setAddTask] = useState<IAddTask>(addTaskObj);

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

        console.log(name, value);

        setAddTask({
            ...addTask,
            [name]: value,
        });
    };

    const handleAddTask = () => {
        console.log(addTask);

        // Read all existing task from `localStorage`
        const taskList = localStorage.getItem("task");
        const tasks = taskList != null ? [JSON.parse(taskList)] : [];
        const allTask = [...tasks, addTask];

        // Set Task to `localStorage`
        localStorage.setItem("task", JSON.stringify(allTask));
    };

    const updateSubComponents = (subTasks: ISubTask[]) => {
        addTask.subTask = subTasks;
        console.log("list of subTasks", subTasks);
    };

    const handleInputKeyDown = () => {
        if (selectModeRef.current) {
            // selectModeRef.current.blur();
            console.log(selectModeRef.current);
        }
    };

    return (
        <>
            <div className="add-task-header">
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
            <Form>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <DatePicker
                            placeholder="Start Date"
                            name="startDate"
                            //value={addTask.startDate}
                            defaultValue={dayjs()}
                            format={dateFormat}
                            className="w100"
                            onChange={(date, dateString) => {
                                inputChangeHandler(dateString, "startDate");
                            }}
                            onPanelChange={() => {}}
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <DatePicker
                            placeholder="Due Date"
                            name="dueDate"
                            //value={addTask.dueDate}
                            onChange={(date, dateString) => {
                                inputChangeHandler(dateString, "dueDate");
                            }}
                            className="w100"
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
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
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 16 }}>
                        <Input
                            placeholder="Task"
                            name="task"
                            value={addTask.title}
                            onChange={(event) => {
                                inputChangeHandler(event);
                            }}
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
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
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        {/* <Input
                            placeholder="Remark"
                            name="remark"
                            onChange={(event) => {
                                inputChangeHandler(event);
                            }}
                        /> */}
                        <ReactQuill
                            theme="snow"
                            value={addTask.remark}
                            placeholder="Remark"
                            onChange={(event) => {
                                inputChangeHandler(event, "remark");
                            }}
                        />
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <TimePicker
                            placeholder="Budget Time"
                            name="budgetTime"
                            onChange={(date, dateString) => {
                                inputChangeHandler(dateString, "budgetTime");
                            }}
                            className="w100"
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
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
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
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
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
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
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Select
                            allowClear
                            showSearch
                            placeholder="Assign Person"
                            value={addTask.assignee}
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
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }}>
                        <Upload>
                            <Button type="primary">Attach Files</Button>
                        </Upload>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 20 }}>
                        <Input
                            placeholder="Data Path"
                            name="dataPath"
                            value={addTask.dataPath}
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
