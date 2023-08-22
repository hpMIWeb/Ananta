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

    // General input change handler
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

        const newUpdatedTask = {
            ...updateSubTask,
            [name]: value,
        };
        setUpdateSubTask(newUpdatedTask);

        if (props.handleTaskUpdate) props.handleTaskUpdate(newUpdatedTask);
    };

    // Render Divider row
    const dividerRow = () => {
        return (
            <Row gutter={[8, 8]} className="form-row">
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                    <Divider />
                </Col>
            </Row>
        );
    };

    // Render Remarks
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

    // Priority change
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

    // Status change
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

    // Add Comment
    const addCommentHandler = (comment: string) => {
        const addComment = {} as SaveComment;
        addComment.comment = comment;
        addComment.taskId = props.parentId;
        addComment.subtaskId = updateSubTask._id;
        api.addTaskComment(addComment)
            .then((resp: any) => {
                toast.success("Successfully added comment", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                const respData = resp.data;
                const subTask = respData.subtask.find((respItem: any) => {
                    return respItem._id === updateSubTask._id;
                });
                setTaskComments(subTask.comments);
                if (props.handleListUpdate)
                    props.handleListUpdate(respData.subtask);
            })
            .catch((error: any) => {
                const msg = JSON.parse(error.response.data).message;
                toast.error(msg, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    // Update Comment
    const editCommentHandler = (
        commentId: string,
        parentId: string,
        comment: string
    ) => {
        const updateComment = {} as SaveComment;
        updateComment.commentId = commentId;
        updateComment.comment = comment;
        updateComment.taskId = props.parentId;
        updateComment.subtaskId = updateSubTask._id;

        api.updateTaskComment(updateComment)
            .then((resp: any) => {
                toast.success("Successfully updated comment", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                const respData = resp.data;
                const subTask = respData.subtask.find((respItem: any) => {
                    return respItem._id === updateSubTask._id;
                });
                setTaskComments(subTask.comments);
            })
            .catch((error: any) => {
                const msg = JSON.parse(error.response.data).message;
                toast.error(msg, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    // Delete Comment
    const deleteCommentHandler = (commentId: string, parentId: string) => {
        api.deleteTaskComment(updateSubTask._id, commentId)
            .then((resp: any) => {
                toast.success("Successfully deleted comment", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                if (resp && resp.data) setTaskComments(resp.data.comments);
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
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 12 }}
                        md={{ span: 16 }}
                        lg={{ span: 14 }}
                    >
                        <div className="timerbuttons">
                            <Stopwatch
                                parentId={updateSubTask._id}
                                handleTaskStatus={handleTaskStatus}
                                status={updateSubTask.status}
                                showSeconds={true}
                                label={"task"}
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
                            <Title
                                level={4}
                                style={{
                                    textAlign: "right",
                                    marginRight: "30px",
                                }}
                                className={`text-priority ${
                                    updateSubTask.priority
                                } ${
                                    updateSubTask.priority === "high"
                                        ? "blink"
                                        : ""
                                }`}
                            >
                                {capitalize(updateSubTask.priority)}
                            </Title>
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
                        <span className="dataLabel">Assigned To</span>
                        <div>
                            {!isEdit && (
                                <div className="assigneeContainer">
                                    <img
                                        src={
                                            "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80"
                                        }
                                        alt="Assignee"
                                        className="assigneeImage"
                                    />
                                    <b>{updateSubTask.assigned_to}</b>
                                </div>
                            )}
                            {isEdit && (
                                <Select
                                    allowClear
                                    showSearch
                                    mode="multiple"
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
                    <Col xs={{ span: 24 }} sm={{ span: 6 }} md={{ span: 6 }}>
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
                                    {dayjs(updateSubTask.budget_time).format(
                                        "YYYY-MM-DD, HH:mm A"
                                    )}
                                </b>
                            )}

                            {/* {isEdit && (
                                <DatePicker
                                    placeholder="Start Date"
                                    name="start_date"
                                    defaultValue={dayjs(
                                        updateSubTask.budget_time
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
                            )} */}
                        </div>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 5 }} md={{ span: 6 }}>
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
                                    {dayjs(updateSubTask.budget_time).format(
                                        "YYYY-MM-DD, HH:mm A"
                                    )}
                                </b>
                            )}
                            {/* {isEdit && (
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
                            )} */}
                        </div>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 4 }} md={{ span: 4 }}>
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
                                    {updateSubTask.budget_time}
                                </b>
                            )}
                            {isEdit && (
                                // <TimePicker
                                //     placeholder="Budget Time"
                                //     name="budgetTime"
                                //     defaultValue={dayjs(
                                //         updateSubTask.budget_time,
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
                                    defaultValue={updateSubTask.budget_time}
                                    onChange={(event) => {
                                        inputChangeHandler(event);
                                    }}
                                    className="w100"
                                />
                            )}
                        </div>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 4 }} md={{ span: 4 }}>
                        <span className="dataLabel">Actual Time</span>
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
                            <Form.Item name={"remark_" + updateSubTask._id}>
                                <ReactQuill
                                    theme="snow"
                                    value={updateSubTask.remarks}
                                    placeholder="Remark"
                                    onChange={(event) => {
                                        inputChangeHandler(event, "remarks");
                                    }}
                                />
                            </Form.Item>
                        )}
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        <Title level={5} style={{ textAlign: "left" }}>
                            Data Path
                        </Title>
                        <span>{updateSubTask.datapath}</span>
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
