import { useEffect, useState } from "react";
import {
  faEdit,
  faSave,
  faSleigh,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
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
import isBetween from "dayjs/plugin/isBetween";
import { time } from "console";
const { Title } = Typography;
const pageSize = 20;

function onChange(sorter: any) {
  console.log(sorter);
}

const TimeSheet = () => {
  const [current, setCurrent] = useState(1);
  const [addTimesheet, setAddTimesheet] = useState<ITimesheet>(new Timesheet());
  const [timesheet, setTimesheet] = useState<ITimesheet[]>([]);

  const columns = [
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
      ellipsis: true,
      sorter: (a: any, b: any) => a.any - b.any,
      render: (start_time: string, record: any) => (
        <Form.Item
          name="start_time"
          rules={[
            {
              required: true,
              message: "Please enter start time.",
            },
          ]}
        >
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
        </Form.Item>
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
      render: (_: any, record: Timesheet) => {
        if (record.is_new) {
          return (
            <span>
              <Button htmlType="submit">
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
              </Button>
            </span>
          );
        }
        return (
          <span>
            <FontAwesomeIcon
              icon={faEdit}
              className="btn-at"
              title="Edit Timesheet"
              style={{
                color: "#2c7be5",
                marginLeft: "15px",
              }}
              onClick={() => editClickHandler(record)}
            />
            <Divider type="vertical" />
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => deleteClickHandler(record._id)}
            >
              <FontAwesomeIcon
                icon={faTrash}
                className="btn-at"
                title="Delete Timesheet"
                style={{ color: "#fa5c7c" }}
              />
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const addNewTimesheetRow = () => {
    const hasDynamicRow = timesheet.some((row) => row.is_new);
    const timeSheetList = localStorage.getItem("timesheet");
    let allTimesheet =
      timeSheetList && timeSheetList.length > 0
        ? JSON.parse(timeSheetList)
        : [];

    if (hasDynamicRow) {
      toast.error("Please complete old row action.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    const newTimesheet = {
      _id:
        allTimesheet && allTimesheet.length > 0 ? allTimesheet.length + 1 : 1,
      start_time: "",
      end_time: "",
      remark: "",
      client: "",
      work_area: "",
      pariculars: "",
      total_time: "",
      is_new: true,
    } as ITimesheet;
    console.log(newTimesheet);
    setTimesheet([newTimesheet, ...timesheet]);
  };

  const [activeTab, setActiveTab] = useState<string>("1");

  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

  // Edit time sheet data
  const editClickHandler = (updateTimesheet: Timesheet) => {
    console.log("Update task", updateTimesheet);

    api
      .updateTimesheet(updateTimesheet._id, updateTimesheet)
      .then((resp: any) => {
        toast.success("Successfully Updated Timesheet", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  // delete time sheet data
  const deleteClickHandler = (timeSheetId: string) => {
    const timeSheetList = localStorage.getItem("timesheet");
    let allTimesheet =
      timeSheetList && timeSheetList.length > 0
        ? JSON.parse(timeSheetList)
        : [];
    // Delete from  DB
    try {
      api.deleteTimesheet(timeSheetId).then((resp: any) => {
        // Set timesheet to `localStorage`
        const updatedData = allTimesheet.filter(
          (item: Timesheet) => item._id !== timeSheetId
        );
        setTimesheet(updatedData);
        localStorage.setItem("timesheet", JSON.stringify(updatedData));
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

  // save time sheet data
  const addTimeSheetHandler = () => {
    // Read all existing timesheet from `localStorage`
    const timeSheetList = localStorage.getItem("timesheet");

    if (
      addTimesheet.start_time === "" ||
      addTimesheet.end_time === "" ||
      addTimesheet.client === "" ||
      addTimesheet.work_area === "" ||
      addTimesheet.pariculars === ""
    ) {
      // Show an error message
      toast.error("Please fill in all fields", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    // Parse the time values to compare
    const startTime = dayjs(addTimesheet.start_time, "HH:mm");
    const endTime = dayjs(addTimesheet.end_time, "HH:mm");

    let allTimesheet =
      timeSheetList && timeSheetList.length > 0
        ? JSON.parse(timeSheetList)
        : [];

    // Check if the entered time range overlaps with any existing records
    const overlappingRecord = allTimesheet.find((item: Timesheet) => {
      const itemStartTime = dayjs(item.start_time, "HH:mm");
      const itemEndTime = dayjs(item.end_time, "HH:mm");
      return (
        (startTime.isSame(itemEndTime) && endTime.isAfter(itemStartTime)) ||
        (startTime.isAfter(itemStartTime) && endTime.isSame(itemEndTime)) ||
        (startTime.isBefore(itemStartTime) && endTime.isAfter(itemEndTime))
      );
    });

    if (overlappingRecord) {
      toast.error("Time entry overlaps with an existing record", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

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
        setTimesheet(allTimesheet);
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
      localStorage.setItem("timesheet", JSON.stringify(resp.data));
    });
  };
  const getData = (current: number, pageSize: number) => {
    let retVal: AddTimesheet[] = [];
    retVal = timesheet;

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
        <ToastContainer />
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
              rowKey="id"
            />
          </Col>
        </Row>
      </div>
    </>
  );
};
export default TimeSheet;
