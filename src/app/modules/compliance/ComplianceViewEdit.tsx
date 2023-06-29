import React, { useState, useEffect } from "react";
import type { CollapseProps } from "antd";
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
import { ToastContainer, toast } from "react-toastify";
import api from "../../utilities/apiServices";
import {
  AddCompliance as IAddCompliance,
  SubCompliance as ISubCompliance,
  ClientDetails as IClientDetails,
  ComplianceTimer,
  TimerOpts,
  AddCompliance,
} from "./interfaces/ICompliance";
import ReactQuill from "react-quill";
import ComplianceDetails from "./ComplianceDetails";
import SubCompliance from "./SubCompliance";
import SubComplianceViewEdit from "./SubComplianceViewEdit";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
const { Title } = Typography;

dayjs.extend(customParseFormat);

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

  const taskUpdate = {} as AddCompliance;
  taskUpdate.status = value;
};

const TaskViewEdit = (props: any) => {
  const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);

  const fullScreenModeToggle = () => {
    if (props.handleScreenMode) {
      props.handleScreenMode();
    }
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
    if (props.tableRowSelected.remark) {
      return parse(props.tableRowSelected.remark);
    } else {
      return "";
    }
  };

  const editClickHandler = () => {
    setIsEdit(!isEdit);
  };

  const statusChangeHandler = (event: any, value: string) => {
    console.log("Status change - ", event);

    const complianceUpdate = {} as AddCompliance;
    complianceUpdate.status = value;

    api
      .updateCompliance(props.tableRowSelected._id, complianceUpdate)
      .then((resp: any) => {
        // localStorage.setItem("task", JSON.stringify(taskUpdate));
        toast.success("Successfully Updated Compliance", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const handleUpdateTask = () => {};

  return (
    <>
      <div
        style={{
          display:
            Object.keys(props.tableRowSelected).length > 0 ? "block" : "none",
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
                  {props.tableRowSelected.title}
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
                    placeholder="Compliance"
                    name="title"
                    value={props.tableRowSelected.title}
                    onChange={(event) => {
                      inputChangeHandler(event);
                    }}
                  />
                </Form.Item>
              )}
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5 }}>
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
                title={"Click here to " + (isEdit ? "cancel" : "edit")}
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
                    display: props.fullScreenMode ? "none" : "block",
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
                    display: props.fullScreenMode ? "block" : "none",
                  }}
                  title="Click here to minimize"
                />
              )}
            </Col>
          </Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: props.fullScreenMode ? 1 : 3 }}
          >
            {isEdit && (
              <Button
                htmlType="submit"
                type="primary"
                onClick={handleUpdateTask}
              >
                Update
              </Button>
            )}
          </Col>
          {dividerRow()}
          <Row gutter={[8, 8]} className="form-row">
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 16 }}
              lg={{ span: 14 }}
            >
              <div className="timerbuttons">
                <Stopwatch complianceId={props.tableRowSelected._id} />
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
                {!isEdit && <b>{props.tableRowSelected.assignee}</b>}
                {isEdit && (
                  <Select
                    allowClear
                    showSearch
                    placeholder="Assign Person"
                    value={props.tableRowSelected.assignee}
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
                    {dayjs(props.tableRowSelected.startDate).format(
                      "YYYY-MM-DD, HH:mm A"
                    )}
                  </b>
                )}

                {isEdit && (
                  <DatePicker
                    placeholder="Start Date"
                    name="startDate"
                    defaultValue={dayjs(props.tableRowSelected.startDate)}
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
            <Col xs={{ span: 24 }} sm={{ span: 5 }} md={{ span: 6 }}>
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
                    {dayjs(props.tableRowSelected.dueDate).format(
                      "YYYY-MM-DD, HH:mm A"
                    )}
                  </b>
                )}
                {isEdit && (
                  <DatePicker
                    placeholder="Due Date"
                    name="dueDate"
                    defaultValue={dayjs(props.tableRowSelected.dueDate)}
                    format={dateFormat}
                    onPanelChange={() => {}}
                    className="w100"
                  />
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
                    {props.tableRowSelected.budget_time}
                  </b>
                )}
                {isEdit && (
                  <TimePicker
                    placeholder="Budget Time"
                    name="budgetTime"
                    defaultValue={dayjs(
                      props.tableRowSelected.budget_time,
                      "HH:mm"
                    )}
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
                    {props.tableRowSelected.actual_time}
                  </b>
                )}
                {isEdit && (
                  <TimePicker
                    placeholder="Actual Time"
                    name="actual_time"
                    defaultValue={dayjs(
                      props.tableRowSelected.actual_time,
                      "HH:mm"
                    )}
                    // onChange={(date, dateString) => {
                    //     inputChangeHandler(dateString, "budgetTime");
                    // }}
                    className="w100"
                  />
                )}
              </div>
            </Col>
          </Row>
          <Row
            gutter={[8, 8]}
            className="form-row"
            style={{ border: "1px solid #d8e2ef" }}
          >
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
              {!isEdit && getRemark()}
              {isEdit && (
                <ReactQuill
                  theme="snow"
                  value={props.tableRowSelected.remark}
                  placeholder="Remark"
                  onChange={(event) => {
                    inputChangeHandler(event, "remark");
                  }}
                />
              )}{" "}
            </Col>
          </Row>

          <Row
            gutter={[8, 8]}
            className="form-row"
            style={{ border: "1px solid #d8e2ef" }}
          >
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
              {isEdit && (
                <ComplianceDetails clients={props.tableRowSelected.clients} />
              )}{" "}
            </Col>
          </Row>

          <Row gutter={[8, 8]} className="form-row">
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
              <Title level={5} style={{ textAlign: "left" }}>
                Attachments
              </Title>
            </Col>
          </Row>
          <Row gutter={[8, 8]} className="form-row">
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
              <Title level={5} style={{ textAlign: "left" }}>
                Sub-Compliance
              </Title>
              {!isEdit && (
                <Collapse>
                  {props.tableRowSelected.subcompliance.map(
                    (subComplianceItem: any, index: number) => (
                      <CollapsePanel
                        header={subComplianceItem.title}
                        key={index}
                      >
                        <SubComplianceViewEdit
                          subComplianceData={subComplianceItem}
                          isEdit={isEdit}
                        />
                      </CollapsePanel>
                    )
                  )}
                </Collapse>
              )}
              {isEdit && (
                <SubComplianceViewEdit
                  subComplianceData={props.tableRowSelected.subcompliance}
                  isEdit={isEdit}
                />
              )}{" "}
            </Col>
          </Row>
          <Row gutter={[8, 8]} className="form-row">
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
              <Title level={5} style={{ textAlign: "left" }}>
                Comments
              </Title>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};
export default TaskViewEdit;
