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
import "./DefaultIndustryType.scss";

import api from "../../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import {
    DefaultIndustryType as IDefaultIndustryType,
    AddDefaultIndustryType as IAddDefaultIndustryType,
} from "./interfaces/IDefaultIndustryType";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { SearchOutlined } from "@ant-design/icons";
import LoadingSpinner from "../../LoadingSpinner"; // Update the path accordingly

const { Title } = Typography;
const pageSize = 25;

const DefaultIndustryType = () => {
    const [current, setCurrent] = useState(1);

    const [industryTypeList, setIndustryTypeList] = useState<
        IDefaultIndustryType[]
    >([]);
    const [addIndustryType, setAddIndustryType] =
        useState<IAddDefaultIndustryType>({} as IAddDefaultIndustryType);
    const [selectedIndustryType, setSelectedIndustryType] =
        useState<IDefaultIndustryType>({} as IDefaultIndustryType);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

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
            title: "Industry Type Name",
            dataIndex: "name",
            key: "name",
            width: "70%",
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
        },

        {
            title: "Action",
            dataIndex: "",
            key: "action",
            width: "10%",
            className: "center-align-cell",
            render: (_: any, record: IDefaultIndustryType) => (
                <span className="actionColumn">
                    <FontAwesomeIcon
                        icon={faEdit}
                        className="btn-at"
                        title="Edit Industry Type"
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
                            title="Delete Industry Type"
                            style={{ color: "#fa5c7c" }}
                        />
                    </Popconfirm>
                </span>
            ),
        },
    ];

    useEffect(() => {
        getIndustryTypeList();
    }, []);

    const getIndustryTypeList = () => {
        setLoading(true); // Set loading state to true
        api.getDefaultIndustryType()
            .then((resp: any) => {
                setIndustryTypeList(resp.data);
            })
            .finally(() => {
                setLoading(false); // Reset loading state
            });
    };

    const deleteClickHandler = (industryTypeId: string) => {
        // Delete from  DB
        setLoading(true); // Set loading state to true
        api.deleteDefaultIndustryType(industryTypeId)
            .then((resp: any) => {
                const updatedData = industryTypeList.filter(
                    (item: IDefaultIndustryType) => item._id !== industryTypeId
                );
                setIndustryTypeList(updatedData);
                toast.success("Industry Type successfully deleted.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .finally(() => {
                setLoading(false); // Reset loading state
            })
            .catch((error) => {
                toast.error("Technical error while deleting Industry Type.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    const editClickHandler = (industryType: IDefaultIndustryType) => {
        setModalMode("edit"); // Set mode to "edit"
        setSelectedIndustryType(industryType);
        form.setFieldsValue({
            name: industryType.name,
        });
        setAddIndustryType({
            name: industryType.name,
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
        let retVal = industryTypeList;
        const slicedData = industryTypeList.slice(
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
            form.setFieldsValue({ name: "" });
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

        setAddIndustryType({
            ...addIndustryType,
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
                            ? api.createDefaultIndustryType(addIndustryType)
                            : api.updateDefaultIndustryType(
                                  addIndustryType,
                                  selectedIndustryType._id
                              );

                    apiCall
                        .then((resp: any) => {
                            const successMessage =
                                modalMode === "add"
                                    ? "Industry Type Added."
                                    : "Industry Type Updated.";

                            toast.success(successMessage, {
                                position: toast.POSITION.TOP_RIGHT,
                            });

                            form.setFieldsValue({} as IAddDefaultIndustryType);
                            setSelectedIndustryType({} as IDefaultIndustryType);
                            form.setFieldsValue({ name: "", description: "" });
                            getIndustryTypeList();
                            setIsModalOpen(false);
                        })
                        .finally(() => {
                            setLoading(false); // Reset loading state
                        });
                } catch (ex) {
                    toast.error(
                        "Technical error while creating Industry Type.",
                        {
                            position: toast.POSITION.TOP_RIGHT,
                        }
                    );
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
        setSelectedIndustryType({} as IDefaultIndustryType);
        setIsModalOpen(false);
    };

    /*Modal action end */
    return (
        <>
            <div>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 4 }}>
                        <Title level={4}>Industry Type</Title>
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
                            id="industryTypeTable"
                            columns={columns}
                            dataSource={getData(current, pageSize)}
                            onChange={onChange}
                            size="small"
                            style={{ width: "100%" }}
                            className="table-striped-rows  industryTypeTable"
                            bordered
                        />
                    )}
                </div>
            </div>

            <Modal
                title={
                    modalMode === "add"
                        ? "Add New Industry Type"
                        : "Edit Industry Type"
                }
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} initialValues={addIndustryType}>
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
                                        message: "Please enter industry type.",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Industry Type Name"
                                    className="w100"
                                    name="name"
                                    onChange={(event) => {
                                        inputChangeHandler(event);
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

export default DefaultIndustryType;
