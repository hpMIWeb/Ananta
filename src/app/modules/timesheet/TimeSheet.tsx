import { useState } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
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
} from "antd";
import type { TabsProps } from "antd";
import "./TimeSheet.scss";
import { Link } from "react-router-dom";
const { Title } = Typography;

const columns = [
    {
        title: "Start Time",
        dataIndex: "starttime",
        key: "starttime",
        ellipsis: true,
        sorter: (a: any, b: any) => a.any - b.any,
        render: () => <Input value="10:30" readOnly className="w102" />,
    },
    {
        title: "End Time",
        dataIndex: "endtime",
        key: "endtime",
        sorter: (a: any, b: any) => a.any - b.any,
        render: () => (
            <Input placeholder="End Date" type="text" className="w102" />
        ),
    },
    {
        title: "Client Name",
        dataIndex: "clientname",
        key: "cliename",
        sorter: (a: any, b: any) => a.any - b.any,
        render: () => <Select value="Client Name" className="w102" />,
    },
    {
        title: "Work Area",
        dataIndex: "workarea",
        key: "workarea",
        sorter: (a: any, b: any) => a.any - b.any,
        render: () => <Select value="Work Area" className="w102" />,
    },
    {
        title: "Particulars",
        dataIndex: "particular",
        key: "particular",
        sorter: (a: any, b: any) => a.any - b.any,
        render: () => (
            <Input placeholder="Particulars" type="text" className="w102" />
        ),
    },
    {
        title: "Remark",
        dataIndex: "ramark",
        key: "remark",
        sorter: (a: any, b: any) => a.any - b.any,
        render: () => (
            <Input placeholder="Remark" type="text" className="w102" />
        ),
    },
    {
        title: "Total Time",
        dataIndex: "totaltime",
        key: "totaltime",
        sorter: (a: any, b: any) => a.any - b.any,
        render: () => <Input value="1hr" readOnly className="w102" />,
    },
    {
        title: "Action",
        dataIndex: "action",
        key: "action",
        sorter: (a: any, b: any) => a.any - b.any,
        render: () => (
            <span>
                <FontAwesomeIcon
                    icon={faEdit}
                    className="btn-at"
                    title="Edit Timesheet"
                    style={{
                        color: "#2c7be5",
                        marginLeft: "15px",
                    }}
                />
                <Divider type="vertical" />
                <FontAwesomeIcon
                    icon={faTrash}
                    className="btn-at"
                    title="Delete Timesheet"
                    style={{ color: "#fa5c7c" }}
                />
            </span>
        ),
    },
];

const data = [
    {
        key: "1",
    },
    {
        key: "2",
    },
    {
        key: "3",
    },
];

function onChange(sorter: any) {
    console.log(sorter);
}
const TimeSheet = () => {
    const [activeTab, setActiveTab] = useState<string>("1");

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
                <Title level={5}>Timesheet</Title>
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
                    />
                </div>
            </div>
            <div style={{ textAlign: "right" }}>
                <DatePicker
                    placeholder="Date"
                    name="due_date"
                    className="w101"
                />
            </div>
            <div>
                <Table
                    className="w102"
                    columns={columns}
                    dataSource={data}
                    pagination={{ pageSize: 100 }}
                    scroll={{ x: 1300 }}
                    onChange={onChange}
                />
            </div>
        </>
    );
};
export default TimeSheet;
