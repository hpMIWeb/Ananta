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
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import "./DefaultChecklist.scss";
import {
    AddDefaultCheckList as IAddDefaultCheckList,
    DefaultCheckList as IDefaultCheckList,
    QuestionDetails as IQuestionDetails,
} from "./interface/IDefaultCheck";
import api from "../../../utilities/apiServices";
import { capitalize } from "../../../utilities/utility";

import { DefaultDepartment as IDefaultDepartment } from "../DefaultDepartment/interfaces/IDefaultDeparment";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../../LoadingSpinner"; // Update the path accordingly
import DeletePopupConfirm from "../../../components/DeletePopupConfirm/DeletePopupConfirm";

const pageSize = 25;
const { Title } = Typography;

const DefaultChecklist = () => {
    const [current, setCurrent] = useState(1);
    const [checklistList, setChecklistList] = useState<IDefaultCheckList[]>([]);
    const [addChecklist, setAddCheckList] = useState<IAddDefaultCheckList>(
        {} as IAddDefaultCheckList
    );
    const [departmentList, setDepartmentList] = useState<IDefaultDepartment[]>(
        []
    );
    const [selectedChecklist, setSelectedChecklist] =
        useState<IDefaultCheckList>({} as IDefaultCheckList);

    const questionObject = { _id: "1", name: "" } as IQuestionDetails;
    const [questions, setQuestions] = useState<IQuestionDetails[]>([
        questionObject,
    ]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [form] = Form.useForm();
    const [focusedQuestionId, setFocusedQuestionId] = useState<string | null>(
        null
    );
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
            title: "Checklist Name",
            dataIndex: "title",
            width: "55%",
            sorter: (a: IDefaultCheckList, b: IDefaultCheckList) =>
                a.title.localeCompare(b.title),
        },
        {
            title: "Department",
            dataIndex: "department",
            width: "25%",
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
            className: "center-align-cell",
            render: (_: any, record: IDefaultCheckList) => (
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
                        popUpTitle={`Do you want to delete ${record.title} Checklist?`}
                        content=""
                        onConfirm={() => deleteClickHandler(record._id)}
                        button-label="Delete  Checklist"
                    />
                </span>
            ),
        },
    ];

    // Custom Validation for Client row
    const customValidationRule = (
        rule: any,
        value: any,
        record: IQuestionDetails
    ) => {
        if (record.name === "") {
            return Promise.resolve();
        }

        if (value === undefined) {
            return Promise.reject(new Error(rule.message));
        } else {
            return Promise.resolve();
        }
    };

    const questionColumns = [
        {
            title: "Name",
            dataIndex: "",
            width: "5%",
            render: (_: any, __: any, index: number) => (
                <span>{index + 1}</span>
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            width: "90%",
            render: (index: any, record: IQuestionDetails) => (
                <Form.Item
                    name={"name_" + record._id}
                    rules={[
                        {
                            required: true,
                            message: "Please enter checklist.",
                            validator: (rule, value) => {
                                return customValidationRule(
                                    rule,
                                    value,
                                    record
                                );
                            },
                        },
                    ]}
                    initialValue={record.name}
                >
                    <Input
                        placeholder="Checklist"
                        name="name"
                        onChange={(event) => {
                            inputChangeHandlerForQuestion(event, record._id);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Tab" || event.key === "Enter") {
                                event.preventDefault();
                                addNewQuestion();
                            }
                        }}
                        autoFocus={focusedQuestionId === record._id} // Set autoFocus based on the focused ID
                    />
                </Form.Item>
            ),
        },
        {
            title: "Action",
            dataIndex: "",
            key: "action",
            width: "5%",
            className: "center-align-cell",
            render: (record: IQuestionDetails) => (
                <span className="actionColumn">
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() =>
                            deleteClickHandlerForQuestion(record._id)
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

    const [isModalOpen1, setIsModalOpen1] = useState(false);

    const deleteClickHandler = (checklistId: string) => {
        // Delete from  DB
        api.deleteDefaultChecklist(checklistId)
            .then((resp: any) => {
                const updatedData = checklistList.filter(
                    (item: IDefaultCheckList) => item._id !== checklistId
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

    const deleteClickHandlerForQuestion = (questionId: any) => {
        if (questions.length > 1) {
            // Filter out the question with the given questionId
            const updatedQuestionsArray = questions.filter(
                (question) => question._id !== questionId
            );

            // Update the state with the updated questions array
            setQuestions(updatedQuestionsArray);
            toast.success("Question delete successfully.", {
                position: toast.POSITION.TOP_RIGHT,
            });
        } else {
            toast.error("Cannot delete the first question.", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }
    };

    const editClickHandler = (checklist: IDefaultCheckList) => {
        setSelectedChecklist(checklist);
        form.setFieldsValue({
            title: checklist.title,
            department: checklist.department._id,
            question: checklist.question,
        });
        setQuestions(checklist.question);
        setModalMode("edit"); // Set mode to "edit"
        showModal("edit"); // Open the modal
    };

    useEffect(() => {
        getChecklist();
        getDepartmentList();
    }, []);

    const addNewQuestion = () => {
        const lastQuestion = questions[questions.length - 1];

        if (lastQuestion && lastQuestion.name.trim() === "") {
            toast.error(
                "Cannot add new question. Please fill in the existing question first."
            );
            return;
        }

        questionObject._id = (questions.length + 1).toString();
        setQuestions([...questions, questionObject]);

        // Focus on the new row by setting its ID as the focused ID
        setFocusedQuestionId(questionObject._id);
    };

    const getChecklist = () => {
        setLoading(true);
        api.getDefaultChecklist()
            .then((resp: any) => {
                console.log(resp.data);
                setChecklistList(resp.data);
            })
            .finally(() => {
                setLoading(false);
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
        setLoading(true);
        api.getDefaultDepartment()
            .then((resp: any) => {
                setDepartmentList(resp.data);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = (mode: "add" | "edit") => {
        console.log(mode);
        if (mode === "add") {
            form.setFieldsValue({ department: "", title: "", question: [] });
            setAddCheckList({} as IAddDefaultCheckList);
            setQuestions([questionObject]);
            setModalMode(mode);
            setIsModalOpen(true);
        } else {
            setModalMode(mode);
            setIsModalOpen(true);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setModalMode("add");
        form.setFieldsValue({} as IAddDefaultCheckList);
        setAddCheckList({} as IAddDefaultCheckList);
        setQuestions([questionObject]);
        setIsModalOpen(false);
    };
    const handleOk = () => {
        //form.resetFields();
        form.validateFields()
            .then((values) => {
                try {
                    // Remove blank questions from the array
                    const filteredQuestions = questions.filter(
                        (question) => question.name.trim() !== ""
                    );
                    setLoading(true);
                    addChecklist.question = filteredQuestions;
                    //  return;
                    console.log("addChecklist", addChecklist);
                    const apiCall =
                        modalMode === "add"
                            ? api.createDefaultChecklist(addChecklist)
                            : api.updateDefaultChecklist(
                                  addChecklist,
                                  selectedChecklist._id
                              );

                    apiCall
                        .then((resp: any) => {
                            const successMessage =
                                modalMode === "add"
                                    ? "Checklist added."
                                    : "Checklist Updated.";

                            toast.success(successMessage, {
                                position: toast.POSITION.TOP_RIGHT,
                            });
                            setModalMode("add");
                            form.setFieldsValue({} as IAddDefaultCheckList);
                            setAddCheckList({} as IAddDefaultCheckList);
                            setQuestions([questionObject]);
                            getChecklist();
                            setIsModalOpen(false);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                } catch (ex) {
                    setLoading(false);
                    toast.error("Technical error while creating Checklist", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            })
            .catch((errorInfo) => {
                setIsModalOpen(true);
                setLoading(false);
                console.log("Validation failed:", errorInfo);
            });
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
            ...addChecklist,
            [name]: value,
        });
    };

    const inputChangeHandlerForQuestion = (
        event: React.ChangeEvent<HTMLInputElement>,
        questionId: string
    ) => {
        const { value } = event.target;

        // Find the index of the question with the matching _id
        const questionIndex = questions.findIndex(
            (question) => question._id === questionId
        );

        if (questionIndex !== -1) {
            // Create a new array with the updated question
            const updatedQuestionsArray = [...questions];
            updatedQuestionsArray[questionIndex] = {
                ...updatedQuestionsArray[questionIndex],
                name: value,
            };
            console.log(updatedQuestionsArray);

            // Update the state with the new array
            setQuestions(updatedQuestionsArray);
        }
    };

    return (
        <div>
            <Row gutter={[8, 8]} className="form-row">
                <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 4 }}>
                    <Title level={4}>Checklist</Title>
                    <ToastContainer autoClose={25000} />
                    <LoadingSpinner isLoading={loading} />
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
                        onClick={() => {
                            showModal("add");
                        }}
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
                title="Create New Checklist"
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleOk}
                okText="Add"
                className="checklist-modal"
            >
                <div className="modal-content">
                    <Divider></Divider>
                    <Form form={form} initialValues={addChecklist}>
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
                                            message:
                                                "Please enter checklist name.",
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
                                            inputChangeHandler(
                                                event,
                                                "department"
                                            );
                                        }}
                                        showSearch={true}
                                        className="w100"
                                    ></Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[8, 8]}>
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 24 }}
                            >
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<PlusOutlined />}
                                    onClick={addNewQuestion}
                                    style={{ float: "right" }}
                                />
                            </Col>
                        </Row>
                        <Divider></Divider>
                        <div className="question-details client-details">
                            <Table
                                rowKey={(record: any) => record._id}
                                dataSource={questions}
                                columns={questionColumns}
                                pagination={false}
                                showHeader={false}
                            />
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default DefaultChecklist;
