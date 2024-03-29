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
    Avatar,
    Tooltip,
} from "antd";
import type { CollapseProps } from "antd";
import {
    Status,
    assigneeOpts,
    capitalize,
    dateFormat,
    getTotalTime,
    priorityOpts,
    statusColors,
    statusList,
    upperText,
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

    const [currentCollapse, setCurrentCollapse] = useState<string>("");

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

    const updateCurrentTask = (subTask: SubTask) => {
        if (subTask && taskSubTasks) {
            const newData = taskSubTasks.map((subTaskItem: SubTask) =>
                subTaskItem && subTaskItem._id === subTask._id
                    ? subTask
                    : subTaskItem
            );
            setTaskSubTasks(newData);
        }
    };

    const updateTaskList = (subTasks: SubTask[]) => {
        setTaskSubTasks(subTasks);
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
    const handleTaskStatus = (
        isRunning: boolean,
        time: string,
        isStop: boolean
    ) => {
        const taskUpdate = {} as AddTask;
        taskUpdate.status = isStop ? Status.completed : Status.in_progress;
        if (!isRunning) taskUpdate.actual_time = time;

        setUpdateTask({
            ...updateTask,
            ["status"]: taskUpdate.status,
        });

        api.updateTask(updateTask._id, taskUpdate).then((resp: any) => {
            toast.success("Successfully Updated Task", {
                position: toast.POSITION.TOP_RIGHT,
            });
            console.log("updateTask", updateTask);
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
            setUpdateTask({
                ...updateTask,
                ["status"]: taskUpdate.status,
            });
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
        updateTask.subtask = taskSubTasks;

        console.log("updateTask", updateTask);

        api.updateTask(updateTask._id, updateTask).then((resp: any) => {
            toast.success("Successfully Updated Task", {
                position: toast.POSITION.TOP_RIGHT,
            });
            setIsEdit(false);
            if (props.handleListUpdate) props.handleListUpdate();
        });
    };

    const collapseChangeHandler = (key: string | string[]) => {
        const selectedKey = key.length > 0 ? key[0] : "";
        setCurrentCollapse(selectedKey);
    };

    const subTaskHeader = (subTaskItem: any, index: number) => {
        return (
            <div className="sub-task-header">
                <div
                    style={{
                        marginRight: "10px",
                    }}
                >
                    {index + 1}.
                </div>
                <div
                    className="task-header-cell"
                    style={{
                        flex: props.fullScreenMode
                            ? index.toString() !== currentCollapse
                                ? 5
                                : 14
                            : 7,
                    }}
                >
                    {subTaskItem.title}
                </div>
                <div
                    className="task-header-cell"
                    style={{ flex: props.fullScreenMode ? 3 : 4 }}
                >
                    {subTaskItem &&
                        subTaskItem.client &&
                        subTaskItem.client.length > 0 &&
                        subTaskItem.client[0].client_name}
                </div>
                {props.fullScreenMode &&
                    index.toString() !== currentCollapse && (
                        <div className="task-header-cell">
                            <FontAwesomeIcon
                                icon={faClock}
                                className="timer-play"
                                style={{
                                    marginRight: "10px",
                                }}
                            />
                            {subTaskItem.budget_time}
                        </div>
                    )}
                {index.toString() !== currentCollapse && (
                    <div
                        className="task-header-cell"
                        style={{
                            flex: props.fullScreenMode ? 1 : 2,
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faCommentDots}
                            className="timer-play"
                            style={{
                                marginRight: "10px",
                            }}
                        />
                        {subTaskItem.comments ? subTaskItem.comments.length : 0}
                    </div>
                )}
                {index.toString() !== currentCollapse && (
                    <div className="task-header-cell">
                        {props.fullScreenMode && (
                            <Tag
                                color={statusColors(subTaskItem.status)}
                                style={{
                                    fontWeight: "500",
                                    fontSize: "12px",
                                }}
                            >
                                {upperText(subTaskItem.status)}
                            </Tag>
                        )}
                    </div>
                )}
                {index.toString() !== currentCollapse && (
                    <div
                        className={`task-header-cell ${
                            props.fullScreenMode ? "" : "task_priorty"
                        } ${subTaskItem.priority} ${
                            subTaskItem.priority === "high" ? "blink" : ""
                        }`}
                    >
                        {props.fullScreenMode
                            ? capitalize(subTaskItem.priority)
                            : " "}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            style={{
                display: Object.keys(updateTask).length > 0 ? "block" : "none",
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
                            md={{ span: 4 }}
                        >
                            {updateTask.client.length > 0 ? (
                                <Title level={4} style={{ textAlign: "right" }}>
                                    {capitalize(
                                        updateTask.client[0].client_name
                                    )}
                                </Title>
                            ) : (
                                <Title level={4} style={{ textAlign: "right" }}>
                                    No client available
                                </Title>
                            )}
                        </Col>
                    )}
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: props.fullScreenMode ? 3 : 4 }}
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
                                (props.fullScreenMode ? "minimize" : "maximize")
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
                                    parentId={updateTask._id}
                                    handleTaskStatus={handleTaskStatus}
                                    status={updateTask.status}
                                    label={"task"}
                                    showSeconds={true}
                                />
                            )}
                            {taskSubTasks && taskSubTasks.length > 0 && (
                                <span className="stopwatch-time">
                                    {getTotalTime(
                                        taskSubTasks.map((item: SubTask) => {
                                            return item.actual_time;
                                        })
                                    )}
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
                                        updateTask.priority
                                    } ${
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
                            value={updateTask.status}
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
                        <span className="dataLabel">Assigned To</span>
                        <div>
                            {!isEdit && (
                                <div className="assigneeContainer">
                                    <Avatar.Group
                                        maxCount={2}
                                        maxStyle={{
                                            color: "#f56a00",
                                            backgroundColor: "#fde3cf",
                                        }}
                                    >
                                        {updateTask.assigned_to.map(
                                            (assignee: any, index: any) => (
                                                <Tooltip
                                                    key={index}
                                                    title={assignee}
                                                >
                                                    <Avatar src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80" />
                                                </Tooltip>
                                            )
                                        )}
                                    </Avatar.Group>
                                </div>
                            )}
                            {isEdit && (
                                <Select
                                    mode="multiple"
                                    allowClear
                                    showSearch
                                    placeholder="Assign Person"
                                    options={assigneeOpts}
                                    defaultValue={updateTask.assigned_to}
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
                        <span className="dataLabel">Assigned Date</span>
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
                                    defaultValue={dayjs(updateTask.start_date)}
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
                        <span className="dataLabel">Due Date</span>
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
                                    defaultValue={dayjs(updateTask.due_date)}
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
                        <span className="dataLabel">Budget Time</span>
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
                                // <TimePicker
                                //     placeholder="Budget Time"
                                //     name="budget_time"
                                //     defaultValue={dayjs(
                                //         updateTask.budget_time,
                                //         "HH:mm"
                                //     )}
                                //     format={"HH:mm"}
                                //     onChange={(date, dateString) => {
                                //         inputChangeHandler(
                                //             dateString,
                                //             "budget_time"
                                //         );
                                //     }}
                                //     className="w100"
                                // />
                                <Input
                                    placeholder="Budget Time"
                                    name="budget_time"
                                    defaultValue={updateTask.budget_time}
                                    onChange={(event) => {
                                        inputChangeHandler(event);
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
                        <span className="dataLabel">Actual Time</span>
                        <div>
                            {
                                <b>
                                    <ClockCircleOutlined
                                        style={{
                                            color: "#2c7be5",
                                            marginRight: "10px",
                                        }}
                                    />
                                    {taskSubTasks &&
                                        taskSubTasks.length <= 0 &&
                                        updateTask.actual_time &&
                                        updateTask.actual_time.trim()}
                                    {taskSubTasks &&
                                        taskSubTasks.length > 0 && (
                                            <span>
                                                {getTotalTime(
                                                    taskSubTasks.map(
                                                        (item: SubTask) => {
                                                            return item.actual_time;
                                                        }
                                                    )
                                                )}
                                            </span>
                                        )}
                                </b>
                            }
                        </div>
                    </Col>
                    {!props.fullScreenMode && (
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 4 }}
                            md={{ span: props.fullScreenMode ? 4 : 12 }}
                        >
                            <span className="dataLabel">Client</span>
                            <div>
                                {
                                    <b>
                                        {updateTask.client &&
                                        updateTask.client.length > 0
                                            ? updateTask.client[0].client_name.trim()
                                            : ""}
                                    </b>
                                }
                            </div>
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
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
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
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        <Title level={5} style={{ textAlign: "left" }}>
                            Data Path
                        </Title>
                        <span>{updateTask.datapath}</span>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        <Title level={4} style={{ textAlign: "left" }}>
                            Attachments
                        </Title>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        <Title level={4} style={{ textAlign: "left" }}>
                            Sub-tasks
                        </Title>
                        {taskSubTasks.length > 0 && (
                            <Collapse
                                accordion
                                expandIconPosition="end"
                                onChange={collapseChangeHandler}
                            >
                                {taskSubTasks.map(
                                    (subTaskItem: SubTask, index: number) => {
                                        return (
                                            <CollapsePanel
                                                header={
                                                    !isEdit
                                                        ? subTaskHeader(
                                                              subTaskItem,
                                                              index
                                                          )
                                                        : subTaskItem.title
                                                }
                                                key={index}
                                            >
                                                <SubTaskViewEdit
                                                    key={subTaskItem._id}
                                                    tableRowSelected={
                                                        subTaskItem
                                                    }
                                                    isEdit={isEdit}
                                                    parentId={updateTask._id}
                                                    handleListUpdate={
                                                        updateTaskList
                                                    }
                                                    handleTaskUpdate={
                                                        updateCurrentTask
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
    );
};
export default TaskViewEdit;
