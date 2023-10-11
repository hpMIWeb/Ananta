import React, { useState, useEffect } from "react";
import {
    Table,
    Typography,
    Button,
    Modal,
    Row,
    Col,
    Form,
    Divider,
    Tag,
} from "antd";
import "./DefaultIndustryType.scss";
import styles from "./defaultIndustryType.module.scss";
import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";

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
import DeletePopupConfirm from "../../../../components/DeletePopupConfirm/DeletePopupConfirm";
import Input from "../../../../components/Input/Index";
import Icon from "../../../../components/Icon/Index";
import SearchFilterBar from "../../../../components/SearchFilterBar/Index";
import CardContentSkeletonLoader from "../../../../components/CardContentSkeletonLoader/Index";

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

    const [selectedIndustryNames, setSelectedIndustryNames] = useState<
        IAddDefaultIndustryType[]
    >([]);

    const [searchValue, setSearchValue] = useState<string>("");
    const [sortState, setSortState] = useState({ type: "", sortOrder: "" });

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

                    <DeletePopupConfirm
                        popUpTitle={`Do you want to delete ${record.name} Industry Type?`}
                        content=""
                        onConfirm={() => deleteClickHandler(record._id)}
                        button-label="Delete Industry Type"
                    />
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
    const handleSearch = (searchValue: string) => {
        setSearchQuery(searchValue);
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
        setSelectedIndustryNames([]);
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

        // Handle Tab key press to add industry name as an object
        if (event.key === "Tab" && value.trim() !== "") {
            event.preventDefault(); // Prevent the default Tab behavior
            setSelectedIndustryNames([
                ...selectedIndustryNames,
                { name: value.trim() },
            ]);
            form.setFieldsValue({ name: "" }); // Clear the input field
        }
    };

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                console.log("ok modalMode", selectedIndustryNames);

                // return;
                //return;
                try {
                    setLoading(true); // Set loading state to true
                    const apiCall =
                        modalMode === "add"
                            ? api.createMultipleDefaultIndustryType(
                                  selectedIndustryNames
                              )
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
                            setSelectedIndustryNames([]);
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
        setSelectedIndustryNames([]);
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
                                Industry Type
                            </h5>
                        </div>
                        <div className={classNames("ms-auto z-index-1")}>
                            <Button
                                onClick={() => {
                                    showModal("add");
                                }}
                                className={styles.newPromoBtn}
                            >
                                Add New
                            </Button>
                        </div>
                    </div>
                    <div
                        style={{
                            backgroundImage: `url(${addSubImg})`,
                        }}
                        className={classNames(
                            "rounded-3 rounded-bottom-0",
                            styles.addPromoCodeImg
                        )}
                    ></div>
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
                                ? "Add New Industry Type"
                                : "Edit " +
                                  selectedIndustryType.name +
                                  " Industry Type"
                        }
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        okText={modalMode === "add" ? "Add" : "Update"}
                    >
                        {/* Display selected industry names as tags */}
                        <div className="selected-industries">
                            {selectedIndustryNames.map((industry, index) => (
                                <Tag
                                    key={index}
                                    closable
                                    onClose={() => {
                                        // Handle tag close to remove the tag
                                        const updatedIndustryNames = [
                                            ...selectedIndustryNames,
                                        ];
                                        updatedIndustryNames.splice(index, 1);
                                        setSelectedIndustryNames(
                                            updatedIndustryNames
                                        );
                                    }}
                                    style={{ marginTop: "8px" }}
                                >
                                    {industry.name}
                                </Tag>
                            ))}
                        </div>
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
                                                message:
                                                    "Please enter industry type.",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Industry Type Name"
                                            className="w100"
                                            name="name"
                                            onChange={(event: any) => {
                                                inputChangeHandler(event);
                                            }}
                                            onKeyDown={(event: any) => {
                                                if (event.key === "Tab") {
                                                    event.preventDefault(); // Prevent the default Tab behavior
                                                    const name =
                                                        form.getFieldValue(
                                                            "name"
                                                        );
                                                    if (name) {
                                                        form.setFieldsValue({
                                                            name: "",
                                                        }); // Clear the input field
                                                        setSelectedIndustryNames(
                                                            [
                                                                ...selectedIndustryNames,
                                                                {
                                                                    name: name.trim(),
                                                                },
                                                            ]
                                                        );
                                                    }
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default DefaultIndustryType;
