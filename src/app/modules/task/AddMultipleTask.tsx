import React, { useEffect, useState } from "react";
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
import {
    priorityOpts,
    chargesOpts,
    assigneeOpts,
    clientOpts,
    modeOptions,
    workAreaOpts,
} from "../../utilities/utility";
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

const AddMultipleTask = () => {
    const navigate = useNavigate();
    const dateFormat = "YYYY-MM-DD";

    const cancelNewTaskHandler = () => {
        navigate("/task");
    };

    const onSwitchSubTask = () => {
        //setShowSubTask(!showSubTask);
    };

    const handleAddTask = () => {
        // console.log(addTask);
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

        // setAddTask({
        //     ...addTask,
        //     [name]: value,
        // });
    };

    return (
        <>
            <div className="add-task-header">
                <div>
                    <Title level={5}>Add Multiple Tasks</Title>
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
                            allowClear
                            placeholder="Select Task Mode"
                            options={modeOptions}
                            onChange={(value, event) => {
                                inputChangeHandler(event);
                            }}
                            //value={addTask.mode}
                            onInputKeyDown={(event) => {
                                if (event.keyCode === 9) {
                                    console.log(event.keyCode, event);
                                }
                            }}
                            className="w100"
                        ></Select>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 16 }}>
                        <Input
                            placeholder="Task"
                            name="task"
                            // value={addTask.task}
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
                            // value={addTask.workArea}
                            className="w100"
                            onChange={(value, event) => {
                                inputChangeHandler(event);
                            }}
                        ></Select>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        <ReactQuill
                            theme="snow"
                            // value={addTask.remark}
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
                            format={"HH:mm"}
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Select
                            allowClear
                            placeholder="Priority"
                            options={priorityOpts}
                            // value={addTask.priority}
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
                            // value={addTask.billable}
                            options={chargesOpts}
                            onChange={(value, event) => {
                                inputChangeHandler(event);
                            }}
                            className="w100"
                        ></Select>
                    </Col>
                </Row>
                {/* <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Select
                            allowClear
                            showSearch
                            placeholder="Client"
                            // value={addTask.client}
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
                            // value={addTask.assignee}
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
                </Row> */}
                {/* <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }}>
                        <Upload>
                            <Button type="primary">Attach Files</Button>
                        </Upload>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 20 }}>
                        <Input
                            placeholder="Data Path"
                            name="dataPath"
                            // value={addTask.dataPath}
                            onChange={(event) => {
                                inputChangeHandler(event);
                            }}
                            className="w100"
                        />
                    </Col>
                </Row> */}
                <Row gutter={[8, 8]} className="form-row">
                    <Col>
                        <Title level={5}>Create new task for each client</Title>
                    </Col>
                    <Col>
                        <Switch
                            onChange={onSwitchSubTask}
                            size="small"
                        ></Switch>
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
                    <Col>
                        <Title
                            level={5}
                            style={{ opacity: 0.5, marginLeft: "10px" }}
                        >
                            Each client will be added as a Subtask.
                        </Title>
                    </Col>
                </Row>

                {/* <Row
                    gutter={[8, 8]}
                    className={"form-row " + (!showSubTask ? "hide" : "")}
                >
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        <SubTask subComponentsHandler={updateSubComponents} />
                    </Col>
                </Row> */}
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

export default AddMultipleTask;
