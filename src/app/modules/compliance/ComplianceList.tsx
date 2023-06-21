import React, { useState, useEffect } from "react";
import type { TabsProps } from "antd";
import { Button, Space, Tabs, Typography, Table, Tag } from "antd";
import {
  AddCompliance,
  AddCompliance as IAddCompliance,
  AddCompliance as ISubTask,
} from "./interfaces/ICompliance";
import dayjs from "dayjs";
import "./ComplianceList.scss";
import { useNavigate } from "react-router-dom";
import ComplianceViewEdit from "./ComplianceViewEdit";
import api from "../../utilities/apiServices";

const { Title } = Typography;
const pageSize = 20;

const ComplianceList = () => {
  const [current, setCurrent] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("1");
  const dateFormat = "YYYY-MM-DD";
  const [fullScreenMode, setFullScreenMode] = useState<boolean>(false);
  const [tableRowSelected, setTableRowSelected] = useState<any>({});
  const [allTask, setAllTask] = useState<[]>([]);

  const screenModeToggle = () => {
    setFullScreenMode(!fullScreenMode);
  };

  const onTabChange = (key: string) => {
    setActiveTab(key);
    setFullScreenMode(false);
  };

  useEffect(() => {
    api.getAllTask().then((resp: any) => {
      console.log(resp.data.allTask);
      setAllTask(resp.data.allTask);
    });
  }, []);

  const colInfo = [
    {
      title: "title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => text,
    },
    {
      title: "client",
      dataIndex: "client",
      key: "client",
    },
    {
      title: "assignee",
      dataIndex: "assignee",
      key: "assignee",
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
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => (
        <span>
          {[status].map((item) => {
            let color = "#fb275d";
            let title = item;
            switch (item) {
              case "completed": {
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
    {
      title: "subtask",
      key: "subtask",
      dataIndex: "subtask",
      render: (subtask: []) => {
        if (subtask && subtask.length > 0) {
          return (
            <div key={subtask.length}>
              {subtask.filter((item: ISubTask) => {
                return item.status === "Completed";
              }).length +
                "/" +
                subtask.length}
            </div>
          );
        } else {
          return <span>No sub task</span>;
        }
      },
    },
  ];

  const rowClassHandler = (record: IAddCompliance) => {
    let rowClassName = "";
    switch (record.status.toLowerCase()) {
      case "pending":
      case "1": {
        rowClassName = "data-row-pending";
        break;
      }
      case "completed": {
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

  const getData = (current: number, pageSize: number, rangeMode: string) => {
    let retVal: AddCompliance[] = [];

    switch (rangeMode) {
      case "today": {
        retVal = allTask.filter((item: IAddCompliance) => {
          return dayjs(item.start_date, dateFormat).isSame(
            dayjs().format(dateFormat)
          );
        });
        break;
      }
      case "upcoming": {
        retVal = allTask.filter((item: IAddCompliance) => {
          return dayjs(item.start_date, dateFormat).isAfter(
            dayjs().format(dateFormat)
          );
        });
        break;
      }
      case "history": {
        retVal = allTask.filter((item: IAddCompliance) => {
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
        <Table
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
          pagination={false}
          style={{ width: "100%" }}
        />
      </div>
    );
  };

  const upcomingContent = () => {
    return (
      <div>
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
          pagination={false}
          //style={{ width: "100%" }}
        />
      </div>
    );
  };

  const historyContent = () => {
    return (
      <div>
        <Table
          dataSource={getData(current, pageSize, "history")}
          rowClassName={rowClassHandler}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                console.log("history", record);
                setTableRowSelected(record);
              },
            };
          }}
          columns={colInfo}
          showHeader={false}
          pagination={false}
          //style={{ width: "100%" }}
        />
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

  const tabContent: TabsProps["items"] = [
    {
      key: "1",
      label: "Today",
    },
    {
      key: "2",
      label: "Report",
    },
  ];

  const navigate = useNavigate();
  const addNewComplianceHandler = () => {
    navigate("/add-compliance");
  };

  return (
    <>
      <div>
        <Title level={5}>Compliance</Title>
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
              <Button type="primary" onClick={addNewComplianceHandler}>
                Add New Compliance
              </Button>
            </Space>
          </div>
        </div>
      </div>
      <div>
        <div
          style={{
            width: "64%",
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
              width: fullScreenMode ? "100%" : "35%",
              //textAlign: "right",
              //border: "1px solid #d8e2ef",
            }}
          >
            <ComplianceViewEdit
              handleScreenMode={screenModeToggle}
              fullScreenMode={fullScreenMode}
              tableRowSelected={tableRowSelected}
              isEdit={false}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ComplianceList;
