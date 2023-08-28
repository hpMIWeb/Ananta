import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Table,
    Typography,
} from "antd";
import {
    DeleteOutlined,
    PlusOutlined,
    EditOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import "./Checklist.scss";
import {
    AddCheckList as IAddCheckList,
    CheckList as ICheckList,
} from "./interface/IChecklist";
import api from "../../../utilities/apiServices";
import { capitalize, employeeOpts } from "../../../utilities/utility";

import { Department as IDepartment } from "../Department/interfaces/IDeparment";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const pageSize = 25;
const { Title } = Typography;

const Checklist = () => {
    const [current, setCurrent] = useState(1);
    const [checklistList, setChecklistList] = useState<ICheckList[]>([]);
    const [addchecklist, setAddCheckList] = useState<IAddCheckList>(
        {} as IAddCheckList
    );
    const [departmentList, setDepartmentList] = useState<IDepartment[]>([]);
    const [selectedChecklist, setSelectedChecklist] = useState<ICheckList>(
        {} as ICheckList
    );
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [form] = Form.useForm();

    const columns = [
        {
            title: "Sr.No",
            dataIndex: "srNo",
            key: "srNo",
            width: "5%",
            sorter: (a: any, b: any) => a.srNo - b.srNo,
            className: "center-align-cell",
        },
        {
            title: "Checklist Name",
            dataIndex: "title",
            width: "55%",
            sorter: (a: ICheckList, b: ICheckList) =>
                a.title.localeCompare(b.title),
        },
        {
            title: "Department",
            dataIndex: "department",
            width: "30%",
            render: (department: any) => (
                <span className="actionColumn">
                    {department && department.name
                        ? department.name
                        : "Unknown Department"}
                </span>
            ),
            sorter: (a: any, b: any) => {
                const departmentA = a.department ? a.department.name : "";
                const departmentB = b.department ? b.department.name : "";
                return departmentA.localeCompare(departmentB);
            },
        },
        {
            title: "Action",
            dataIndex: "",
            key: "action",
            width: "10%",
            render: (_: any, record: ICheckList) => (
                <span className="actionColumn">
                    <FontAwesomeIcon
                        icon={faEdit}
                        className="btn-at"
                        title="Edit Department"
                        style={{ color: "#2c7be5", marginLeft: "15px" }}
                        onClick={() => editClickHandler(record)}
                    />
                    <Divider type="vertical" />
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => deleteClickHandler(record._id)}
                    >
                        <FontAwesomeIcon
                            icon={faTrash}
                            className="btn-at"
                            title="Delete Department"
                            style={{ color: "#fa5c7c" }}
                        />
                    </Popconfirm>
                </span>
            ),
        },
    ];

    const [isModalOpen1, setIsModalOpen1] = useState(false);

    const deleteClickHandler = (checklistId: string) => {
        // Delete from  DB
        api.deleteChecklist(checklistId)
            .then((resp: any) => {
                const updatedData = checklistList.filter(
                    (item: ICheckList) => item._id !== checklistId
                );
                setChecklistList(updatedData);
                toast.success("Checklist successfully deleted.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .catch((error) => {
                toast.error("Technical error while deleting Checklist.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    const editClickHandler = (checklist: ICheckList) => {
        setSelectedChecklist(checklist);
        setModalMode("edit"); // Set mode to "edit"
        showModal(); // Open the modal
    };

    useEffect(() => {
        getChecklist();
        getDepartmentList();
    }, []);

    const getChecklist = () => {
        api.getChecklist().then((resp: any) => {
            console.log(resp.data);
            setChecklistList(resp.data);
        });
    };

    function onChange(sorter: any) {
        console.log(sorter);
    }

    const getData = (current: number, pageSize: number) => {
        const startIndex = (current - 1) * pageSize;
        let retVal = checklistList;

        if (searchQuery.trim() !== "") {
            retVal = retVal.filter((item) => {
                return item.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            });
        }

        return retVal.map((item: any, index: number) => {
            const serialNumber = startIndex + index + 1; // Calculate the serial number
            return {
                ...item,
                key: index,
                srNo: serialNumber, // Assign the serial number to the 'srNo' property
            };
        });
    };

    const getDepartmentList = () => {
        api.getDepartment().then((resp: any) => {
            setDepartmentList(resp.data);
        });
    };
    const showModal1 = () => {
        setIsModalOpen1(true);
    };
    const handleCancel1 = () => {
        //form.resetFields();
        setIsModalOpen1(false);
    };
    const handleOk1 = () => {
        //form.resetFields();
        setIsModalOpen1(false);
    };
    const [isModalOpen2, setIsModalOpen2] = useState(false);

    const showModal2 = () => {
        setIsModalOpen2(true);
    };
    const handleCancel2 = () => {
        //form.resetFields();
        setIsModalOpen2(false);
    };
    const handleOk2 = () => {
        //form.resetFields();
        setIsModalOpen2(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        //form.resetFields();
        setIsModalOpen(false);
    };
    const handleOk = () => {
        //form.resetFields();
        setIsModalOpen(false);
    };

    // Search input change handler
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
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

        setAddCheckList({
            ...addchecklist,
            [name]: value,
        });
    };

    return (
        <div>
            <Row gutter={[8, 8]} className="form-row">
                <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 4 }}>
                    <Title level={4}>Checklist</Title>
                    <ToastContainer autoClose={25000} />
                </Col>

                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 16 }}
                    md={{ span: 18 }}
                ></Col>
                <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 2 }}>
                    <Button
                        type="primary"
                        className="c2"
                        onClick={showModal}
                        style={{ float: "right", marginBottom: "10px" }}
                    >
                        Create New
                    </Button>
                </Col>
            </Row>
            <Divider></Divider>
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
            </Row>
            <div className="client-details">
                <Table
                    columns={columns}
                    dataSource={getData(current, pageSize)}
                    onChange={onChange}
                    size="small"
                    style={{ width: "100%" }}
                    className="table-striped-rows  checklistTable"
                    bordered
                />
            </div>
            <Modal
                title="Sales Entry Checklist"
                open={isModalOpen1}
                width={650}
                onCancel={handleCancel1}
                onOk={handleOk1}
            >
                <hr />
            </Modal>
            <Modal
                title="Sales Entry Checklist"
                open={isModalOpen2}
                onCancel={handleCancel2}
                onOk={handleOk2}
                width={650}
                okText="Save"
                cancelText="Delete"
                cancelButtonProps={{ style: { color: "red" } }}
            >
                <hr />
            </Modal>
            <Modal
                title="Create New Checklist"
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleOk}
                width={650}
                okText="Add"
            >
                <Divider></Divider>
                <Form>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 16 }}
                            md={{ span: 12 }}
                        >
                            <Form.Item
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter checklist name.",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Checklist Name"
                                    className="w100"
                                    name="title"
                                    onChange={(event) => {
                                        inputChangeHandler(event);
                                    }}
                                    defaultValue={addchecklist.title}
                                />
                            </Form.Item>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 16 }}
                            md={{ span: 12 }}
                        >
                            <Form.Item
                                name="department"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter department",
                                    },
                                ]}
                            >
                                <Select
                                    allowClear
                                    options={departmentList.map(
                                        (departmentList) => ({
                                            value: departmentList._id,
                                            label: capitalize(
                                                departmentList.name
                                            ),
                                        })
                                    )}
                                    placeholder="Select Department"
                                    onChange={(value, event) => {
                                        inputChangeHandler(event, "department");
                                    }}
                                    defaultValue={addchecklist.department}
                                    showSearch={true}
                                    className="w100"
                                ></Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider></Divider>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 16 }}
                            md={{ span: 6 }}
                        >
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<PlusOutlined />}
                            />{" "}
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default Checklist;
