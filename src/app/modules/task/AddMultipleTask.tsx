import React, { useEffect, useState } from "react";
import {
    Form,
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
import styles from "./AddTask.module.scss";
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
import { useAppDispatch } from "../../states/store";
import { useSelector } from "react-redux";
import { getEmployeesReducersApi } from "../../../redux/getEmployeesReducers";
import { getClientsReducersApi } from "../../../redux/getClientsReducers";
import classNames from "classnames";
import Input from "../../../components/Input/Index";

const { Title } = Typography;

dayjs.extend(weekday);
dayjs.extend(localeData);

const AddMultipleTask = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
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
        let returnArray = {
            status: true,
            message: "Please set mandatory fields!",
        };

        console.log("multipleTask", multipleTask);
        if (
            multipleTask.hasOwnProperty("start_date") &&
            multipleTask.start_date === ""
        ) {
            returnArray.status = false;
        } else if (
            multipleTask.hasOwnProperty("due_date") &&
            multipleTask.due_date === ""
        ) {
            returnArray.status = false;
        } else if (
            multipleTask.hasOwnProperty("mode") &&
            multipleTask.mode === ""
        ) {
            returnArray.status = false;
        } else if (
            multipleTask.hasOwnProperty("title") &&
            multipleTask.title === ""
        ) {
            returnArray.status = false;
        } else if (
            multipleTask.hasOwnProperty("client") &&
            multipleTask.clients &&
            multipleTask.clients.length === 0
        ) {
            returnArray.status = false;
        } else if (
            multipleTask.hasOwnProperty("workArea") &&
            multipleTask.workArea === ""
        ) {
            returnArray.status = false;
        } else if (
            multipleTask.hasOwnProperty("remarks") &&
            multipleTask.remarks === ""
        ) {
            returnArray.status = false;
        } else if (
            multipleTask.hasOwnProperty("budget_time") &&
            multipleTask.budget_time === ""
        ) {
            returnArray.status = false;
        } else if (
            multipleTask.hasOwnProperty("budget_time") &&
            multipleTask.budget_time === "00:00"
        ) {
            returnArray.status = false;
            returnArray.message = "Enter valid budget time.";
        } else if (
            multipleTask.hasOwnProperty("priority") &&
            multipleTask.priority === ""
        ) {
            returnArray.status = false;
        } else if (
            multipleTask.hasOwnProperty("billable") &&
            multipleTask.billable === ""
        ) {
            returnArray.status = false;
        }

        // Due date validation against the start date
        const startDateValue = dayjs(multipleTask.start_date);
        const dueDateValue = dayjs(multipleTask.due_date);
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

            multipleTask.taskType = "multiple_client_without_subtask";
            if (multipleTask.subtask.length > 0) {
                multipleTask.taskType = "multiple_client_with_subtask";
            }
            // Save to DB

            console.log("multipleTask", multipleTask);
            // return;
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
        console.log("details", details);
        setClientDetails(details);
    };

    const updateSubComponents = (subTasks: IAddMultipleSubtask[]) => {
        setSubTask(showSubTask ? subTasks : []);
    };

    return (
        <>
            <ToastContainer autoClose={25000} />
            <div
                className={classNames(
                    "card mb-3",
                    styles.addPromoCodeCardWrapper
                )}
            >
                {" "}
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
                                Add Multiple Tasks
                            </h5>
                        </div>
                        <div className={classNames("ms-auto z-index-1")}>
                            <Button
                                type="primary"
                                className={classNames(
                                    "greyBtn",
                                    styles.cancelAddClientBtn
                                )}
                                style={{
                                    minWidth: 104,
                                }}
                                onClick={cancelNewTaskHandler}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={styles.addClientDetailBox}>
                    <Form
                        name="basic"
                        form={form}
                        initialValues={{
                            start_date: dayjs(),
                        }}
                        autoComplete="off"
                        requiredMark={false}
                        className="customAddForm"
                        id="addMultipleTaskFrm"
                    >
                        <div className="row">
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4"
                                )}
                            >
                                <div className="mb-3">
                                    <Form.Item
                                        name="start_date"
                                        className="customAddClientSelectOptions"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select start date.",
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    const dueDateValue =
                                                        getFieldValue(
                                                            "due_date"
                                                        );
                                                    if (
                                                        !value ||
                                                        !dueDateValue ||
                                                        dayjs(value).isBefore(
                                                            dueDateValue
                                                        )
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
                                                inputChangeHandler(
                                                    dateString,
                                                    "start_date"
                                                );
                                            }}
                                            onPanelChange={() => {}}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4"
                                )}
                            >
                                <div className="mb-3">
                                    <Form.Item
                                        name="due_date"
                                        className="customAddClientSelectOptions"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select due date.",
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    const startDate =
                                                        getFieldValue(
                                                            "start_date"
                                                        );
                                                    if (
                                                        !value ||
                                                        !startDate ||
                                                        !dayjs(value).isBefore(
                                                            startDate
                                                        )
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
                                                inputChangeHandler(
                                                    dateString,
                                                    "due_date"
                                                );
                                            }}
                                            className="customFormDatePicker"
                                            format={dateFormat}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4"
                                )}
                            >
                                <div className="mb-3">
                                    <Form.Item
                                        className="customAddClientSelectOptions"
                                        name="mode"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select task mode.",
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder={
                                                <span>Select Mode</span>
                                            }
                                            options={modeOptions}
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
                            <div
                                className={classNames(
                                    "col-12 col-md-6 col-lg-6"
                                )}
                            >
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
                                            onChange={(event: any) => {
                                                inputChangeHandler(event);
                                            }}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <div
                                className={classNames(
                                    "col-12 col-md-6 col-lg-6"
                                )}
                            >
                                <div className="mb-3">
                                    <Form.Item
                                        className="customAddClientSelectOptions"
                                        name="workArea"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select work area.",
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder={
                                                <span>Select Work Area</span>
                                            }
                                            options={workAreaOpts}
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
                            <div
                                className={classNames(
                                    "col-12 col-md-12 col-lg-12"
                                )}
                            >
                                <div className="mb-3">
                                    <ReactQuill
                                        theme="snow"
                                        placeholder="Remark"
                                        onChange={(event) => {
                                            inputChangeHandler(
                                                event,
                                                "remarks"
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4"
                                )}
                            >
                                <div className="mb-3">
                                    <Form.Item
                                        name="budget_time"
                                        className="customAddClientSelectOptions"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select budget time.",
                                            },
                                            {
                                                pattern:
                                                    /^(?:[01]\d|2[0-3]):[0-5]\d$/,
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
                                            onInput={(event: any) => {
                                                const inputElement =
                                                    event.target as HTMLInputElement;
                                                let input = inputElement.value;
                                                input = input.replace(
                                                    /[^0-9]/g,
                                                    ""
                                                ); // Remove non-numeric characters

                                                if (input.length >= 3) {
                                                    input =
                                                        input.slice(0, 2) +
                                                        ":" +
                                                        input.slice(2);
                                                }

                                                inputElement.value = input;
                                                inputChangeHandler(event);
                                            }}
                                            onChange={(event: any) => {
                                                inputChangeHandler(event);
                                            }}
                                            className="customAddFormInputText"
                                            maxLength={5}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4"
                                )}
                            >
                                <div className="mb-3">
                                    <Form.Item
                                        className="customAddClientSelectOptions"
                                        name="priority"
                                    >
                                        <Select
                                            allowClear
                                            showSearch={true}
                                            placeholder="Priority"
                                            options={priorityOpts}
                                            onChange={(value, event) => {
                                                inputChangeHandler(event);
                                            }}
                                            className="customAddClientSelectOptions"
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4"
                                )}
                            >
                                <div className="mb-3">
                                    <Form.Item
                                        className="customAddClientSelectOptions"
                                        name="billable"
                                    >
                                        <Select
                                            allowClear
                                            placeholder="Billable"
                                            options={chargesOpts}
                                            onChange={(value, event) => {
                                                inputChangeHandler(event);
                                            }}
                                            className="w100"
                                        ></Select>
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
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
                                <Title level={5}>
                                    Create new task for each client
                                </Title>
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
                            className={
                                "form-row " + (!showSubTask ? "hide" : "")
                            }
                        >
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 24 }}
                            >
                                {showSubTask && (
                                    <MultipleSubtask
                                        subComponentsHandler={
                                            updateSubComponents
                                        }
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
                </div>
            </div>
        </>
    );
};

export default AddMultipleTask;
