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
} from "antd";
import {
    Status,
    assigneeOpts,
    capitalize,
    dateFormat,
    priorityOpts,
    statusList,
} from "../../utilities/utility";
import parse from "html-react-parser";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import Comments from "../../components/Comments/Comments";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    AddTask,
    SaveComment,
    SubTask,
    UpdateSubTask,
} from "./interfaces/ITask";
import Stopwatch from "../../components/Stockwatch/Stopwatch";
import { ToastContainer, toast } from "react-toastify";
import api from "../../utilities/apiServices";

const { Title } = Typography;
dayjs.extend(customParseFormat);

const SubTaskViewEdit = (props: any) => {
    const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);
    const [parentId, setParentId] = useState(props.parentId);
    const [updateSubTask, setUpdateSubTask] = useState<UpdateSubTask>(
        props.tableRowSelected
    );
    const [taskComments, setTaskComments] = useState<Comment>(
        (props.tableRowSelected && props.tableRowSelected.comments) ?? []
    );

    useEffect(() => {
        setIsEdit(props.isEdit);
    }, [props.isEdit]);

    useEffect(() => {
        setUpdateSubTask(props.tableRowSelected);
        setTaskComments(props.tableRowSelected.comments);
    }, [props.tableRowSelected]);

    useEffect(() => {
        setParentId(props.parentId);
    }, [props.parentId]);

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

        const taskUpdate = {} as SubTask;
        taskUpdate.status = value;
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
        if (updateSubTask.remarks) {
            return parse(updateSubTask.remarks);
        } else {
            return "";
        }
    };

    const handleUpdateTask = () => {
        console.log("Update task", updateSubTask);

        api.updateSubTask(updateSubTask._id, updateSubTask).then(
            (resp: any) => {
                toast.success("Successfully Updated Task", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setIsEdit(false);
                if (props.handleListUpdate) props.handleListUpdate();
            }
        );
    };

    const priorityChangeHandler = (event: any, value: string) => {
        console.log("Priority change - ", event);

        const taskUpdate = {} as UpdateSubTask;
        taskUpdate.priority = value;
        // taskUpdate._id = updateTask._id;
        taskUpdate.taskId = parentId;

        api.updateSubTask(updateSubTask._id, taskUpdate).then((resp: any) => {
            toast.success("Successfully Updated Task", {
                position: toast.POSITION.TOP_RIGHT,
            });
            // render updated tasks
            if (resp.data.subtask && props.handleListUpdate) {
                props.handleListUpdate(resp.data.subtask);
            }
        });
    };

    const statusChangeHandler = (event: any, value: string) => {
        console.log("Status change - ", event);

        const taskUpdate = {} as UpdateSubTask;
        taskUpdate.status = value;
        taskUpdate.taskId = parentId;

        api.updateSubTask(updateSubTask._id, taskUpdate).then((resp: any) => {
            toast.success("Successfully Updated Task", {
                position: toast.POSITION.TOP_RIGHT,
            });

            // render updated tasks
            if (resp.data.subtask && props.handleListUpdate) {
                props.handleListUpdate(resp.data.subtask);
            }
        });
    };

    const addCommentHandler = (comment: string) => {
        const addComment = {} as SaveComment;
        addComment.comment = comment;
        addComment.taskId = updateSubTask._id;
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
        api.deleteTaskComment(updateSubTask._id, commentId)
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

    // event handler from `stopwatch` action - play & stop
    const handleTaskStatus = (
        isRunning: boolean,
        time: string,
        isStop: boolean
    ) => {
        const taskUpdate = {} as UpdateSubTask;
        taskUpdate.taskId = parentId;
        taskUpdate.status = isStop ? Status.completed : Status.in_progress;
        if (!isRunning) taskUpdate.actual_time = time;

        api.updateSubTask(updateSubTask._id, taskUpdate).then((resp: any) => {
            toast.success("Successfully Updated Sub Task", {
                position: toast.POSITION.TOP_RIGHT,
            });

            // render updated tasks
            if (resp.data.subtask && props.handleListUpdate) {
                props.handleListUpdate(resp.data.subtask);
            }
        });
    };

    return (
        <>
            <div
                style={{
                    display:
                        Object.keys(updateSubTask).length > 0
                            ? "block"
                            : "none",
                }}
            >
                <ToastContainer />

                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 20 }}>
                        {!isEdit && (
                            <Title level={5} style={{ textAlign: "left" }}>
                                {updateSubTask.title}
                            </Title>
                        )}
                        {isEdit && (
                            <Input
                                placeholder="Task"
                                name="task"
                                defaultValue={updateSubTask.title}
                            />
                        )}
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }}>
                        <Title level={5} style={{ textAlign: "right" }}>
                            {capitalize(updateSubTask.assigned_to)}
                        </Title>
                    </Col>
                </Row>
                {dividerRow()}
                <Row gutter={[8, 8]} className="form-row">
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 12 }}
                        md={{ span: 16 }}
                        lg={{ span: 14 }}
                    >
                        <div className="timerbuttons">
                            <Stopwatch
                                taskId={updateSubTask._id}
                                handleTaskStatus={handleTaskStatus}
                                status={updateSubTask.status}
                                showSeconds={true}
                            />
                        </div>
                    </Col>
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 6 }}
                        md={{ span: 4 }}
                        lg={{ span: 5 }}
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
                                        updateSubTask.priority === "high"
                                            ? "blink"
                                            : ""
                                    }`}
                                >
                                    {capitalize(updateSubTask.priority)}
                                </Title>
                            </>
                        )}
                        {isEdit && (
                            <Select
                                allowClear
                                placeholder="Select Priority"
                                options={priorityOpts}
                                defaultValue={updateSubTask.priority}
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
                        lg={{ span: 5 }}
                    >
                        <Select
                            allowClear
                            placeholder="Select Status"
                            options={statusList}
                            defaultValue={updateSubTask.status}
                            value={props.tableRowSelected.status}
                            className="w100"
                            onChange={(value, event) => {
                                statusChangeHandler(event, value);
                            }}
                        />
                    </Col>
                </Row>
                {dividerRow()}
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 5 }} md={{ span: 4 }}>
                        Assigned To
                        <div>
                            {!isEdit && <b>{updateSubTask.assigned_to}</b>}
                            {isEdit && (
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder="Assign Person"
                                    defaultValue={updateSubTask.assigned_to}
                                    options={assigneeOpts}
                                    className="w100"
                                    onChange={(value, event) => {
                                        inputChangeHandler(event);
                                    }}
                                ></Select>
                            )}
                        </div>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 4 }} md={{ span: 4 }}>
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
                                    {updateSubTask.budget_time}
                                </b>
                            )}
                            {isEdit && (
                                <TimePicker
                                    placeholder="Budget Time"
                                    name="budgetTime"
                                    defaultValue={dayjs(
                                        updateSubTask.budget_time,
                                        "HH:mm"
                                    )}
                                    format={"HH:mm"}
                                    // onChange={(date, dateString) => {
                                    //     inputChangeHandler(dateString, "budgetTime");
                                    // }}
                                    className="w100"
                                />
                            )}
                        </div>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 4 }} md={{ span: 4 }}>
                        Actual Time
                        <div>
                            {!isEdit && (
                                <b>
                                    <ClockCircleOutlined
                                        style={{
                                            color: "#2c7be5",
                                            marginRight: "10px",
                                        }}
                                    />
                                    {updateSubTask.actual_time === ""
                                        ? "00:00"
                                        : updateSubTask.actual_time}
                                </b>
                            )}
                            {/* {isEdit && (
                                <TimePicker
                                    placeholder="Actual Time"
                                    name="actual_time"
                                    defaultValue={dayjs(
                                        updateTask.actual_time,
                                        "HH:mm"
                                    )}
                                    format={"HH:mm"}
                                    // onChange={(date, dateString) => {
                                    //     inputChangeHandler(dateString, "budgetTime");
                                    // }}
                                    className="w100"
                                />
                            )} */}
                        </div>
                    </Col>
                </Row>
                <Row
                    gutter={[8, 8]}
                    className="form-row"
                    style={{ border: "1px solid #d8e2ef", padding: "15px" }}
                >
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        {!isEdit && getRemark()}
                        {isEdit && (
                            <ReactQuill
                                theme="snow"
                                value={updateSubTask.remarks}
                                placeholder="Remark"
                                onChange={(event) => {
                                    inputChangeHandler(event, "remarks");
                                }}
                            />
                        )}
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        <Title level={5} style={{ textAlign: "left" }}>
                            Attachments
                        </Title>
                    </Col>
                </Row>
                {!isEdit && (
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        >
                            <Title level={5} style={{ textAlign: "left" }}>
                                Comments
                            </Title>
                            <Comments
                                comments={taskComments}
                                parentId={updateSubTask._id}
                                addComment={addCommentHandler}
                                editComment={editCommentHandler}
                                deleteComment={deleteCommentHandler}
                            />
                        </Col>
                    </Row>
                )}
            </div>
        </>
    );
};
export default SubTaskViewEdit;
