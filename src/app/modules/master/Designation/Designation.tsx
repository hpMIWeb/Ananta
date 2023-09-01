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
    Select,
} from "antd";
import "./Designation.scss";
import api from "../../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import {
    Designation as IDesignation,
    AddDesignation as IAddDesignation,
} from "./interfaces/IDesignation";
import { Department as IDepartment } from "../Department/interfaces/IDeparment";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import LoadingSpinner from "../../../modules/LoadingSpinner"; // Update the path accordingly
const { Title } = Typography;
const pageSize = 25;

const Designation = () => {
    const [current, setCurrent] = useState(1);
    const [designationList, setDesignationList] = useState<IDesignation[]>([]);
    const [departmentList, setDepartmentList] = useState<IDepartment[]>([]);
    const [addDesignation, setAddDesignation] = useState<IAddDesignation>(
        {} as IAddDesignation
    );
    const [selectedDesignation, setSelectedDesignation] =
        useState<IDesignation>({} as IDesignation);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [form] = Form.useForm();

    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [selectedDepartmentEmployees, setSelectedDepartmentEmployees] =
        useState<IDesignation[]>([]);
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
            title: "Designation",
            dataIndex: "name",
            key: "name",
            width: "35%",
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
        },
        {
            title: "Department",
            dataIndex: "departmentName",
            key: "departmentName",
            width: "35%",
            sorter: (a: any, b: any) =>
                a.departmentName.localeCompare(b.departmentName),
        },
        {
            title: "Employee",
            dataIndex: "employeeCount",
            key: "employeeCount",
            width: "5%",
            className: "center-align-cell",
            sorter: (a: any, b: any) => a.employeeCount - b.employeeCount,
            render: (employeeCount: any, record: IDesignation) => (
                <span className="actionColumn">
                    <FontAwesomeIcon
                        icon={faUser}
                        style={{ marginRight: "5px" }}
                    />{" "}
                    {/* User icon */}
                    <span onClick={() => showEmployeeModal(record)}>
                        {employeeCount}
                    </span>
                </span>
            ),
        },
        {
            title: "Action",
            dataIndex: "",
            key: "action",
            width: "10%",
            className: "center-align-cell",
            render: (_: any, record: IDesignation) => (
                <span className="actionColumn">
                    <FontAwesomeIcon
                        icon={faEdit}
                        className="btn-at"
                        title="Edit Designation"
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
                            title="Delete Designation"
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
                        title="Delete Designation"
                        style={{ color: "#fa5c7c" }}
                    />
                </Popconfirm>
            ),
        },
    ];

    useEffect(() => {
        getDesignationList();
        getDepartmentList();
    }, []);

    const getDepartmentList = () => {
        setLoading(true); // Set loading state to true
        api.getDepartment()
            .then((resp: any) => {
                setDepartmentList(resp.data);
            })
            .finally(() => {
                setLoading(false); // Reset loading state
            });
    };

    const getDesignationList = () => {
        setLoading(true); // Set loading state to true
        api.getDesignation()
            .then((resp: any) => {
                setDesignationList(resp.data);
            })
            .finally(() => {
                setLoading(false); // Reset loading state
            });
    };

    const deleteClickHandler = (designationId: string) => {
        // Delete from  DB
        setLoading(true); // Set loading state to true
        api.deleteDesignation(designationId)
            .then((resp: any) => {
                toast.success("Designation successfully deleted.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                getDesignationList();
            })
            .catch((error) => {
                toast.error("Technical error while deleting Designation.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .finally(() => {
                setLoading(false); // Reset loading state
            });
    };

    const editClickHandler = (designation: IDesignation) => {
        form.resetFields();
        setSelectedDesignation(designation);
        setAddDesignation({
            name: designation.name,
            department: designation.department,
        });

        form.setFieldsValue({
            name: designation.name,
            department: designation.department,
        });
        setModalMode("edit"); // Set mode to "edit"
        showModal("edit"); // Open the modal
    };

    // Search input change handler
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    const getData = (current: number, pageSize: number) => {
        const startIndex = (current - 1) * pageSize;
        let retVal = designationList;
        const slicedData = designationList.slice(
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
            form.setFieldsValue({ department: "", name: "" });

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

        setAddDesignation({
            ...addDesignation,
            [name]: value,
        });
    };

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                try {
                    setLoading(true); // Set loading state to true
                    const apiCall =
                        modalMode === "add"
                            ? api.createDesignation(addDesignation)
                            : api.updateDesignation(
                                  addDesignation,
                                  selectedDesignation._id
                              );

                    apiCall
                        .then((resp: any) => {
                            const successMessage =
                                modalMode === "add"
                                    ? "Designation Added."
                                    : "Designation Updated.";

                            toast.success(successMessage, {
                                position: toast.POSITION.TOP_RIGHT,
                            });
                            form.resetFields();
                            form.setFieldsValue({} as IAddDesignation);
                            setIsModalOpen(false);
                            setSelectedDesignation({} as IDesignation);
                            getDesignationList();
                        })
                        .finally(() => {
                            setLoading(false); // Reset loading state
                        });
                } catch (ex) {
                    toast.error("Technical error while creating Designation", {
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
        form.setFieldsValue({} as IAddDesignation);
        setSelectedDesignation({} as IDesignation);
        setAddDesignation({} as IAddDesignation);
        setIsModalOpen(false);
        setModalMode("add"); // Set mode to "add"
    };

    const showEmployeeModal = (designation: IDesignation) => {
        setSelectedDepartmentEmployees(designation.employees); // Assuming "Employees" is the property containing the list of employees for a designation
        setIsEmployeeModalOpen(true);
    };

    const closeEmployeeModal = () => {
        setSelectedDepartmentEmployees([]);
        setIsEmployeeModalOpen(false);
    };

    const removeEmployeeFromDepartment = (employeeId: string) => {
        // Call your API to remove the employee from the designation
        //TODO:: After successful removal, update the selectedDepartmentEmployees state
        const updatedEmployees = selectedDepartmentEmployees.filter(
            (employee: any) => employee.EmployeeId !== employeeId
        );
        setSelectedDepartmentEmployees(updatedEmployees);
        // You can also update the Employees property of the designation in the designationList state
    };

    /*Modal action end */
    return (
        <>
            <div>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 4 }}>
                        <Title level={4}>Designation</Title>
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
            <LoadingSpinner isLoading={loading} />

            <div>
                <div className="client-details">
                    <Table
                        columns={columns}
                        dataSource={getData(current, pageSize)}
                        onChange={onChange}
                        size="small"
                        style={{ width: "100%" }}
                        className="table-striped-rows"
                        bordered
                    />
                </div>
            </div>

            <Modal
                title={
                    modalMode === "add"
                        ? "Add New Designation"
                        : "Edit Designation"
                } // Modify the title
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} initialValues={addDesignation}>
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
                                        message:
                                            "Please enter designation name",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Designation Name"
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
                                name="department"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select a department.",
                                    },
                                ]}
                            >
                                <Select
                                    allowClear
                                    placeholder="Department"
                                    options={departmentList.map(
                                        (department) => ({
                                            value: department._id,
                                            label: department.name,
                                        })
                                    )}
                                    value={addDesignation.department}
                                    showSearch={true}
                                    onChange={(value, event) => {
                                        inputChangeHandler(event, "department");
                                    }}
                                    className="w100"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <Modal
                title="Designation Employees"
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

export default Designation;
