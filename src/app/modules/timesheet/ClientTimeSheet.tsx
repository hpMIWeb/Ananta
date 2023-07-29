import React, { useState } from "react";
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
import "./ClientTimeSheet.scss";
import { Link } from "react-router-dom";
import {
    workAreaOpts,
    clientOpts,
    employeeOpts,
    chargesOpts,
    calculateTimeDifference,
} from "../../utilities/utility";
import api from "../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
const { Title } = Typography;
const pageSize = 20;

const ClientTimeSheet = () => {
    const [current, setCurrent] = useState(1);
    const [activeTab, setActiveTab] = useState<string>("2");
    const [clientReport, setClientReport] = useState<[]>([]);

    const columns = [
        {
            title: "Date",
            dataIndex: "starttime",
            key: "starttime",
            ellipsis: true,
            width: "10%",
            sorter: (a: string, b: string) => dayjs(a).unix() - dayjs(b).unix(),
            render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
        },
        {
            title: "Client Name",
            dataIndex: "client",
            key: "client",
            width: "25%",
            sorter: (a: any, b: any) => a.client.localeCompare(b.client),
        },
        {
            title: "Task",
            dataIndex: "remark",
            key: "remark",
            width: "25%",
            sorter: (a: any, b: any) => a.remark.localCompare(b.remark),
            render: (remark: string) => (
                <div className="scrollabletd">{remark}</div>
            ),
        },
        {
            title: "Work Area",
            dataIndex: "work_area",
            key: "work_area",
            width: "240",

            sorter: (a: any, b: any) => a.work_area.localCompare(b.work_area),
        },
        {
            title: "Budget Time",
            dataIndex: "budget_time",
            key: "budget_time",
            sorter: (a: any, b: any) =>
                a.budget_time.localCompare(b.budget_time),
        },
        {
            title: "Actual Time",
            dataIndex: "actual_time",
            key: "actual_time",
            sorter: (a: any, b: any) =>
                a.actual_time.localCompare(b.actual_time),
        },
        {
            title: "Differance",
            dataIndex: "total_time",
            key: "total_time",
            width: 120,
            sorter: (a: any, b: any) => a.start_time.localCompare(b.total_time),
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

    function onChange(sorter: any) {
        console.log(sorter);
    }

    const onTabChange = (key: string) => {
        setActiveTab(key);
    };

    const downloadPDF = () => {
        // manage down load()
        console.log("dsDD");
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
        console.log("dsDD");
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

    const printData = () => {
        // manage down load()

        window.print();
    };

    let parameters: string[] = [];
    const getClientReport = (event: any, nameItem: string = "") => {
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

        if (name === "employeeName") {
            if (value === "") {
            }
            toast.error("Please select employee.", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

        switch (name) {
            case "employeeName": {
                if (value !== "") {
                    parameters.push(
                        `employeeName=${encodeURIComponent(value)}`
                    );
                }
                break;
            }
            case "clientName": {
                if (value !== "") {
                    parameters.push(`clientName=${encodeURIComponent(value)}`);
                }
                break;
            }
            case "workArea": {
                if (value !== "") {
                    parameters.push(`workArea=${encodeURIComponent(value)}`);
                }
                break;
            }
            case "billable": {
                if (value !== "") {
                    parameters.push(`billable=${encodeURIComponent(value)}`);
                }
                break;
            }
            case "date": {
                if (value !== "") {
                    parameters.push(`date=${encodeURIComponent(value)}`);
                }
                break;
            }
            default:
                break;
        }

        const queryString = parameters.join("&");
        console.log(queryString);
        try {
            api.getClientTimesheetReport("?" + queryString).then(
                (resp: any) => {
                    localStorage.setItem(
                        "clientReport",
                        JSON.stringify(resp.data)
                    );
                    setClientReport(resp.data);
                }
            );
        } catch (ex) {
            toast.error("Technical error while Download.", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const getData = (current: number, pageSize: number) => {
        let returnVal = clientReport;
        console.log(clientReport);

        return returnVal
            .map((item: any, index: number) => {
                item.key = index;
                return item;
            })
            .slice((current - 1) * pageSize, current * pageSize);
    };

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
                <Title level={5}>TimeSheet</Title>
            </div>

            <div
                className="task-list-header"
                style={{ borderBottom: "2px solid #d8e2ef" }}
            >
                <div>
                    <ToastContainer />
                    <Tabs
                        defaultActiveKey="3"
                        items={tabContent}
                        onChange={onTabChange}
                        style={{ width: "100%" }}
                    />
                </div>
            </div>
            <div>
                <div className="Et1">
                    <span>
                        <FilePdfTwoTone className="Et2" onClick={downloadPDF} />
                        <FileExcelTwoTone
                            className="Et2"
                            onClick={downloadExcel}
                        />
                        <ShareAltOutlined
                            className="Et2"
                            onClick={downloadExcel}
                        />
                        <PrinterTwoTone className="Et2" onClick={printData} />
                    </span>
                </div>
                <Row gutter={[8, 8]} className={"mt-10 form-row"}>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }}>
                        <Select
                            allowClear
                            showSearch
                            placeholder="clientName*"
                            options={clientOpts}
                            className="w100 border-bottom"
                            bordered={false}
                            onChange={(value, event) => {
                                getClientReport(event, "clientName");
                            }}
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }}>
                        {" "}
                        <Select
                            allowClear
                            showSearch
                            placeholder="Employee"
                            options={employeeOpts}
                            className="w100 border-bottom"
                            bordered={false}
                            onChange={(value, event) => {
                                getClientReport(event, "employeeName");
                            }}
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }}>
                        <Select
                            allowClear
                            showSearch
                            placeholder="Work Area"
                            options={workAreaOpts}
                            className="w100 border-bottom"
                            bordered={false}
                            onChange={(value, event) => {
                                getClientReport(event, "workArea");
                            }}
                        />
                    </Col>
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 4 }}
                        className="border-bottom"
                    >
                        <DatePicker
                            placeholder="Date"
                            className="w100 border-bottom"
                            bordered={false}
                            name="name"
                            onChange={(value, event) => {
                                getClientReport(event, "date");
                            }}
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }}>
                        <Select
                            allowClear
                            showSearch
                            placeholder="Charges"
                            options={chargesOpts}
                            className="w100 border-bottom"
                            bordered={false}
                            onChange={(value, event) => {
                                getClientReport(event, "billable");
                            }}
                        />
                    </Col>
                </Row>
                <div className="summery">
                    <ul className="summery1">
                        <li className="Et7">
                            <div>
                                <img
                                    src={
                                        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80"
                                    }
                                    alt="Assignee"
                                    className="assigneeImage"
                                />
                            </div>
                            <p className="Et6">Trusha Bhanderi</p>
                        </li>
                        <Divider type="vertical" />
                        <li className="Et7">
                            <p className="Et6">23-05-2022 To 30-05-2022</p>
                            <p className="Et8">Time Period</p>
                        </li>
                        <Divider type="vertical" />
                        <li className="Et7">
                            <p className="Et6">20</p>
                            <p className="Et8">Total Task</p>
                        </li>
                        <Divider type="vertical" />
                        <li className="Et7">
                            <p className="Et6">25h 30m</p>
                            <p className="Et8">Total Budget Time</p>
                        </li>
                        <Divider type="vertical" />
                        <li className="Et7">
                            <p className="Et6">35h 30m</p>
                            <p className="Et8">Total Actual Time</p>
                        </li>
                        <Divider type="vertical" />
                        <li className="Et7">
                            <p className="Et6">35h 30m</p>
                            <p className="Et8">Total Difference</p>
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
        </>
    );
};

export default ClientTimeSheet;
