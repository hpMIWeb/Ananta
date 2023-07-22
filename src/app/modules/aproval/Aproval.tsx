import React, { useState } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import {
  Table,
  Tabs,
  TabsProps,
  Typography,
  Input,
  Button,
  Modal,
  Row,
  Col,
  DatePicker,
  Select,
  Form,
} from "antd";
import "./Aproval.scss";
import {
  employeeOpts,
  leaveTypeOpts,
  departmentOpts,
} from "../../utilities/utility";
import TextArea from "antd/es/input/TextArea";
import { AddLeave, Leave, LeaveDates, LeaveDate } from "./interfaces/IApproval";
import dayjs from "dayjs";
import api from "../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;

const Approval = () => {
  const [activeTab, setActiveTab] = useState<string>("2");

  const [fullScreenMode, setFullScreenMode] = useState<boolean>(false);
  const [leave, setLeave] = useState<boolean>(false);
  const [addLeaveObj, setAddLeaveObj] = useState<AddLeave>(new Leave());
  const [leaveDate, setLeaveDate] = useState<LeaveDates>(new LeaveDate());
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "starttime",
      key: "starttime",
      ellipsis: true,
      width: 160,
      sorter: (a: any, b: any) => a.any - b.any,
      render: () => <Input value="Trusha Bhandari" className="At5" />,
    },
    {
      title: "Department",
      dataIndex: "clientname",
      key: "cliename",
      width: 150,
      sorter: (a: any, b: any) => a.any - b.any,
      render: () => <Input value="Designing" className="At5" />,
    },
    {
      title: "Leave Date",
      dataIndex: "Task",
      key: "Task",
      width: 200,
      sorter: (a: any, b: any) => a.any - b.any,
      render: () => <Input value="05-10-2022 To 10-10-2022" className="At5" />,
    },

    {
      title: "Reason",
      dataIndex: "workarea",
      key: "workarea",
      width: 240,
      sorter: (a: any, b: any) => a.any - b.any,
      render: () => (
        <div className="scrollabletd">
          organic lomo retro fanny pack lo-fi farm-to-table readymade.organic
          lomo retro fanny pack lo-fi farm-to-table readymade.organic lomo retro
          fanny pack lo-fi farm-to-table readymade.
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "Budget Time",
      key: "Budget Time",
      width: 100,
      sorter: (a: any, b: any) => a.any - b.any,
      render: () => <UserAddOutlined className="At4" />,
    },
  ];

  const data = [
    {
      key: "1",
      name: "John",
      age: 32,
      address: "New York",
    },
    {
      key: "2",
      name: "Jane",
      age: 28,
      address: "London",
    },
    {
      key: "3",
      name: "Jim",
      age: 34,
      address: "Paris",
    },
  ];

  function onChange(sorter: any) {
    console.log(sorter);
  }
  const onTabChange = (key: string) => {
    setActiveTab(key);
    setFullScreenMode(false);
  };

  const tabContent: TabsProps["items"] = [
    {
      key: "1",
      label: "Leave",
    },
    {
      key: "2",
      label: "Task",
    },
  ];

  /*Modal action start*/

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

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

    if (name === "leave_date") {
      leaveDate.start_date = value;
      leaveDate.end_date = value;
      setLeaveDate(leaveDate);
    }

    setAddLeaveObj({
      ...addLeaveObj,
      [name]: value,
    });
    console.log(addLeaveObj);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const dates = {} as LeaveDates;
        dates.start_date = leaveDate.start_date;
        dates.end_date = leaveDate.end_date;
        addLeaveObj.leave_date = dates;
        console.log("values", values);
        console.log("addLeaveObj", addLeaveObj);
        // Save to DB
        try {
          api.applyLeave(addLeaveObj).then((resp: any) => {
            toast.success("Successfully Leave Apply.", {
              position: toast.POSITION.TOP_RIGHT,
            });
            form.resetFields();
            setIsModalOpen(false);
          });
        } catch (ex) {
          toast.error("Technical error while creating Task", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  /*Modal action end */
  return (
    <>
      <div>
        <Title level={5}>Approvals</Title>
      </div>
      <ToastContainer autoClose={25000} />
      <div
        className="task-list-header"
        style={{ borderBottom: "2px solid #d8e2ef" }}
      >
        <div>
          <Tabs
            defaultActiveKey="1"
            items={tabContent}
            onChange={onTabChange}
            style={{ width: "200%", margin: "0px 20px" }}
          />
        </div>
      </div>
      <div>
        <div className="At1">
          <Button type="primary" className="At2" onClick={showModal}>
            Apply
          </Button>
        </div>

        <div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ defaultCurrent: 1, total: 2 }}
            onChange={onChange}
          />
        </div>
      </div>
      <Modal
        title="Apply Leave"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Row gutter={[8, 8]} className="form-row">
            <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 12 }}>
              <Form.Item
                name="employee_name"
                rules={[
                  { required: true, message: "Please select a leave date!" },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Employee"
                  className="w100"
                  options={employeeOpts}
                  onChange={(value, event) => {
                    inputChangeHandler(event, "employee_name");
                  }}
                ></Select>
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 12 }}>
              <Form.Item
                name="department"
                rules={[
                  { required: true, message: "Please select a leave type!" },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Department"
                  className="w100"
                  options={departmentOpts}
                  onChange={(value, event) => {
                    inputChangeHandler(event, "department");
                  }}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} className="form-row">
            <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 12 }}>
              <Form.Item
                name="leave_date"
                rules={[
                  { required: true, message: "Please select a leave date!" },
                ]}
              >
                <DatePicker
                  placeholder="Date"
                  className="w100"
                  format={"YYYY-MM-DD"}
                  name="leave_date"
                  onChange={(date, dateString) => {
                    inputChangeHandler(dateString, "leave_date");
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 12 }}>
              <Form.Item
                name="leave_type"
                rules={[
                  { required: true, message: "Please select a leave type!" },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Leave Type"
                  className="w100"
                  options={leaveTypeOpts}
                  onChange={(value, event) => {
                    inputChangeHandler(event, "leave_type");
                  }}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} className="form-row">
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
              <Form.Item
                name="leave_reason"
                rules={[{ required: true, message: "Please enter a reason!" }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Reason"
                  name="leave_reason"
                  onChange={(event) => {
                    inputChangeHandler(event, "leave_reason");
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Approval;
