import React, { useEffect, useState, useRef } from "react";
import {
    Form,
    Input,
    Typography,
    DatePicker,
    Select,
    Switch,
    Row,
    Col,
    TimePicker,
    Upload,
    Divider,
    Calendar,
    Popover,
    Dropdown,
    Radio,
    Button,
    RadioChangeEvent,
    TabsProps,
    Tabs,
    Checkbox,
} from "antd";

import SubTask from "./SubTask";
import {
    priorityOpts,
    chargesOpts,
    assigneeOpts,
    clientOpts,
    modeOptions,
    workAreaOpts,
} from "../../utilities/utility";
import dayjs from "dayjs";
import {
    CloseOutlined,
    CalendarOutlined,
    CaretDownOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
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
import Followers from "../../components/Followers/Followers";
import Reminder from "../../components/Reminder/Reminder";
import ChecklistModal from "../../components/ChecklistModal/ChecklistModal";

const { Title } = Typography;
const ttl = "Repeat Task";
const cont = (
    <Form>
        <div>
            <hr />
            <p className="a7">Create New Copies</p>
            <Radio.Group buttonStyle="solid">
                <Radio.Button value="a" defaultChecked>
                    Daily
                </Radio.Button>
                <Radio.Button value="b">Weakly</Radio.Button>
                <Radio.Button value="c">Monthly</Radio.Button>
                <Radio.Button value="d">Yearly</Radio.Button>
            </Radio.Group>

            <br />
            <br />

            <p className="a6">
                Every <Select value={1} /> Day(s)
            </p>
            <p className="a7">
                When Do you want to stop repeating this Task ?{" "}
            </p>
            <Radio.Group>
                <Radio value={1}>
                    <p className="a6">Do not stop repeating this Task</p>
                </Radio>
                <br />
                <Radio value={2}>
                    <p className="a6">
                        On <DatePicker placeholder="" />
                    </p>
                </Radio>
            </Radio.Group>
            <br />
            <br />
            <p className="a7">Set Remainder</p>
            <Select placeholder="Select Option" className="a8" />
            <div className="a9">
                <Button>Cancel</Button>&nbsp;&nbsp;
                <Button type="primary">Done</Button>
            </div>
        </div>
    </Form>
);

//Weakly
/*  
                <p className="a6">Every <Select value={1} /> Day(s)</p>
                <div>
                <p className="a6">On</p>&nbsp;&nbsp;&nbsp;
                    <Checkbox.Group style={{width:'100%'}}>
                    <Row>
                        <Col>
                            <Checkbox value="A">Sun</Checkbox>
                        </Col>
                        <Col>
                            <Checkbox value="B">Mon</Checkbox>
                        </Col>
                        <Col>
                            <Checkbox value="C">Tues</Checkbox>
                        </Col>
                        <Col>
                            <Checkbox value="D">Wed</Checkbox>
                        </Col>
                        <Col>
                            <Checkbox value="E">Thu</Checkbox>
                        </Col>
                        <Col>
                            <Checkbox value="E">Fri</Checkbox>
                        </Col>
                        <Col>
                            <Checkbox value="E">Sat</Checkbox>
                        </Col>
                    </Row>
                    </Checkbox.Group>
                
                </div>
                <p className="a7">When Do you want to stop repeating this Task ? </p>
                <Radio.Group>
                <Radio value={1}><p className="a6">Do not stop repeating this Task</p></Radio><br />
                <Radio value={2}><p className="a6">On <DatePicker placeholder="" /></p></Radio>
                </Radio.Group>
                <br /><br />
                <p className="a7">Set Remainder</p>
                <Select placeholder="Select Option" className="a8" />
                <div className="a9">
                    <Button>Cancel</Button>&nbsp;&nbsp;
                    <Button type="primary">Done</Button>
                </div> 
            */
//Monthly
/*  <br />
                <br />
                <Radio.Group>
                    <Radio value={1}><p className="a6">Once in Every <Select value={1} /> Month(s) On <Select value={22} /> </p></Radio><br />
                    <Radio value={2}><p className="a6">Once in Every <Select value={1} /> Month(s) On <Select value="Last" /> <Select value="Sunday" /> </p></Radio>
                </Radio.Group>
                
                <p className="a7">When Do you want to stop repeating this Task ? </p>
                <Radio.Group>
                <Radio value={1}><p className="a6">Do not stop repeating this Task</p></Radio><br />
                <Radio value={2}><p className="a6">On <DatePicker placeholder="" /></p></Radio>
                </Radio.Group>
                <br /><br />
                <p className="a7">Set Remainder</p>
                <Select placeholder="Select Option" className="a8" />
                <div className="a9">
                    <Button>Cancel</Button>&nbsp;&nbsp;
                    <Button type="primary">Done</Button>
                </div> 
            */
//Yearly
/*
            <br />
            <br />
            <p className="a6">Once in Every <Select value={1} /> Year(s) On <Select value="August" /> <Select value={22} /> </p>

            <p className="a7">When Do you want to stop repeating this Task ? </p>
                <Radio.Group>
                <Radio value={1}><p className="a6">Do not stop repeating this Task</p></Radio><br />
                <Radio value={2}><p className="a6">On <DatePicker placeholder="" /></p></Radio>
                </Radio.Group>
                <br /><br />
                <p className="a7">Set Remainder</p>
                <Select placeholder="Select Option" className="a8" />
                <div className="a9">
                    <Button>Cancel</Button>&nbsp;&nbsp;
                    <Button type="primary">Done</Button>
                </div> 
        */
const AddTask = () => {
    const dateFormat = "YYYY-MM-DD";
    const navigate = useNavigate();
    const selectModeRef = useRef(null);
    const [form] = Form.useForm();

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
        } else if (
            addTask.hasOwnProperty("due_date") &&
            addTask.due_date === ""
        ) {
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
        } else if (
            addTask.hasOwnProperty("workArea") &&
            addTask.workArea === ""
        ) {
            returnArray.status = false;
        } else if (
            addTask.hasOwnProperty("remarks") &&
            addTask.remarks === ""
        ) {
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
        } else if (
            addTask.hasOwnProperty("priority") &&
            addTask.priority === ""
        ) {
            returnArray.status = false;
        } else if (
            addTask.hasOwnProperty("billable") &&
            addTask.billable === ""
        ) {
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

            console.log(addTask.subtask.length);

            let allTask =
                taskList && taskList.length > 0 ? JSON.parse(taskList) : [];
            addTask._id =
                allTask && allTask.length > 0 ? allTask.length + 1 : 1;
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

    const handleInputKeyDown = () => {
        if (selectModeRef.current) {
            // selectModeRef.current.blur();
            console.log(selectModeRef.current);
        }
    };

    const resetFormValues = () => {
        const fields = form.getFieldsValue();
        Object.keys(fields).forEach((field) => {
            form.setFieldsValue({ [field]: undefined });
        });

        // onSwitchSubTask();
        setShowSubTask(false);
        //form.resetFields();
        //form.validateFields();
        console.log(addTask);
    };

    // render
    return (
        <>
            <div className="add-task-header">
                <ToastContainer autoClose={25000} />
                <div>
                    <Title level={5}>Add Task</Title>
                </div>
                <div className="add-task-cancel">
                    <Button
                        type="primary"
                        danger
                        icon={<CloseOutlined />}
                        onClick={cancelNewTaskHandler}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
            <Row gutter={[8, 8]} className="form-row">
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                    <div className="a1">
                        <div className="a5">
                            {<ClockCircleOutlined className="a2" />}
                            &nbsp;
                            <div>
                                <p className="a3">Start Date</p>
                                <p className="a4">
                                    {" "}
                                    Not set yet{" "}
                                    <Popover
                                        style={{ width: "20%" }}
                                        placement="bottom"
                                        content={
                                            <div style={{ width: 300 }}>
                                                <DatePicker
                                                    showTime
                                                    bordered={false}
                                                    className="w100"
                                                />
                                            </div>
                                        }
                                    >
                                        <CaretDownOutlined></CaretDownOutlined>
                                    </Popover>{" "}
                                </p>
                            </div>
                        </div>
                        <div className="aa5">
                            <ClockCircleOutlined className="a2" />
                            &nbsp;
                            <div>
                                <p className="a3">Due Date</p>
                                <p className="a4">
                                    {" "}
                                    Not set yet{" "}
                                    <Popover placement="bottom">
                                        <CaretDownOutlined />
                                    </Popover>
                                </p>
                            </div>
                        </div>
                        <div className="aa5">
                            <ClockCircleOutlined className="a2" />
                            &nbsp;
                            <div>
                                <p className="a3">Repeat Task</p>
                                <p className="a4">
                                    {" "}
                                    Not set yet{" "}
                                    <Popover
                                        placement="bottom"
                                        title={ttl}
                                        content={cont}
                                    >
                                        <CaretDownOutlined />
                                    </Popover>
                                </p>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Form
                form={form}
                initialValues={{
                    start_date: dayjs(),
                }}
                id="addTaskFrm"
            >
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
                            name="start_date"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select start date.",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const dueDateValue =
                                            getFieldValue("due_date");
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
                                format={dateFormat}
                                className="w100"
                                onChange={(date, dateString) => {
                                    inputChangeHandler(
                                        dateString,
                                        "start_date"
                                    );
                                }}
                                onPanelChange={() => {}}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
                            name="due_date"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select due date.",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const startDate =
                                            getFieldValue("start_date");
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
                                //  value={addTask.due_date}
                                onChange={(date, dateString) => {
                                    inputChangeHandler(dateString, "due_date");
                                }}
                                className="w100"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
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
                                placeholder="Select Task Mode"
                                options={modeOptions}
                                onChange={(value, event) => {
                                    inputChangeHandler(event);
                                }}
                                value={addTask.mode}
                                showSearch={true}
                                onInputKeyDown={(event) => {
                                    if (event.keyCode === 9) {
                                        handleInputKeyDown();
                                    }
                                }}
                                // onBlur={(event) => {
                                //     console.log("onBlur", event.target);
                                // }}
                                className="w100"
                            ></Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 16 }}>
                        <Form.Item
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter title.",
                                    validateTrigger: ["onSubmit"],
                                },
                            ]}
                        >
                            <Input
                                placeholder="Task"
                                name="title"
                                value={addTask.title}
                                onChange={(event) => {
                                    inputChangeHandler(event);
                                }}
                                className="w100"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
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
                                placeholder="Select Work Area"
                                options={workAreaOpts}
                                value={addTask.workArea}
                                className="w100"
                                showSearch={true}
                                onChange={(value, event) => {
                                    inputChangeHandler(event);
                                }}
                            ></Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        <Form.Item
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
                            name="budget_time"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select budget time.",
                                },
                                {
                                    pattern: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
                                    message:
                                        "Please enter a valid time in the format HH:mm.",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (value !== "00:00") {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                "Budget Time cannot be set to 00:00."
                                            )
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input
                                placeholder="Budget Time"
                                name="budget_time"
                                onInput={(event) => {
                                    const inputElement =
                                        event.target as HTMLInputElement;
                                    let input = inputElement.value;
                                    input = input.replace(/[^0-9]/g, ""); // Remove non-numeric characters

                                    if (input.length >= 3) {
                                        input =
                                            input.slice(0, 2) +
                                            ":" +
                                            input.slice(2);
                                    }

                                    inputElement.value = input;
                                    inputChangeHandler(event);
                                }}
                                className="w100"
                                maxLength={5}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
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
                                options={clientOpts}
                                onChange={(value, event) => {
                                    inputChangeHandler(event);
                                }}
                                className="w100"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
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
                                options={assigneeOpts}
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
                                onChange={(event) => {
                                    inputChangeHandler(event);
                                }}
                                className="w100"
                            />
                        </Form.Item>
                    </Col>
                </Row>{" "}
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <ChecklistModal />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Reminder />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Followers />
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
        </>
    );
};

export default AddTask;
