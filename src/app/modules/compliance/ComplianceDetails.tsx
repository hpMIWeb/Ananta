import React, { useEffect, useState, useRef } from "react";
import { Typography, Select, TimePicker, Table, Button } from "antd";
import {
  priorityOpts,
  assigneeOpts,
  clientOpts,
} from "../../utilities/utility";
import "react-quill/dist/quill.snow.css";

import "react-toastify/dist/ReactToastify.css";
import "./AddCompliance.scss";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import TextArea from "antd/es/input/TextArea";
import {
  AddCompliance as IAddCompliance,
  SubCompliance as ISubCompliance,
  ComplianceDetails as IComplianceDetails,
  ComplianceTimer,
  TimerOpts,
} from "./interfaces/ICompliance";
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

const complianceDetailsObj = {
  complianceDetailId: 1,
  client: "",
  key: 1,
} as IComplianceDetails;

const ComplianceDetails = (props: any) => {
  const [complianceDetails, setComplianceDetails] = useState<
    IComplianceDetails[]
  >([complianceDetailsObj]);

  const removeComplianceDetails = (item: IComplianceDetails) => {
    const index = complianceDetails.indexOf(item);
    if (index > -1) {
      const compliance = [...complianceDetails].filter((compliance: any) => {
        return compliance.complianceDetailId !== item.complianceDetailId;
      });
      setComplianceDetails(compliance);
    }
  };

  const addNewComplianceDetails = () => {
    complianceDetailsObj.key = complianceDetails.length + 1;
    complianceDetailsObj.complianceDetailId = complianceDetails.length + 1;
    setComplianceDetails([]);
    setComplianceDetails([...complianceDetails, complianceDetailsObj]);
  };
  useEffect(() => {
    console.log("props", props);
  }, [props]);

  return (
    <>
      <div className="sub-task-add">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={addNewComplianceDetails}
        >
          Add
        </Button>
      </div>
      <Table
        dataSource={complianceDetails}
        columns={columns}
        pagination={false}
      />
    </>
  );
};

export default ComplianceDetails;
