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
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import "./Checklist.scss";
import styles from "./checklist.module.scss";
import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";

import {
  AddCheckList as IAddCheckList,
  CheckList as ICheckList,
  QuestionDetails as IQuestionDetails,
} from "./interface/IChecklist";
import api from "../../../utilities/apiServices";
import { capitalize, setLocalstorage } from "../../../utilities/utility";

import { Department as IDepartment } from "../Department/interfaces/IDeparment";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import DeletePopupConfirm from "../../../../components/DeletePopupConfirm/DeletePopupConfirm";
import SearchFilterBar from "../../../../components/SearchFilterBar/Index";
import CardContentSkeletonLoader from "../../../../components/CardContentSkeletonLoader/Index";

const Checklist = () => {
  const pageSize = 25;
  const [current, setCurrent] = useState(1);
  const [checklistList, setChecklistList] = useState<ICheckList[]>([]);
  const [addChecklist, setAddCheckList] = useState<IAddCheckList>(
    {} as IAddCheckList
  );
  const [departmentList, setDepartmentList] = useState<IDepartment[]>([]);
  const [selectedChecklist, setSelectedChecklist] = useState<ICheckList>(
    {} as ICheckList
  );

  const questionObject = { _id: "1", name: "" } as IQuestionDetails;
  const [questions, setQuestions] = useState<IQuestionDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalMode, setModalMode] = useState<string>("add");
  const [form] = Form.useForm();
  const [focusedQuestionId, setFocusedQuestionId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
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
      title: "Checklist Name",
      dataIndex: "title",
      width: "55%",
      sorter: (a: ICheckList, b: ICheckList) => a.title.localeCompare(b.title),
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
      render: (_: any, record: ICheckList) => (
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

  const editableQuestionColumns = [
    {
      title: "Name",
      dataIndex: "",
      width: "5%",
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
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
                return customValidationRule(rule, value, record);
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
            onConfirm={() => deleteClickHandlerForQuestion(record._id)}
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

  const questionColumns = [
    {
      title: "Name",
      dataIndex: "",
      width: "5%",
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: "90%",
    },
  ];

  const deleteClickHandler = (checklistId: string) => {
    // Delete from  DB
    api
      .deleteChecklist(checklistId)
      .then((resp: any) => {
        const updatedData = checklistList.filter(
          (item: ICheckList) => item._id !== checklistId
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

  const editClickHandler = (checklist: ICheckList) => {
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

  const viewClickHandler = (checklist: ICheckList) => {
    setSelectedChecklist(checklist);

    form.setFieldsValue({
      title: checklist.title,
      department: checklist.department._id,
      question: checklist.question,
    });
    setQuestions(checklist.question);
    setModalMode("view"); // Set mode to "edit"
    showModal("view"); // Open the modal
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
    api
      .getChecklist()
      .then((resp: any) => {
        setChecklistList(resp.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function onChange(sorter: any) {}

  const getData = (current: number, pageSize: number) => {
    const startIndex = (current - 1) * pageSize;
    let retVal = checklistList;

    if (searchQuery.trim() !== "") {
      retVal = retVal.filter((item) => {
        return Object.values(item).some((value) => {
          if (value) {
            return (
              value
                .toString()
                .toLowerCase()
                .indexOf(searchQuery?.toLowerCase()) !== -1
            );
          }
          return value;
        });
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
    api
      .getDepartment()
      .then((resp: any) => {
        setDepartmentList(resp.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (mode: string) => {
    if (mode === "add") {
      setQuestions([]);
      form.setFieldsValue({ department: "", title: "", question: [] });
      setAddCheckList({} as IAddCheckList);
      setModalMode(mode);
      setIsModalOpen(true);
    } else if (mode === "edit") {
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
    form.setFieldsValue({} as IAddCheckList);
    setAddCheckList({} as IAddCheckList);
    setQuestions([]);
    setIsModalOpen(false);
  };
  const handleOk = () => {
    //form.resetFields();
    form
      .validateFields()
      .then((values) => {
        try {
          // Remove blank questions from the array
          const filteredQuestions = questions.filter(
            (question) => question.name.trim() !== ""
          );
          setLoading(true);
          addChecklist.question = filteredQuestions;
          const apiCall =
            modalMode === "add"
              ? api.createChecklist(addChecklist)
              : api.updateChecklist(addChecklist, selectedChecklist._id);

          apiCall
            .then((resp: any) => {
              const successMessage =
                modalMode === "add" ? "Checklist added." : "Checklist Updated.";

              toast.success(successMessage, {
                position: toast.POSITION.TOP_RIGHT,
              });
              setModalMode("add");
              form.setFieldsValue({} as IAddCheckList);
              setAddCheckList({} as IAddCheckList);
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
      });
  };

  // Search input change handler
  const handleSearch = (searchValue: string) => {
    setSearchQuery(searchValue);
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

      // Update the state with the new array
      setQuestions(updatedQuestionsArray);
    }
  };

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
                Check list
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
                onChange={onChange}
                size="small"
                className="r4 table-striped-rows"
                bordered
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => {
                      viewClickHandler(record);
                    },
                  };
                }}
              />
            </div>
          )}

          <Modal
            title={
              modalMode === "view" ? (
                <Row gutter={[8, 8]} className="form-row">
                  <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 10 }}>
                    {selectedChecklist.title}
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 10 }}>
                    {selectedChecklist.title}
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 2 }}>
                    <Button
                      type="link"
                      icon={<FontAwesomeIcon icon={faEdit} />}
                      onClick={() => {
                        // Handle the edit button click event here
                        editClickHandler(selectedChecklist);
                      }}
                    />
                  </Col>
                </Row>
              ) : (
                "Create New Checklist"
              )
            }
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            okText="Add"
            className="checklist-modal"
          >
            <div className="modal-content">
              <Divider></Divider>
              <Form form={form} initialValues={addChecklist}>
                {modalMode === "view" ? (
                  // Render labels and values in "view" mode
                  <>
                    <p>
                      {selectedChecklist.title}
                      {selectedChecklist.department.name}
                    </p>

                    <div className="question-details client-details ">
                      <Table
                        rowKey={(record: any) => record._id}
                        columns={
                          modalMode === "view"
                            ? questionColumns
                            : editableQuestionColumns
                        }
                        dataSource={questions}
                        pagination={false}
                        showHeader={false}
                      />
                    </div>
                  </>
                ) : (
                  <>
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
                              message: "Please enter checklist name.",
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
                            options={departmentList.map((departmentList) => ({
                              value: departmentList._id,
                              label: capitalize(departmentList.name),
                            }))}
                            placeholder="Select Department"
                            onChange={(value, event) => {
                              inputChangeHandler(event, "department");
                            }}
                            showSearch={true}
                            className="w100"
                          ></Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Divider></Divider>
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
                        />
                      </Col>
                    </Row>

                    <div className="question-details client-details ">
                      <Table
                        rowKey={(record: any) => record._id}
                        columns={
                          modalMode === "view"
                            ? questionColumns
                            : editableQuestionColumns
                        }
                        dataSource={questions}
                        pagination={false}
                        showHeader={false}
                      />
                    </div>
                  </>
                )}
              </Form>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Checklist;
