import React, { useEffect, useState } from "react";
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
import styles from "./TimeSheet.module.scss";
import "./EmpTimeSheet.scss";
import { Link } from "react-router-dom";
import { workAreaOpts, calculateTimeDifference } from "../../utilities/utility";
import {
    EmployeeReport,
    EmployeeReportSummary,
} from "./interfaces/IEmployeeReport";
import api from "../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../states/store";
import { getClientsReducersApi } from "../../../redux/getClientsReducers";
import { getEmployeesReducersApi } from "../../../redux/getEmployeesReducers";
import classNames from "classnames";

const { Title } = Typography;
const pageSize = 20;

const EmpTimeSheet = () => {
    const [current, setCurrent] = useState(1);
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState<string>("2");
    const [employeeReport, setEmployeeReport] = useState<EmployeeReport[]>([]);
    const [employeeReportSummary, setEmployeeReportSummary] =
        useState<EmployeeReportSummary>(new EmployeeReportSummary());
    const clientList = useSelector((state: any) => state.getClients.data) || [];
    const employeeList =
        useSelector((state: any) => state.getEmployees.data) || [];
    useEffect(() => {
        dispatch(getClientsReducersApi());
        dispatch(getEmployeesReducersApi());
    }, []);

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            width: "10%",
            sorter: (a: string, b: string) => dayjs(a).unix() - dayjs(b).unix(),
            render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
        },
        {
            title: "Client Name",
            dataIndex: "client",
            key: "client",
            sorter: (a: any, b: any) => {
                const clientA = a.client ?? ""; // Use an empty string if 'client' is undefined
                const clientB = b.client ?? ""; // Use an empty string if 'client' is undefined
                return clientA.localeCompare(clientB);
            },
        },
        {
            title: "Task",
            dataIndex: "remark",
            key: "remark",
            width: 240,
            sorter: (a: any, b: any) => {
                const remarkA = a.remark ?? ""; // Use an empty string if 'remark' is undefined
                const remarkB = b.remark ?? ""; // Use an empty string if 'remark' is undefined
                return remarkA.localeCompare(remarkB);
            },
            render: (remark: string) => (
                <div className="scrollbar-td">{remark}</div>
            ),
        },

        {
            title: "Work Area",
            dataIndex: "work_area",
            key: "work_area",
            width: 120,
            sorter: (a: any, b: any) => {
                const work_areaA = a.work_area ?? ""; // Use an empty string if 'work_area' is undefined
                const work_areaB = b.work_area ?? ""; // Use an empty string if 'remark' is undefined
                return work_areaA.localeCompare(work_areaB);
            },
        },
        {
            title: "Budget Time",
            dataIndex: "budget_time",
            key: "budget_time",
            sorter: (a: any, b: any) => {
                const budget_timeA = a.budget_time ?? ""; // Use an empty string if 'budget_time' is undefined
                const budget_timeB = b.budget_time ?? ""; // Use an empty string if 'budget_time' is undefined
                return budget_timeA.localeCompare(budget_timeB);
            },
        },
        {
            title: "Actual Time",
            dataIndex: "actual_time",
            key: "actual_time",
            sorter: (a: any, b: any) => {
                const actual_timeA = a.budget_time ?? ""; // Use an empty string if 'actual_time' is undefined
                const actual_timeB = b.budget_time ?? ""; // Use an empty string if 'actual_time' is undefined
                return actual_timeA.localeCompare(actual_timeB);
            },
        },
        {
            title: "Difference",
            dataIndex: "total_time",
            key: "total_time",
            width: 120,

            render: (total_time: string, record: any) => {
                const { budget_time, actual_time } = record;
                const formattedDiff = calculateTimeDifference(
                    budget_time,
                    actual_time
                );
                // Extract the sign of the difference (+ or -)
                const diffSign = formattedDiff.charAt(0);

                // Apply different styles based on the sign of the difference
                const textStyle = {
                    color: diffSign === "+" ? "green" : "red",
                };
                return <span style={textStyle}>{formattedDiff}</span>;
            },
        },
    ];

    const onTabChange = (key: string) => {
        setActiveTab(key);
    };

    function onChange(sorter: any) {}

    const downloadPDF = () => {
        // manage down load()
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

        // Check if the filter parameter already exists in the parameters array
        const parameterExists = parameters.some((param) =>
            param.startsWith(`${nameItem}=`)
        );

        // If the parameter already exists, remove it from the array
        if (parameterExists) {
            parameters = parameters.filter((param) => {
                return !param.startsWith(`${nameItem}=`);
            });
        }

        // Push the new parameter to the array
        if (value !== "") {
            parameters.push(`${nameItem}=${encodeURIComponent(value)}`);
        }

        let queryString = "";
        if (parameters && parameters.length > 0) {
            queryString = "?" + parameters.join("&");
        }

        try {
            if (queryString !== "") {
                api.getEmployeeTimesheetReport("?" + queryString).then(
                    (resp: any) => {
                        setEmployeeReport(resp.data["data"]);
                        setEmployeeReportSummary(resp.data["header"]);
                    }
                );
            } else {
                setEmployeeReport([]);
                setEmployeeReportSummary(new EmployeeReportSummary());
            }
        } catch (ex) {
            toast.error("Technical error while Download.", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const getData = (current: number, pageSize: number) => {
        let returnVal = employeeReport;
        return returnVal
            .map((item: any, index: number) => {
                item.key = index;
                return item;
            })
            .slice((current - 1) * pageSize, current * pageSize);
    };

    const printData = () => {
        // manage down load()
        window.print();
    };

    const tabContent: TabsProps["items"] = [
        {
            key: "1",
            label: (
                <Link
                    to="/timesheet"
                    style={{
                        textDecoration: "none",
                        color: "rgba(0, 0, 0, 0.88)",
                    }}
                >
                    My Timesheet
                </Link>
            ),
        },
        {
            key: "2",
            label: (
                <Link to="/emp-time-sheet" style={{ textDecoration: "none" }}>
                    Employee Timesheet Report
                </Link>
            ),
        },
        {
            key: "3",
            label: (
                <Link
                    to="/client-time-sheet"
                    style={{
                        textDecoration: "none",
                        color: "rgba(0, 0, 0, 0.88)",
                    }}
                >
                    Client Timesheet Report
                </Link>
            ),
        },
    ];

    return (
        <div className={styles.timeSheetPageWrapper}>
            <div
                className={classNames(
                    "card-header d-flex",
                    styles.timeSheetPageHeader
                )}
            >
                <div
                    className={classNames(
                        "d-flex align-items-center w-100",
                        styles.timeSheetHeaderTitle
                    )}
                >
                    <div className="me-auto">
                        <h5
                            className={classNames(
                                "my-2 position-relative z-index-1",
                                styles.timeSheetLabel
                            )}
                        >
                            Time Sheet
                        </h5>
                    </div>
                </div>
            </div>
            <div className={styles.timeSheetBottomWrapper}>
                <div className="task-list-header">
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
                            <FilePdfTwoTone
                                className="Et2"
                                onClick={downloadPDF}
                            />
                            <FileExcelTwoTone
                                className="Et2"
                                onClick={downloadExcel}
                            />
                            <ShareAltOutlined
                                className="Et2"
                                onClick={downloadExcel}
                            />
                            <PrinterTwoTone
                                className="Et2"
                                onClick={printData}
                            />
                        </span>
                    </div>
                    <div>
                        <Row gutter={[8, 8]} className={"mt-2 mb-2"}>
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 6 }}
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder="Employee"
                                    options={employeeList.map(
                                        (employee: any) => ({
                                            label: employee?.firstName,
                                            value: employee?._id,
                                        })
                                    )}
                                    className="border-bottom w100 customAddClientSelectOptions"
                                    bordered={false}
                                    onChange={(value, event) => {
                                        getEmployeeReport(
                                            event,
                                            "employeeName"
                                        );
                                    }}
                                />
                            </Col>
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 6 }}
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder="clientName"
                                    options={clientList.map((client: any) => ({
                                        label: client?.firmName,
                                        value: client?._id,
                                    }))}
                                    className="w100 border-bottom"
                                    bordered={false}
                                    onChange={(value, event) => {
                                        getEmployeeReport(event, "clientName");
                                    }}
                                />
                            </Col>
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 6 }}
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder="Work Area"
                                    options={workAreaOpts}
                                    className="w100 border-bottom"
                                    bordered={false}
                                    onChange={(value, event) => {
                                        getEmployeeReport(event, "workArea");
                                    }}
                                />
                            </Col>
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 6 }}
                                className="border-bottom"
                            >
                                <DatePicker
                                    placeholder="Date"
                                    className="w100 border-bottom"
                                    bordered={false}
                                    name="name"
                                    onChange={(value, event) => {
                                        getEmployeeReport(event, "date");
                                    }}
                                    //  style={{ borderBottom: "1px solid" }}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className="summery">
                        <ul className="summery1">
                            <li className="w100  employeeLi">
                                <div className="employeeSummaryLable">
                                    <img
                                        src={
                                            "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80"
                                        }
                                        alt="Assignee"
                                        className="assigneeImage"
                                        height={"200px"}
                                        width={"200px"}
                                    />
                                </div>
                                <p className="employeeSummaryData w100">
                                    Pinank
                                </p>
                            </li>
                            <Divider type="vertical" className="divider" />
                            <li className="w100 employeeLi">
                                <p className="employeeSummaryData w100">
                                    {employeeReportSummary.taskCount}
                                </p>
                                <p className="employeeSummaryLable w100">
                                    Time Period
                                </p>
                            </li>
                            <Divider type="vertical" className="divider" />
                            <li className="w100 employeeLi">
                                <p className="employeeSummaryData">
                                    {employeeReportSummary.taskCount}
                                </p>
                                <p className="employeeSummaryLable">
                                    Total Task
                                </p>
                            </li>
                            <Divider type="vertical" className="divider" />
                            <li className="w100 employeeLi">
                                <p className="employeeSummaryData">
                                    {employeeReportSummary.totalBudgetTime}
                                </p>
                                <p className="employeeSummaryLable">
                                    Total Budget Time
                                </p>
                            </li>
                            <Divider type="vertical" className="divider" />
                            <li className="w100 employeeLi">
                                <p className="employeeSummaryData">
                                    {employeeReportSummary.totalActualTime}
                                </p>
                                <p className="employeeSummaryLable">
                                    Total Actual Time
                                </p>
                            </li>
                            <Divider type="vertical" className="divider" />
                            <li className="w100 employeeLi">
                                <p className="employeeSummaryData">
                                    {calculateTimeDifference(
                                        employeeReportSummary.totalBudgetTime,
                                        employeeReportSummary.totalActualTime
                                    )}
                                </p>
                                <p className="employeeSummaryLable">
                                    Total Difference
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Table
                            columns={columns}
                            dataSource={getData(current, pageSize)}
                            pagination={{ defaultCurrent: 1, total: 2 }}
                            onChange={onChange}
                            className="table-striped-rows"
                            bordered
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpTimeSheet;
