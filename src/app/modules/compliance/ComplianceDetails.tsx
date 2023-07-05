import React, { useEffect, useState } from "react";
import { Typography, Select, TimePicker, Table, Button, Form } from "antd";
import {
  priorityOpts,
  assigneeOpts,
  clientOpts,
} from "../../utilities/utility";
import "react-quill/dist/quill.snow.css";

import "react-toastify/dist/ReactToastify.css";
import "./AddCompliance.scss";
import { PlusOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import TextArea from "antd/es/input/TextArea";
import { ClientDetails as IClientDetails } from "./interfaces/ICompliance";

const ComplianceDetails = (props: any) => {
  const [clientDetails, setClientDetails] = useState<IClientDetails[]>([
    {
      complianceDetailId: "1",
      client_name: "",
      actual_time: "",
      assignee_to: "",
      budget_time: "",
      priority: "",
      remark: "",
      parentId: props.parentId,
    } as IClientDetails,
  ]);
  const [selectedTableRow, setSelectedTableRow] = useState({
    complianceDetailId: "1",
    client_name: "",
    actual_time: "",
    assignee_to: "",
    budget_time: "",
    priority: "",
    remark: "",
    parentId: props.parentId,
  } as IClientDetails);

  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any, index: number) => (
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
          onClick={() => {
            removeComplianceDetails(record);
          }}
        />
      ),
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={
            "client_name_" +
            record.complianceDetailId +
            "_" +
            props.parentTitle +
            "_" +
            props.parentId
          }
          rules={[
            {
              required: true,
              message: "Please select Client.",
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Client"
            options={clientOpts}
            className="w100"
            onChange={(value, event) => {
              inputChangeHandler(event, "client_name");
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Assign To",
      dataIndex: "assignTo",
      key: "assignTo",
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={
            "assignee_to_" +
            record.complianceDetailId +
            "_" +
            props.parentTitle +
            "_" +
            props.parentId
          }
          rules={[
            {
              required: true,
              message: "Please select Assignee.",
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Assign Person"
            options={assigneeOpts}
            className="w100"
            onChange={(value, event) => {
              inputChangeHandler(event, "assignee_to");
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Budget Time",
      dataIndex: "budgetTime",
      key: "budgetTime",
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={
            "budget_time_" +
            record.complianceDetailId +
            "_" +
            props.parentTitle +
            "_" +
            props.parentId
          }
          rules={[
            {
              required: true,
              message: "Please set Budget Time.",
            },
          ]}
        >
          <TimePicker
            placeholder="Budget Time"
            name="budget_time"
            className="w100"
            format={"HH:mm"}
            onChange={(date, dateString) => {
              inputChangeHandler(dateString, "budget_time");
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={
            "_priority_" +
            record.complianceDetailId +
            "_" +
            props.parentTitle +
            "_" +
            props.parentId
          }
          rules={[
            {
              required: true,
              message: "Please set Priority.",
            },
          ]}
        >
          <Select
            allowClear
            placeholder="Priority"
            options={priorityOpts}
            className="w100"
            onChange={(value, event) => {
              inputChangeHandler(event, "priority");
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      render: (text: any, record: any, index: number) => (
        <TextArea
          rows={2}
          name="remark"
          onChange={(value) => {
            inputChangeHandler(value);
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
    } else if (nameItem !== "" && event !== "" && event !== undefined) {
      name = nameItem;
      value = event.value ?? event;
    } else if (event) {
      name = event.name;
      value = event.value;
    }

    Object.keys(selectedTableRow).map((keyItem: string) => {
      if (keyItem === name) {
        switch (keyItem) {
          case "client_name": {
            selectedTableRow.client_name = value;
            break;
          }
          case "assignee_to": {
            selectedTableRow.assignee_to = value;
            break;
          }
          case "budget_time": {
            selectedTableRow.budget_time = value;
            selectedTableRow.actual_time = value;
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

    // update selected rows
    setSelectedTableRow(selectedTableRow);

    // update parent component
    if (props.updateClients) {
      props.updateClients(clientDetails);
    }
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
    const new_id = clientDetails.length + 1;
    const newClient = {
      complianceDetailId: new_id.toString(),
      client_name: "",
      actual_time: "",
      assignee_to: "",
      budget_time: "",
      priority: "",
      remark: "",
      parentId: props.parentId,
    } as IClientDetails;
    setClientDetails([...clientDetails, newClient]);

    // update parent component
    if (props.updateClients) {
      props.updateClients(clientDetails);
    }
  };

  return (
    <>
      <div
        className="sub-task-add"
        style={{ display: props.isAllowAdd ? "block" : "none" }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={addNewComplianceDetails}
          style={{ float: "right", marginBottom: "10px" }}
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
