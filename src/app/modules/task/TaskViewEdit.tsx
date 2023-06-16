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
} from "antd";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import {
    assigneeOpts,
    capitalize,
    dateFormat,
    statusList,
} from "../../components/utilities/utility";
import parse from "html-react-parser";
import dayjs from "dayjs";
import {
    ClockCircleOutlined,
    CalendarOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faExpandArrowsAlt,
    faCompressArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
const { Title } = Typography;

const TaskViewEdit = (props: any) => {
    const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);

    const fullScreenModeToggle = () => {
        if (props.handleScreenMode) {
            props.handleScreenMode();
        }
    };

    console.log(props.tableRowSelected.budgetTime);

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
        setIsEdit(true);
    };

    const statusChangeHandler = (event: any) => {
        console.log("Status change - ", event);
    };

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
                            <Title level={5} style={{ textAlign: "left" }}>
                                {props.tableRowSelected.task}
                            </Title>
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
                            {/* <EditOutlined
                                style={{
                                    fontSize: "25px",
                                    color: "#2c7be5",
                                }}
                                title="Click here to edit record"
                                onClick={editClickHandler}
                            /> */}
                            <FontAwesomeIcon
                                icon={faEdit}
                                style={{
                                    fontSize: "20px",
                                    color: "#2c7be5",
                                    cursor: "pointer",
                                }}
                                title="Click here to edit"
                                onClick={editClickHandler}
                            />
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
                            {/* <FullscreenOutlined
                                onClick={fullScreenModeToggle}
                                style={{
                                    fontSize: "25px",
                                    color: "#2c7be5",
                                    float: "right",
                                    display: props.fullScreenMode
                                        ? "none"
                                        : "block",
                                }}
                                title="Maximize"
                            /> */}
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
                            {/* <FullscreenExitOutlined
                                onClick={fullScreenModeToggle}
                                style={{
                                    fontSize: "25px",
                                    color: "#2c7be5",
                                    float: "right",
                                    display: props.fullScreenMode
                                        ? "block"
                                        : "none",
                                }}
                                title="Minimize"
                            /> */}
                        </Col>
                    </Row>
                    {dividerRow()}
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 8 }}
                        >
                            {/* <button
                                className=""
                                id="pauseTimer"
                                title="Pause"
                            ></button>
                            <button
                                className="triangle"
                                id="startTimer"
                                title="Play"
                            ></button>
                            <button
                                className="square"
                                title="Complete"
                            ></button> */}
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 20 }}
                        >
                            Time 00:00
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 4 }}
                        >
                            <Select
                                allowClear
                                placeholder="Select Status"
                                options={statusList}
                                value={
                                    props.tableRowSelected &&
                                    props.tableRowSelected.status
                                }
                                className="w100"
                                onChange={(value, event) => {
                                    statusChangeHandler(event);
                                }}
                            ></Select>
                        </Col>
                    </Row>
                    {dividerRow()}
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 5 }}
                            md={{ span: 5 }}
                        >
                            Assigned To
                            <div>
                                <b
                                    style={{
                                        display: isEdit ? "none" : "block",
                                    }}
                                >
                                    {props.tableRowSelected.assignee}
                                </b>
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder="Assign Person"
                                    value={props.tableRowSelected.assignee}
                                    options={assigneeOpts}
                                    // onChange={(value, event) => {
                                    //     inputChangeHandler(event);
                                    // }}
                                    style={{
                                        display: isEdit ? "block" : "none",
                                    }}
                                ></Select>
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 6 }}
                            md={{ span: 6 }}
                        >
                            Assigned Date
                            <div>
                                <b
                                    style={{
                                        display: isEdit ? "none" : "block",
                                    }}
                                >
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
                                <DatePicker
                                    placeholder="Start Date"
                                    name="startDate"
                                    defaultValue={
                                        props.tableRowSelected.startDate
                                    }
                                    format={dateFormat}
                                    // className="w100"
                                    // onChange={(date, dateString) => {
                                    //     inputChangeHandler(dateString, "startDate");
                                    // }}
                                    onPanelChange={() => {}}
                                    style={{
                                        display: isEdit ? "block" : "none",
                                    }}
                                />
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 5 }}
                            md={{ span: 5 }}
                        >
                            Due Date
                            <div>
                                <b
                                    style={{
                                        display: isEdit ? "none" : "block",
                                    }}
                                >
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
                                <DatePicker
                                    placeholder="Due Date"
                                    name="dueDate"
                                    defaultValue={
                                        props.tableRowSelected.dueDate
                                    }
                                    format={dateFormat}
                                    onPanelChange={() => {}}
                                    style={{
                                        display: isEdit ? "block" : "none",
                                    }}
                                />
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 4 }}
                            md={{ span: 4 }}
                        >
                            Budget Time
                            <div>
                                <b
                                    style={{
                                        display: isEdit ? "none" : "block",
                                    }}
                                >
                                    <ClockCircleOutlined
                                        style={{
                                            color: "#2c7be5",
                                            marginRight: "10px",
                                        }}
                                    />
                                    {props.tableRowSelected.budgetTime}
                                </b>
                                <TimePicker
                                    placeholder="Budget Time"
                                    name="budgetTime"
                                    defaultValue={dayjs("12:08:23", "HH:mm:ss")}
                                    // onChange={(date, dateString) => {
                                    //     inputChangeHandler(dateString, "budgetTime");
                                    // }}
                                    className="w100"
                                    style={{
                                        display: isEdit ? "block" : "none",
                                    }}
                                />
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 4 }}
                            md={{ span: 4 }}
                        >
                            Actual Time
                            <div>
                                <b
                                    style={{
                                        display: isEdit ? "none" : "block",
                                    }}
                                >
                                    <ClockCircleOutlined
                                        style={{
                                            color: "#2c7be5",
                                            marginRight: "10px",
                                        }}
                                    />
                                    {props.tableRowSelected.budgetTime}
                                </b>
                                <TimePicker
                                    placeholder="Actual Time"
                                    name="actualTime"
                                    defaultValue={
                                        props.tableRowSelected
                                            ? dayjs(
                                                  props.tableRowSelected
                                                      .budgetTime,
                                                  "HH:mm:ss"
                                              )
                                            : dayjs()
                                    }
                                    className="w100"
                                    style={{
                                        display: isEdit ? "block" : "none",
                                    }}
                                />
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
