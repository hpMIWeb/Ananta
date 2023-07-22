import React, { useState } from "react";
import {
  DatePicker,
  Select,
  Table,
  Tabs,
  TabsProps,
  Typography,
  Input,
  Col,
  Row,
  Divider,
  Image,
} from "antd";
import {
  FilePdfTwoTone,
  FileExcelTwoTone,
  ShareAltOutlined,
  PrinterTwoTone,
} from "@ant-design/icons";
import "./EmpTimeSheet.scss";
import { Link } from "react-router-dom";
import {
  workAreaOpts,
  clientOpts,
  employeeOpts,
} from "../../utilities/utility";
import { EmployeeReport } from "./interfaces/IEmployeeReport";
import api from "../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

const { Title } = Typography;
const pageSize = 20;

const EmpTimeSheet = () => {
  const [current, setCurrent] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("2");
  const [employeeReport, setEmployeeReport] = useState<[]>([]);

  const columns = [
    {
      title: "Date",
      dataIndex: "starttime",
      key: "starttime",
      ellipsis: true,
      width: 110,
      sorter: (a: any, b: any) => a.any - b.any,
      render: () => <Input value="03-08-2022" className="Et4" />,
    },
    {
      title: "Client Name",
      dataIndex: "clientname",
      key: "cliename",
      sorter: (a: any, b: any) => a.any - b.any,
      render: () => <Input value="Trusha Bhanderi" className="Et4" />,
    },
    {
      title: "Task",
      dataIndex: "Task",
      key: "Task",
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
      title: "Work Area",
      dataIndex: "workarea",
      key: "workarea",
      width: 120,
      sorter: (a: any, b: any) => a.any - b.any,
      render: () => <Input value="GST" className="Et4" />,
    },
    {
      title: "Budget Time",
      dataIndex: "Budget Time",
      key: "Budget Time",
      sorter: (a: any, b: any) => a.any - b.any,
      render: () => <Input value="02h 30m" className="Et4" />,
    },
    {
      title: "Actual Time",
      dataIndex: "Actual Time",
      key: "Actual Time",
      sorter: (a: any, b: any) => a.any - b.any,
      render: () => <Input value="02h 00m" className="Et4" />,
    },
    {
      title: "Differance",
      dataIndex: "Differance",
      key: "Differance",
      width: 120,
      sorter: (a: any, b: any) => a.any - b.any,
      render: () => (
        <Input value="30+" style={{ color: "green" }} className="Et4" />
      ),
    },
  ];

  const data = [
    {
      key: "1",
    },
    {
      key: "2",
    },
    {
      key: "3",
    },
    {
      key: "4",
    },
    {
      key: "5",
    },
    {
      key: "6",
    },
  ];
  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

  function onChange(sorter: any) {
    console.log(sorter);
  }

  const downloadPDF = () => {
    // manage down load()
    console.log("dsDD");
    toast.success("Successfully Download.", {
      position: toast.POSITION.TOP_RIGHT,
    });
    // try {
    //   api.downloadTimesheetPDF().then((resp: any) => {
    //     toast.success("Successfully Download.", {
    //       position: toast.POSITION.TOP_RIGHT,
    //     });
    //   });
    // } catch (ex) {
    //   toast.error("Technical error while Download.", {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    // }
  };

  const downloadExcel = () => {
    // manage down load()
    console.log("dsDD");
    toast.success("Successfully Download.", {
      position: toast.POSITION.TOP_RIGHT,
    });
    // try {
    //   api.downloadTimesheetPDF().then((resp: any) => {
    //     toast.success("Successfully Download.", {
    //       position: toast.POSITION.TOP_RIGHT,
    //     });
    //   });
    // } catch (ex) {
    //   toast.error("Technical error while Download.", {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    // }
  };

  let parameters: string[] = [];
  const getEmployeeReport = (event: any, nameItem: string = "") => {
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

    if (name === "employeeName") {
      if (value === "") {
      }
      toast.error("Please select employee.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    switch (name) {
      case "employeeName": {
        if (value !== "") {
          parameters.push(`employeeName=${encodeURIComponent(value)}`);
        }
        break;
      }
      case "clientName": {
        if (value !== "") {
          parameters.push(`clientName=${encodeURIComponent(value)}`);
        }
        break;
      }
      case "workArea": {
        if (value !== "") {
          parameters.push(`workArea=${encodeURIComponent(value)}`);
        }
        break;
      }
      case "date": {
        if (value !== "") {
          parameters.push(`date=${encodeURIComponent(value)}`);
        }
        break;
      }
      default:
        break;
    }

    const queryString = parameters.join("&");
    console.log(queryString);
    try {
      api.getEmployeeReport(queryString).then((resp: any) => {
        localStorage.setItem("employeeReport", JSON.stringify(resp.data));
        setEmployeeReport(resp.data);
      });
    } catch (ex) {
      toast.error("Technical error while Download.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const printData = () => {
    // manage down load()
    window.print();
  };

  const tabContent: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <Link to="/timesheet" style={{ color: "black" }}>
          My Timesheet
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link to="/emp-time-sheet" style={{ color: "black" }}>
          Employee Timesheet Report
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link to="/client-time-sheet" style={{ color: "black" }}>
          Client Timesheet Report
        </Link>
      ),
    },
  ];

  return (
    <>
      <div>
        <Title level={5}>TimeSheet</Title>
      </div>

      <div
        className="task-list-header"
        style={{ borderBottom: "2px solid #d8e2ef" }}
      >
        <div>
          <ToastContainer />
          <Tabs
            defaultActiveKey="2"
            items={tabContent}
            onChange={onTabChange}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div>
        <div className="Et1">
          <span>
            <FilePdfTwoTone className="Et2" onClick={downloadPDF} />
            <FileExcelTwoTone className="Et2" onClick={downloadExcel} />
            <ShareAltOutlined className="Et2" onClick={downloadExcel} />
            <PrinterTwoTone className="Et2" onClick={printData} />
          </span>
        </div>
        <Select
          allowClear
          showSearch
          placeholder="Employee"
          options={employeeOpts}
          className="Et3"
          onChange={(value, event) => {
            getEmployeeReport(event, "employeeName");
          }}
        />
        <Select
          allowClear
          showSearch
          placeholder="clientName"
          options={clientOpts}
          className="Et3"
          onChange={(value, event) => {
            getEmployeeReport(event, "clientName");
          }}
        />
        <Select
          allowClear
          showSearch
          placeholder="Work Area"
          options={workAreaOpts}
          className="Et3"
          onChange={(value, event) => {
            getEmployeeReport(event, "workArea");
          }}
        />
        <DatePicker
          placeholder="Date"
          className="Et3"
          name="name"
          onChange={(value, event) => {
            getEmployeeReport(event, "date");
          }}
        />
        <div className="summery">
          <ul className="summery1">
            <li className="Et7">
              <div>
                <Image> </Image>
              </div>
              <p className="Et6">Trusha Bhanderi</p>
            </li>
            <Divider type="vertical" />
            <li className="Et7">
              <p className="Et6">23-05-2022 To 30-05-2022</p>
              <p className="Et8">Time Period</p>
            </li>
            <Divider type="vertical" />
            <li className="Et7">
              <p className="Et6">20</p>
              <p className="Et8">Total Task</p>
            </li>
            <Divider type="vertical" />
            <li className="Et7">
              <p className="Et6">25h 30m</p>
              <p className="Et8">Total Budget Time</p>
            </li>
            <Divider type="vertical" />
            <li className="Et7">
              <p className="Et6">35h 30m</p>
              <p className="Et8">Total Actual Time</p>
            </li>
            <Divider type="vertical" />
            <li className="Et7">
              <p className="Et6">35h 30m</p>
              <p className="Et8">Total Difference</p>
            </li>
          </ul>
        </div>
        <div>
          <Table
            columns={columns}
            //dataSource={getData(current, pageSize)}
            dataSource={data}
            pagination={{ defaultCurrent: 1, total: 2 }}
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
};

export default EmpTimeSheet;
