import React, { useEffect, useState, useRef } from "react";
import {
  Form,
  Typography,
  DatePicker,
  Select,
  Switch,
  Row,
  Col,
  TimePicker,
  Upload,
  Divider,
} from "antd";
import Button from "../../../components/Button/Index";
import SubTask from "./SubTask";
import styles from "./AddTask.module.scss";
import {
  priorityOpts,
  chargesOpts,
  assigneeOpts,
  modeOptions,
  workAreaOpts,
} from "../../utilities/utility";
import dayjs from "dayjs";
import { CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  AddTask as IAddTask,
  TaskTimer,
  TimerOpts,
  Task,
  AddSubTask,
} from "./interfaces/ITask";
import api from "../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddTask.scss";
import { useAppDispatch } from "../../states/store";
import { getClientsReducersApi } from "../../../redux/getClientsReducers";
import { getEmployeesReducersApi } from "../../../redux/getEmployeesReducers";
import { useSelector } from "react-redux";
import classNames from "classnames";
import Input from "../../../components/Input/Index";
const { Title } = Typography;

const AddTask = () => {
  const dispatch = useAppDispatch();
  const dateFormat = "YYYY-MM-DD";
  const navigate = useNavigate();
  const selectModeRef = useRef(null);
  const initialValuesRef = useRef(new Task());
  const [form] = Form.useForm();
  const clientList = useSelector((state: any) => state.getClients.data) || [];
  const employeeList =
    useSelector((state: any) => state.getEmployees.data) || [];
  useEffect(() => {
    dispatch(getClientsReducersApi());
    dispatch(getEmployeesReducersApi());
  }, []);

  // local states
  const [showSubTask, setShowSubTask] = useState<boolean>(false);
  const [addTask, setAddTask] = useState<IAddTask>(new Task());

  // Handllers
  const onSwitchSubTask = () => {
    setShowSubTask(!showSubTask);
  };
  const cancelNewTaskHandler = () => {
    navigate("/task");
  };

  const inputChangeHandler = (event: any, nameItem: string = "") => {
    let name = "";
    let value = "";
    if (event && event.target) {
      name = event.target.name;
      value = event.target.value;
    } else if (nameItem !== "" && event !== "") {
      name = nameItem;
      value = event;
    } else if (event) {
      name = event.name;
      value = event.value;
    }

    if (name === "assigned_to" && Array.isArray(event)) {
      const transformedValues = event.map((item) => item.value);
      setAddTask({ ...addTask, [name]: transformedValues });
    } else {
      setAddTask({
        ...addTask,
        [name]: value,
      });
    }
  };

  const validate = () => {
    let returnArray = {
      status: true,
      message: "Please set mandatory fields!",
    };

    if (addTask.hasOwnProperty("start_date") && addTask.start_date === "") {
      returnArray.status = false;
    } else if (addTask.hasOwnProperty("due_date") && addTask.due_date === "") {
      returnArray.status = false;
    } else if (addTask.hasOwnProperty("mode") && addTask.mode === "") {
      returnArray.status = false;
    } else if (addTask.hasOwnProperty("title") && addTask.title === "") {
      returnArray.status = false;
    } else if (
      addTask.hasOwnProperty("client") &&
      addTask.client &&
      addTask.client.length === 0
    ) {
      returnArray.status = false;
    } else if (addTask.hasOwnProperty("workArea") && addTask.workArea === "") {
      returnArray.status = false;
    } else if (addTask.hasOwnProperty("remarks") && addTask.remarks === "") {
      returnArray.status = false;
    } else if (
      addTask.hasOwnProperty("budget_time") &&
      addTask.budget_time === ""
    ) {
      returnArray.status = false;
    } else if (
      addTask.hasOwnProperty("budget_time") &&
      addTask.budget_time === "00:00"
    ) {
      returnArray.status = false;
      returnArray.message = "Enter valid budget time.";
    } else if (addTask.hasOwnProperty("priority") && addTask.priority === "") {
      returnArray.status = false;
    } else if (addTask.hasOwnProperty("billable") && addTask.billable === "") {
      returnArray.status = false;
    } else if (
      addTask.hasOwnProperty("assigned_to") &&
      addTask.assigned_to &&
      addTask.assigned_to.length === 0
    ) {
      returnArray.status = false;
    }

    // Due date validation against the start date
    const startDateValue = dayjs(addTask.start_date);
    const dueDateValue = dayjs(addTask.due_date);
    if (startDateValue.isValid() && dueDateValue.isValid()) {
      if (dueDateValue.isBefore(startDateValue)) {
        returnArray.status = false;
        returnArray.message = "Enter dates.";
      }
    } else {
      returnArray.status = false;
      returnArray.message = "Enter dates.";
    }

    // Start date validation against the due date
    if (startDateValue.isValid() && dueDateValue.isValid()) {
      if (startDateValue.isAfter(dueDateValue)) {
        returnArray.status = false;
        returnArray.message = "Enter dates.";
      }
    } else {
      returnArray.status = false;
      returnArray.message = "Enter dates.";
    }

    return returnArray;
  };

  const handleAddTask = () => {
    let validateTaskData = validate();
    if (!validateTaskData.status) {
      toast.error(validateTaskData.message, {
        position: toast.POSITION.TOP_RIGHT,
      });

      return false;
    } else {
      // Read all existing task from `localStorage`
      const taskList = localStorage.getItem("task");

      // set timer
      const timer = {} as TaskTimer;
      timer.state = TimerOpts.stop;
      timer.time = 0;
      addTask.timer = timer;
      addTask.actual_time = addTask.budget_time;

      addTask.taskType = "single_task_without_subtask";
      if (addTask.subtask.length > 0) {
        addTask.taskType = "single_task_with_subtask";
      }

      let allTask = taskList && taskList.length > 0 ? JSON.parse(taskList) : [];
      addTask._id = allTask && allTask.length > 0 ? allTask.length + 1 : 1;
      allTask.push(addTask);

      // Save to DB
      try {
        api.createTask(addTask).then((resp: any) => {
          // Set Task to `localStorage`
          localStorage.setItem("task", JSON.stringify(allTask));
          toast.success("Successfully Created Task", {
            position: toast.POSITION.TOP_RIGHT,
          });
          // TODO: need to implement
          resetFormValues();
        });
      } catch (ex) {
        toast.error("Technical error while creating Task", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  const updateSubComponents = (subTasks: AddSubTask[]) => {
    addTask.subtask = !showSubTask
      ? []
      : subTasks.map((subTaskItem: AddSubTask) => {
          return {
            title: subTaskItem.title,
            status: "pending",
            budget_time: subTaskItem.budget_time,
            actual_time: " ",
            remarks: subTaskItem.remarks,
            priority: subTaskItem.priority,
            workArea: subTaskItem.workArea,
            client: subTaskItem.client,
            assigned_to: subTaskItem.assigned_to,
            datapath: subTaskItem.datapath,
            attachments: [], //TODO: once attachement available then implement this
            mode: " ",
            comments: [],
          };
        });
  };

  const resetFormValues = () => {
    const fields = form.getFieldsValue();
    Object.keys(fields).forEach((field) => {
      form.setFieldsValue({ [field]: undefined });
    });

    setShowSubTask(false);
  };

  // render
  return (
    <>
      <ToastContainer autoClose={25000} />
      <div className={classNames("card mb-3", styles.addPromoCodeCardWrapper)}>
        <div
          className={classNames(
            "card-header d-flex",
            styles.promoCodeCardHeaderBox
          )}
          style={{ minHeight: 60 }}
        >
          <div
            className={classNames(
              "d-flex align-items-center w-100",
              styles.promocodeHeaderTitle
            )}
          >
            <div className="me-auto">
              <h5
                className={classNames(
                  "my-2 position-relative z-index-1",
                  styles.addPromoCodeLabel
                )}
              >
                Add New Task
              </h5>
            </div>
            <div className={classNames("ms-auto z-index-1")}>
              <Button
                onClick={cancelNewTaskHandler}
                className={classNames("greyBtn", styles.cancelAddClientBtn)}
                style={{
                  minWidth: 104,
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.addClientDetailBox}>
          <Form
            name="basic"
            initialValues={{
              start_date: dayjs(),
            }}
            autoComplete="off"
            requiredMark={false}
            className="customAddForm"
            form={form}
            id="addTaskFrm"
          >
            <div className="row">
              <div className={classNames("col-12 col-md-4 col-lg-4")}>
                <div className="mb-3">
                  <Form.Item
                    name="start_date"
                    className="customAddClientSelectOptions"
                    rules={[
                      {
                        required: true,
                        message: "Please select start date.",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const dueDateValue = getFieldValue("due_date");
                          if (
                            !value ||
                            !dueDateValue ||
                            dayjs(value).isBefore(dueDateValue)
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "Start date should be before the due date."
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      placeholder="Start Date"
                      name="start_date"
                      className="customFormDatePicker"
                      format={dateFormat}
                      onChange={(date, dateString) => {
                        inputChangeHandler(dateString, "start_date");
                      }}
                      onPanelChange={() => {}}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className={classNames("col-12 col-md-4 col-lg-4")}>
                <div className="mb-3">
                  <Form.Item
                    name="due_date"
                    className="customAddClientSelectOptions"
                    rules={[
                      {
                        required: true,
                        message: "Please select due date.",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const startDate = getFieldValue("start_date");
                          if (
                            !value ||
                            !startDate ||
                            !dayjs(value).isBefore(startDate)
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "Due date should be on or after the start date."
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      placeholder="Due Date"
                      name="due_date"
                      onChange={(date, dateString) => {
                        inputChangeHandler(dateString, "due_date");
                      }}
                      className="customFormDatePicker"
                      format={dateFormat}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className={classNames("col-12 col-md-4 col-lg-4")}>
                <div className="mb-3">
                  <Form.Item
                    className="customAddClientSelectOptions"
                    name="mode"
                    rules={[
                      {
                        required: true,
                        message: "Please select task mode.",
                      },
                    ]}
                  >
                    <Select
                      ref={selectModeRef}
                      allowClear
                      placeholder={<span>Select Mode</span>}
                      options={modeOptions}
                      value={addTask.mode}
                      showSearch={true}
                      onChange={(value, event) => {
                        inputChangeHandler(event);
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="row">
              <div className={classNames("col-12 col-md-6 col-lg-6")}>
                <div className="mb-3">
                  <Form.Item
                    name="title"
                    className="customAddClientSelectOptions"
                    rules={[
                      {
                        required: true,
                        message: "Please enter title.",
                        validateTrigger: ["onSubmit"],
                      },
                    ]}
                  >
                    <Input
                      name="title"
                      placeholder={"Task"}
                      className="customAddFormInputText"
                      value={addTask.title}
                      onChange={(event: any) => {
                        inputChangeHandler(event);
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className={classNames("col-12 col-md-6 col-lg-6")}>
                <div className="mb-3">
                  <Form.Item
                    className="customAddClientSelectOptions"
                    name="workArea"
                    rules={[
                      {
                        required: true,
                        message: "Please select work area.",
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      placeholder={<span>Select Work Area</span>}
                      options={workAreaOpts}
                      value={addTask.workArea}
                      showSearch={true}
                      onChange={(value, event) => {
                        inputChangeHandler(event);
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <Row gutter={[8, 8]} className="form-row">
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                <Form.Item
                  className="customAddClientSelectOptions"
                  name="remarks"
                  rules={[
                    {
                      required: true,
                      message: "Please entre remark.",
                    },
                  ]}
                >
                  <ReactQuill
                    theme="snow"
                    value={addTask.remarks}
                    placeholder="Remark"
                    onChange={(event) => {
                      inputChangeHandler(event, "remarks");
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 8]} className="form-row">
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                <Form.Item
                  className="customAddClientSelectOptions"
                  name="budget_time"
                  rules={[
                    {
                      required: true,
                      message: "Please select budget time.",
                    },
                    {
                      pattern: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
                      message: "Please enter a valid time in the format HH:mm.",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (value !== "00:00") {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Budget Time cannot be set to 00:00.")
                        );
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder="Budget Time"
                    name="budget_time"
                    onInput={(event: any) => {
                      const inputElement = event.target as HTMLInputElement;
                      let input = inputElement.value;
                      input = input.replace(/[^0-9]/g, ""); // Remove non-numeric characters

                      if (input.length >= 3) {
                        input = input.slice(0, 2) + ":" + input.slice(2);
                      }

                      inputElement.value = input;
                      inputChangeHandler(event);
                    }}
                    className="customAddFormInputText"
                    maxLength={5}
                  />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                <Form.Item
                  className="customAddClientSelectOptions"
                  name="priority"
                  rules={[
                    {
                      required: true,
                      message: "Please select priority.",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    placeholder="Priority"
                    options={priorityOpts}
                    value={addTask.priority}
                    showSearch={true}
                    onChange={(value, event) => {
                      inputChangeHandler(event);
                    }}
                    className="w100"
                  />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                <Form.Item
                  className="customAddClientSelectOptions"
                  name="billable"
                  rules={[
                    {
                      required: true,
                      message: "Please select billable.",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    placeholder="Billable"
                    value={addTask.billable}
                    options={chargesOpts}
                    showSearch={true}
                    onChange={(value, event) => {
                      inputChangeHandler(event);
                    }}
                    className="w100"
                  ></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 8]} className="form-row add-form-row">
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                <Form.Item
                  className="customAddClientSelectOptions"
                  name="client"
                  rules={[
                    {
                      required: true,
                      message: "Please select client.",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder="Client"
                    value={addTask.client}
                    options={clientList.map((client: any) => ({
                      label: client?.firmName,
                      value: client?._id,
                    }))}
                    onChange={(value, event) => {
                      inputChangeHandler(event);
                    }}
                    className="w100"
                  />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                <Form.Item
                  className="customAddClientSelectOptions"
                  name="assigned_to"
                  rules={[
                    {
                      required: true,
                      message: "Please select assignee.",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder="Assign Person"
                    value={addTask.assigned_to}
                    options={employeeList.map((employee: any) => ({
                      label: employee?.firstName,
                      value: employee?._id,
                    }))}
                    onChange={(value, event) => {
                      inputChangeHandler(event, "assigned_to");
                    }}
                    mode="multiple"
                    className="w100"
                  ></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 8]} className="form-row">
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 4 }}>
                <Upload showUploadList={{ showPreviewIcon: true }}>
                  <Button type="primary">Attach Files</Button>
                </Upload>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 20 }}>
                <Form.Item
                  className="customAddClientSelectOptions"
                  name="datapath"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Input
                    placeholder="Data Path"
                    name="datapath"
                    defaultValue={addTask.datapath}
                    onChange={(event: any) => {
                      inputChangeHandler(event);
                    }}
                    className="customAddFormInputText"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 8]} className="form-row">
              <Divider />
            </Row>
            <Row gutter={[8, 8]} className="form-row">
              <Col>
                <Title level={5}>Sub Task</Title>
              </Col>
              <Col>
                <Switch
                  checked={showSubTask}
                  onChange={onSwitchSubTask}
                ></Switch>
              </Col>
            </Row>

            <Row
              gutter={[8, 8]}
              className={"form-row " + (!showSubTask ? "hide" : "")}
            >
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                <SubTask subComponentsHandler={updateSubComponents} />
              </Col>
            </Row>
            <Row gutter={[8, 8]} className="form-row">
              <Button
                htmlType="submit"
                type="primary"
                className="w100"
                onClick={handleAddTask}
              >
                Add Task
              </Button>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddTask;
