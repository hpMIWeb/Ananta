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
} from "antd";
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
import {
    faEdit,
    faExpandArrowsAlt,
    faCompressArrowsAlt,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Stopwatch from "../../components/Stockwatch/Stopwatch";
import Comments from "../../components/Comments/Comments";
import { ToastContainer, toast } from "react-toastify";
import api from "../../utilities/apiServices";
import { AddTask, SaveComment } from "./interfaces/ITask";
const { Title } = Typography;

dayjs.extend(customParseFormat);

const TaskViewEdit = (props: any) => {
    const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);
    const [selectedRow, setSelectedRow] = useState<AddTask>(props.selectedRow);
    const [taskComments, setTaskComments] = useState<Comment>(
        props.selectedRow.comments
    );

    const fullScreenModeToggle = () => {
        if (props.handleScreenMode) {
            props.handleScreenMode();
        }
    };

    useEffect(() => {
        console.log("comment for selection row ", selectedRow.comments);
    }, []);

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
        if (selectedRow.remark) {
            return parse(selectedRow.remark);
        } else {
            return "";
        }
    };

    const editClickHandler = () => {
        setIsEdit(!isEdit);
    };

    const statusChangeHandler = (event: any, value: string) => {
        console.log("Status change - ", event);

        const taskUpdate = {} as AddTask;
        taskUpdate.status = value;

        api.updateTask(selectedRow._id, taskUpdate).then((resp: any) => {
            // localStorage.setItem("task", JSON.stringify(taskUpdate));
            toast.success("Successfully Updated Task", {
                position: toast.POSITION.TOP_RIGHT,
            });
        });
    };

    const addCommentHandler = (comment: string) => {
        const addComment = {} as SaveComment;
        addComment.comment = comment;
        addComment.taskId = selectedRow._id;
        api.addTaskComment(addComment)
            .then(() => {
                toast.success("Successfully added comment", {
                    position: toast.POSITION.TOP_RIGHT,
                });
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
        api.deleteTaskComment(selectedRow._id, commentId)
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

    return (
        <>
            <div
                style={{
                    display:
                        Object.keys(selectedRow).length > 0 ? "block" : "none",
                }}
            >
                <ToastContainer />
                <Form style={{ padding: "15px 0 0 0" }}>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: props.fullScreenMode ? 18 : 16 }}
                        >
                            {!isEdit && (
                                <Title level={5} style={{ textAlign: "left" }}>
                                    {selectedRow.title}
                                </Title>
                            )}
                            {isEdit && (
                                <Input
                                    placeholder="Task"
                                    name="task"
                                    value={selectedRow.title}
                                    // onChange={(event) => {
                                    //     inputChangeHandler(event);
                                    // }}
                                />
                            )}
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 5 }}
                        >
                            <Title level={5} style={{ textAlign: "right" }}>
                                {capitalize(selectedRow.assignee)}
                            </Title>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: props.fullScreenMode ? 1 : 3 }}
                        >
                            <FontAwesomeIcon
                                icon={isEdit ? faXmark : faEdit}
                                style={{
                                    fontSize: isEdit ? "25px" : "20px",
                                    color: "#2c7be5",
                                    cursor: "pointer",
                                    marginLeft: "10px",
                                    marginTop: isEdit ? "-3px" : "0",
                                }}
                                title={
                                    "Click here to " +
                                    (isEdit ? "cancel" : "edit")
                                }
                                onClick={editClickHandler}
                            />
                            {!props.fullScreenMode && (
                                <FontAwesomeIcon
                                    icon={faExpandArrowsAlt}
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "normal",
                                        color: "#2c7be5",
                                        float: "right",
                                        cursor: "pointer",
                                        display: props.fullScreenMode
                                            ? "none"
                                            : "block",
                                    }}
                                    title="Click here to maximize"
                                    onClick={fullScreenModeToggle}
                                />
                            )}
                            {props.fullScreenMode && (
                                <FontAwesomeIcon
                                    icon={faCompressArrowsAlt}
                                    onClick={fullScreenModeToggle}
                                    style={{
                                        fontSize: "20px",
                                        color: "#2c7be5",
                                        float: "right",
                                        cursor: "pointer",
                                        display: props.fullScreenMode
                                            ? "block"
                                            : "none",
                                    }}
                                    title="Click here to minimize"
                                />
                            )}
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
                                <Stopwatch taskId={selectedRow._id} />
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 6 }}
                            md={{ span: 4 }}
                            lg={{ span: 5 }}
                        >
                            <Select
                                allowClear
                                placeholder="Select Priority"
                                options={priorityOpts}
                                value={selectedRow.priority}
                                className="w100"
                                onChange={(value, event) => {
                                    statusChangeHandler(event, value);
                                }}
                            />
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
                                value={selectedRow.status}
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
                            md={{ span: 4 }}
                        >
                            Assigned To
                            <div>
                                {!isEdit && <b>{selectedRow.assignee}</b>}
                                {isEdit && (
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Assign Person"
                                        value={selectedRow.assignee}
                                        options={assigneeOpts}
                                        className="w100"
                                        // onChange={(value, event) => {
                                        //     inputChangeHandler(event);
                                        // }}
                                    ></Select>
                                )}
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 6 }}
                            md={{ span: 6 }}
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
                                        {dayjs(selectedRow.start_date).format(
                                            "YYYY-MM-DD, HH:mm A"
                                        )}
                                    </b>
                                )}

                                {isEdit && (
                                    <DatePicker
                                        placeholder="Start Date"
                                        name="start_date"
                                        defaultValue={dayjs(
                                            selectedRow.start_date
                                        )}
                                        className="w100"
                                        // format={dateFormat}
                                        // className="w100"
                                        // onChange={(date, dateString) => {
                                        //     inputChangeHandler(dateString, "startDate");
                                        // }}
                                        onPanelChange={() => {}}
                                    />
                                )}
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 5 }}
                            md={{ span: 6 }}
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
                                        {dayjs(selectedRow.due_date).format(
                                            "YYYY-MM-DD, HH:mm A"
                                        )}
                                    </b>
                                )}
                                {isEdit && (
                                    <DatePicker
                                        placeholder="Due Date"
                                        name="due_date"
                                        defaultValue={dayjs(
                                            selectedRow.due_date
                                        )}
                                        format={dateFormat}
                                        onPanelChange={() => {}}
                                        className="w100"
                                    />
                                )}
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 4 }}
                            md={{ span: 4 }}
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
                                        {selectedRow.budget_time}
                                    </b>
                                )}
                                {isEdit && (
                                    <TimePicker
                                        placeholder="Budget Time"
                                        name="budget_time"
                                        defaultValue={dayjs(
                                            selectedRow.budget_time,
                                            "HH:mm:ss"
                                        )}
                                        // onChange={(date, dateString) => {
                                        //     inputChangeHandler(dateString, "budgetTime");
                                        // }}
                                        className="w100"
                                    />
                                )}
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 4 }}
                            md={{ span: 4 }}
                        >
                            Actual Time
                            <div>
                                <b>
                                    <ClockCircleOutlined
                                        style={{
                                            color: "#2c7be5",
                                            marginRight: "10px",
                                        }}
                                    />
                                    {selectedRow.actual_time}
                                </b>
                            </div>
                        </Col>
                    </Row>
                    <Row
                        gutter={[8, 8]}
                        className="form-row"
                        style={{ border: "1px solid #d8e2ef" }}
                    >
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        >
                            {getRemark()}
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        >
                            <Title level={5} style={{ textAlign: "left" }}>
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
                            <Title level={5} style={{ textAlign: "left" }}>
                                Sub-tasks
                            </Title>
                        </Col>
                    </Row>
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
                                parentId={selectedRow._id}
                                addComment={addCommentHandler}
                                editComment={editCommentHandler}
                                deleteComment={deleteCommentHandler}
                            />
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
};
export default TaskViewEdit;
