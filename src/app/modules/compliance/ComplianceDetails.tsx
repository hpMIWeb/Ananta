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
  ClientDetails as IClientDetails,
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

const clientDetailsObj = {
  complianceDetailId: 1,
  client: "",
  actual_time: "",
  assignee: "",
  budget_time: "",
  priority: "",
  remark: "",
} as IClientDetails;

const removeComplianceDetails11 = (item: IClientDetails) => {
  console.log(item);
};

const ComplianceDetails = (props: any) => {
  const [clientDetails, setClientDetails] = useState<IClientDetails[]>([
    clientDetailsObj,
  ]);
  const [clientDetails1, setClientDetails1] = useState<IClientDetails[]>([
    clientDetailsObj,
  ]);
  const [selectedTableRow, setSelectedTableRow] = useState(clientDetailsObj);

  const columns = [
    {
      title: "Action",
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
      render: (item: any) => (
        <Select
          allowClear
          showSearch
          placeholder="Client"
          options={clientOpts}
          className="w100"
          onChange={(value, event) => {
            inputChangeHandler(event, "client");
          }}
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
          onChange={(value, event) => {
            inputChangeHandler(event, "assignee");
          }}
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
          onChange={(date, dateString) => {
            inputChangeHandler(dateString, "budget_time");
          }}
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
          onChange={(value, event) => {
            inputChangeHandler(event, "priority");
          }}
        />
      ),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      render: () => (
        <TextArea
          rows={2}
          onChange={(value) => {
            inputChangeHandler(value, "remark");
          }}
        />
      ),
    },
  ];

  const inputChangeHandler = (event: any, nameItem: string = "") => {
    let name = "";
    let value = "";
    if (event && event.target) {
      name = event.target.name;
      value = event.target.value;
    } else if (nameItem !== "" && event !== "") {
      name = nameItem;
      value = event.value;
    } else if (event) {
      name = event.name;
      value = event.value;
    }

    console.log("===============");
    console.log(name, value);
    console.log(clientDetails1);

    Object.keys(selectedTableRow).map((keyItem: string) => {
      if (keyItem === name) {
        switch (keyItem) {
          case "client": {
            selectedTableRow.client = value;
            break;
          }
          case "assignee": {
            selectedTableRow.assignee = value;
            break;
          }
          case "budget_time": {
            selectedTableRow.budget_time = value;
            break;
          }
          case "priority": {
            selectedTableRow.priority = value;
            break;
          }
          case "remark": {
            selectedTableRow.remark = value;
            break;
          }
        }
      }
    });

    setClientDetails1([selectedTableRow]);
    console.log(clientDetails1);
  };

  const removeComplianceDetails = (item: IClientDetails) => {
    const index = clientDetails.indexOf(item);
    if (index > -1) {
      const compliance = [...clientDetails].filter((compliance: any) => {
        return compliance.complianceDetailId !== item.complianceDetailId;
      });
      setClientDetails(compliance);
    }
  };

  const addNewComplianceDetails = () => {
    clientDetailsObj.complianceDetailId = clientDetails.length + 1;
    console.log(clientDetailsObj);
    setClientDetails([...clientDetails, clientDetailsObj]);
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
        dataSource={clientDetails}
        columns={columns}
        pagination={false}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setSelectedTableRow(record);
            },
          };
        }}
      />
    </>
  );
};

export default ComplianceDetails;
