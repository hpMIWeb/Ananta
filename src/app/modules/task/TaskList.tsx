import React, { useState } from "react";
import type { TabsProps } from "antd";
import { Button, Space, Tabs, Typography, Table, Tag } from "antd";
import { AddTask as IAddTask, SubTask as ISubTask } from "./interfaces/ITask";
import dayjs from "dayjs";
import "./TaskList.scss";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const pageSize = 20;

const TaskList = () => {
    const [current, setCurrent] = useState(1);
    const dateFormat = "YYYY-MM-DD";

    const onChange = (key: string) => {
        // console.log(key);
    };

    const colInfo = [
        {
            title: "task",
            dataIndex: "task",
            key: "task",
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
            dataIndex: "startDate",
            key: "startDate",
            render: (startDate: string) => (
                <span>{dayjs(startDate).format(dateFormat)}</span>
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
                        switch (item) {
                            case "Completed": {
                                color = "#00ca72";
                                break;
                            }
                            case "InProgress": {
                                color = "#ffcc00";
                                break;
                            }
                            case "Cancel": {
                                color = "#808080";
                                break;
                            }
                        }

                        return (
                            <Tag
                                color={color}
                                key={item}
                                style={{ fontWeight: "500", fontSize: "12px" }}
                            >
                                {item.toUpperCase()}
                            </Tag>
                        );
                    })}
                </span>
            ),
        },
        {
            title: "subTask",
            key: "subTask",
            dataIndex: "subTask",
            render: (subTask: []) => {
                if (subTask && subTask.length > 0) {
                    return (
                        <div key={subTask.length}>
                            {subTask.filter((item: ISubTask) => {
                                return item.status === "Completed";
                            }).length +
                                "/" +
                                subTask.length}
                        </div>
                    );
                } else {
                    return <span>No sub task</span>;
                }
            },
        },
    ];

    const rowClassHandler = (record: IAddTask) => {
        let rowClassName = "";
        switch (record.status) {
            case "Pending": {
                rowClassName = "data-row-pending";
                break;
            }
            case "Completed": {
                rowClassName = "data-row-completed";
                break;
            }
            case "InProgress": {
                rowClassName = "data-row-in-progress";
                break;
            }
            case "Cancel": {
                rowClassName = "data-row-cancel";
                break;
            }
        }
        return rowClassName;
    };

    const getData = (current: number, pageSize: number, rangeMode: string) => {
        const taskList = localStorage.getItem("task");
        const tasks = taskList != null ? JSON.parse(taskList) : [];
        let retVal = [];

        switch (rangeMode) {
            case "today": {
                retVal = tasks.filter((item: IAddTask) => {
                    return dayjs(item.startDate).isSame(dayjs());
                });
                break;
            }
            case "upcoming": {
                retVal = tasks.filter((item: IAddTask) => {
                    return dayjs(item.startDate).isAfter(dayjs());
                });
                break;
            }
            case "history": {
                retVal = tasks.filter((item: IAddTask) => {
                    return dayjs(item.startDate).isBefore(dayjs());
                });
                break;
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
                    columns={colInfo}
                    showHeader={false}
                    pagination={false}
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
                    columns={colInfo}
                    showHeader={false}
                    pagination={false}
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
                    columns={colInfo}
                    showHeader={false}
                    pagination={false}
                />
            </div>
        );
    };

    const tabContent: TabsProps["items"] = [
        {
            key: "1",
            label: "Today",
            children: todayContent(),
        },
        {
            key: "2",
            label: "Upcoming",
            children: upcomingContent(),
        },
        {
            key: "3",
            label: "History",
            children: historyContent(),
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

            <div className="task-list-header">
                <div>
                    <Tabs
                        defaultActiveKey="1"
                        items={tabContent}
                        onChange={onChange}
                    />
                </div>
                <div className="task-list-add">
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
        </>
    );
};

export default TaskList;
