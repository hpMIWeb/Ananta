import { useEffect, useState } from "react";
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
  Space,
  Button,
  TimePicker,
} from "antd";
import type { TabsProps } from "antd";
import "./TimeSheet.scss";
import { Link } from "react-router-dom";
import {
  AddTimesheet,
  AddTimesheet as ITimesheet,
  Timesheet,
} from "./interfaces/ITimesheet";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../utilities/apiServices";
import { workAreaOpts, clientOpts } from "../../utilities/utility";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
const { Title } = Typography;
const pageSize = 20;

function onChange(sorter: any) {
  console.log(sorter);
}

const TimeSheet = () => {
  const [current, setCurrent] = useState(1);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [addTimesheet, setAddTimesheet] = useState<ITimesheet>(new Timesheet());
  const [timesheet, setTimesheet] = useState<ITimesheet[]>([
    {
      _id: "1",
      start_time: "",
      end_time: "",
      remark: "",
      client: "",
      work_area: "",
      pariculars: "",
      total_time: "",
    } as ITimesheet,
  ]);

  const columns = [
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
      ellipsis: true,
      sorter: (a: any, b: any) => a.any - b.any,
      render: (start_time: string) => (
        <TimePicker
          placeholder="Start Time"
          name="start_time"
          defaultValue={dayjs(start_time, "HH:mm")}
          format={"HH:mm"}
          onChange={(date, dateString) => {
            inputChangeHandler(dateString, "start_time");
          }}
          className="w100"
        />
      ),
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
      sorter: (a: any, b: any) => a.any - b.any,
      render: (end_time: string) => (
        <TimePicker
          placeholder="End Time"
          name="end_time"
          defaultValue={dayjs(end_time, "HH:mm")}
          format={"HH:mm"}
          onChange={(date, dateString) => {
            inputChangeHandler(dateString, "end_time");
          }}
          className="w100"
        />
      ),
    },
    {
      title: "Client Name",
      dataIndex: "client",
      key: "client",
      sorter: (a: any, b: any) => a.any - b.any,
      render: (client: string) => (
        <Select
          allowClear
          showSearch
          placeholder="Client"
          options={clientOpts}
          defaultValue={client}
          className="w100"
          onChange={(value, event) => {
            inputChangeHandler(event, "client");
          }}
        />
      ),
    },
    {
      title: "Work Area",
      dataIndex: "work_area",
      key: "work_area",
      sorter: (a: any, b: any) => a.any - b.any,
      render: (work_area: string) => (
        <Select
          allowClear
          showSearch
          placeholder="Work Area"
          className="w102"
          options={workAreaOpts}
          defaultValue={work_area}
          onChange={(value, event) => {
            inputChangeHandler(event, "work_area");
          }}
        />
      ),
    },
    {
      title: "Particulars",
      dataIndex: "pariculars",
      key: "pariculars",
      sorter: (a: any, b: any) => a.any - b.any,
      render: (pariculars: string) => (
        <Input
          placeholder="Particulars"
          type="text"
          name="pariculars"
          defaultValue={pariculars}
          className="w102"
          onChange={(value) => {
            inputChangeHandler(value);
          }}
        />
      ),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      sorter: (a: any, b: any) => a.any - b.any,
      render: (remark: string) => (
        <Input
          placeholder="Remark"
          type="text"
          name="remark"
          defaultValue={remark}
          className="w102"
          onChange={(value) => {
            inputChangeHandler(value);
          }}
        />
      ),
    },
    {
      title: "Total Time",
      dataIndex: "total_time",
      key: "total_time",
      sorter: (a: any, b: any) => a.any - b.any,
      render: (remark: string) => (
        <Input
          name="total_time"
          className="w102"
          defaultValue={remark}
          onChange={(value) => {
            inputChangeHandler(value);
          }}
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      sorter: (a: any, b: any) => a.any - b.any,
      render: () => (
        <span>
          <FontAwesomeIcon
            icon={faSave}
            className="btn-at"
            title="Save Timesheet"
            style={{
              color: "#5edd0a",
              marginLeft: "15px",
            }}
            onClick={addTimeSheetHandler}
          />
        </span>
        // <span>

        //   <FontAwesomeIcon
        //     icon={faEdit}
        //     className="btn-at"
        //     title="Edit Timesheet"
        //     style={{
        //       color: "#2c7be5",
        //       marginLeft: "15px",
        //     }}
        //     onClick={editClickHandler}
        //   />
        //   <Divider type="vertical" />
        //   <FontAwesomeIcon
        //     icon={faTrash}
        //     className="btn-at"
        //     title="Delete Timesheet"
        //     style={{ color: "#fa5c7c" }}
        //   />
        // </span>
      ),
    },
  ];

  const addNewTimesheetRow = () => {
    const newTimesheet = {
      _id: "1",
      start_time: "",
      end_time: "",
      remark: "",
      client: "",
      work_area: "",
      pariculars: "",
      total_time: "",
    } as ITimesheet;
    setTimesheet([...timesheet, newTimesheet]);
  };

  const [activeTab, setActiveTab] = useState<string>("1");

  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

  const editClickHandler = () => {
    setIsEdit(!isEdit);
  };

  const addTimeSheetHandler = () => {
    // Read all existing timesheet from `localStorage`
    const timesheetList = localStorage.getItem("timesheet");

    // set timer

    let allTimesheet =
      timesheetList && timesheetList.length > 0
        ? JSON.parse(timesheetList)
        : [];
    addTimesheet._id =
      allTimesheet && allTimesheet.length > 0 ? allTimesheet.length + 1 : 1;
    allTimesheet.push(addTimesheet);

    console.log("ALL timesheet", allTimesheet);
    console.log("addTimesheet", addTimesheet);

    // Save to DB
    try {
      api.createTimesheet(addTimesheet).then((resp: any) => {
        // Set timesheet to `localStorage`
        localStorage.setItem("timesheet", JSON.stringify(allTimesheet));
        toast.success("Successfully Timesheet add.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
    } catch (ex) {
      toast.error("Technical error while creating Task", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  //save time sheet code start

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

    // update selected rows
    //setAddTimesheet(selectedTableRow);
    setAddTimesheet({
      ...addTimesheet,
      [name]: value,
    });
  };

  // save time sheet code end

  //Time sheet List
  useEffect(() => {
    getTaskData();
  }, []);

  const getTaskData = () => {
    api.getTimesheet().then((resp: any) => {
      setTimesheet(resp.data);
    });
  };
  const getData = (current: number, pageSize: number) => {
    let retVal: AddTimesheet[] = [];
    retVal = timesheet;

    console.log("retVal", retVal);
    return retVal
      .map((item: any, index: number) => {
        item.key = index;
        return item;
      })
      .slice((current - 1) * pageSize, current * pageSize);
  };
  //End Time sheet List
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
        <Title level={5}>Timesheet</Title>
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
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <DatePicker placeholder="Date" name="due_date" className="w101" />
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={addNewTimesheetRow}
          >
            Add
          </Button>
        </div>
      </div>

      <Row gutter={[8, 8]} className="form-row"></Row>
      <div>
        <Row gutter={[8, 8]} className="form-row">
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
            <Table
              columns={columns}
              //   dataSource={timesheet}
              dataSource={getData(current, pageSize)}
              pagination={{ pageSize: 100 }}
              scroll={{ x: 1300 }}
              onChange={onChange}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};
export default TimeSheet;
