import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Typography,
    DatePicker,
    Select,
    Switch,
    Row,
    Col,
    TimePicker,
    Divider,
} from "antd";
import {
    priorityOpts,
    chargesOpts,
    modeOptions,
    workAreaOpts,
} from "../../utilities/utility";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    AddMultipleTask as IAddMultipleTask,
    AddClientDetails as IAddClientDetails,
    AddMultipleSubtask as IAddMultipleSubtask,
    AddMultipleTaskClass,
} from "./interfaces/ITask";
import api from "../../utilities/apiServices";
import MultipleTaskClientDetails from "./MultipleTaskClientDetails";
import "./AddTask.scss";
import MultipleSubtask from "./MultipleSubtask";
import { ToastContainer, toast } from "react-toastify";

const { Title } = Typography;

dayjs.extend(weekday);
dayjs.extend(localeData);

const AddMultipleTask = () => {
    const navigate = useNavigate();
    const dateFormat = "YYYY-MM-DD";
    const [clientDetails, setClientDetails] = useState<IAddClientDetails[]>([]);
    const [clientDetailsForSubTask, setClientDetailsForSubtask] = useState<
        IAddClientDetails[]
    >([]);
    const [multipleTask, setMultipleTask] = useState<IAddMultipleTask>(
        new AddMultipleTaskClass()
    );
    const [subTask, setSubTask] = useState<IAddMultipleSubtask[]>();
    const [showSubTask, setShowSubTask] = useState<boolean>(false);
    const newClientItem = {
        _id: "1",
        client_name: "",
        assigned_to: [],
        budget_time: "00:00",
        actual_time: "",
        priority: "",
        remarks: "",
        data_path: "",
        attachments: [],
        status: "",
        parentId: "",
    } as IAddClientDetails;
    const [form] = Form.useForm();

    const cancelNewTaskHandler = () => {
        navigate("/task");
    };

    const onSwitchSubTask = () => {
        if (clientDetails.length > 0) {
            setShowSubTask(!showSubTask);
        }
    };

    const validate = () => {
        let returnFlag = true;

        console.log("multipleTask", multipleTask);
        if (
            multipleTask.hasOwnProperty("start_date") &&
            multipleTask.start_date === ""
        ) {
            returnFlag = false;
        } else if (
            multipleTask.hasOwnProperty("due_date") &&
            multipleTask.due_date === ""
        ) {
            returnFlag = false;
        } else if (
            multipleTask.hasOwnProperty("mode") &&
            multipleTask.mode === ""
        ) {
            returnFlag = false;
        } else if (
            multipleTask.hasOwnProperty("title") &&
            multipleTask.title === ""
        ) {
            returnFlag = false;
        } else if (
            multipleTask.hasOwnProperty("client") &&
            multipleTask.clients &&
            multipleTask.clients.length === 0
        ) {
            returnFlag = false;
        } else if (
            multipleTask.hasOwnProperty("workArea") &&
            multipleTask.workArea === ""
        ) {
            returnFlag = false;
        } else if (
            multipleTask.hasOwnProperty("remarks") &&
            multipleTask.remarks === ""
        ) {
            returnFlag = false;
        } else if (
            multipleTask.hasOwnProperty("budget_time") &&
            multipleTask.budget_time === ""
        ) {
            returnFlag = false;
        } else if (
            multipleTask.hasOwnProperty("priority") &&
            multipleTask.priority === ""
        ) {
            returnFlag = false;
        } else if (
            multipleTask.hasOwnProperty("billable") &&
            multipleTask.billable === ""
        ) {
            returnFlag = false;
        }

        // Due date validation against the start date
        const startDateValue = dayjs(multipleTask.start_date);
        const dueDateValue = dayjs(multipleTask.due_date);
        if (startDateValue.isValid() && dueDateValue.isValid()) {
            if (dueDateValue.isBefore(startDateValue)) {
                returnFlag = false;
            }
        } else {
            returnFlag = false;
        }

        // Start date validation against the due date
        if (startDateValue.isValid() && dueDateValue.isValid()) {
            if (startDateValue.isAfter(dueDateValue)) {
                returnFlag = false;
            }
        } else {
            returnFlag = false;
        }

        return returnFlag;
    };

    const handleAddTask = () => {
        if (!validate()) {
            toast.error("Please set mandatory fields", {
                position: toast.POSITION.TOP_RIGHT,
            });

            return false;
        } else {
            const clientDetailsData = JSON.parse(JSON.stringify(clientDetails));
            const newDataWithoutId = [];

            for (const obj of clientDetailsData) {
                const newObj = { ...obj }; // Create a shallow copy of the object
                delete newObj._id;
                newDataWithoutId.push(newObj);
            }

            if (newDataWithoutId && newDataWithoutId.length > 0) {
                multipleTask.clients = newDataWithoutId;
            }

            let newDetails = [];
            let newDetails1 = [];
            if (subTask && subTask.length > 0) {
                // filter any in-correct data
                newDetails = subTask.filter((item: IAddMultipleSubtask) => {
                    return item.title !== "" && item.budget_time !== "";
                });

                // Convert data into required format
                newDetails1 = newDetails.map((item: IAddMultipleSubtask) => {
                    return {
                        title: item.title,
                        taskId: "",
                        status: item.status,
                        budget_time: item.budget_time,
                        actual_time: "",
                        remarks: item.remarks,
                        clients: item.clients,
                        priority: item.priority,
                        comments: [],
                    };
                });

                multipleTask.subtask = newDetails1;
                //TODO:: @hitesh bhai
                // setSubCompliance(newDetails1); // remove due to override object please confirm @hitesh bhai
            }

            // Save to DB
            try {
                api.createMultipleTask(multipleTask).then((resp: any) => {
                    toast.success("Successfully Created Multiple Task", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    resetFormValues();
                });
            } catch (ex) {
                toast.error("Technical error while creating Task", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }
    };

    const resetFormValues = () => {
        const fields = form.getFieldsValue();
        Object.keys(fields).forEach((field) => {
            form.setFieldsValue({ [field]: undefined });
        });

        setShowSubTask(false);
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

        console.log(name, value);

        setMultipleTask({
            ...multipleTask,
            [name]: value,
        });
    };

    const clientDetailsHandler = (details: IAddClientDetails[]) => {
        setClientDetails(details);
    };

    const updateSubComponents = (subTasks: IAddMultipleSubtask[]) => {
        setSubTask(showSubTask ? subTasks : []);
    };

    return (
        <>
            <div className="add-task-header">
                <ToastContainer autoClose={25000} />
                <div>
                    <Title level={5}>Add Multiple Tasks</Title>
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
            <Form
                form={form}
                initialValues={{
                    start_date: dayjs(),
                }}
                id="addMultipleTaskFrm"
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
                        <DatePicker
                            placeholder="Due Date"
                            name="due_date"
                            onChange={(date, dateString) => {
                                inputChangeHandler(dateString, "due_date");
                            }}
                            className="w100"
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Select
                            allowClear
                            placeholder="Select Task Mode"
                            options={modeOptions}
                            onChange={(value, event) => {
                                inputChangeHandler(event);
                            }}
                            className="w100"
                        ></Select>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 16 }}>
                        <Input
                            placeholder="Task"
                            name="title"
                            onChange={(event) => {
                                inputChangeHandler(event);
                            }}
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Select
                            allowClear
                            placeholder="Select Work Area"
                            options={workAreaOpts}
                            className="w100"
                            onChange={(value, event) => {
                                inputChangeHandler(event);
                            }}
                        ></Select>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        <ReactQuill
                            theme="snow"
                            // value={addTask.remark}
                            placeholder="Remark"
                            onChange={(event) => {
                                inputChangeHandler(event, "remarks");
                            }}
                        />
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        {/* <TimePicker
                            placeholder="Budget Time"
                            name="budget_time"
                            onChange={(date, dateString) => {
                                inputChangeHandler(dateString, "budget_time");
                            }}
                            className="w100"
                            format={"HH:mm"}
                        /> */}
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
                            ]}
                        >
                            <Input
                                placeholder="Budget Time"
                                name="budget_time"
                                onChange={(event) => {
                                    inputChangeHandler(event);
                                }}
                                className="w100"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Select
                            allowClear
                            placeholder="Priority"
                            options={priorityOpts}
                            onChange={(value, event) => {
                                inputChangeHandler(event);
                            }}
                            className="w100"
                        />
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Select
                            allowClear
                            placeholder="Billable"
                            options={chargesOpts}
                            onChange={(value, event) => {
                                inputChangeHandler(event);
                            }}
                            className="w100"
                        ></Select>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Divider />
                </Row>
                <MultipleTaskClientDetails
                    updateClients={clientDetailsHandler}
                    isAllowAdd={true}
                    parentTitle="task"
                    parentId={-1}
                    scroll={{ x: 1000 }}
                    data={[newClientItem]}
                    isEdit={true}
                />
                <Row gutter={[8, 8]} className="form-row">
                    <Divider />
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col>
                        <Title level={5}>Create new task for each client</Title>
                    </Col>
                    <Col>
                        <Switch
                            onChange={onSwitchSubTask}
                            size="small"
                        ></Switch>
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
                            disabled
                        ></Switch>
                    </Col>
                    <Col>
                        <Title
                            level={5}
                            style={{ opacity: 0.5, marginLeft: "10px" }}
                        >
                            Each client will be added as a Subtask.
                        </Title>
                    </Col>
                </Row>
                <Row
                    gutter={[8, 8]}
                    className={"form-row " + (!showSubTask ? "hide" : "")}
                >
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        {showSubTask && (
                            <MultipleSubtask
                                subComponentsHandler={updateSubComponents}
                                clientData={clientDetails}
                            />
                        )}
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

export default AddMultipleTask;
