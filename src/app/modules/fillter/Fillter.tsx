import { useEffect, useState, useRef } from "react";
import { faEdit, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Tabs,
  Typography,
  Table,
  DatePicker,
  Row,
  Col,
  Form,
  Select,
  Divider,
  Input,
  Button,
  TimePicker,
  Modal,
  Popconfirm,
} from "antd";
import type { TabsProps } from "antd";
import { Link } from "react-router-dom";

import { PlusOutlined } from "@ant-design/icons";
import { workAreaOpts, clientOpts } from "../../utilities/utility";
const { Title } = Typography;

const Fillter = () => {
  return (
    <>
      <div>
        <Title level={5}>Timesheet</Title>
      </div>

      <div
        className="task-list-header"
        style={{ borderBottom: "2px solid #d8e2ef" }}
      >
        <div></div>
      </div>
      <Form>
        <Row gutter={[8, 8]} className="form-row"></Row>
      </Form>
    </>
  );
};
export default Fillter;
