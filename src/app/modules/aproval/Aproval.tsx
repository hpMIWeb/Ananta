import React, { useState, useEffect } from "react";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import {
    Table,
    Tabs,
    TabsProps,
    Typography,
    Input,
    Button,
    Modal,
    Row,
    Col,
    DatePicker,
    Select,
    Form,
    Tag,
    Popconfirm,
} from "antd";
import "./Aproval.scss";
import {
    employeeOpts,
    leaveTypeOpts,
    departmentOpts,
} from "../../utilities/utility";
import TextArea from "antd/es/input/TextArea";
import { AddLeave, Leave, LeaveDates, LeaveDate } from "./interfaces/IApproval";
import dayjs from "dayjs";
import api from "../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { Title } = Typography;
const pageSize = 25;

const Approval = () => {
    const [current, setCurrent] = useState(1);
    const [activeTab, setActiveTab] = useState<string>("2");

    const [fullScreenMode, setFullScreenMode] = useState<boolean>(false);
    const [leave, setLeave] = useState<boolean>(false);
    const [addLeaveObj, setAddLeaveObj] = useState<AddLeave>(new Leave());
    const [leaveList, setLeaveList] = useState<AddLeave[]>([]);
    const [leaveDate, setLeaveDate] = useState<LeaveDates>(new LeaveDate());
    const [form] = Form.useForm();

    const columns = [
        {
            title: "Employee Name",
            dataIndex: "employee_name",
            key: "employee_name",
            ellipsis: true,
            width: "15%", // Use percentage instead of fixed width
            sorter: (a: any, b: any) =>
                a.employee_name.localeCompare(b.employee_name),
            render: (employee_name: string) => employee_name,
        },
        {
            title: "Department",
            dataIndex: "department",
            key: "department",
            width: "10%",
            sorter: (a: any, b: any) =>
                a.department.localeCompare(b.department),
            render: (department: string) => department,
        },
        {
            title: "Leave Date",
            dataIndex: "leave_date",
            key: "leave_date",
            width: "25%",
            sorter: (a: any, b: any) =>
                a.leave_date.start_date - b.leave_date.start_date,
            render: (leave_date: LeaveDates) =>
                dayjs(leave_date.start_date).format("YYYY-MM-DD") +
                " To " +
                dayjs(leave_date.end_date).format("YYYY-MM-DD"),
        },

        {
            title: "Reason",
            dataIndex: "leave_reason",
            key: "leave_reason",
            width: "35%",
            sorter: (a: any, b: any) =>
                a.leave_reason.localeCompare(b.leave_reason),
            render: (leave_reason: string) => (
                <div className="scrollbar-td">{leave_reason}</div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: "10%",
            render: (leave_status: string, record: AddLeave) => {
                if (record.leave_status === "pending") {
                    return (
                        <span>
                            <Popconfirm
                                title="Sure to Approve?"
                                onConfirm={() =>
                                    handleUpdateStatus(record._id, "approve")
                                }
                            >
                                <UserAddOutlined
                                    className="userIcon"
                                    style={{
                                        color: "green",
                                        cursor: "pointer",
                                    }}
                                />
                            </Popconfirm>

                            <Popconfirm
                                title="Sure to Reject?"
                                onConfirm={() =>
                                    handleUpdateStatus(record._id, "reject")
                                }
                            >
                                <UserDeleteOutlined
                                    className="userIcon"
                                    style={{ color: "red", cursor: "pointer" }}
                                />
                            </Popconfirm>
                        </span>
                    );
                } else {
                    const statusText =
                        record.leave_status === "approve"
                            ? "Approve"
                            : "Reject";
                    const statusColor =
                        record.leave_status === "approve" ? "green" : "red";
                    return (
                        <Tag color={statusColor} key={statusText}>
                            {statusText.toUpperCase()}
                        </Tag>
                    );
                }
            },
        },
    ];

    useEffect(() => {
        getLeaveList();
    }, []);

    const getLeaveList = () => {
        api.getLeave().then((resp: any) => {
            setLeaveList(resp.data);
        });
    };

    const handleUpdateStatus = (id: string, status: string) => {
        try {
            console.log(id);
            api.updateLeaveStatus(id, status).then((resp: any) => {
                toast.success("Successfully Status change.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                getLeaveList();
            });
        } catch (ex) {
            toast.error("Technical error while updating status.", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };
    const getData = (current: number, pageSize: number) => {
        // let returnVal = leaveList;
        const returnVal = leaveList.slice().reverse();

        console.log(leaveList);

        return returnVal.map((item: any, index: number) => {
            item.key = index;
            return item;
        });
        //   .slice((current - 1) * pageSize, current * pageSize);
    };

    function onChange(sorter: any) {
        console.log(sorter);
    }
    const onTabChange = (key: string) => {
        setActiveTab(key);
        setFullScreenMode(false);
    };

    const tabContent: TabsProps["items"] = [
        {
            key: "1",
            label: "Leave",
        },
        {
            key: "2",
            label: "Task",
        },
    ];

    /*Modal action start*/

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const inputChangeHandler = (event: any, nameItem: string = "") => {
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

        if (name === "leave_date") {
            leaveDate.start_date = value;
            leaveDate.end_date = value;
            setLeaveDate(leaveDate);
        }

        setAddLeaveObj({
            ...addLeaveObj,
            [name]: value,
        });
        console.log(addLeaveObj);
    };

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                const dates = {} as LeaveDates;
                dates.start_date = leaveDate.start_date;
                dates.end_date = leaveDate.end_date;
                addLeaveObj.leave_date = dates;
                addLeaveObj.employee_name = "Pinank Soni";
                addLeaveObj.department = "Development";

                // Check if there is any leave already added for the selected dates
                const isLeaveConflict = leaveList.some((leaveItem) => {
                    const startDate1 = new Date(
                        leaveItem.leave_date.start_date
                    );
                    const endDate1 = new Date(leaveItem.leave_date.end_date);
                    const startDate2 = new Date(leaveDate.start_date);
                    const endDate2 = new Date(leaveDate.end_date);

                    return (
                        (startDate1 <= startDate2 && endDate1 >= startDate2) || // new leave start date is between existing leave range
                        (startDate1 <= endDate2 && endDate1 >= endDate2) || // new leave end date is between existing leave range
                        (startDate1 >= startDate2 && endDate1 <= endDate2) // new leave range completely overlaps with existing leave range
                    );
                });

                if (isLeaveConflict) {
                    toast.error("Leave already added for the selected dates.", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    setIsModalOpen(true);
                    return Promise.reject();
                } else {
                    // Save to DB
                    try {
                        api.applyLeave(addLeaveObj).then((resp: any) => {
                            toast.success("Successfully Leave Apply.", {
                                position: toast.POSITION.TOP_RIGHT,
                            });
                            form.resetFields();
                            setIsModalOpen(false);
                            getLeaveList();
                        });
                    } catch (ex) {
                        toast.error("Technical error while creating Task", {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                    }
                }
            })
            .catch((errorInfo) => {
                setIsModalOpen(true);
                console.log("Validation failed:", errorInfo);
            });
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    /*Modal action end */
    return (
        <>
            <div>
                <Title level={5}>Approvals</Title>
            </div>
            <ToastContainer autoClose={25000} />
            <div
                className="task-list-header"
                style={{ borderBottom: "2px solid #d8e2ef" }}
            >
                <div>
                    <Tabs
                        defaultActiveKey="1"
                        items={tabContent}
                        onChange={onTabChange}
                        style={{ width: "200%", margin: "0px 20px" }}
                    />
                </div>
            </div>
            <div>
                <div className="At1" style={{ float: "right" }}>
                    <Button type="primary" className="At2" onClick={showModal}>
                        Apply
                    </Button>
                </div>

                <div>
                    <Table
                        id=""
                        columns={columns}
                        size="small"
                        dataSource={getData(current, pageSize)}
                        onChange={onChange}
                        style={{ width: "100%" }}
                        className="table-striped-rows"
                    />
                </div>
            </div>
            <Modal
                title="Apply Leave"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form}>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 16 }}
                            md={{ span: 12 }}
                        >
                            <Form.Item
                                name="leave_date"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select a leave date!",
                                    },
                                ]}
                            >
                                <DatePicker
                                    placeholder="Date"
                                    className="w100"
                                    format={"YYYY-MM-DD"}
                                    name="leave_date"
                                    onChange={(date, dateString) => {
                                        inputChangeHandler(
                                            dateString,
                                            "leave_date"
                                        );
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 16 }}
                            md={{ span: 12 }}
                        >
                            <Form.Item
                                name="leave_type"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select a leave type!",
                                    },
                                ]}
                            >
                                <Select
                                    allowClear
                                    placeholder="Leave Type"
                                    className="w100"
                                    options={leaveTypeOpts}
                                    onChange={(value, event) => {
                                        inputChangeHandler(event, "leave_type");
                                    }}
                                ></Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} className="">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        >
                            <Form.Item
                                name="leave_reason"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter a reason!",
                                    },
                                ]}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Reason"
                                    name="leave_reason"
                                    onChange={(event) => {
                                        inputChangeHandler(
                                            event,
                                            "leave_reason"
                                        );
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default Approval;
