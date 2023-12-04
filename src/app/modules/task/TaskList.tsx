import React, { useState, useEffect } from "react";
import { Avatar, TabsProps, Tooltip } from "antd";
import { Space, Tabs, Typography, Table, Tag, Row, Col, Input } from "antd";
import {
    AddTask,
    AddTask as IAddTask,
    SubTask as ISubTask,
} from "./interfaces/ITask";
import dayjs from "dayjs";
import styles from "./TaskList.module.scss";
import { useNavigate } from "react-router-dom";
import TaskViewEdit from "./TaskViewEdit";
import api from "../../utilities/apiServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAlignLeft,
    faCalendarAlt,
    faAngleDown,
    faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import Fillter from "../fillter/Fillter";
import { SearchOutlined, UserOutlined, FilterTwoTone } from "@ant-design/icons";
import classNames from "classnames";
import Button from "../../../components/Button/Index";
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
    const [searchQuery, setSearchQuery] = useState<string>("");

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

    useEffect(() => {}, [tableRowSelected]);

    const colInfo = [
        {
            title: " ",
            dataIndex: " ",
            key: " ",
            render: (text: string) => <></>,
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: "20%",
            sorter: (a: any, b: any) => a.title.localeCompare(b.title),
            render: (text: string) => <span className="title">{text}</span>,
        },
        {
            title: "Client",
            dataIndex: "",
            key: "",
            render: (record: any) => (
                <>
                    <span className="clientDiv">
                        {record.client[0].client_name}
                    </span>
                </>
            ),
        },
        {
            title: "Assignee",
            dataIndex: "assigned_to",
            key: "assigned_to",
            width: "10%",
            render: (assigned_to: any) => (
                <div className="assigneeContainer">
                    <Avatar.Group
                        maxCount={2}
                        maxStyle={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                        }}
                    >
                        {assigned_to.map((assignee: any, index: any) => (
                            <Tooltip key={index} title={assignee}>
                                <Avatar src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80" />
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                </div>
            ),
        },
        {
            title: "Due Date",
            key: "due_date",
            dataIndex: "due_date",
            width: "10%",

            render: (due_date: string) => {
                return (
                    <span className="clientDiv dueDate">
                        <FontAwesomeIcon
                            icon={faCalendarAlt}
                            style={{ marginRight: "5px" }}
                        />
                        <span>{dayjs(due_date).format("DD MMM h:mma")}</span>
                    </span>
                );
            },
        },
        {
            title: "Progress",
            key: "subtask",
            dataIndex: "subtask",
            width: "10%",
            render: (subtask: []) => {
                if (subtask && subtask.length > 0) {
                    return <span className="clientDiv">0/0</span>;
                } else {
                    return <span className="clientDiv">0/0</span>;
                }
            },
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            width: "10%",
            render: (status: string) => (
                <span style={{ float: "right" }}>
                    {[status].map((item) => {
                        let color = "#fb275d";
                        let title = item;
                        switch (item) {
                            case "completed":
                            case "complete": {
                                color = "#00ca72";
                                break;
                            }
                            case "inprogress": {
                                color = "#ffcc00";
                                break;
                            }
                            case "in_progress": {
                                color = "#ffcc00";
                                break;
                            }
                            case "cancelled": {
                                color = "#808080";
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
                                style={{
                                    fontWeight: "500",
                                    fontSize: "12px",
                                    textAlign: "center",
                                    minWidth: "100px",
                                }}
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
        switch (record.priority.toLowerCase()) {
            case "high": {
                rowClassName = "tasklist data-row-high";
                break;
            }
            case "medium": {
                rowClassName = "tasklist data-row-medium";
                break;
            }
            case "low": {
                rowClassName = "tasklist data-row-low";
                break;
            }
            case "moderate": {
                rowClassName = "tasklist data-row-moderate";
                break;
            }
        }
        console.log("rowClassName", rowClassName);
        return rowClassName;
    };

    const filterHandler = (queryString: string) => {
        api.getAllTask(queryString).then((resp: any) => {
            setAllTask(resp.data);
        });
        getContentRender();
    };

    // Search input change handler
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
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

        if (searchQuery.trim() !== "") {
            retVal = retVal.filter((item) => {
                return item.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            });
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
                    className="form-row"
                    style={{ marginTop: "0" }}
                >
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        style={{
                            float: "right",
                            marginBottom: "10px",
                            marginTop: "7px",
                        }}
                    >
                        <Input
                            placeholder="Search..."
                            className="search-box"
                            bordered={false}
                            onChange={handleSearch}
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
                            marginTop: "0",
                        }}
                    ></Col>
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        style={{ paddingTop: "20px", textAlign: "right" }}
                    >
                        <div
                            className="btn-link expanddiv"
                            title="Click here to show more filters"
                            onClick={onSwitchMoreFilter}
                        >
                            <span>
                                <FilterTwoTone />
                            </span>
                            <FontAwesomeIcon
                                icon={!showMoreFilter ? faAngleDown : faAngleUp}
                                style={{
                                    fontSize: "13px",
                                    paddingLeft: "5px",
                                }}
                            />
                        </div>
                    </Col>
                </Row>
                <Row
                    gutter={[8, 8]}
                    className={`form-row`}
                    style={{
                        marginTop: "0",
                    }}
                >
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 24 }}
                        style={{
                            float: "right",
                            marginBottom: "0",
                            marginTop: "0",
                        }}
                    >
                        <Fillter
                            showMoreFilter={showMoreFilter}
                            filterHandler={filterHandler}
                        />
                    </Col>
                </Row>
                <Row
                    gutter={[8, 8]}
                    className="form-row"
                    style={{ marginTop: "0" }}
                >
                    <Table
                        id={"taskTable"}
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
                        pagination={{
                            defaultPageSize: 10,
                        }}
                        size="small"
                        style={{ width: "100%" }}
                    />
                </Row>
            </div>
        );
    };

    const upcomingContent = () => {
        return (
            <div>
                <Row
                    gutter={[8, 8]}
                    className="form-row"
                    style={{ marginTop: "0" }}
                >
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        style={{
                            float: "right",
                            marginBottom: "0",
                            marginTop: "7px",
                        }}
                    >
                        <Input
                            placeholder="Search..."
                            className="search-box border-bottom"
                            bordered={false}
                            onChange={handleSearch}
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
                            marginTop: "0",
                        }}
                    ></Col>
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        style={{ paddingTop: "20px", textAlign: "right" }}
                    >
                        <div
                            className="btn-link expanddiv"
                            title="Click here to show more filters"
                            onClick={onSwitchMoreFilter}
                        >
                            <span>
                                <FilterTwoTone />
                            </span>
                            <FontAwesomeIcon
                                icon={!showMoreFilter ? faAngleDown : faAngleUp}
                                style={{
                                    fontSize: "13px",
                                }}
                            />
                        </div>
                    </Col>
                </Row>
                <Row
                    gutter={[8, 8]}
                    className={`form-row`}
                    style={{
                        marginTop: "0",
                    }}
                >
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 24 }}
                        style={{
                            float: "right",
                            marginBottom: "0",
                            marginTop: "0",
                        }}
                    >
                        <Fillter
                            showMoreFilter={showMoreFilter}
                            filterHandler={filterHandler}
                        />
                    </Col>
                </Row>
                <Row
                    gutter={[8, 8]}
                    className="form-row"
                    style={{ marginTop: "0" }}
                >
                    <Table
                        id={"taskTable"}
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
                <Row
                    gutter={[8, 8]}
                    className="form-row"
                    style={{ marginTop: "0" }}
                >
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        style={{
                            float: "right",
                            marginBottom: "0",
                            marginTop: "7px",
                        }}
                    >
                        <Input
                            placeholder="Search..."
                            prefix={<SearchOutlined />}
                            className="search-box border-bottom"
                            bordered={false}
                            onChange={handleSearch}
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
                        <div
                            className="btn-link expanddiv"
                            title="Click here to show more filters"
                            onClick={onSwitchMoreFilter}
                        >
                            <span>
                                <FilterTwoTone />
                            </span>
                            <FontAwesomeIcon
                                icon={!showMoreFilter ? faAngleDown : faAngleUp}
                                style={{
                                    fontSize: "13px",
                                }}
                            />
                        </div>
                    </Col>
                </Row>
                <Row
                    gutter={[8, 8]}
                    className={`form-row`}
                    style={{
                        marginTop: "0",
                    }}
                >
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 24 }}
                        style={{
                            float: "right",
                            marginBottom: "0",
                            marginTop: "0",
                        }}
                    >
                        <Fillter
                            showMoreFilter={showMoreFilter}
                            filterHandler={filterHandler}
                        />
                    </Col>
                </Row>
                <Row
                    gutter={[8, 8]}
                    className="form-row"
                    style={{ marginTop: "0" }}
                >
                    <Table
                        id={"taskTable"}
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
        <div className={styles.taskPageWrapper}>
            <div
                className={classNames(
                    "card-header d-flex",
                    styles.taskPageHeader
                )}
            >
                <div
                    className={classNames(
                        "d-flex align-items-center w-100",
                        styles.taskHeaderTitle
                    )}
                >
                    <div className="me-auto">
                        <h5
                            className={classNames(
                                "my-2 position-relative z-index-1",
                                styles.taskLabel
                            )}
                        >
                            Task
                        </h5>
                    </div>
                </div>
            </div>
            <div className={styles.taskBottomWrapper}>
                <div className="task-list-header">
                    <div>
                        <Tabs
                            defaultActiveKey="1"
                            items={tabContent}
                            onChange={onTabChange}
                            style={{ width: "100%" }}
                            tabBarExtraContent={
                                <>
                                    <Button
                                        onClick={addNewMultiTaskHandler}
                                        className={styles.newTaskBtn}
                                        type="primary"
                                        style={{
                                            float: "left",
                                            marginRight: "10px",
                                        }}
                                    >
                                        Add Multiple Task
                                    </Button>
                                    <Button
                                        onClick={addNewTaskHandler}
                                        className={styles.newTaskBtn}
                                        type="primary"
                                        style={{ float: "left" }}
                                    >
                                        Add New Task
                                    </Button>
                                </>
                            }
                        ></Tabs>
                    </div>
                    <div
                        className={classNames(
                            "ms-auto z-index-1",
                            styles.taskListAdd
                        )}
                    ></div>
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
                    {tableRowSelected &&
                        Object.keys(tableRowSelected).length > 0 && (
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
            </div>
        </div>
    );
};

export default TaskList;
