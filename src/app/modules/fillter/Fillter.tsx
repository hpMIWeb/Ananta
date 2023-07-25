import { DatePicker, Row, Col, Select, Button } from "antd";
import {
  clientOpts,
  assigneeOpts,
  statusList,
  priorityOpts,
} from "../../utilities/utility";
import "../fillter/Fillter.scss";
import api from "../../utilities/apiServices";
import {
  AddTask,
  AddTask as IAddTask,
  SubTask as ISubTask,
} from "../task/interfaces/ITask";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

let parameters: string[] = [];
const pageSize = 20;

const Fillter = (prop: any) => {
  const [current, setCurrent] = useState(1);
  const [allTask, setAllTask] = useState<[]>([]);
  const dateFormat = "YYYY-MM-DD";
  const actionTab = prop.actionTab ? prop.actionTab : "";
  const rangeMode = prop.rangeMode ? prop.rangeMode : "";
  useEffect(() => {
    // Get the current URL
    console.log(prop);
    const currentURL = window.location.href;
    console.log("Current URL:", currentURL);
    // Split the URL by slashes and get the last part
    const parts = currentURL.split("/");
    const lastPart = parts[parts.length - 1];

    console.log("Last part of the URL:", lastPart);
  }, []); // Empty
  const filterHandler = (event: any, nameItem: string = "") => {
    let name = "";
    let value = "";

    if (event && event.target) {
      name = event.target.name;
      value = event.target.value;
    } else if (nameItem !== "" && event !== "" && event !== undefined) {
      name = nameItem;
      value = event.value ?? event;
    } else if (event) {
      name = event.name;
      value = event.value;
    }

    console.log("parameters", parameters);
    // Check if the filter parameter already exists in the parameters array
    const parameterExists = parameters.some((param) =>
      param.startsWith(`${name}=`)
    );

    // If the parameter already exists, remove it from the array
    if (parameterExists) {
      parameters = parameters.filter((param) => !param.startsWith(`${name}=`));
    }

    // Push the new parameter to the array
    if (value !== "") {
      parameters.push(`${name}=${encodeURIComponent(value)}`);
    }
    const queryString = "?" + parameters.join("&");
    console.log(queryString);
    prop.filterHandler(queryString);
  };

  return (
    <>
      <Row
        gutter={[8, 8]}
        className={`form-row ${prop.showMoreFilter ? "fade-up" : "fade-down"}`}
        style={{
          marginTop: "10px",
        }}
      >
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
          <Select
            allowClear
            showSearch
            placeholder="Select a client"
            options={clientOpts}
            className="w100 border-bottom"
            bordered={false}
            onChange={(value, event) => {
              filterHandler(value, "client");
            }}
          />
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
          <Select
            allowClear
            showSearch
            placeholder="Assign By"
            options={assigneeOpts}
            className="w100 border-bottom"
            bordered={false}
            onChange={(value, event) => {
              filterHandler(event, "assignedBy");
            }}
          ></Select>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
          <Select
            allowClear
            showSearch
            placeholder="Assign To"
            options={assigneeOpts}
            className="w100 border-bottom"
            bordered={false}
            onChange={(value, event) => {
              filterHandler(event, "assignedTo");
            }}
          ></Select>
        </Col>
      </Row>

      <Row
        gutter={[8, 8]}
        className={`form-row ${prop.showMoreFilter ? "fade-up" : "fade-down"}`}
        style={{ marginTop: "10px" }}
      >
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
          <DatePicker
            placeholder="Due Date"
            name="due_date_search"
            className="w100 border-bottom"
            bordered={false}
            onChange={(value, event) => {
              filterHandler(event, "dueDate");
            }}
          />
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
          <Select
            allowClear
            showSearch
            placeholder="Status"
            options={statusList}
            className="w100 border-bottom"
            bordered={false}
            onChange={(value, event) => {
              filterHandler(event, "status");
            }}
          ></Select>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }}>
          <Select
            allowClear
            showSearch
            placeholder="Priority"
            options={priorityOpts}
            className="w100 border-bottom"
            bordered={false}
            onChange={(value, event) => {
              filterHandler(event, "priority");
            }}
          ></Select>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 2 }}
          style={{ textAlign: "right" }}
        >
          <Button
            href="#"
            title="Clear"
            className="clearlink"
            style={{ border: "none" }}
          >
            Clear
          </Button>
        </Col>
      </Row>
    </>
  );
};
export default Fillter;
