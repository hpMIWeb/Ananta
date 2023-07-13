import { useEffect, useState } from "react";
import {
  faCancel,
  faCross,
  faEdit,
  faTrash,
  faXmark,
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
import { PlusOutlined, ClockCircleOutlined } from "@ant-design/icons";
import api from "../../utilities/apiServices";
import { workAreaOpts, clientOpts } from "../../utilities/utility";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { receiveMessageOnPort } from "worker_threads";
const { Title } = Typography;
const pageSize = 20;

const TimeSheet = () => {
  const [current, setCurrent] = useState(1);
  const dateFormat = "YYYY-MM-DD";
  const [timesheetDate, setTimesheetDate] = useState(dayjs(dateFormat)); //set date in calender
  const [timesheet, setTimesheet] = useState<ITimesheet[]>([]);
  const [selectedTableRow, setSelectedTableRow] = useState<ITimesheet>(
    {} as ITimesheet
  );

  //Time sheet List
  useEffect(() => {
    getTimeSheetData();
    addNewTimesheetRow();
  }, []);

  function onChange(sorter: any) {
    console.log(sorter);
  }

  const columns = [
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
      width: "10%",
      render: (start_time: string, record: Timesheet) => {
        if (record.is_new) {
          return (
            <Form.Item
              name={`start_time_${record._id}`}
              rules={[
                {
                  required: true,
                  message: "Please enter start time.",
                },
              ]}
            >
              <TimePicker
                placeholder="Start Time"
                name={`start_time_${record._id}`}
                format="HH:mm"
                onChange={(date, dateString) => {
                  inputChangeHandler(dateString, "start_time");
                }}
              />
            </Form.Item>
          );
        } else if (!record.is_edit) {
          return (
            <b>
              <ClockCircleOutlined
                style={{
                  color: "#2c7be5",
                  marginRight: "10px",
                }}
              />
              {dayjs(start_time).format("HH:mm")}
            </b>
          );
        }

        return (
          <Form.Item
            name={`start_time_${record._id}`}
            rules={
              record.start_time
                ? []
                : [
                    {
                      required: true,
                      message: "Please enter start time.",
                    },
                  ]
            }
          >
            <TimePicker
              placeholder="Start Time"
              name={`start_time_${record._id}`}
              format="HH:mm"
              defaultValue={dayjs(record.start_time, "HH:mm")}
              onChange={(date, dateString) => {
                inputChangeHandler(dateString, "start_time");
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
      sorter: (a: any, b: any) => a.any - b.any,
      width: "10%",
      render: (end_time: string, record: Timesheet) => {
        if (record.is_new) {
          return (
            <Form.Item
              name={`end_time_${record._id}`}
              rules={[
                {
                  required: true,
                  message: "Please enter start time.",
                },
              ]}
            >
              <TimePicker
                placeholder="End Time"
                name="end_time"
                format={"HH:mm"}
                onChange={(date, dateString) => {
                  inputChangeHandler(dateString, "end_time");
                }}
              />
            </Form.Item>
          );
        } else if (!record.is_edit) {
          return (
            <b>
              <ClockCircleOutlined
                style={{
                  color: "#2c7be5",
                  marginRight: "10px",
                }}
              />
              {dayjs(record.end_time).format("HH:mm")}
            </b>
          );
        }
        return (
          <Form.Item
            name={`end_time_${record._id}`}
            rules={
              record.end_time
                ? []
                : [
                    {
                      required: true,
                      message: "Please enter end time.",
                    },
                  ]
            }
          >
            <TimePicker
              placeholder="End Time"
              name="end_time"
              defaultValue={dayjs(end_time, "HH:mm")}
              format={"HH:mm"}
              onChange={(date, dateString) => {
                inputChangeHandler(dateString, "end_time");
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: "Client Name",
      dataIndex: "client",
      key: "client",
      width: "10%",
      sorter: (a: any, b: any) => a.any - b.any,
      render: (client: string, record: Timesheet) => {
        if (record.is_new) {
          <Form.Item
            name={`client_${record._id}`}
            rules={
              record.client
                ? []
                : [
                    {
                      required: true,
                      message: "Please enter client time.",
                    },
                  ]
            }
          >
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
          </Form.Item>;
        } else if (!record.is_edit) {
          return <b>{record.client}</b>;
        }
        return (
          <Form.Item
            name={`client_${record._id}`}
            rules={
              record.client
                ? []
                : [
                    {
                      required: true,
                      message: "Please enter client time.",
                    },
                  ]
            }
          >
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
          </Form.Item>
        );
      },
    },
    {
      title: "Work Area",
      dataIndex: "work_area",
      key: "work_area",
      width: "10%",
      sorter: (a: any, b: any) => a.any - b.any,
      render: (work_area: string, record: Timesheet) => {
        if (record.is_new) {
          return (
            <Form.Item
              name={`work_area_${record._id}`}
              rules={
                record.work_area
                  ? []
                  : [
                      {
                        required: true,
                        message: "Please select work area.",
                      },
                    ]
              }
            >
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
            </Form.Item>
          );
        } else if (!record.is_edit) {
          return <b>{record.work_area}</b>;
        }
        return (
          <Form.Item
            name={`work_area_${record._id}`}
            rules={
              record.work_area
                ? []
                : [
                    {
                      required: true,
                      message: "Please select work area.",
                    },
                  ]
            }
          >
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
          </Form.Item>
        );
      },
    },
    {
      title: "Particulars",
      dataIndex: "pariculars",
      key: "pariculars",
      width: "10%",
      sorter: (a: any, b: any) => a.any - b.any,
      render: (pariculars: string, record: Timesheet) => {
        if (record.is_new) {
          return (
            <Form.Item
              name={`pariculars_${record._id}`}
              rules={
                record.pariculars
                  ? [] // Exclude validation if `remark` is pre-filled
                  : [
                      {
                        required: true,
                        message: "Please enter pariculars.",
                      },
                    ]
              }
            >
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
            </Form.Item>
          );
        } else if (!record.is_edit) {
          return <b>{record.pariculars}</b>;
        }
        return (
          <Form.Item
            name={`pariculars_${record._id}`}
            rules={
              record.pariculars
                ? [] // Exclude validation if `remark` is pre-filled
                : [
                    {
                      required: true,
                      message: "Please enter pariculars.",
                    },
                  ]
            }
          >
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
          </Form.Item>
        );
      },
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      width: "10%",
      sorter: (a: any, b: any) => a.any - b.any,
      render: (remark: string, record: Timesheet) => {
        if (record.is_new) {
          return (
            <Form.Item
              name={`remark_${record._id}`}
              rules={
                record.remark
                  ? [] // Exclude validation if `remark` is pre-filled
                  : [
                      {
                        required: true,
                        message: "Please enter a remark.",
                      },
                    ]
              }
            >
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
            </Form.Item>
          );
        } else if (!record.is_edit) {
          return <b>{record.remark}</b>;
        }
        return (
          <Form.Item
            name={`remark_${record._id}`}
            rules={
              record.remark
                ? [] // Exclude validation if `remark` is pre-filled
                : [
                    {
                      required: true,
                      message: "Please enter a remark.",
                    },
                  ]
            }
          >
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
          </Form.Item>
        );
      },
    },
    {
      title: "Total Time",
      dataIndex: "total_time",
      key: "total_time",
      width: "10%",
      sorter: (a: any, b: any) => a.any - b.any,
      render: (total_time: string, record: Timesheet) => {
        if (!record.is_edit) {
          return (
            <span
              className="ant-col ant-form-item-control css-dev-only-do-not-override-w8mnev"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <b>
                <ClockCircleOutlined
                  style={{
                    color: "#2c7be5",
                    marginRight: "10px",
                  }}
                />
                {record.total_time}
              </b>
            </span>
          );
        }
        if (record.is_new || !record.start_time || !record.end_time) {
          return null; // Hide the column for new entries or if start time or end time is empty
        }

        const startTime = dayjs(record.start_time, "HH:mm");
        const endTime = dayjs(record.end_time, "HH:mm");

        if (endTime.isBefore(startTime)) {
          return null; // Hide the column if end time is before start time
        }

        const diffMinutes = endTime.diff(startTime, "minutes");
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        const formattedDuration = `${hours}:${minutes
          .toString()
          .padStart(2, "0")}`;

        // return <span id={`total_time_${record._id}`}>{formattedDuration}</span>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "10%",

      render: (_: any, record: Timesheet) => {
        if (record.is_new) {
          return (
            <span style={{ display: "flex", justifyContent: "center" }}>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => removeRow(record._id)}
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
        }
        if (record.is_edit) {
          return (
            <span style={{ display: "flex", justifyContent: "center" }}>
              <FontAwesomeIcon
                icon={faXmark}
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
        }
        return (
          <span style={{ display: "flex", justifyContent: "center" }}>
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
    const newAddTimesheet = new Timesheet();
    newAddTimesheet._id = (timesheet.length + 1).toString();
    newAddTimesheet.timesheet_date = timesheetDate.toString();

    if (
      !timesheet.some((row) => row.start_time === "" && row.end_time === "")
    ) {
      const selectedRowIndex = timesheet.findIndex(
        (row) => row === selectedTableRow
      );
      const updatedTimesheet = [
        ...timesheet.slice(0, selectedRowIndex + 1),
        newAddTimesheet,
        ...timesheet.slice(selectedRowIndex + 1),
      ];
      setTimesheet(updatedTimesheet);
    } else {
      toast.error("Please complete the last row action.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const [activeTab, setActiveTab] = useState<string>("1");

  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

  // Edit time sheet data
  const editClickHandler = (record: Timesheet) => {
    record.is_edit = !record.is_edit;
    setTimesheet([...timesheet]);
  };

  // delete time sheet data
  const deleteClickHandler = (timeSheetId: string) => {
    //  const timeSheetList = localStorage.getItem("timesheet");

    // Delete from  DB
    try {
      api.deleteTimesheet(timeSheetId).then((resp: any) => {
        // Set timesheet to `localStorage`
        const updatedData = timesheet.filter(
          (item: Timesheet) => item._id !== timeSheetId
        );
        setTimesheet(updatedData);
        localStorage.setItem("timesheet", JSON.stringify(updatedData));
        toast.success("Successfully Timesheet Remove.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
    } catch (ex) {
      toast.error("Technical error while creating Task", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const removeRow = (timeSheetId: string) => {
    if (timeSheetId === "1") {
      toast.error("Cannot delete the first new row.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    const updatedData = timesheet.filter(
      (item: Timesheet) => item._id !== timeSheetId
    );

    setTimesheet(updatedData);
    localStorage.setItem("timesheet", JSON.stringify(updatedData));
    toast.success("Successfully Timesheet delete.", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // save time sheet data
  // save time sheet data
  const saveTimeSheetHandler = () => {
    const selectedDate = timesheetDate.format("YYYY-MM-DD");

    // Read all existing timesheet from `localStorage`
    console.log("save call", timesheet);

    const newTimesheets = timesheet.filter((entry) => entry.is_new);

    // Check if any new timesheets are present
    if (newTimesheets.length === 0) {
      toast.error("No new timesheet entries to save.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    // Check if every new timesheet entry has non-blank values
    const isEveryEntryValid = newTimesheets.every((entry) =>
      Object.values(entry).every((value) => value !== "")
    );

    // If any entry is not valid, display an error message
    if (!isEveryEntryValid) {
      toast.error("Please complete all required fields.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    // Create an array of timesheet data
    const timesheetPayload = newTimesheets.map((entry) => ({
      start_time: entry.start_time,
      end_time: entry.end_time,
      remark: entry.remark,
      client: entry.client,
      work_area: entry.work_area,
      pariculars: entry.pariculars,
      total_time: entry.total_time,
      timesheet_date: selectedDate,
    }));

    console.log(timesheetPayload);
    // Make a single API call to save the multiple timesheet entries
    try {
      api.createMultipleTimesheet(timesheetPayload).then((resp) => {
        toast.success("Successfully saved timesheet entries", {
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
    let start;
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
          case "start_time": {
            selectedTableRow.start_time = value;

            let startTime = dayjs(selectedTableRow.start_time, "HH:mm");
            if (startTime.isAfter(startTime)) {
              toast.error("Start time should not be greater than start time.", {
                position: toast.POSITION.TOP_RIGHT,
              });
              return;
            }
            selectedTableRow.total_time = calculateTotalTime(selectedTableRow);
            break;
          }
          case "end_time": {
            selectedTableRow.end_time = value;
            let endTime = dayjs(value, "HH:mm");
            let startTime = dayjs(selectedTableRow.start_time, "HH:mm");

            if (endTime.isBefore(startTime)) {
              toast.error("End time should not be less than start time.", {
                position: toast.POSITION.TOP_RIGHT,
              });
              return;
            }
            selectedTableRow.total_time = calculateTotalTime(selectedTableRow);
            if (selectedTableRow.is_new) {
              addNewTimesheetRow();
            }
            break;
          }
          case "client": {
            selectedTableRow.client = value;

            break;
          }
          case "pariculars": {
            selectedTableRow.pariculars = value;
            break;
          }
          case "remark": {
            selectedTableRow.remark = value;
            break;
          }
          case "work_area": {
            selectedTableRow.work_area = value;
            break;
          }
        }
      }
    });

    // update selected rows

    setSelectedTableRow(selectedTableRow);
  };

  const dateChangeHandler = (date: string) => {
    getTimeSheetData();
  };

  const calculateTotalTime = (record: Timesheet) => {
    let endTime = dayjs(record.end_time, "HH:mm");
    let startTime = dayjs(record.start_time, "HH:mm");
    let diff = 0;
    if (startTime) {
      diff = dayjs(endTime).diff(dayjs(record.start_time, "HH:mm"), "minute");
    }
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    const formattedDuration = `${hours}:${minutes.toString().padStart(2, "0")}`;
    return formattedDuration;
  };
  // save time sheet code end

  const getTimeSheetData = () => {
    api.getTimesheet().then((resp: any) => {
      const newBlankTimeSheet = new Timesheet();
      newBlankTimeSheet._id = (timesheet.length + 1).toString();
      const finalData = [newBlankTimeSheet, ...resp.data];
      setTimesheet(finalData);

      localStorage.setItem("timesheet", JSON.stringify(resp.data));
    });
  };
  const getData = (current: number, pageSize: number) => {
    console.log("all timesheet", timesheet);
    let returnVal = timesheet;

    returnVal = timesheet.filter((item: ITimesheet) => {
      return dayjs(item.start_time, dateFormat).isSame(
        dayjs().format(dateFormat)
      );
    });
    console.log(returnVal);
    return returnVal
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
      <Form>
        <div style={{ textAlign: "right", marginTop: "10px" }}>
          <DatePicker
            placeholder="Date"
            name="due_date"
            className="w101"
            defaultValue={timesheetDate}
            format={dateFormat}
            onChange={(date, dateString) => {
              inputChangeHandler(dateString, "start_time");
            }}
          />
        </div>

        <div>
          <Row
            gutter={[8, 8]}
            className="form-row"
            style={{ marginTop: "10px" }}
          >
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
              <Table
                columns={columns}
                dataSource={getData(current, pageSize)}
                pagination={{ pageSize: 100 }}
                onChange={onChange}
                rowKey="_id"
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => {
                      setSelectedTableRow(record);
                    },
                  };
                }}
              />
            </Col>
          </Row>

          <Row gutter={[8, 8]} className="form-row">
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              onClick={saveTimeSheetHandler}
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              Save
            </Button>
          </Row>
        </div>
      </Form>
    </>
  );
};
export default TimeSheet;
