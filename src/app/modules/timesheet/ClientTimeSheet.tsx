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
const { Title } = Typography;

const columns = [
    {
        title: "Date",
        dataIndex: "starttime",
        key: "starttime",
        ellipsis: true,
        width: 110,
        sorter: (a: any, b: any) => a.any - b.any,
        render: () => <Input value="03-08-2022" className="Et4" />,
    },
    {
        title: "Client Name",
        dataIndex: "clientname",
        key: "cliename",
        sorter: (a: any, b: any) => a.any - b.any,
        render: () => <Input value="Trusha Bhanderi" className="Et4" />,
    },
    {
        title: "Task",
        dataIndex: "Task",
        key: "Task",
        width: 240,
        sorter: (a: any, b: any) => a.any - b.any,
        render: () => (
            <div className="scrollabletd">
                organic lomo retro fanny pack lo-fi farm-to-table
                readymade.organic lomo retro fanny pack lo-fi farm-to-table
                readymade.organic lomo retro fanny pack lo-fi farm-to-table
                readymade.
            </div>
        ),
    },

    {
        title: "Work Area",
        dataIndex: "workarea",
        key: "workarea",
        width: 120,
        sorter: (a: any, b: any) => a.any - b.any,
        render: () => <Input value="GST" className="Et4" />,
    },
    {
        title: "Budget Time",
        dataIndex: "Budget Time",
        key: "Budget Time",
        sorter: (a: any, b: any) => a.any - b.any,
        render: () => <Input value="02h 30m" className="Et4" />,
    },
    {
        title: "Actual Time",
        dataIndex: "Actual Time",
        key: "Actual Time",
        sorter: (a: any, b: any) => a.any - b.any,
        render: () => <Input value="02h 00m" className="Et4" />,
    },
    {
        title: "Differance",
        dataIndex: "Differance",
        key: "Differance",
        width: 120,
        sorter: (a: any, b: any) => a.any - b.any,
        render: () => (
            <Input value="30+" style={{ color: "green" }} className="Et4" />
        ),
    },
];

const data = [
    {
        key: "1",
        name: "John",
        age: 32,
        address: "New York",
    },
    {
        key: "2",
        name: "Jane",
        age: 28,
        address: "London",
    },
    {
        key: "3",
        name: "Jim",
        age: 34,
        address: "Paris",
    },
];

function onChange(sorter: any) {
    console.log(sorter);
}
const ClientTimeSheet = () => {
    const [activeTab, setActiveTab] = useState<string>("2");

    const [fullScreenMode, setFullScreenMode] = useState<boolean>(false);

    const onTabChange = (key: string) => {
        setActiveTab(key);
        setFullScreenMode(false);
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
                        <FilePdfTwoTone className="Et2" />
                        <FileExcelTwoTone className="Et2" />
                        <ShareAltOutlined className="Et2" />
                        <PrinterTwoTone className="Et2" />
                    </span>
                </div>
                <Select value="Client Name*" className="Et3" />
                <Select value="Employee Name" className="Ct1" />
                <Select value="Work Area" className="Ct1" />
                <DatePicker className="Et3" placeholder="Date" />
                <Select value="All" className="Ct1" />
                <div className="summery">
                    <ul className="summery1">
                        <li className="Et7">
                            <div>
                                <Image src="" />
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
                        dataSource={data}
                        pagination={{ defaultCurrent: 1, total: 2 }}
                        onChange={onChange}
                    />
                </div>
            </div>
        </>
    );
};

export default ClientTimeSheet;
