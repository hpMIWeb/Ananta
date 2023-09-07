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
    Tag,
} from "antd";
import "./DefaultLineOfBusiness.scss";

import api from "../../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import {
    DefaultLineOfBusiness as IDefaultLineOfBusiness,
    AddDefaultLineOfBusiness as IAddDefaultLineOfBusiness,
} from "./interfaces/IDefaultLineOfBusiness";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { SearchOutlined } from "@ant-design/icons";
import LoadingSpinner from "../../LoadingSpinner"; // Update the path accordingly
import DeletePopupConfirm from "../../../components/DeletePopupConfirm/DeletePopupConfirm";

const { Title } = Typography;
const pageSize = 25;

const DefaultLineOfBusiness = () => {
    const [current, setCurrent] = useState(1);

    const [lineOfBusinessList, setLineOfBusinessList] = useState<
        IDefaultLineOfBusiness[]
    >([]);
    const [addLineOfBusiness, setAddLineOfBusiness] =
        useState<IAddDefaultLineOfBusiness>({} as IAddDefaultLineOfBusiness);
    const [selectedLineOfBusiness, setSelectedLineOfBusiness] =
        useState<IDefaultLineOfBusiness>({} as IDefaultLineOfBusiness);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<
        IAddDefaultLineOfBusiness[]
    >([]);

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
            title: "Line Of Business Name",
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
            render: (_: any, record: IDefaultLineOfBusiness) => (
                <span className="actionColumn">
                    <FontAwesomeIcon
                        icon={faEdit}
                        className="btn-at"
                        title="Edit Line Of Business"
                        style={{ color: "#2c7be5", marginLeft: "15px" }}
                        onClick={() => editClickHandler(record)}
                    />
                    <Divider type="vertical" />

                    <DeletePopupConfirm
                        popUpTitle={`Do you want to delete ${record.name} Line Of Business?`}
                        content=""
                        onConfirm={() => deleteClickHandler(record._id)}
                        button-label="Delete Line Of Business"
                    />
                </span>
            ),
        },
    ];

    useEffect(() => {
        getLineOfBusiness();
    }, []);

    const getLineOfBusiness = () => {
        setLoading(true); // Set loading state to true
        api.getDefaultLineOfBusiness()
            .then((resp: any) => {
                setLineOfBusinessList(resp.data);
            })
            .finally(() => {
                setLoading(false); // Reset loading state
            });
    };

    const deleteClickHandler = (industryTypeId: string) => {
        // Delete from  DB
        setLoading(true); // Set loading state to true
        api.deleteDefaultLineOfBusiness(industryTypeId)
            .then((resp: any) => {
                const updatedData = lineOfBusinessList.filter(
                    (item: IDefaultLineOfBusiness) =>
                        item._id !== industryTypeId
                );
                setLineOfBusinessList(updatedData);
                toast.success("Line Of Business successfully deleted.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .finally(() => {
                setLoading(false); // Reset loading state
            })
            .catch((error) => {
                toast.error(
                    "Technical error while deleting Line Of Business.",
                    {
                        position: toast.POSITION.TOP_RIGHT,
                    }
                );
            });
    };

    const editClickHandler = (industryType: IDefaultLineOfBusiness) => {
        setModalMode("edit"); // Set mode to "edit"
        setSelectedLineOfBusiness(industryType);
        form.setFieldsValue({
            name: industryType.name,
        });
        setAddLineOfBusiness({
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
        let retVal = lineOfBusinessList;
        const slicedData = lineOfBusinessList.slice(
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
        setSelectedBusinessTypes([]);
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

        setAddLineOfBusiness({
            ...addLineOfBusiness,
            [name]: value,
        });
        // Handle Tab key press to add industry name as an object
        if (event.key === "Tab" && value.trim() !== "") {
            event.preventDefault(); // Prevent the default Tab behavior
            setSelectedBusinessTypes([
                ...selectedBusinessTypes,
                { name: value.trim() },
            ]);
            form.setFieldsValue({ name: "" }); // Clear the input field
        }
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
                            ? api.createMultipleDefaultLineOfBusiness(
                                  selectedBusinessTypes
                              )
                            : api.updateDefaultLineOfBusiness(
                                  addLineOfBusiness,
                                  selectedLineOfBusiness._id
                              );

                    apiCall
                        .then((resp: any) => {
                            const successMessage =
                                modalMode === "add"
                                    ? "Line Of Business Added."
                                    : "Line Of Business Updated.";

                            toast.success(successMessage, {
                                position: toast.POSITION.TOP_RIGHT,
                            });

                            form.setFieldsValue(
                                {} as IAddDefaultLineOfBusiness
                            );
                            setSelectedLineOfBusiness(
                                {} as IDefaultLineOfBusiness
                            );
                            setSelectedBusinessTypes([]);
                            form.setFieldsValue({ name: "", description: "" });
                            getLineOfBusiness();
                            setIsModalOpen(false);
                        })
                        .finally(() => {
                            setLoading(false); // Reset loading state
                        });
                } catch (ex) {
                    toast.error(
                        "Technical error while creating Line Of Business.",
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
        setSelectedLineOfBusiness({} as IDefaultLineOfBusiness);
        setIsModalOpen(false);
        setSelectedBusinessTypes([]);
    };

    /*Modal action end */
    return (
        <>
            <div>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 4 }}>
                        <Title level={4}>Line Of Business</Title>
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
                        ? "Add New Line Of Business"
                        : "Edit " +
                          selectedLineOfBusiness.name +
                          " Industry Type"
                }
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={modalMode === "add" ? "Add" : "Update"}
            >
                <div className="selected-industries">
                    {selectedBusinessTypes.map((businessName, index) => (
                        <Tag
                            key={index}
                            closable
                            onClose={() => {
                                // Handle tag close to remove the tag
                                const updatedLineOfBusinessNames = [
                                    ...selectedBusinessTypes,
                                ];
                                updatedLineOfBusinessNames.splice(index, 1);
                                setSelectedBusinessTypes(
                                    updatedLineOfBusinessNames
                                );
                            }}
                            style={{ marginTop: "8px" }}
                        >
                            {businessName.name}
                        </Tag>
                    ))}
                </div>
                <Form form={form} initialValues={addLineOfBusiness}>
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
                                    placeholder="Line Of Business Name"
                                    className="w100"
                                    name="name"
                                    onChange={(event) => {
                                        inputChangeHandler(event);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === "Tab") {
                                            event.preventDefault(); // Prevent the default Tab behavior
                                            const name =
                                                form.getFieldValue("name");
                                            if (name) {
                                                form.setFieldsValue({
                                                    name: "",
                                                }); // Clear the input field
                                                setSelectedBusinessTypes([
                                                    ...selectedBusinessTypes,
                                                    { name: name.trim() },
                                                ]);
                                            }
                                        }
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

export default DefaultLineOfBusiness;
