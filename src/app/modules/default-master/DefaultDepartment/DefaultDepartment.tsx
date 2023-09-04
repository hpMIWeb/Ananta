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
    Spin,
} from "antd";
import "./DefaultDepartment.scss";
import TextArea from "antd/es/input/TextArea";

import api from "../../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import {
    DefaultDepartment as IDefaultDepartment,
    AddDefaultDepartment as IAddDefalutDepartment,
} from "./interfaces/IDefaultDeparment";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import LoadingSpinner from "../../LoadingSpinner"; // Update the path accordingly

const { Title } = Typography;
const pageSize = 25;

const DefaultDepartment = () => {
    const [current, setCurrent] = useState(1);

    const [departmentList, setDepartmentList] = useState<IDefaultDepartment[]>(
        []
    );
    const [addDepartment, setAddDepartment] = useState<IAddDefalutDepartment>(
        {} as IAddDefalutDepartment
    );
    const [selectedDepartment, setSelectedDepartment] =
        useState<IDefaultDepartment>({} as IDefaultDepartment);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [form] = Form.useForm();

    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [selectedDepartmentEmployees, setSelectedDepartmentEmployees] =
        useState<IDefaultDepartment[]>([]);

    const [loading, setLoading] = useState(true);

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
            dataIndex: "name",
            key: "name",
            width: "70%",
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
        },
        {
            title: "Employee",
            dataIndex: "employeeCount",
            key: "employeeCount",
            width: "5%",
            className: "center-align-cell",
            sorter: (a: any, b: any) => a.employeeCount - b.employeeCount,
            render: (employeeCount: any, record: IDefaultDepartment) => (
                <span
                    className="actionColumn"
                    onClick={() => showEmployeeModal(record)}
                >
                    <FontAwesomeIcon
                        icon={faUser}
                        style={{ marginRight: "5px" }}
                    />{" "}
                    <span>{employeeCount ? employeeCount : 0}</span>
                </span>
            ),
        },
        {
            title: "Action",
            dataIndex: "",
            key: "action",
            width: "10%",
            className: "center-align-cell",
            render: (_: any, record: IDefaultDepartment) => (
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
        setLoading(true); // Set loading state to true
        api.getDefaultDepartment()
            .then((resp: any) => {
                setDepartmentList(resp.data);
            })
            .finally(() => {
                setLoading(false); // Reset loading state
            });
    };

    const deleteClickHandler = (departmentId: string) => {
        // Delete from  DB
        setLoading(true); // Set loading state to true
        api.deleteDefaultDepartment(departmentId)
            .then((resp: any) => {
                const updatedData = departmentList.filter(
                    (item: IDefaultDepartment) => item._id !== departmentId
                );
                setDepartmentList(updatedData);
                toast.success("Department successfully deleted.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .finally(() => {
                setLoading(false); // Reset loading state
            })
            .catch((error) => {
                toast.error("Technical error while deleting Department.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    const editClickHandler = (department: IDefaultDepartment) => {
        setModalMode("edit"); // Set mode to "edit"
        setSelectedDepartment(department);
        form.setFieldsValue({
            name: department.name,
            description: department.description,
        });
        setAddDepartment({
            name: department.name,
            description: department.description,
        });
        showModal("edit"); // Open the modal
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
                return item.name
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

    function onChange(sorter: any) {
        console.log(sorter);
    }

    /*Modal action start*/

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = (mode: "add" | "edit") => {
        console.log("mode", mode);
        if (mode === "add") {
            form.resetFields();
            form.setFieldsValue({ name: "", description: "" });
            setModalMode(mode);
            setIsModalOpen(true);
        } else {
            setModalMode(mode);
            setIsModalOpen(true);
        }
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
                console.log("ok modalMode", modalMode);
                //return;
                try {
                    setLoading(true); // Set loading state to true
                    const apiCall =
                        modalMode === "add"
                            ? api.createDefaultDepartment(addDepartment)
                            : api.updateDefaultDepartment(
                                  addDepartment,
                                  selectedDepartment._id
                              );

                    apiCall
                        .then((resp: any) => {
                            const successMessage =
                                modalMode === "add"
                                    ? "Department Added."
                                    : "Department Updated.";

                            toast.success(successMessage, {
                                position: toast.POSITION.TOP_RIGHT,
                            });

                            form.setFieldsValue({} as IAddDefalutDepartment);
                            setSelectedDepartment({} as IDefaultDepartment);
                            form.setFieldsValue({ name: "", description: "" });
                            getDepartmentList();
                            setIsModalOpen(false);
                        })
                        .finally(() => {
                            setLoading(false); // Reset loading state
                        });
                } catch (ex) {
                    toast.error("Technical error while creating Department.", {
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
        setModalMode("add"); // Set mode to "add"
        form.setFieldsValue({ name: "", description: "" });
        setSelectedDepartment({} as IDefaultDepartment);
        setIsModalOpen(false);
    };

    const showEmployeeModal = (department: IDefaultDepartment) => {
        setSelectedDepartmentEmployees(department.employees); // Assuming "Employees" is the property containing the list of employees for a department
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
                            onClick={() => {
                                showModal("add");
                            }}
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
                <LoadingSpinner isLoading={loading} />
                <div className="client-details">
                    {!loading && (
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
                    )}
                </div>
            </div>

            <Modal
                title={
                    modalMode === "add"
                        ? "Add New Department"
                        : "Edit Department"
                }
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
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* employee modal work */}
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

export default DefaultDepartment;
