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
    Divider,
} from "antd";
import "./Department.scss";
import { leaveTypeOpts } from "../../../utilities/utility";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import api from "../../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import {
    Department as IDepartment,
    AddDepartment as IAddDepartment,
} from "./interfaces/IDeparment";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
const { Title } = Typography;
const pageSize = 25;

const Department = () => {
    const [current, setCurrent] = useState(1);
    const [departmentList, setDepartmentList] = useState<IDepartment[]>([]);
    const [addDepartment, setAddDepartment] = useState<IAddDepartment>(
        {} as IAddDepartment
    );
    const [selectedDepartment, setSelectedDepartment] = useState<IDepartment>(
        {} as IDepartment
    );
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [form] = Form.useForm();

    const deleteClickHandler = (departmentId: string) => {
        // Delete from  DB
        api.deleteDepartment(departmentId)
            .then((resp: any) => {
                const updatedData = departmentList.filter(
                    (item: IDepartment) => item.DepartmentId !== departmentId
                );
                setDepartmentList(updatedData);
                toast.success("Department successfully deleted.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .catch((error) => {
                toast.error("Technical error while deleting Department.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    const editClickHandler = (department: IDepartment) => {
        console.log(department);
        setSelectedDepartment(department);
        setModalMode("edit"); // Set mode to "edit"
        showModal(); // Open the modal
    };

    const columns = [
        {
            title: "Sr.No",
            dataIndex: "",
            key: "",
            width: "5%",
            render: (_: any, __: any, index: any) => index + 1,
            sorter: (a: any, b: any) => a.key - b.key, // Sort by key (index)
            className: "center-align-cell",
        },
        {
            title: "Department Name",
            dataIndex: "DepartmentName",
            key: "DepartmentName",
            width: "65%",
            sorter: (a: any, b: any) =>
                a.DepartmentName.localeCompare(b.DepartmentName),
        },
        {
            title: "Employee",
            dataIndex: "EmployeeCount",
            key: "EmployeeCount",
            width: "20%",
        },
        {
            title: "Action",
            dataIndex: "",
            key: "action",
            width: "10%",
            render: (_: any, record: IDepartment) => (
                <span className="totalTimeDisplay">
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
                        onConfirm={() =>
                            deleteClickHandler(record.DepartmentId)
                        }
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

    useEffect(() => {
        getDepartmentList();
    }, []);

    const getDepartmentList = () => {
        api.getDepartment().then((resp: any) => {
            setDepartmentList(resp.data);
        });
    };

    const getData = (current: number, pageSize: number) => {
        const returnVal = departmentList.slice().reverse();
        return returnVal.map((item: any, index: number) => {
            item.key = index;
            return item;
        });
    };

    function onChange(sorter: any) {
        console.log(sorter);
    }

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

        setAddDepartment({
            ...addDepartment,
            [name]: value,
        });
    };

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                try {
                    if (modalMode === "add") {
                        // Add logic
                        api.createDepartment(addDepartment).then(
                            (resp: any) => {
                                toast.success("Successfully department add.", {
                                    position: toast.POSITION.TOP_RIGHT,
                                });
                                form.resetFields();
                                setIsModalOpen(false);
                                getDepartmentList();
                                console.log(resp.data);
                                // setDepartmentList([
                                //     ...departmentList,
                                //     resp.data,
                                // ]);
                            }
                        );
                    } else {
                        // Edit logic
                        api.updateDepartment(
                            addDepartment,
                            selectedDepartment.DepartmentId
                        ).then((resp: any) => {
                            toast.success("Successfully department updated.", {
                                position: toast.POSITION.TOP_RIGHT,
                            });
                            form.resetFields();
                            setIsModalOpen(false);
                            setSelectedDepartment({} as IDepartment);
                            getDepartmentList();
                        });
                    }
                } catch (ex) {
                    toast.error("Technical error while creating Task", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            })
            .catch((errorInfo) => {
                setIsModalOpen(true);
                console.log("Validation failed:", errorInfo);
            });
    };

    const handleCancel = () => {
        //form.resetFields();
        setIsModalOpen(false);
    };

    /*Modal action end */
    return (
        <>
            <div>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 4 }}>
                        <Title level={4}>Department</Title>
                    </Col>
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 16 }}
                        md={{ span: 18 }}
                    ></Col>
                    <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 2 }}>
                        <Button
                            type="primary"
                            className="At2"
                            onClick={showModal}
                            style={{ float: "right", marginBottom: "10px" }}
                        >
                            Add New
                        </Button>
                    </Col>
                </Row>
            </div>
            <ToastContainer autoClose={25000} />

            <div>
                <div className="client-details">
                    <Table
                        id="departmentTable"
                        columns={columns}
                        dataSource={getData(current, pageSize)}
                        onChange={onChange}
                        size="small"
                        style={{ width: "100%" }}
                        className="table-striped-rows  departmentTable"
                        bordered
                    />
                </div>
            </div>
            <Modal
                title={
                    modalMode === "add"
                        ? "Add New Department"
                        : "Edit Department"
                } // Modify the title
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form}>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 16 }}
                            md={{ span: 24 }}
                        >
                            <Form.Item
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter department name",
                                    },
                                ]}
                                initialValue={
                                    modalMode === "edit"
                                        ? selectedDepartment.DepartmentName
                                        : undefined
                                }
                            >
                                <Input
                                    placeholder="Department Name"
                                    className="w100"
                                    name="name"
                                    onChange={(event) => {
                                        inputChangeHandler(event);
                                    }}
                                />
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
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter a description!",
                                    },
                                ]}
                                initialValue={
                                    modalMode === "edit"
                                        ? selectedDepartment.DepartmentDescription
                                        : undefined
                                }
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Description.."
                                    name="description"
                                    onChange={(event) => {
                                        inputChangeHandler(
                                            event,
                                            "description"
                                        );
                                    }}
                                    defaultValue={
                                        selectedDepartment.DepartmentDescription
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default Department;
