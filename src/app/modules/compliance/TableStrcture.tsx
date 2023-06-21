import React, { useEffect, useState, useRef } from "react";
import { Typography, Select, TimePicker, Table } from "antd";
import {
  priorityOpts,
  assigneeOpts,
  clientOpts,
} from "../../utilities/utility";
import "react-quill/dist/quill.snow.css";

import "react-toastify/dist/ReactToastify.css";
import "./AddCompliance.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import TextArea from "antd/es/input/TextArea";

//dayjs.extend(weekday);
//dayjs.extend(localeData);
const getClientDropDown = () => {
  return (
    <Select
      allowClear
      showSearch
      placeholder="Client"
      options={clientOpts}
      className="w100"
    />
  );
};

const getAssignDropDown = () => {
  return (
    <Select
      allowClear
      showSearch
      placeholder="Assign Person"
      options={assigneeOpts}
      className="w100"
    ></Select>
  );
};

const columns = [
  {
    title: "Action1",
    dataIndex: "action",
    key: "action",
    render: () => (
      <FontAwesomeIcon
        icon={faTrashAlt}
        style={{
          fontSize: "15px",
          color: "#ec0033",
          cursor: "pointer",
          marginLeft: "10px",
          marginTop: "0",
          alignSelf: "center",
        }}
        title={"Click here to Delete"}
      />
    ),
  },
  {
    title: "Client",
    dataIndex: "client",
    key: "client",
    render: () => (
      <Select
        allowClear
        showSearch
        placeholder="Client"
        options={clientOpts}
        className="w100"
      />
    ),
  },
  {
    title: "Assign To",
    dataIndex: "assignTo",
    key: "assignTo",
    render: () => (
      <Select
        allowClear
        showSearch
        placeholder="Assign Person"
        options={assigneeOpts}
        className="w100"
      ></Select>
    ),
  },
  {
    title: "Budget Time",
    dataIndex: "budgetTime",
    key: "budgetTime",
    render: () => (
      <TimePicker
        placeholder="Budget Time"
        name="budget_time"
        className="w100"
        format={"HH:mm"}
      />
    ),
  },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
    render: () => (
      <Select
        allowClear
        placeholder="Priority"
        options={priorityOpts}
        className="w100"
      />
    ),
  },
  {
    title: "Remark",
    dataIndex: "remark",
    key: "remark",
    render: () => <TextArea rows={2} />,
  },
];

const dataSource = [
  {
    key: "1",
    action: "Mike",
    age: 32,
    address: "10 Downing Street",
  },
];
const TableStrcture = () => {
  return (
    <>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </>
  );
};

export default TableStrcture;
