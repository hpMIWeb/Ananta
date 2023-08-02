import React, { useEffect, useState, useRef } from "react";
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
    Upload,
    Divider,
    Table,
} from "antd";
import AddSubCompliance from "./AddSubCompliance";
import {
    priorityOpts,
    chargesOpts,
    modeOptions,
    workAreaOpts,
} from "../../utilities/utility";
import dayjs from "dayjs";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    AddCompliance as IAddCompliance,
    SubCompliance as ISubCompliance,
    IClientDetails,
    ComplianceTimer,
    TimerOpts,
} from "./interfaces/ICompliance";
import api from "../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddCompliance.scss";
import ComplianceDetails from "./ComplianceDetails";

const { Title } = Typography;
const dataSource = [
    {
        key: "1",
        action: "Mike",
        age: 32,
        address: "10 Downing Street",
    },
];
const AddCompliance = () => {
    const dateFormat = "YYYY-MM-DD";
    const navigate = useNavigate();
    const selectModeRef = useRef(null);
    const [form] = Form.useForm();

    // local states
    const [showSubCompliance, setShowSubCompliance] = useState<boolean>(false);
    const [addCompliance, setAddCompliance] = useState<IAddCompliance>({
        status: "pending",
        start_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        title: "",
        actual_time: "",
        assignee: "",
        billable: "",
        remark: "",
        priority: "",
        mode: "",
        due_date: "",
        workArea: "",
    } as IAddCompliance);
    const [complianceDetails, setComplianceDetails] = useState<
        IClientDetails[]
    >([]);
    const [subCompliance, setSubCompliance] = useState<ISubCompliance[]>();

    // Handllers
    const onSwitchSubCompliance = () => {
        setShowSubCompliance(!showSubCompliance);
    };
    const cancelNewComplianceHandler = () => {
        navigate("/compliance");
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

        console.log("Compliance Remark");

        setAddCompliance({
            ...addCompliance,
            [name]: value,
        });
    };

    const handleQuillKeyDown = (event: any) => {
        if (event.key === "Tab") {
            event.preventDefault(); // Prevent the default tab behavior

            const formElements = [
                "input",
                "select",
                "textarea",
                "button",
                "a[href]",
                '[tabindex]:not([tabindex="-1"])',
            ];

            // Get all focusable elements in the form
            const focusableElements = document.querySelectorAll(
                "form, [contenteditable='true'], " + formElements.join(", ")
            );

            const currentFocusIndex = Array.from(focusableElements).indexOf(
                event.target
            );

            // Move focus to the next focusable element in the form
            const nextFocusIndex =
                (currentFocusIndex + 1) % focusableElements.length;
            const nextFocusElement = focusableElements[nextFocusIndex];

            // Check if the next focusable element supports focus
            if (nextFocusElement instanceof HTMLElement) {
                nextFocusElement.focus();
            }
        }
    };

    const complianceDetailsHandler = (details: IClientDetails[]) => {
        console.log("client details at Add - ", details);
        setComplianceDetails(details);
    };

    const validate = () => {
        let returnFlag = true;

        console.log(addCompliance.start_date);
        if (
            addCompliance.hasOwnProperty("start_date") &&
            addCompliance.start_date === ""
        ) {
            returnFlag = false;
        } else if (
            addCompliance.hasOwnProperty("due_date") &&
            addCompliance.due_date === ""
        ) {
            returnFlag = false;
        } else if (
            addCompliance.hasOwnProperty("mode") &&
            addCompliance.mode === ""
        ) {
            returnFlag = false;
        } else if (
            addCompliance.hasOwnProperty("title") &&
            addCompliance.title === ""
        ) {
            returnFlag = false;
        } else if (
            addCompliance.hasOwnProperty("workArea") &&
            addCompliance.workArea === ""
        ) {
            returnFlag = false;
        } else if (
            addCompliance.hasOwnProperty("remark") &&
            addCompliance.remark === ""
        ) {
            returnFlag = false;
        } else if (
            addCompliance.hasOwnProperty("budget_time") &&
            addCompliance.budget_time === ""
        ) {
            returnFlag = false;
        } else if (
            addCompliance.hasOwnProperty("priority") &&
            addCompliance.priority === ""
        ) {
            returnFlag = false;
        } else if (
            addCompliance.hasOwnProperty("billable") &&
            addCompliance.billable === ""
        ) {
            returnFlag = false;
        }

        // Due date validation against the start date
        const startDateValue = dayjs(addCompliance.start_date);
        const dueDateValue = dayjs(addCompliance.due_date);
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

        // Clients validation
        if (complianceDetails === undefined || complianceDetails.length === 0) {
            returnFlag = false;
        }

        console.log(returnFlag);
        return returnFlag;
    };

    const handleAddCompliance = () => {
        if (!validate()) {
            toast.error("Please set mandatory fields", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        } else {
            // // Read all existing task from `localStorage`
            // const complianceList = localStorage.getItem("compliance");
            // // set timer
            // const timer = {} as ComplianceTimer;
            // timer.state = TimerOpts.stop;
            // timer.time = 0;
            // addCompliance.timer = timer;
            // addCompliance.actual_time = addCompliance.budget_time;
            // let allCompliance =
            //     complianceList && complianceList.length > 0
            //         ? JSON.parse(complianceList)
            //         : [];
            // addCompliance._id =
            //     allCompliance && allCompliance.length > 0
            //         ? allCompliance.length + 1
            //         : 1;
            // console.log(addCompliance);
            // allCompliance.push(addCompliance);
            // console.log("ALL COMPLIANCE", allCompliance);
            // localStorage.setItem("compliance", JSON.stringify(allCompliance));

            const complianceData = JSON.parse(
                JSON.stringify(complianceDetails)
            );
            if (complianceData && complianceData.length > 0) {
                addCompliance.clients = complianceData;
            }

            addCompliance.subcompliance =
                subCompliance && subCompliance.length > 0
                    ? subCompliance.map((item: ISubCompliance) => {
                          return {
                              title: item.title,
                              status: item.status,
                              mode: item.status,
                              budget_time: item.budget_time,
                              actual_time: "",
                              remark: item.remark,
                              priority: item.priority,
                              workArea: item.workArea,
                              clients: item.clients,
                              comments: [],
                          };
                      })
                    : [];

            setAddCompliance(addCompliance);

            console.log(
                "before same subCompliance - ",
                subCompliance,
                addCompliance
            );

            // Save to DB
            try {
                api.createCompliance(addCompliance).then((resp: any) => {
                    const fields = form.getFieldsValue();
                    Object.keys(fields).forEach((field) => {
                        form.setFieldsValue({ [field]: undefined });
                    });
                    toast.success("Successfully Created Compliance", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                });
            } catch (ex) {
                toast.error("Technical error while creating Compliance", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }
    };

    const updateSubComponents = (subCompliance: ISubCompliance[]) => {
        setSubCompliance(showSubCompliance ? subCompliance : []);
    };

    const handleInputKeyDown = () => {
        if (selectModeRef.current) {
            // selectModeRef.current.blur();
            console.log(selectModeRef.current);
        }
    };

    return (
        <>
            <div className="add-compliance-header">
                <ToastContainer />
                <div>
                    <Title level={5}>Add Compliance</Title>
                </div>
                <div className="add-compliance-cancel">
                    <Button
                        type="primary"
                        danger
                        icon={<CloseOutlined />}
                        onClick={cancelNewComplianceHandler}
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
                id="addTaskFrm"
            >
                <Row gutter={[8, 8]} className="form-row row-custom">
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
                                    message: "Please select compliance mode.",
                                },
                            ]}
                        >
                            <Select
                                ref={selectModeRef}
                                allowClear
                                placeholder="Select Compliance Mode"
                                options={modeOptions}
                                onChange={(value, event) => {
                                    inputChangeHandler(event);
                                }}
                                value={addCompliance.mode}
                                showSearch={true}
                                onInputKeyDown={(event) => {
                                    if (event.keyCode === 9) {
                                        // console.log(event.keyCode, event);
                                        // inputChangeHandler(event);
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
                <Row gutter={[8, 8]} className="form-row row-custom">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 16 }}>
                        <Form.Item
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter title.",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Compliance Name"
                                name="title"
                                value={addCompliance.title}
                                onChange={(event) => {
                                    inputChangeHandler(event);
                                }}
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
                                value={addCompliance.workArea}
                                className="w100"
                                showSearch={true}
                                onChange={(value, event) => {
                                    inputChangeHandler(event);
                                }}
                            ></Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row row-custom">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        <Form.Item
                            name="remak"
                            rules={[
                                {
                                    required: true,
                                    message: "Please entre remark.",
                                },
                            ]}
                        >
                            <ReactQuill
                                id={"compliance_" + addCompliance._id}
                                theme="snow"
                                value={addCompliance.remark}
                                placeholder="Compliance Remark"
                                onKeyDown={handleQuillKeyDown}
                                onChange={(event) => {
                                    inputChangeHandler(event, "remark");
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row row-custom">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
                            name="budget_time"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select budget time.",
                                },
                            ]}
                        >
                            <TimePicker
                                placeholder="Budget Time"
                                name="budget_time"
                                onChange={(date, dateString) => {
                                    inputChangeHandler(
                                        dateString,
                                        "budget_time"
                                    );
                                }}
                                className="w100"
                                format={"HH:mm"}
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
                                value={addCompliance.priority}
                                onChange={(value, event) => {
                                    inputChangeHandler(event);
                                }}
                                className="w100"
                                showSearch={true}
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
                                value={addCompliance.billable}
                                options={chargesOpts}
                                onChange={(value, event) => {
                                    inputChangeHandler(event);
                                }}
                                className="w100"
                                showSearch={true}
                            ></Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row row-custom">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        <ComplianceDetails
                            updateClients={complianceDetailsHandler}
                            isAllowAdd={true}
                            parentTitle="compliance"
                            parentId={addCompliance._id}
                            scroll={{ x: 1000 }}
                            data={[]}
                            isEdit={true}
                        />
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Divider />
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Col>
                        <Title level={5}>Sub Compliance</Title>
                    </Col>
                    <Col>
                        <Switch onChange={onSwitchSubCompliance}></Switch>
                    </Col>
                </Row>
                <Row
                    gutter={[8, 8]}
                    className={"form-row " + (!showSubCompliance ? "hide" : "")}
                >
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        <AddSubCompliance
                            subComponentsHandler={updateSubComponents}
                        />
                    </Col>
                </Row>
                <Row gutter={[8, 8]} className="form-row">
                    <Button
                        htmlType="submit"
                        type="primary"
                        className="w100"
                        onClick={handleAddCompliance}
                    >
                        Add Compliance
                    </Button>
                </Row>
            </Form>
        </>
    );
};

export default AddCompliance;
