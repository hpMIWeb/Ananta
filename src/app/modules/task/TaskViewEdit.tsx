import React, { useState, useEffect } from "react";
import {
    Select,
    Form,
    Row,
    Col,
    Divider,
    Typography,
    DatePicker,
    TimePicker,
    Input,
    Button,
    Collapse,
    Tag,
} from "antd";
import type { CollapseProps } from "antd";
import {
    assigneeOpts,
    capitalize,
    dateFormat,
    priorityOpts,
    statusList,
} from "../../utilities/utility";
import parse from "html-react-parser";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import Comments from "../../components/Comments/Comments";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AddTask, SaveComment, SubTask } from "./interfaces/ITask";

import {
    faEdit,
    faExpandArrowsAlt,
    faCompressArrowsAlt,
    faXmark,
    faClock,
    faCommentDots,
    faSave,
} from "@fortawesome/free-solid-svg-icons";
import Stopwatch from "../../components/Stockwatch/Stopwatch";
import { ToastContainer, toast } from "react-toastify";
import api from "../../utilities/apiServices";
import SubTaskViewEdit from "./SubTaskViewEdit";
import "./TaskViewEdit.scss";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
const { Title } = Typography;

dayjs.extend(customParseFormat);

const TaskViewEdit = (props: any) => {
    const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);
    const [updateTask, setUpdateTask] = useState<AddTask>(
        props.tableRowSelected
    );
    const [taskComments, setTaskComments] = useState<Comment>(
        props.tableRowSelected.comments
    );
    const [taskSubTasks, setTaskSubTasks] = useState<SubTask[]>(
        props.tableRowSelected.subtask ?? []
    );

    const fullScreenModeToggle = () => {
        if (props.handleScreenMode) {
            props.handleScreenMode();
        }
    };

    useEffect(() => {
        setUpdateTask(props.tableRowSelected);
        setTaskSubTasks(props.tableRowSelected.subtask);
        setTaskComments(props.tableRowSelected.comments);
    }, [props.tableRowSelected]);

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

        setUpdateTask({
            ...updateTask,
            [name]: value,
        });
    };

    const dividerRow = () => {
        return (
            <Row gutter={[8, 8]} className="form-row">
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                    <Divider />
                </Col>
            </Row>
        );
    };

    const getRemark = () => {
        if (updateTask.remarks) {
            return parse(updateTask.remarks);
        } else {
            return "";
        }
    };

    const editClickHandler = () => {
        setIsEdit(!isEdit);
    };

    // event handler from `stopwatch` action - play & stop
    const handleTaskStatus = (isRunning: boolean) => {
        const taskUpdate = {} as AddTask;
        taskUpdate.status = isRunning ? "in_progress" : "complete";

        api.updateTask(updateTask._id, taskUpdate).then((resp: any) => {
            toast.success("Successfully Updated Task", {
                position: toast.POSITION.TOP_RIGHT,
            });
            if (props.handleListUpdate) props.handleListUpdate();
        });
    };

    const priorityChangeHandler = (event: any, value: string) => {
        console.log("Priority change - ", event);

        const taskUpdate = {} as AddTask;
        taskUpdate.priority = value;

        api.updateTask(updateTask._id, taskUpdate).then((resp: any) => {
            toast.success("Successfully Updated Task", {
                position: toast.POSITION.TOP_RIGHT,
            });
            if (props.handleListUpdate) props.handleListUpdate();
        });
    };

    const statusChangeHandler = (event: any, value: string) => {
        const taskUpdate = {} as AddTask;
        taskUpdate.status = value;

        if (value !== "" && value !== undefined) {
            api.updateTask(updateTask._id, taskUpdate).then((resp: any) => {
                toast.success("Successfully Updated Task", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                if (props.handleListUpdate) props.handleListUpdate();
            });
        } else {
            toast.error("Status should not blank", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const addCommentHandler = (comment: string) => {
        const addComment = {} as SaveComment;
        addComment.comment = comment;
        addComment.taskId = updateTask._id;

        api.addTaskComment(addComment)
            .then((resp: any) => {
                toast.success("Successfully added comment", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setTaskComments(resp.data.comments);
            })
            .catch((error: any) => {
                const msg = JSON.parse(error.response.data).message;
                toast.error(msg, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    const editCommentHandler = (
        commentId: string,
        parentId: string,
        comment: string
    ) => {
        const updateComment = {} as SaveComment;
        updateComment.commentId = commentId;
        updateComment.comment = comment;
        updateComment.taskId = parentId;

        api.updateTaskComment(updateComment)
            .then((resp: any) => {
                toast.success("Successfully updated comment", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setTaskComments(resp.data.comments);
            })
            .catch((error: any) => {
                const msg = JSON.parse(error.response.data).message;
                toast.error(msg, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    const deleteCommentHandler = (commentId: string, parentId: string) => {
        api.deleteTaskComment(updateTask._id, commentId)
            .then((resp: any) => {
                toast.success("Successfully deleted comment", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setTaskComments(resp.data.comments);
            })
            .catch((error: any) => {
                const msg = JSON.parse(error.response.data).message;
                toast.error(msg, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    const handleUpdateTask = () => {
        console.log("Update task", updateTask);

        api.updateTask(updateTask._id, updateTask).then((resp: any) => {
            toast.success("Successfully Updated Task", {
                position: toast.POSITION.TOP_RIGHT,
            });
            setIsEdit(false);
            if (props.handleListUpdate) props.handleListUpdate();
        });
    };

    return (
        <>
            <div
                style={{
                    display:
                        Object.keys(updateTask).length > 0 ? "block" : "none",
                }}
            >
                <ToastContainer />
                <Form style={{ padding: "15px 0 0 0" }}>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: props.fullScreenMode ? 17 : 20 }}
                        >
                            {!isEdit && (
                                <Title level={4} style={{ textAlign: "left" }}>
                                    {updateTask.title}
                                </Title>
                            )}
                            {isEdit && (
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
                                        defaultValue={updateTask.title}
                                        onChange={(event) => {
                                            inputChangeHandler(event);
                                        }}
                                    />
                                </Form.Item>
                            )}
                        </Col>
                        {props.fullScreenMode && (
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 5 }}
                            >
                                <Title level={4} style={{ textAlign: "right" }}>
                                    {capitalize(updateTask.client)}
                                </Title>
                            </Col>
                        )}
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: props.fullScreenMode ? 2 : 4 }}
                        >
                            <FontAwesomeIcon
                                icon={
                                    props.fullScreenMode
                                        ? faCompressArrowsAlt
                                        : faExpandArrowsAlt
                                }
                                onClick={fullScreenModeToggle}
                                style={{
                                    fontSize: "20px",
                                    color: "#2c7be5",
                                    float: "right",
                                    cursor: "pointer",
                                }}
                                title={
                                    "Click here to" +
                                    (props.fullScreenMode
                                        ? "minimize"
                                        : "maximize")
                                }
                            />
                            {props.fullScreenMode && (
                                <>
                                    <FontAwesomeIcon
                                        icon={isEdit ? faXmark : faEdit}
                                        style={{
                                            fontSize: isEdit ? "25px" : "20px",
                                            color: "#2c7be5",
                                            cursor: "pointer",
                                            marginRight: "15px",
                                            float: "right",
                                            marginTop: isEdit ? "-3px" : "0",
                                        }}
                                        title={
                                            "Click here to " +
                                            (isEdit ? "cancel" : "edit")
                                        }
                                        onClick={editClickHandler}
                                    />
                                    {isEdit && (
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            style={{
                                                fontSize: "20px",
                                                color: "#2c7be5",
                                                cursor: "pointer",
                                                marginRight: "15px",
                                                float: "right",
                                                marginTop: "0",
                                            }}
                                            title={"Click here to Save"}
                                            onClick={handleUpdateTask}
                                        />
                                    )}
                                </>
                            )}
                        </Col>
                    </Row>
                    {dividerRow()}
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 12 }}
                            md={{ span: 16 }}
                            lg={{ span: props.fullScreenMode ? 14 : 10 }}
                        >
                            <div className="timerbuttons">
                                {taskSubTasks && taskSubTasks.length <= 0 && (
                                    <Stopwatch
                                        taskId={updateTask._id}
                                        handleTaskStatus={handleTaskStatus}
                                    />
                                )}
                                {taskSubTasks && taskSubTasks.length > 0 && (
                                    <span className="stopwatch-time">
                                        00:
                                        {"00".toString().padStart(2, "0")}:
                                        {"00".toString().padStart(2, "0")}:
                                        {"00".toString().padStart(2, "0")}
                                    </span>
                                )}
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 6 }}
                            md={{ span: 4 }}
                            lg={{ span: props.fullScreenMode ? 5 : 7 }}
                        >
                            {!isEdit && (
                                <>
                                    <Title
                                        level={4}
                                        style={{
                                            textAlign: "right",
                                            marginRight: "30px",
                                        }}
                                        className={`text-priority ${
                                            updateTask.priority === "high"
                                                ? "blink"
                                                : ""
                                        }`}
                                    >
                                        {capitalize(updateTask.priority)}
                                    </Title>
                                </>
                            )}
                            {isEdit && (
                                <Select
                                    allowClear
                                    placeholder="Select Priority"
                                    options={priorityOpts}
                                    defaultValue={updateTask.priority}
                                    className="w100"
                                    onChange={(value, event) => {
                                        priorityChangeHandler(event, value);
                                    }}
                                />
                            )}
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 6 }}
                            md={{ span: 4 }}
                            lg={{ span: props.fullScreenMode ? 5 : 7 }}
                        >
                            <Select
                                allowClear
                                placeholder="Select Status"
                                options={statusList}
                                defaultValue={updateTask.status}
                                className="w100"
                                onChange={(value, event) => {
                                    statusChangeHandler(event, value);
                                }}
                            />
                        </Col>
                    </Row>
                    {dividerRow()}
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 5 }}
                            md={{ span: props.fullScreenMode ? 4 : 12 }}
                        >
                            Assigned To
                            <div>
                                {!isEdit && <b>{updateTask.assigned_to}</b>}
                                {isEdit && (
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Assign Person"
                                        defaultValue={updateTask.assigned_to}
                                        options={assigneeOpts}
                                        className="w100"
                                        onChange={(value, event) => {
                                            inputChangeHandler(event);
                                        }}
                                    ></Select>
                                )}
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 6 }}
                            md={{ span: props.fullScreenMode ? 6 : 12 }}
                        >
                            Assigned Date
                            <div>
                                {!isEdit && (
                                    <b>
                                        <CalendarOutlined
                                            style={{
                                                color: "#2c7be5",
                                                marginRight: "10px",
                                            }}
                                        />
                                        {dayjs(updateTask.start_date).format(
                                            "YYYY-MM-DD, HH:mm A"
                                        )}
                                    </b>
                                )}

                                {isEdit && (
                                    <DatePicker
                                        placeholder="Start Date"
                                        name="start_date"
                                        defaultValue={dayjs(
                                            updateTask.start_date
                                        )}
                                        className="w100"
                                        // format={dateFormat}
                                        // className="w100"
                                        onChange={(date, dateString) => {
                                            inputChangeHandler(
                                                dateString,
                                                "start_date"
                                            );
                                        }}
                                        onPanelChange={() => {}}
                                    />
                                )}
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 5 }}
                            md={{ span: props.fullScreenMode ? 6 : 12 }}
                        >
                            Due Date
                            <div>
                                {!isEdit && (
                                    <b>
                                        <CalendarOutlined
                                            style={{
                                                color: "#2c7be5",
                                                marginRight: "10px",
                                            }}
                                        />
                                        {dayjs(updateTask.due_date).format(
                                            "YYYY-MM-DD, HH:mm A"
                                        )}
                                    </b>
                                )}
                                {isEdit && (
                                    <DatePicker
                                        placeholder="Due Date"
                                        name="due_date"
                                        defaultValue={dayjs(
                                            updateTask.due_date
                                        )}
                                        format={dateFormat}
                                        onPanelChange={() => {}}
                                        className="w100"
                                        onChange={(date, dateString) => {
                                            inputChangeHandler(
                                                dateString,
                                                "due_date"
                                            );
                                        }}
                                    />
                                )}
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 4 }}
                            md={{ span: props.fullScreenMode ? 4 : 12 }}
                        >
                            Budget Time
                            <div>
                                {!isEdit && (
                                    <b>
                                        <ClockCircleOutlined
                                            style={{
                                                color: "#2c7be5",
                                                marginRight: "10px",
                                            }}
                                        />
                                        {updateTask.budget_time}
                                    </b>
                                )}
                                {isEdit && (
                                    <TimePicker
                                        placeholder="Budget Time"
                                        name="budget_time"
                                        defaultValue={dayjs(
                                            updateTask.budget_time,
                                            "HH:mm"
                                        )}
                                        format={"HH:mm"}
                                        onChange={(date, dateString) => {
                                            inputChangeHandler(
                                                dateString,
                                                "budget_time"
                                            );
                                        }}
                                        className="w100"
                                    />
                                )}
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 4 }}
                            md={{ span: props.fullScreenMode ? 4 : 12 }}
                        >
                            Actual Time
                            <div>
                                {
                                    <b>
                                        <ClockCircleOutlined
                                            style={{
                                                color: "#2c7be5",
                                                marginRight: "10px",
                                            }}
                                        />
                                        {updateTask.actual_time.trim() === ""
                                            ? "00:00"
                                            : ""}
                                    </b>
                                }
                                {/* {isEdit && (
                                    <TimePicker
                                        placeholder="Actual Time"
                                        name="actual_time"
                                        defaultValue={dayjs(
                                            updateTask.actual_time,
                                            "HH:mm"
                                        )}
                                        format={"HH:mm"}
                                        onChange={(date, dateString) => {
                                            inputChangeHandler(
                                                dateString,
                                                "budget_time"
                                            );
                                        }}
                                        className="w100"
                                    />
                                )} */}
                            </div>
                        </Col>
                        {!props.fullScreenMode && (
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 4 }}
                                md={{ span: props.fullScreenMode ? 4 : 12 }}
                            >
                                Client
                                <div>{<b>{updateTask.client.trim()}</b>}</div>
                            </Col>
                        )}
                    </Row>
                    <Row
                        gutter={[8, 8]}
                        className="form-row"
                        style={{
                            border: "1px solid #d8e2ef",
                            padding: "15px",
                            marginTop: "20px",
                        }}
                    >
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        >
                            {!isEdit && getRemark()}
                            {isEdit && (
                                <ReactQuill
                                    theme="snow"
                                    value={updateTask.remarks}
                                    placeholder="Remark"
                                    onChange={(event) => {
                                        inputChangeHandler(event, "remarks");
                                    }}
                                />
                            )}
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        >
                            <Title level={4} style={{ textAlign: "left" }}>
                                Attachments
                            </Title>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        >
                            <Title level={4} style={{ textAlign: "left" }}>
                                Sub-tasks
                            </Title>
                            {taskSubTasks.length > 0 && (
                                <Collapse accordion expandIconPosition="right">
                                    {taskSubTasks.map(
                                        (
                                            subTaskItem: SubTask,
                                            index: number
                                        ) => {
                                            return (
                                                <CollapsePanel
                                                    header={
                                                        <div className="sub-task-header">
                                                            <div>
                                                                <span
                                                                    style={{
                                                                        marginRight:
                                                                            "10px",
                                                                    }}
                                                                >
                                                                    {index + 1}.
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="task-header-cell"
                                                                style={{
                                                                    flex: props.fullScreenMode
                                                                        ? 5
                                                                        : 14,
                                                                }}
                                                            >
                                                                {
                                                                    subTaskItem.title
                                                                }
                                                            </div>
                                                            {props.fullScreenMode && (
                                                                <div className="task-header-cell">
                                                                    {
                                                                        subTaskItem.assigned_to
                                                                    }
                                                                </div>
                                                            )}
                                                            {props.fullScreenMode && (
                                                                <div className="task-header-cell">
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faClock
                                                                        }
                                                                        className="timer-play"
                                                                        style={{
                                                                            marginRight:
                                                                                "10px",
                                                                        }}
                                                                    />
                                                                    {
                                                                        subTaskItem.budget_time
                                                                    }
                                                                </div>
                                                            )}
                                                            <div
                                                                className="task-header-cell"
                                                                style={{
                                                                    flex: props.fullScreenMode
                                                                        ? 1
                                                                        : 2,
                                                                }}
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faCommentDots
                                                                    }
                                                                    className="timer-play"
                                                                    style={{
                                                                        marginRight:
                                                                            "10px",
                                                                    }}
                                                                />
                                                                {subTaskItem.comments
                                                                    ? subTaskItem
                                                                          .comments
                                                                          .length
                                                                    : 0}
                                                            </div>
                                                            <div className="task-header-cell">
                                                                {props.fullScreenMode && (
                                                                    <Tag
                                                                        color={
                                                                            "red"
                                                                        }
                                                                        style={{
                                                                            fontWeight:
                                                                                "500",
                                                                            fontSize:
                                                                                "12px",
                                                                        }}
                                                                    >
                                                                        {capitalize(
                                                                            subTaskItem.status
                                                                        )}
                                                                    </Tag>
                                                                )}
                                                            </div>
                                                            <div
                                                                className={`task-header-cell ${
                                                                    props.fullScreenMode
                                                                        ? ""
                                                                        : "task_priorty"
                                                                } ${
                                                                    subTaskItem.priority
                                                                } ${
                                                                    subTaskItem.priority ===
                                                                    "high"
                                                                        ? "blink"
                                                                        : ""
                                                                }`}
                                                            >
                                                                {props.fullScreenMode
                                                                    ? capitalize(
                                                                          subTaskItem.priority
                                                                      )
                                                                    : " "}
                                                            </div>
                                                        </div>
                                                    }
                                                    key={subTaskItem._id}
                                                >
                                                    <SubTaskViewEdit
                                                        key={subTaskItem._id}
                                                        tableRowSelected={
                                                            subTaskItem
                                                        }
                                                        isEdit={isEdit}
                                                        parentId={
                                                            updateTask._id
                                                        }
                                                    />
                                                </CollapsePanel>
                                            );
                                        }
                                    )}
                                </Collapse>
                            )}
                            {taskSubTasks.length <= 0 && (
                                <Title
                                    style={{
                                        textAlign: "left",
                                        fontSize: "12px",
                                        fontWeight: "normal",
                                        textIndent: "5px",
                                    }}
                                >
                                    No Sub Tasks
                                </Title>
                            )}
                        </Col>
                    </Row>
                    {!isEdit && (
                        <Row gutter={[8, 8]} className="form-row">
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 24 }}
                            >
                                <Title level={4} style={{ textAlign: "left" }}>
                                    Comments
                                </Title>
                                <Comments
                                    comments={taskComments}
                                    parentId={updateTask._id}
                                    addComment={addCommentHandler}
                                    editComment={editCommentHandler}
                                    deleteComment={deleteCommentHandler}
                                />
                            </Col>
                        </Row>
                    )}
                    <Row gutter={[8, 8]} className="form-row">
                        <div style={{ height: "30px" }}></div>
                    </Row>
                </Form>
            </div>
        </>
    );
};
export default TaskViewEdit;
