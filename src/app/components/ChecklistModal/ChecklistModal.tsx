import React, { useState, useEffect } from "react";
import "./ChecklistModal.scss";

import api from "../../utilities/apiServices";
import {
    CheckList as ICheckList,
    QuestionDetails as IQuestionDetails,
} from "../../modules/master/Checklist/interface/IChecklist";
import {
    Button,
    Col,
    Divider,
    Input,
    Popconfirm,
    Popover,
    Row,
    Select,
    Table,
    Tooltip,
    Typography,
    Form,
} from "antd";
import {
    CaretDownOutlined,
    OrderedListOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import { capitalize } from "../../utilities/utility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
const { Title } = Typography;

const ChecklistModal = (props: any) => {
    // State to checklist list
    const [checklistList, setChecklistList] = useState<ICheckList[]>([]);

    const checklistObject = { _id: "1", name: "" } as IQuestionDetails;
    const [questions, setChecklistGrid] = useState<IQuestionDetails[]>([
        checklistObject,
    ]);
    const [form] = Form.useForm();
    const [focusedQuestionId, setFocusedQuestionId] = useState<string | null>(
        null
    );

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
                        },
                    ]}
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
                        defaultValue={record.name}
                        value={record.name}
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
    const deleteClickHandlerForQuestion = (questionId: any) => {
        if (questions.length > 1) {
            // Filter out the question with the given questionId
            const updatedQuestionsArray = questions.filter(
                (question) => question._id !== questionId
            );

            // Update the state with the updated questions array
            setChecklistGrid(updatedQuestionsArray);
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
    const addNewQuestion = () => {
        const lastQuestion = questions[questions.length - 1];

        if (lastQuestion && lastQuestion.name.trim() === "") {
            toast.error(
                "Cannot add new question. Please fill in the existing question first."
            );
            return;
        }

        checklistObject._id = (questions.length + 1).toString();
        setChecklistGrid([...questions, checklistObject]);

        // Focus on the new row by setting its ID as the focused ID
        // setFocusedQuestionId(questions.);
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
            setChecklistGrid(updatedQuestionsArray);
        }
    };
    // const [singleCheckList, setSingleChecklistList] = useState<ICheckList>([]);
    // State to control popover visibility
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    // State to store selected values
    const [selectedValues, setSelectedValues] = useState([]);

    // Function to handle selection changes
    const handleSelectChange = (values: any) => {
        // Convert selected values to user objects
        console.log("values", values);
    };

    // Function to handle popover visibility change
    const handlePopoverVisibleChange = (visible: boolean) => {
        setIsPopoverVisible(visible);
    };

    useEffect(() => {
        getCheckListModal();
    }, []);

    const getCheckListModal = () => {
        api.getChecklist().then((resp: any) => {
            setChecklistList(resp.data);
        });
    };

    return (
        <div className="checklist-container w100">
            <div className="checklist-wrapper">
                {
                    <OrderedListOutlined
                        className="checklist-icon"
                        onClick={() => setIsPopoverVisible(!isPopoverVisible)}
                    />
                }
                &nbsp;
                <div>
                    <p className="checklist-label">Checklist</p>
                    <p className="checklist-value">
                        {selectedValues.length > 0
                            ? selectedValues.map((user: any, index: number) =>
                                  index === 0 ? (
                                      <span key={user._id}>
                                          {capitalize(
                                              `${user.firstName} ${user.lastName}`
                                          )}{" "}
                                      </span>
                                  ) : (
                                      ""
                                  )
                              )
                            : "Not selected yet "}
                        {selectedValues.length > 1 && (
                            <Tooltip
                                placement="bottom"
                                title={selectedValues
                                    .map(
                                        (checklist: any) =>
                                            `${capitalize(
                                                `${checklist.firstName} ${checklist.lastName}`
                                            )}`
                                    )
                                    .join(", ")}
                            >
                                {selectedValues.length > 1 &&
                                    `+ ${selectedValues.length - 1}`}
                            </Tooltip>
                        )}
                        &nbsp;
                        <Popover
                            placement="bottom"
                            content={
                                <div style={{ width: 300 }}>
                                    <div className="checklist-modal-header">
                                        <Title level={5}>
                                            Checklists{" "}
                                            <Button
                                                type="primary"
                                                danger
                                                icon={<CloseOutlined />}
                                                // onClick={cancelNewTaskHandler}
                                                size={"small"}
                                                style={{ float: "right" }}
                                            ></Button>
                                        </Title>
                                    </div>

                                    <Divider></Divider>
                                    <Row gutter={[8, 8]} className="form-row">
                                        <Col
                                            xs={{ span: 24 }}
                                            sm={{ span: 24 }}
                                            md={{ span: 8 }}
                                        ></Col>
                                        <Col
                                            xs={{ span: 24 }}
                                            sm={{ span: 24 }}
                                            md={{ span: 16 }}
                                            style={{ float: "right" }}
                                        >
                                            <Select
                                                //mode="multiple"
                                                bordered={false}
                                                allowClear
                                                showSearch
                                                placeholder="Select Template"
                                                defaultValue={selectedValues}
                                                onChange={handleSelectChange}
                                                className="w100 border-bottom"
                                                options={checklistList.map(
                                                    (
                                                        checklist: ICheckList
                                                    ) => ({
                                                        value: checklist._id,
                                                        label: capitalize(
                                                            `${checklist.title}`
                                                        ),
                                                    })
                                                )}
                                            ></Select>
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
                                </div>
                            }
                            visible={isPopoverVisible} // Control popover visibility
                            onVisibleChange={handlePopoverVisibleChange} // Handle visibility change
                            trigger="click" // Show popover on click
                            // overlayStyle={{ zIndex: 9999 }} // Adjust z-index as needed
                        >
                            <CaretDownOutlined></CaretDownOutlined>
                        </Popover>{" "}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChecklistModal;
