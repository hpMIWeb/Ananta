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
  const [showMoreFilter, setShowMoreFilterTask] = useState<boolean>(false);

  const onSwitchMoreFilter = () => {
    setShowMoreFilterTask(!showMoreFilter);
  };
  return (
    <>
      <Row gutter={[8, 8]} className="form-row">
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
          <a
            className="btn-link"
            title="Show Filters"
            onClick={onSwitchMoreFilter}
          >
            <span>{!showMoreFilter ? "Show Filters" : "Hide Filters"}</span>
            <svg
              className="svg-inline--fa fa-angle-down fa-w-10"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="angle-down"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              data-fa-i2svg=""
            >
              <path
                fill="currentColor"
                d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"
              ></path>
            </svg>
            <i className="fas fa-angle-down"></i>
          </a>
        </Col>
      </Row>
      <Row gutter={[8, 8]} className="form-row"></Row>
      <Row
        gutter={[8, 8]}
        className={"form-row " + (!showMoreFilter ? "hide" : "")}
      ></Row>
    </>
  );
};
export default Fillter;
