import React, { useState, useEffect } from "react";
import type { TabsProps } from "antd";
import {
  Button,
  Space,
  Tabs,
  Typography,
  Table,
  Tag,
  Row,
  Col,
  Input,
} from "antd";
import {
  AddTask,
  AddTask as IAddTask,
  SubTask as ISubTask,
} from "./interfaces/ITask";
import dayjs from "dayjs";
import "./TaskList.scss";
import { useNavigate } from "react-router-dom";
import TaskViewEdit from "./TaskViewEdit";
import api from "../../utilities/apiServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlignLeft,
  faCalendarAlt,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import Fillter from "../fillter/Fillter";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
const { Title } = Typography;
const pageSize = 20;

const TaskList = () => {
  const [current, setCurrent] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("1");
  const dateFormat = "YYYY-MM-DD";
  const [fullScreenMode, setFullScreenMode] = useState<boolean>(false);
  const [tableRowSelected, setTableRowSelected] = useState<IAddTask>(
    {} as IAddTask
  );
  const [showMoreFilter, setShowMoreFilterTask] = useState<boolean>(false);

  const onSwitchMoreFilter = () => {
    setShowMoreFilterTask(!showMoreFilter);
  };
  const [allTask, setAllTask] = useState<[]>([]);

  const screenModeToggle = () => {
    setFullScreenMode(!fullScreenMode);
  };

  const onTabChange = (key: string) => {
    setActiveTab(key);
    setFullScreenMode(false);
  };

  const getTaskData = () => {
    api.getAllTask("").then((resp: any) => {
      setAllTask(resp.data);
    });
  };

  useEffect(() => {
    getTaskData();
  }, []);

  useEffect(() => {
    console.log("Task List - ", tableRowSelected);
  }, [tableRowSelected]);

  const colInfo = [
    {
      title: " ",
      dataIndex: " ",
      key: " ",
      render: (text: string) => <></>,
    },
    {
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span className="title">{text}</span>,
      width: "350px",
    },
    {
      title: "client",
      dataIndex: "client",
      key: "client",
    },
    {
      title: "assignee",
      dataIndex: "assigned_to",
      key: "assigned_to",
    },
    {
      title: "calendaricon",
      key: "start_date",
      dataIndex: "start_Date",
      render: () => {
        return (
          <FontAwesomeIcon
            icon={faCalendarAlt}
            style={{
              fontSize: "13px",
            }}
          />
        );
      },
    },
    {
      title: "task date",
      dataIndex: "start_date",
      key: "start_date",
      render: (start_date: string) => (
        <span>{dayjs(start_date).format(dateFormat)}</span>
      ),
    },

    {
      title: "lefticon",
      key: "subtask",
      dataIndex: "subtask",
      render: () => {
        return (
          <FontAwesomeIcon
            icon={faAlignLeft}
            style={{
              fontSize: "13px",
            }}
          />
        );
      },
    },
    {
      title: "subtask",
      key: "subtask",
      dataIndex: "subtask",
      render: (subtask: []) => {
        if (subtask && subtask.length > 0) {
          return (
            <div key={subtask.length}>
              {subtask.filter((item: ISubTask) => {
                return (
                  item.status === "Completed" || item.status === "Complete"
                );
              }).length +
                "/" +
                subtask.length}
            </div>
          );
        } else {
          return <span>0/0</span>;
        }
      },
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => (
        <span>
          {[status].map((item) => {
            let color = "#fb275d";
            let title = item;
            switch (item) {
              case "completed":
              case "complete": {
                color = "#00ca72";
                break;
              }
              case "in_progress": {
                color = "#ffcc00";
                break;
              }
              case "cancelled": {
                color = "#5e6e82";
                break;
              }
              case "1": {
                color = "#fb275d";
                title = "pending";
              }
            }

            return (
              <Tag
                color={color}
                key={item}
                style={{ fontWeight: "500", fontSize: "12px" }}
              >
                {title.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
  ];

  const rowClassHandler = (record: IAddTask) => {
    let rowClassName = "";
    switch (record.status.toLowerCase()) {
      case "pending":
      case "1": {
        rowClassName = "data-row-pending";
        break;
      }
      case "completed":
      case "complete": {
        rowClassName = "data-row-completed";
        break;
      }
      case "in_progress": {
        rowClassName = "data-row-in-progress";
        break;
      }
      case "cancelled": {
        rowClassName = "data-row-cancel";
        break;
      }
    }
    return rowClassName;
  };

  const filterHandler = (queryString: string) => {
    console.log("clientFilterHandler", queryString);

    api.getAllTask(queryString).then((resp: any) => {
      setAllTask(resp.data);
    });
    getContentRender();
  };
  const getData = (current: number, pageSize: number, rangeMode: string) => {
    let retVal: AddTask[] = [];

    switch (rangeMode) {
      case "today": {
        retVal = allTask.filter((item: IAddTask) => {
          return dayjs(item.start_date, dateFormat).isSame(
            dayjs().format(dateFormat)
          );
        });
        break;
      }
      case "upcoming": {
        retVal = allTask.filter((item: IAddTask) => {
          return dayjs(item.start_date, dateFormat).isAfter(
            dayjs().format(dateFormat)
          );
        });
        break;
      }
      case "history": {
        retVal = allTask.filter((item: IAddTask) => {
          return dayjs(item.start_date, dateFormat).isBefore(
            dayjs().format(dateFormat)
          );
        });
        break;
      }
      default: {
        retVal = [];
      }
    }

    return retVal
      .map((item: any, index: number) => {
        item.key = index;
        return item;
      })
      .slice((current - 1) * pageSize, current * pageSize);
  };

  const todayContent = () => {
    return (
      <div>
        <Row
          gutter={[8, 8]}
          className="form-row "
          style={{ marginTop: "10px" }}
        >
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            style={{
              float: "right",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <Input
              placeholder="Search"
              className="inp"
              bordered={false}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            style={{
              float: "right",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          ></Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            style={{ paddingTop: "20px", textAlign: "right" }}
          >
            <a
              className="btn-link expanddiv"
              title="Show Filters"
              onClick={onSwitchMoreFilter}
            >
              <span className="svgIcon">
                {!showMoreFilter ? "Show Filters " : "Hide Filters "}
              </span>
              <svg
                className="svg-inline--fa fa-angle-down fa-w-10"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="angle-down"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"
                ></path>
              </svg>
              <i className="fas fa-angle-down"></i>
            </a>
          </Col>
        </Row>
        <Fillter
          showMoreFilter={showMoreFilter}
          filterHandler={filterHandler}
        />

        <Row gutter={[8, 8]} className="form-row" style={{ marginTop: "10px" }}>
          <Table
            showSorterTooltip={{ title: "testing functionality" }}
            dataSource={getData(current, pageSize, "today")}
            rowClassName={rowClassHandler}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setTableRowSelected(record);
                },
              };
            }}
            columns={colInfo}
            showHeader={false}
            pagination={{
              defaultPageSize: 10,
            }}
            style={{ width: "100%" }}
          />
        </Row>
      </div>
    );
  };

  const upcomingContent = () => {
    return (
      <div>
        <Row gutter={[8, 8]} className="form-row" style={{ marginTop: "10px" }}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            style={{
              float: "right",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <Input placeholder="Search" prefix={<SearchOutlined />} />
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            style={{
              float: "right",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          ></Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            style={{ paddingTop: "20px", textAlign: "right" }}
          >
            <a
              className="btn-link expanddiv"
              title="Show Filters"
              onClick={onSwitchMoreFilter}
            >
              <span className="svgIcon">
                {!showMoreFilter ? "Show Filters " : "Hide Filters "}
              </span>
              <svg
                className="svg-inline--fa fa-angle-down fa-w-10"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="angle-down"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"
                ></path>
              </svg>
              <i className="fas fa-angle-down"></i>
            </a>
          </Col>
        </Row>
        <Fillter
          showMoreFilter={showMoreFilter}
          filterHandler={filterHandler}
        />
        <Row gutter={[8, 8]} className="form-row" style={{ marginTop: "10px" }}>
          <Table
            dataSource={getData(current, pageSize, "upcoming")}
            rowClassName={rowClassHandler}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setTableRowSelected(record);
                },
              };
            }}
            columns={colInfo}
            showHeader={false}
            pagination={{
              defaultPageSize: 10,
            }}
            style={{ width: "100%" }}
          />
        </Row>
      </div>
    );
  };

  const historyContent = () => {
    return (
      <div>
        <Row gutter={[8, 8]} className="form-row" style={{ marginTop: "10px" }}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            style={{
              float: "right",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <Input placeholder="Search" prefix={<SearchOutlined />} />
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            style={{
              float: "right",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          ></Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            style={{ paddingTop: "20px", textAlign: "right" }}
          >
            <a
              className="btn-link expanddiv"
              title="Show Filters"
              onClick={onSwitchMoreFilter}
            >
              <span className="svgIcon">
                {!showMoreFilter ? "Show Filters " : "Hide Filters "}
              </span>
              <svg
                className="svg-inline--fa fa-angle-down fa-w-10"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="angle-down"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"
                ></path>
              </svg>
              <i className="fas fa-angle-down"></i>
            </a>
          </Col>
        </Row>
        <Fillter
          showMoreFilter={showMoreFilter}
          filterHandler={filterHandler}
        />
        <Row gutter={[8, 8]} className="form-row" style={{ marginTop: "10px" }}>
          <Table
            dataSource={getData(current, pageSize, "history")}
            rowClassName={rowClassHandler}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setTableRowSelected(record);
                },
              };
            }}
            columns={colInfo}
            showHeader={false}
            pagination={{
              defaultPageSize: 10,
            }}
            style={{ width: "100%" }}
          />
        </Row>
      </div>
    );
  };

  const getContentRender = () => {
    switch (activeTab) {
      case "1": {
        return todayContent();
      }
      case "2": {
        return upcomingContent();
      }
      case "3": {
        return historyContent();
      }
    }
    return null;
  };

  const handleListUpdate = () => {
    getTaskData();
  };

  const tabContent: TabsProps["items"] = [
    {
      key: "1",
      label: "Today",
    },
    {
      key: "2",
      label: "Upcoming",
    },
    {
      key: "3",
      label: "History",
    },
  ];

  const navigate = useNavigate();
  const addNewTaskHandler = () => {
    navigate("/add-task");
  };
  const addNewMultiTaskHandler = () => {
    navigate("/add-multi-task");
  };

  return (
    <>
      <div>
        <Title level={5}>Tasks</Title>
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
          ></Tabs>
        </div>
        <div className="task-list-add">
          <div>
            <Space>
              <Button type="primary" onClick={addNewMultiTaskHandler}>
                Add Multiple Task
              </Button>
              <Button type="primary" onClick={addNewTaskHandler}>
                Add New Task
              </Button>
            </Space>
          </div>
        </div>
      </div>
      <div>
        <div
          style={{
            width: "65%",
            float: "left",
            display: fullScreenMode ? "none" : "block",
            marginRight: "15px",
          }}
        >
          {getContentRender()}
        </div>
        {tableRowSelected && Object.keys(tableRowSelected).length > 0 && (
          <div
            style={{
              float: "right",
              width: fullScreenMode ? "100%" : "33%",
            }}
          >
            <TaskViewEdit
              handleScreenMode={screenModeToggle}
              fullScreenMode={fullScreenMode}
              tableRowSelected={tableRowSelected}
              isEdit={false}
              handleListUpdate={handleListUpdate}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TaskList;
