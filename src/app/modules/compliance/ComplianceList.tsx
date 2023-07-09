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
    Select,
    Input,
} from "antd";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAlignLeft,
    faCalendarAlt,
    faCalendarDays,
    faUser,
    faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { complianceReportOpts, clientOpts } from "../../utilities/utility";
import Fillter from "../fillter/Fillter";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
const { Title } = Typography;
const pageSize = 20;

const ComplianceList = () => {
    const [showMoreFilter, setShowMoreFilterTask] = useState<boolean>(false);

    const onSwitchMoreFilter = () => {
        setShowMoreFilterTask(!showMoreFilter);
    };
    const [current, setCurrent] = useState(1);
    const [activeTab, setActiveTab] = useState<string>("1");
    const dateFormat = "YYYY-MM-DD";
    const [fullScreenMode, setFullScreenMode] = useState<boolean>(false);
    const [reportTab, setReportTab] = useState<boolean>(false);
    const [tableRowSelected, setTableRowSelected] = useState<any>({});
    const [allCompliance, setAllCompliance] = useState<[]>([]);

    const screenModeToggle = () => {
        setFullScreenMode(!fullScreenMode);
    };

    const reportTabToggle = () => {
        setReportTab(!reportTab);
    };

    const onTabChange = (key: string) => {
        setActiveTab(key);
        setFullScreenMode(false);
        setReportTab(key === "2" ? true : false);
    };

    useEffect(() => {
        getComplianceData();
    }, []);

    const getComplianceData = () => {
        api.getAllCompliance().then((resp: any) => {
            console.log(resp.data);
            setAllCompliance(resp.data);
        });
    };

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
            render: (text: string) => (
                <p className="text-truncate tasklist button p nav-link">
                    {text}
                </p>
            ),
        },
        {
            title: "Compliance date",
            dataIndex: "start_date",
            key: "start_date",
            render: (start_date: string) => (
                <div className="dateDisplay">
                    <FontAwesomeIcon icon={faCalendarAlt} style={{}} />
                    &nbsp; {dayjs(start_date).format(dateFormat)}
                </div>
            ),
        },
        {
            title: "Sub Compliance",
            dataIndex: "start1_date",
            key: "start1_date",
            render: (start_date1: string) => (
                <div className="dateDisplay">
                    <FontAwesomeIcon icon={faUser} style={{}} />
                    &nbsp; 0/10
                </div>
            ),
        },
        {
            title: "task date",
            dataIndex: "start_date",
            key: "start_date",
            render: (start_date: string) => (
                <div className="dateDisplay">
                    <FontAwesomeIcon icon={faAlignLeft} style={{}} />
                    &nbsp; 0/10
                </div>
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
                                break;
                            }
                            case "2": {
                                color = "#40fb27";
                                title = "completed";
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

    const colInfoForReportTab = [
        {
            title: "Compliance Name",
            dataIndex: "title",
            key: "title",
            render: (text: string) => (
                <p className="text-truncate-report">GST Return</p>
            ),
            sorter: (a: any, b: any) => a.title - b.title,
            width: "20%",
        },
        {
            title: "Jan",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <span>
                    {[status].map((item) => {
                        let color = "#fb275d";
                        let title = item;
                        switch (item) {
                            case "completed": {
                                color = "#00ca72";
                                title = "Completed";
                                break;
                            }
                            case "in_progress": {
                                color = "#ffcc00";
                                title = "Inprogress";
                                break;
                            }
                            case "cancelled": {
                                color = "#5e6e82";
                                title = "Cancelled";
                                break;
                            }
                            case "pending": {
                                color = "#fb275d";
                                title = "Pending";
                                break;
                            }
                            case "2": {
                                color = "#40fb27";
                                title = "Completed";
                            }
                        }

                        return <span style={{ color: color }}>{title}</span>;
                    })}
                </span>
            ),
            sorter: (a: any, b: any) => a.status - b.status,
            width: 20,
        },
        {
            title: "Feb",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <p className="text-truncate-report">{status}</p>
            ),
            sorter: (a: any, b: any) => a.status - b.status,
        },
        {
            title: "Mar",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <p className="text-truncate-report">{status}</p>
            ),
            sorter: (a: any, b: any) => a.status - b.status,
        },
        {
            title: "Apr",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <p className="text-truncate-report">{status}</p>
            ),
            sorter: (a: any, b: any) => a.status - b.status,
        },
        {
            title: "May",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <p className="text-truncate-report">{status}</p>
            ),
            sorter: (a: any, b: any) => a.status - b.status,
        },
        {
            title: "Jun",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <p className="text-truncate-report">{status}</p>
            ),
            sorter: (a: any, b: any) => a.status - b.status,
        },
        {
            title: "Jul",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <p className="text-truncate-report">{status}</p>
            ),
            sorter: (a: any, b: any) => a.status - b.status,
        },
        {
            title: "Aug",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <p className="text-truncate-report">{status}</p>
            ),
            sorter: (a: any, b: any) => a.status - b.status,
        },
        {
            title: "Sep",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <p className="text-truncate-report">{status}</p>
            ),
            sorter: (a: any, b: any) => a.status - b.status,
        },
        {
            title: "Oct",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <p className="text-truncate-report">{status}</p>
            ),
            sorter: (a: any, b: any) => a.status - b.status,
        },
        {
            title: "Nov",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <p className="text-truncate-report">{status}</p>
            ),
            sorter: (a: any, b: any) => a.status - b.status,
        },
        {
            title: "Dec",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <p className="text-truncate-report">{status}</p>
            ),
            sorter: (a: any, b: any) => a.status - b.status,
        },
    ];

    const rowClassHandler = (record: IAddCompliance) => {
        let rowClassName = "";
        switch (record.status.toLowerCase()) {
            case "pending":
            case "1": {
                rowClassName = "tasklist complianceListRow data-row-pending";
                break;
            }
            case "completed": {
                rowClassName = "tasklist complianceListRow data-row-completed";
                break;
            }
            case "in_progress": {
                rowClassName =
                    "tasklist complianceListRow data-row-in-progress";
                break;
            }
            case "cancelled": {
                rowClassName = "tasklist complianceListRow data-row-cancel";
                break;
            }
        }
        return rowClassName;
    };

    const rowClassHandlerForReport = (record: IAddCompliance) => {
        let rowClassName = "";
        switch (record.status.toLowerCase()) {
            case "pending":
            case "1": {
                rowClassName = "tasklist complianceReportRow ";
                break;
            }
            case "completed": {
                rowClassName = "tasklist complianceReportRow ";
                break;
            }
            case "in_progress": {
                rowClassName = "tasklist complianceReportRow ";
                break;
            }
            case "cancelled": {
                rowClassName = "tasklist complianceReportRow ";
                break;
            }
        }
        return rowClassName;
    };

    const getData = (current: number, pageSize: number, rangeMode: string) => {
        let retVal: AddCompliance[] = [];

        switch (rangeMode) {
            case "today": {
                retVal = allCompliance.filter((item: IAddCompliance) => {
                    return dayjs(item.start_date, dateFormat).isSame(
                        dayjs().format(dateFormat)
                    );
                });
                break;
            }
            case "report": {
                retVal = allCompliance.filter((item: IAddCompliance) => {
                    return dayjs(item.start_date, dateFormat).isAfter(
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
                    className="form-row"
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
                                {!showMoreFilter
                                    ? "Show Filters "
                                    : "Hide Filters "}
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
                <Fillter showMoreFilter={showMoreFilter} />
                <Row
                    gutter={[8, 8]}
                    className="form-row"
                    style={{ marginTop: "10px" }}
                >
                    <Table
                        id={"complianceListRow"}
                        dataSource={getData(current, pageSize, "today")}
                        rowClassName={rowClassHandler}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    setTableRowSelected(record);
                                },
                            };
                        }}
                        className=""
                        columns={colInfo}
                        showHeader={false}
                        pagination={false}
                        style={{ width: "100%" }}
                        size="small"
                        showSorterTooltip
                    />
                </Row>
            </div>
        );
    };

    const reportContent = () => {
        return (
            <div>
                <Row
                    gutter={[8, 8]}
                    className="form-row"
                    style={{ marginTop: "10px" }}
                >
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Select
                            allowClear
                            showSearch
                            placeholder="Client"
                            options={clientOpts}
                            className="w100"
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Select
                            allowClear
                            showSearch
                            placeholder="Report Type"
                            options={complianceReportOpts}
                            className="w100"
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <a
                            className="btn-link expanddiv"
                            href="#"
                            title="Show Filters"
                            onClick={onSwitchMoreFilter}
                        >
                            <span>
                                {!showMoreFilter
                                    ? "Show Filters"
                                    : "Hide Filters"}
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

                <Row
                    gutter={[8, 8]}
                    className={"form-row " + (!showMoreFilter ? "hide" : "")}
                    style={{ marginTop: "10px" }}
                >
                    <Row gutter={[8, 8]} className=""></Row>
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 24 }}
                    ></Col>
                </Row>
                <Row
                    gutter={[8, 8]}
                    className={"form-row "}
                    style={{ marginTop: "10px" }}
                >
                    <Table
                        id={"complianceReport"}
                        dataSource={getData(current, pageSize, "today")}
                        rowClassName={rowClassHandlerForReport}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    setTableRowSelected(record);
                                },
                            };
                        }}
                        columns={colInfoForReportTab}
                        showHeader={true}
                        size="small"
                        showSorterTooltip
                        scroll={{ x: 1300 }}
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
                return reportContent();
            }
        }
        return null;
    };

    const handleListUpdate = () => {
        getComplianceData();
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
                <div className="compliance-list-add">
                    <div>
                        <Space>
                            <Button
                                type="primary"
                                onClick={addNewComplianceHandler}
                            >
                                Add New Compliance
                            </Button>
                        </Space>
                    </div>
                </div>
            </div>
            <div>
                <div
                    style={{
                        width: reportTab ? "100%" : "65%",
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
                                display: reportTab ? "none" : "",
                                //textAlign: "right",
                                //border: "1px solid #d8e2ef",
                            }}
                        >
                            <ComplianceViewEdit
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

export default ComplianceList;
