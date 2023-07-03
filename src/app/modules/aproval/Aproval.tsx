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
} from "antd";
import "./Aproval.scss";
import { leaveTypeOpts } from "../../utilities/utility";
import ReactQuill from "react-quill";
import TextArea from "antd/es/input/TextArea";
const { Title } = Typography;

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
        organic lomo retro fanny pack lo-fi farm-to-table readymade.organic lomo
        retro fanny pack lo-fi farm-to-table readymade.organic lomo retro fanny
        pack lo-fi farm-to-table readymade.
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
const Approval = () => {
  const [activeTab, setActiveTab] = useState<string>("2");

  const [fullScreenMode, setFullScreenMode] = useState<boolean>(false);

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

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /*Modal action end */
  return (
    <>
      <div>
        <Title level={5}>Approvals</Title>
      </div>

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
        <Row gutter={[8, 8]} className="form-row">
          <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 12 }}>
            <DatePicker
              placeholder="Date"
              name="leave_date"
              className="w100"
              onPanelChange={() => {}}
            />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 12 }}>
            <Select
              allowClear
              placeholder="Leave Type"
              className="w100"
              options={leaveTypeOpts}
            ></Select>
          </Col>
        </Row>
        <Row gutter={[8, 8]} className="form-row">
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
            <TextArea rows={2} name="remark" placeholder="Reason" />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default Approval;
