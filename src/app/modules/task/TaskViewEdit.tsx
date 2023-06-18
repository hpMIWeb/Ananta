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
} from "../../components/utilities/utility";
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
import Stopwatch from "../../components/hooks/Stopwatch";
const { Title } = Typography;

dayjs.extend(customParseFormat);

const TaskViewEdit = (props: any) => {
    // if (props.tableRowSelected) {
    //     props.tableRowSelected.timer = {
    //         state: TimerOpts.stop,
    //         time: "00:00:00",
    //     };
    // }

    const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);
    // const [taskTimer, setTaskTimer] = useState<TaskTimer>({
    //     state: TimerOpts.stop,
    //     time: 0,
    // } as TaskTimer);
    // const [isTaskRunning, setIsTaskRuning] = useState<Boolean>(
    //     props.tableRowSelected.timer.state === 1
    // );
    // const [time, setTime] = useState(0);
    // const [timerDetail, setTimerDetail] = useState({
    //     hours: 0,
    //     minutes: 0,
    //     seconds: 0,
    //     milliseconds: 0,
    // } as TimerDetail);

    const fullScreenModeToggle = () => {
        if (props.handleScreenMode) {
            props.handleScreenMode();
        }
    };

    console.log("props into Task View Edit", props.tableRowSelected);

    useEffect(() => {}, []);

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
        if (props.tableRowSelected.remark) {
            return parse(props.tableRowSelected.remark);
        } else {
            return "";
        }
    };

    const editClickHandler = () => {
        console.log(props.tableRowSelected);
        setIsEdit(!isEdit);
    };

    const statusChangeHandler = (event: any) => {
        console.log("Status change - ", event);
    };

    // let interval = setInterval(handleTick, 1000);

    // const playTimer = () => {
    //     // taskTimer.state = TimerOpts.pause;
    //     const timer = {} as TaskTimer;
    //     timer.state = TimerOpts.pause;
    //     timer.time = "00:00:00";
    //     setTaskTimer(timer);
    //     setIsTaskRuning(!isTaskRunning);
    // };

    // const pauseTimer = () => {
    //     taskTimer.state = TimerOpts.play;
    //     setTaskTimer(taskTimer);
    //     setIsTaskRuning(!isTaskRunning);
    // };

    // const stopTimer = () => {
    //     taskTimer.state = TimerOpts.stop;
    //     setTaskTimer(taskTimer);
    //     setIsTaskRuning(false);
    //     setTime(0);
    // };

    // useEffect(() => {
    //     console.log(taskTimer);
    // }, [taskTimer]);

    // useEffect(() => {
    //     if (isTaskRunning) {
    //         const interval = setInterval(() => {
    //             setTime(time + 1);

    //             timerDetail.hours = Math.floor(time / 360000);
    //             timerDetail.minutes = Math.floor((time % 360000) / 6000);
    //             timerDetail.seconds = Math.floor((time % 6000) / 100);
    //             timerDetail.milliseconds = time % 100;
    //             setTimerDetail(timerDetail);
    //         }, 10);
    //         return () => clearInterval(interval);
    //     }
    // }, [isTaskRunning, time]);

    return (
        <>
            <div
                style={{
                    display:
                        Object.keys(props.tableRowSelected).length > 0
                            ? "block"
                            : "none",
                }}
            >
                <Form style={{ padding: "15px 0 0 0" }}>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: props.fullScreenMode ? 18 : 16 }}
                        >
                            {!isEdit && (
                                <Title level={5} style={{ textAlign: "left" }}>
                                    {props.tableRowSelected.task}
                                </Title>
                            )}
                            {isEdit && (
                                <Input
                                    placeholder="Task"
                                    name="task"
                                    value={props.tableRowSelected.task}
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
                                {capitalize(props.tableRowSelected.assignee)}
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
                                <Stopwatch
                                    taskId={props.tableRowSelected.taskId}
                                />
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
                                value={props.tableRowSelected.priority}
                                className="w100"
                                onChange={(value, event) => {
                                    statusChangeHandler(event);
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
                                value={props.tableRowSelected.status}
                                className="w100"
                                onChange={(value, event) => {
                                    statusChangeHandler(event);
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
                                {!isEdit && (
                                    <b>{props.tableRowSelected.assignee}</b>
                                )}
                                {isEdit && (
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Assign Person"
                                        value={props.tableRowSelected.assignee}
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
                                        {dayjs(
                                            props.tableRowSelected.startDate
                                        ).format("YYYY-MM-DD, HH:mm A")}
                                    </b>
                                )}

                                {isEdit && (
                                    <DatePicker
                                        placeholder="Start Date"
                                        name="startDate"
                                        defaultValue={dayjs(
                                            props.tableRowSelected.startDate
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
                                        {dayjs(
                                            props.tableRowSelected.dueDate
                                        ).format("YYYY-MM-DD, HH:mm A")}
                                    </b>
                                )}
                                {isEdit && (
                                    <DatePicker
                                        placeholder="Due Date"
                                        name="dueDate"
                                        defaultValue={dayjs(
                                            props.tableRowSelected.dueDate
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
                                        {props.tableRowSelected.budgetTime}
                                    </b>
                                )}
                                {isEdit && (
                                    <TimePicker
                                        placeholder="Budget Time"
                                        name="budgetTime"
                                        defaultValue={dayjs(
                                            props.tableRowSelected.budgetTime,
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
                                    {props.tableRowSelected.budgetTime}
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
                        </Col>
                    </Row>
                </Form>
            </div>

            {/* <div className="row avtardiv my-3">
                <div className="col-2">
                    <p>Assigned To</p>
                    <div className="asgnp_avtar">
                        <strong>Arya Stark</strong>
                    </div>
                </div>
                <div className="col-3">
                    <p>Assigned Date</p>
                    <div className="asgnp_avtar">
                        <i className="far fa-calendar-alt"></i>{" "}
                        <strong> 25 Aug 2022, 10am</strong>
                    </div>
                </div>
                <div className="col-3">
                    <p>Due Date</p>
                    <div className="asgnp_avtar">
                        <i className="far fa-calendar-alt"></i>{" "}
                        <strong> 27 Aug 2022, 10am</strong>
                    </div>
                </div>
                <div className="col-2">
                    <p>Budget Time</p>
                    <div className="asgnp_avtar">
                        <i className="far fa-clock"></i>{" "}
                        <strong>02h 30m</strong>
                    </div>
                </div>
                <div className="col-2">
                    <p>Actual Time</p>
                    <div className="asgnp_avtar">
                        <i className="far fa-clock"></i>{" "}
                        <strong>02h 30m</strong>
                    </div>
                </div>
                <div className="col-2 clientname">
                    <p>Client</p>
                    <div className="asgnp_avtar">
                        <strong>Trusha Bhanderi</strong>
                    </div>
                </div>
            </div> */}
        </>
    );
};
export default TaskViewEdit;
