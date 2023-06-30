import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Divider,
  TimePicker,
  Table,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  priorityOpts,
  workAreaOpts,
  statusList,
} from "../../utilities/utility";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  SubCompliance as ISubCompliance,
  ClientDetails as IClientDetails,
  AddCompliance,
  SubCompliance,
} from "./interfaces/ICompliance";
import "./subCompliance.scss";
import ComplianceDetails from "./ComplianceDetails";
import Stopwatch from "../../components/Stockwatch/Stopwatch";
import { ToastContainer, toast } from "react-toastify";
import api from "../../utilities/apiServices";
import type { ColumnsType, TableProps } from "antd/es/table";

const SubComplianceViewEdit = (props: any) => {
  const [subCompliances, setSubCompliance] = useState<ISubCompliance[]>([
    {
      _id: "1",
      status: "Pending",
    } as ISubCompliance,
  ]);

  const [complianceDetails, setComplianceDetails] = useState<IClientDetails[]>(
    []
  );

  useEffect(() => {
    console.log(props);
    if (props.subComplianceData) {
      setSubCompliance([props.subComplianceData]);
      setComplianceDetails([props.subComplianceData.clients]);
    }
  }, []);

  const dividerRow = () => {
    return (
      <Row gutter={[8, 8]} className="form-row">
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
          <Divider />
        </Col>
      </Row>
    );
  };

  const inputChangeHandler = (
    event: any,
    subCompliance: ISubCompliance,
    nameItem: string = ""
  ) => {
    let name: any = "";
    let value: any = "";

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

    const updatedCompliance = [...subCompliances].map((item: any) => {
      if (item._id === subCompliance._id) {
        item[name] = value;
      }
      return item;
    });

    console.log(name, value, updatedCompliance);

    setSubCompliance(updatedCompliance);
  };

  const subComplianceStatusChangeHandler = (
    event: any,
    value: string,
    subCompliance: SubCompliance
  ) => {
    console.log("Status change - ", props.complianceId);
    const subComplianceUpdate = {} as SubCompliance;
    subComplianceUpdate.status = value;
    subComplianceUpdate._id = subCompliance._id;

    subComplianceUpdate.complianceId = props.complianceId;

    console.log(subComplianceUpdate);
    //subComplianceItem._id
    //return false;
    api.updateSubCompliance(subComplianceUpdate).then((resp: any) => {
      // localStorage.setItem("task", JSON.stringify(taskUpdate));
      toast.success("Successfully Updated", {
        position: toast.POSITION.TOP_RIGHT,
      });
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (text: any, record: any, index: number) => (
        <div className="timerbuttons">
          <Stopwatch />
        </div>
      ),
    },
    {
      title: "Client Name",
      dataIndex: "client_name",
      key: "client_name",
      sorter: (a: any, b: any) => a.client_name - b.client_name,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Assign To",
      dataIndex: "assigned_to",
      key: "assigned_to",
      sorter: (a: any, b: any) => a.assigned_to - b.assigned_to,
    },
    {
      title: "Remarks",
      dataIndex: "remark",
      key: "remark",
      sorter: (a: any, b: any) => a.remark - b.remark,
    },
    {
      title: "Budget Time",
      dataIndex: "budget_time",
      key: "budget_time",
      sorter: (a: any, b: any) => a.budget_time - b.budget_time,
    },
    {
      title: "Actual Time",
      dataIndex: "budget_time",
      key: "budget_time",
      sorter: (a: any, b: any) => a.budget_time - b.budget_time,
    },
  ];

  interface DataType {
    key: React.Key;
    client_name: string;
    remark: number;
    budget_time: string;
  }

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", sorter);
  };

  return (
    <div>
      {subCompliances.map((subComplianceItem: any, index: number) => (
        <div key={subComplianceItem._id}>
          {index !== 0 && <Divider style={{ backgroundColor: "#9da9bb" }} />}
          <div className="sub-compliance-header"></div>
          <div className="sub-compliance-content">
            <Row gutter={[8, 8]} className="form-row">
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 16 }}
                lg={{ span: 14 }}
              >
                <div className="timerbuttons">
                  <Stopwatch complianceId={subComplianceItem._id} />
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
                  value={subComplianceItem.priority}
                  className="w100"
                  onChange={(value, event) => {
                    subComplianceStatusChangeHandler(
                      event,
                      value,
                      subComplianceItem
                    );
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
                  value={subComplianceItem.status}
                  className="w100"
                  onChange={(value, event) => {
                    subComplianceStatusChangeHandler(
                      event,
                      value,
                      subComplianceItem
                    );
                  }}
                />
              </Col>
            </Row>
            {dividerRow()}
            <Row gutter={[8, 8]} className="form-row">
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                {!props.isEdit && <b>{subComplianceItem.title}</b>}
                {props.isEdit && (
                  <Input
                    placeholder="Compliance"
                    name="title"
                    value={subComplianceItem.title}
                  />
                )}
              </Col>
            </Row>
            <Row gutter={[8, 8]} className="form-row">
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                {!props.isEdit && <b>{subComplianceItem.remark}</b>}
              </Col>
            </Row>
            {!props.isEdit && (
              <Row gutter={[8, 8]} className="form-row">
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                  <Table
                    id="complianceViewEdit"
                    dataSource={subComplianceItem.clients}
                    columns={columns}
                    size="small"
                    onChange={onChange}
                  />
                </Col>
              </Row>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubComplianceViewEdit;
