import { Typography, DatePicker, Row, Col, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  clientOpts,
  assigneeOpts,
  statusList,
  priorityOpts,
} from "../../utilities/utility";
import "../fillter/Fillter.scss";
const Fillter = (prop: any) => {
  return (
    <>
      <Row
        gutter={[8, 8]}
        className={"form-row " + (!prop.showMoreFilter ? "hide" : "")}
        style={{ marginTop: "10px" }}
      >
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
          <Select
            allowClear
            showSearch
            placeholder="Select a client"
            options={clientOpts}
            className="w100"
          />
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
          <Select
            allowClear
            showSearch
            placeholder="Assign By"
            options={assigneeOpts}
            className="w100"
          ></Select>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
          <Select
            allowClear
            showSearch
            placeholder="Assign To"
            options={assigneeOpts}
            className="w100"
          ></Select>
        </Col>
      </Row>
      <Row
        gutter={[8, 8]}
        className={"form-row " + (!prop.showMoreFilter ? "hide" : "")}
        style={{ marginTop: "10px" }}
      >
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }}>
          <DatePicker
            placeholder="Due Date"
            name="due_date_search"
            className="w100"
          />
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }}>
          <Select
            allowClear
            showSearch
            placeholder="Status"
            options={statusList}
            className="w100"
          ></Select>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }}>
          <Select
            allowClear
            showSearch
            placeholder="Priority"
            options={priorityOpts}
            className="w100"
          ></Select>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 6 }}
          style={{ textAlign: "right" }}
        >
          <a href="#" title="Clear" className="clearlink">
            <svg
              className="svg-inline--fa fa-times fa-w-11"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="times"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 352 512"
              data-fa-i2svg=""
            >
              <path
                fill="currentColor"
                d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
              ></path>
            </svg>
            <i className="fas fa-times"></i> Clear
          </a>
        </Col>
      </Row>
    </>
  );
};
export default Fillter;
