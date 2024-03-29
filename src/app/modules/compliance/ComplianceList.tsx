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
import { Compliance as ICompliance } from "./interfaces/ICompliance";
import dayjs from "dayjs";
import "./ComplianceList.scss";
import { useNavigate } from "react-router-dom";
import ComplianceViewEdit from "./ComplianceViewEdit";
import api from "../../utilities/apiServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAlignLeft,
    faAngleDown,
    faAngleUp,
    faCalendarAlt,
    faCalendarDays,
    faUser,
    faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
    complianceReportOpts,
    clientOpts,
    upperText,
} from "../../utilities/utility";
import Fillter from "../fillter/Fillter";
import ComplianceFilter from "../fillter/ComplianceFilter";
import { SearchOutlined, UserOutlined, FilterTwoTone } from "@ant-design/icons";
const { Title } = Typography;
const pageSize = 50;

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
    const [reportType, setReportType] = useState<string>("compliance_wise");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const screenModeToggle = () => {
        setFullScreenMode(!fullScreenMode);
    };

    const onTabChange = (key: string) => {
        setActiveTab(key);
        setFullScreenMode(false);
        setReportTab(key === "4" || key === "5" ? true : false);
    };

    useEffect(() => {
        getComplianceData();
    }, []);

    const getComplianceData = () => {
        api.getAllCompliance("").then((resp: any) => {
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
            width: "30rem",
            sorter: (a: any, b: any) => a.title.localeCompare(b.title),
            render: (text: string) => (
                <span className="list-short-title">{text}</span>
            ),
        },
        {
            title: "Compliance date",
            dataIndex: "start_date",
            key: "start_date",
            width: "6rem",
            render: (start_date: string) => (
                <span className="clientDiv dueDate">
                    <FontAwesomeIcon
                        icon={faCalendarAlt}
                        style={{ marginRight: "5px" }}
                    />
                    <span>{dayjs(start_date).format("DD MMM h:mma")}</span>
                </span>
            ),
        },
        {
            title: "Sub Compliance",
            dataIndex: "",
            key: "",
            width: "6rem",
            render: (start_date1: string) => (
                <div className="clientDiv">
                    <FontAwesomeIcon icon={faUser} style={{}} />
                    &nbsp; 0/10
                </div>
            ),
        },
        {
            title: "Process",
            dataIndex: "",
            key: "",
            render: (start_date: string) => (
                <div className="clientDiv">
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
                <span style={{ float: "right" }}>
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
                            case "inprogress": {
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
                                color = "#00ca72";
                                title = "completed";
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
                                {upperText(title)}
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

    const rowClassHandler = (record: ICompliance) => {
        let rowClassName = "";
        switch (record.priority.toLowerCase()) {
            case "high": {
                rowClassName = "tasklist  data-row-high";
                break;
            }
            case "medium": {
                rowClassName = "tasklist  data-row-medium";
                break;
            }
            case "low": {
                rowClassName = "tasklist  data-row-low";
                break;
            }
            case "moderate": {
                rowClassName = "tasklist  data-row-moderate";
                break;
            }
        }
        return rowClassName;
    };

    const rowClassHandlerForReport = (record: ICompliance) => {
        let rowClassName = "";
        switch (record.status.toLowerCase()) {
            case "pending":
            case "1": {
                rowClassName = "tasklist complianceReportRow ";
                break;
            }
            case "2": {
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

    // Search input change handler
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    const getData = (current: number, pageSize: number, rangeMode: string) => {
        let retVal: ICompliance[] = [];

        switch (rangeMode) {
            case "today": {
                retVal = allCompliance.filter((item: ICompliance) => {
                    return dayjs(item.start_date, dateFormat).isSame(
                        dayjs().format(dateFormat)
                    );
                });
                break;
            }
            case "upcoming": {
                retVal = allCompliance.filter((item: ICompliance) => {
                    return dayjs(item.start_date, dateFormat).isAfter(
                        dayjs().format(dateFormat)
                    );
                });
                break;
            }
            case "history": {
                retVal = allCompliance.filter((item: ICompliance) => {
                    return dayjs(item.start_date, dateFormat).isBefore(
                        dayjs().format(dateFormat)
                    );
                });
                break;
            }
            case "report": {
                retVal = allCompliance.filter((item: ICompliance) => {
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

    const handelReportType = (value: string) => {
        console.log("value", value);
        setReportType(value);
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
                        style={{ width: "100%" }}
                        size="small"
                        showSorterTooltip
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
                            marginBottom: "10px",
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
                        id={"complianceListRow"}
                        dataSource={getData(current, pageSize, "upcoming")}
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
                        style={{ width: "100%" }}
                        size="small"
                        showSorterTooltip
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
                            marginBottom: "10px",
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
                        id={"complianceListRow"}
                        dataSource={getData(current, pageSize, "history")}
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
                            placeholder="Report Type"
                            options={complianceReportOpts}
                            className="w100 border-bottom"
                            bordered={false}
                            value={reportType}
                            onChange={handelReportType}
                        />
                    </Col>

                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Select
                            allowClear
                            showSearch
                            placeholder={
                                reportType === "compliance_wise"
                                    ? "Client"
                                    : "Compliance"
                            }
                            options={
                                reportType === "compliance_wise"
                                    ? clientOpts
                                    : []
                            }
                            className="w100 border-bottom"
                            bordered={false}
                        />
                    </Col>

                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        style={{ float: "right" }}
                    >
                        <a
                            className="btn-link expanddiv"
                            href="#"
                            title="Click here to show more filters"
                            onClick={onSwitchMoreFilter}
                        >
                            <span>
                                <FilterTwoTone />
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

                <ComplianceFilter
                    showMoreFilter={showMoreFilter}
                    filterHandler={filterHandler}
                    reportType={reportType}
                />

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

    const reportContentNew = () => {
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
                            placeholder="Report Type"
                            options={complianceReportOpts}
                            className="w100 border-bottom"
                            bordered={false}
                            value={reportType}
                            onChange={handelReportType}
                        />
                    </Col>

                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Select
                            allowClear
                            showSearch
                            placeholder={
                                reportType === "Client"
                                    ? "Client"
                                    : "Compliance"
                            }
                            options={reportType === "Client" ? clientOpts : []}
                            className="w100 border-bottom"
                            bordered={false}
                        />
                    </Col>

                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        style={{ float: "right" }}
                    >
                        <a
                            className="btn-link expanddiv"
                            href="#"
                            title="Click here to show more filters"
                            onClick={onSwitchMoreFilter}
                        >
                            <span>
                                <FilterTwoTone />
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

                <ComplianceFilter
                    showMoreFilter={showMoreFilter}
                    filterHandler={filterHandler}
                    reportType={reportType}
                />

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

    const filterHandler = (queryString: string) => {
        console.log("clientFilterHandler", queryString);
        api.getAllCompliance(queryString).then((resp: any) => {
            setAllCompliance(resp.data);
        });
        getContentRender();
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
            case "4": {
                return reportContent();
            }
            case "5": {
                return reportContentNew();
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
            label: "Upcoming",
        },
        {
            key: "3",
            label: "History",
        },
        {
            key: "4",
            label: "Report",
        },
        {
            key: "5",
            label: "New Report",
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
