import React, { useState, useEffect } from "react";
import {
    Table,
    Typography,
    Input,
    Button,
    Modal,
    Row,
    Col,
    Form,
    Popconfirm,
    Divider,
} from "antd";
import "./Department.scss";
import TextArea from "antd/es/input/TextArea";

import api from "../../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import {
    Department as IDepartment,
    AddDepartment as IAddDepartment,
} from "./interfaces/IDeparment";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
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
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [form] = Form.useForm();

    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [selectedDepartmentEmployees, setSelectedDepartmentEmployees] =
        useState<IDepartment[]>([]);

    const staticEmployees = [
        { EmployeeName: "Employee 1", EmployeeId: "1" },
        { EmployeeName: "Employee 2", EmployeeId: "2" },
        { EmployeeName: "Employee 3", EmployeeId: "3" },
        { EmployeeName: "Employee 4", EmployeeId: "4" },
        { EmployeeName: "Employee 5", EmployeeId: "5" },
    ];

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
            title: "Department Name",
            dataIndex: "DepartmentName",
            key: "DepartmentName",
            width: "70%",
            sorter: (a: any, b: any) =>
                a.DepartmentName.localeCompare(b.DepartmentName),
        },
        {
            title: "Employee",
            dataIndex: "EmployeeCount",
            key: "EmployeeCount",
            width: "5%",
            className: "center-align-cell",
            sorter: (a: any, b: any) => a.EmployeeCount - b.EmployeeCount,
            render: (EmployeeCount: any, record: IDepartment) => (
                <span className="totalTimeDisplay">
                    <span onClick={() => showEmployeeModal(record)}>
                        {EmployeeCount}
                    </span>
                </span>
            ),
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

    const employeeColumns = [
        {
            title: "Employee Name",
            dataIndex: "EmployeeName",
            key: "EmployeeName",
            width: "90%",
        },
        {
            title: "Action",
            dataIndex: "",
            key: "action",
            width: "10%",
            render: (employee: any) => (
                <Popconfirm
                    title="Sure to remove?"
                    onConfirm={() =>
                        removeEmployeeFromDepartment(employee.EmployeeId)
                    }
                >
                    <FontAwesomeIcon
                        icon={faTrash}
                        className="btn-at"
                        title="Delete Department"
                        style={{ color: "#fa5c7c" }}
                    />
                </Popconfirm>
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
        setSelectedDepartment(department);
        setAddDepartment({
            name: department.DepartmentName,
            description: department.DepartmentDescription,
        });
        setModalMode("edit"); // Set mode to "edit"
        showModal(); // Open the modal
    };

    // Search input change handler
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    const getData = (current: number, pageSize: number) => {
        const startIndex = (current - 1) * pageSize;
        let retVal = departmentList;
        const slicedData = departmentList.slice(
            startIndex,
            startIndex + pageSize
        );

        if (searchQuery.trim() !== "") {
            retVal = retVal.filter((item) => {
                return item.DepartmentName.toLowerCase().includes(
                    searchQuery.toLowerCase()
                );
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
        form.resetFields();
        setIsModalOpen(false);
        setSelectedDepartment({} as IDepartment);
        setAddDepartment({
            name: "",
            description: "",
        });
        setModalMode("add"); // Set mode to "add"
    };

    const showEmployeeModal = (department: IDepartment) => {
        setSelectedDepartmentEmployees(department.Employees); // Assuming "Employees" is the property containing the list of employees for a department
        setIsEmployeeModalOpen(true);
    };

    const closeEmployeeModal = () => {
        setSelectedDepartmentEmployees([]);
        setIsEmployeeModalOpen(false);
    };

    const removeEmployeeFromDepartment = (employeeId: string) => {
        // Call your API to remove the employee from the department
        // After successful removal, update the selectedDepartmentEmployees state
        const updatedEmployees = selectedDepartmentEmployees.filter(
            (employee: any) => employee.EmployeeId !== employeeId
        );
        setSelectedDepartmentEmployees(updatedEmployees);
        // You can also update the Employees property of the department in the departmentList state
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
                <Form form={form} initialValues={addDepartment}>
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
                            >
                                <Input
                                    placeholder="Department Name"
                                    className="w100"
                                    name="name"
                                    onChange={(event) => {
                                        inputChangeHandler(event);
                                    }}
                                    // defaultValue={addDepartment.name}
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
                                    //defaultValue={addDepartment.description}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <Modal
                title="Department Employees"
                open={isEmployeeModalOpen}
                onCancel={closeEmployeeModal}
                footer={null}
            >
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        <Button
                            type="primary"
                            style={{ marginBottom: "10px" }}
                            className="w100"
                        >
                            Add Employee
                        </Button>
                    </Col>
                </Row>

                <Table
                    dataSource={staticEmployees}
                    columns={employeeColumns}
                    pagination={false}
                />
            </Modal>
        </>
    );
};

export default Department;
