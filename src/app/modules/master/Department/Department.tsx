import React, { useState, useEffect } from "react";
import {
    Table,
    Typography,
    Button,
    Modal,
    Row,
    Col,
    Form,
    Popconfirm,
    Divider,
} from "antd";
import styles from "./department.module.scss";
import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";

import api from "../../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import TextArea from "antd/es/input/TextArea";
import {
    Department as IDepartment,
    AddDepartment as IAddDepartment,
} from "./interfaces/IDeparment";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import LoadingSpinner from "../../../modules/LoadingSpinner"; // Update the path accordingly
import DeletePopupConfirm from "../../../../components/DeletePopupConfirm/DeletePopupConfirm";
import Input from "../../../../components/Input/Index";
import Select from "../../../../components/Select/Index";
import "./Department.scss";
import Icon from "../../../../components/Icon/Index";
import SearchFilterBar from "../../../../components/SearchFilterBar/Index";
import CardContentSkeletonLoader from "../../../../components/CardContentSkeletonLoader/Index";
const { Title } = Typography;
const pageSize = 25;

const Department = () => {
    const [current, setCurrent] = useState(1);

    const [searchValue, setSearchValue] = useState<string>("");
    const [sortState, setSortState] = useState({ type: "", sortOrder: "" });
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
    const [tableRowSelected, setTableRowSelected] = useState<IAddDepartment>(
        {} as IAddDepartment
    );

    const [loading, setLoading] = useState(true);

    const columns = [
        {
            title: "Sr.No",
            dataIndex: "srNo",
            key: "srNo",
            width: "8%",
            sorter: (a: any, b: any) => a.srNo - b.srNo,
            className: "center-align-cell",
        },
        {
            title: "Department Name",
            dataIndex: "name",
            key: "name",
            width: "70%",
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
            render: (text: string, record: IDepartment) => (
                <div>
                    <span className="">{text}</span>
                    <p className="description">{record.description}</p>
                </div>
            ),
        },
        {
            title: "Employee",
            dataIndex: "employeeCount",
            key: "employeeCount",
            width: "12%",
            className: "center-align-cell",
            sorter: (a: any, b: any) => a.employeeCount - b.employeeCount,
            render: (employeeCount: any, record: any) => (
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
            render: (_: any, record: IDepartment) => (
                <span className="actionColumn">
                    <FontAwesomeIcon
                        icon={faEdit}
                        className="btn-at"
                        title="Edit Department"
                        style={{ color: "#2c7be5", marginLeft: "15px" }}
                        onClick={() => editClickHandler(record)}
                    />
                    <Divider type="vertical" />
                    <DeletePopupConfirm
                        popUpTitle={`Do you want to delete ${record.name} Department?`}
                        content=""
                        onConfirm={() => deleteClickHandler(record._id)}
                        button-label="Delete  Department"
                    />
                </span>
            ),
        },
    ];

    const employeeColumns = [
        {
            title: "Employee Name",
            dataIndex: "",
            key: "",
            width: "90%",
            render: (employee: any) => (
                <span>
                    {employee.firstName} {employee.lastName}
                </span>
            ),
        },
        {
            title: "Action",
            dataIndex: "",
            key: "action",
            width: "10%",
            render: (employee: any) => (
                <Popconfirm
                    title="Sure to remove?"
                    onConfirm={() => removeEmployeeFromDepartment(employee._id)}
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
        api.getDepartment()
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
        api.deleteDepartment(departmentId)
            .then((resp: any) => {
                const updatedData = departmentList.filter(
                    (item: IDepartment) => item._id !== departmentId
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

    const editClickHandler = (department: IDepartment) => {
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
    const handleSearch = (searchValue: string) => {
        setSearchQuery(searchValue);
    };

    // Search input change handler
    const handleEmaployeeSearch = (searchValue: string) => {
        setSearchQuery(searchValue);
    };

    const getData = (current: number, pageSize: number) => {
        const startIndex = (current - 1) * pageSize;
        let retVal = departmentList;

        if (searchQuery.trim() !== "") {
            retVal = retVal.filter((item) => {
                return Object.values(item).some(
                    (value) =>
                        value
                            .toString()
                            .toLowerCase()
                            .indexOf(searchQuery?.toLowerCase()) !== -1
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

    function onChange(sorter: any) {}

    /*Modal action start*/

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = (mode: "add" | "edit") => {
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
                try {
                    setLoading(true); // Set loading state to true
                    const apiCall =
                        modalMode === "add"
                            ? api.createDepartment(addDepartment)
                            : api.updateDepartment(
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

                            form.setFieldsValue({} as IAddDepartment);
                            setSelectedDepartment({} as IDepartment);
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
            });
    };

    const handleCancel = () => {
        setModalMode("add"); // Set mode to "add"
        form.setFieldsValue({ name: "", description: "" });
        setSelectedDepartment({} as IDepartment);
        setIsModalOpen(false);
    };

    const showEmployeeModal = (data: IDepartment) => {
        setSelectedDepartmentEmployees(data.employees); // Assuming "Employees" is the property containing the list of employees for a department
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
            <ToastContainer autoClose={25000} />
            {/* <LoadingSpinner isLoading={loading} /> */}
            <div className={classNames(styles.promoCodesPageWrapper)}>
                <div
                    className={classNames(
                        "card-header d-flex",
                        styles.promoCodesPageHeader
                    )}
                    style={{ minHeight: 60 }}
                >
                    <div
                        className={classNames(
                            "d-flex align-items-center w-100",
                            styles.departmentHeaderTitle
                        )}
                    >
                        <div className="me-auto">
                            <h5
                                className={classNames(
                                    "my-2 position-relative z-index-1",
                                    styles.deapartmentLabel
                                )}
                            >
                                Department
                            </h5>
                        </div>
                        <div className={classNames("ms-auto z-index-1")}>
                            <Button
                                onClick={() => {
                                    showModal("add");
                                }}
                                className={styles.newPromoBtn}
                                type="primary"
                            >
                                Add New
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={styles.departmentBottomWrapper}>
                    <div style={{ marginBottom: 24 }}>
                        <SearchFilterBar
                            searchValue={searchQuery}
                            setSearchValue={handleSearch}
                            sortState={sortState}
                            setSortState={setSortState}
                            setSortStateHandler={(options: any) => {
                                setSortState(options);
                            }}
                            allowSortBy={false}
                        />
                    </div>
                    {loading && <CardContentSkeletonLoader />}
                    {!loading && (
                        <div>
                            <Table
                                columns={columns}
                                dataSource={getData(current, pageSize)}
                                size="small"
                                style={{ width: "100%" }}
                                className="r4 table-striped-rows"
                                bordered
                                pagination={false}
                            />
                        </div>
                    )}
                    <Modal
                        title={
                            modalMode === "add"
                                ? "Add New Department"
                                : "Edit Department - " + selectedDepartment.name
                        }
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        okText={modalMode === "add" ? "Add" : "Update"}
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
                                                message:
                                                    "Please enter department name",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Department Name"
                                            className="w100"
                                            name="name"
                                            onChange={(event: any) => {
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
                                    <Form.Item name="description">
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
                    <Modal
                        title="Department Employees"
                        open={isEmployeeModalOpen}
                        onCancel={closeEmployeeModal}
                        footer={null}
                    >
                        <Row gutter={[8, 8]} className="form-row">
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 24 }}
                            >
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
                            </Col>
                        </Row>

                        <Table
                            dataSource={selectedDepartmentEmployees}
                            columns={employeeColumns}
                            pagination={false}
                        />
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default Department;
