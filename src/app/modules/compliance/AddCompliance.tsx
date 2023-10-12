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
    Divider,
} from "antd";

import {
    priorityOpts,
    chargesOpts,
    modeOptions,
    workAreaOpts,
} from "../../utilities/utility";
import dayjs from "dayjs";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import styles from "./AddCompliance.module.scss";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    InsertCompliance as IInsertCompliance,
    SubCompliance as ISubCompliance,
    IClientDetails,
    ComplianceTimer,
    TimerOpts,
    InsertSubCompliance as IInsertSubCompliance,
} from "./interfaces/ICompliance";
import api from "../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddCompliance.scss";
import ComplianceDetails from "./ComplianceDetails";
import { nanoid } from "@reduxjs/toolkit";
import AddSubCompliance from "./AddSubCompliance";
import { useAppDispatch } from "../../states/store";
import { useSelector } from "react-redux";
import { getClientsReducersApi } from "../../../redux/getClientsReducers";
import { getEmployeesReducersApi } from "../../../redux/getEmployeesReducers";
import classNames from "classnames";

const { Title } = Typography;
const AddCompliance = () => {
    const dateFormat = "YYYY-MM-DD";
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const selectModeRef = useRef(null);
    const [form] = Form.useForm();

    // local states
    const [showSubCompliance, setShowSubCompliance] = useState<boolean>(false);
    const [addCompliance, setAddCompliance] = useState<IInsertCompliance>({
        status: "pending",
        start_date: dayjs().format("YYYY-MM-DD"),
        title: "",
        actual_time: "",
        assignee: "",
        billable: "",
        remark: "",
        priority: "",
        mode: "",
        due_date: "",
        workArea: "",
    } as IInsertCompliance);
    const [complianceDetails, setComplianceDetails] = useState<
        IClientDetails[]
    >([]);

    const [subCompliance, setSubCompliance] =
        useState<IInsertSubCompliance[]>();

    const clientList = useSelector((state: any) => state.getClients.data) || [];
    const employeeList =
        useSelector((state: any) => state.getEmployees.data) || [];
    useEffect(() => {
        dispatch(getClientsReducersApi());
        dispatch(getEmployeesReducersApi());
    }, []);

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

        setAddCompliance({
            ...addCompliance,
            [name]: value,
        });
    };

    const complianceDetailsHandler = (details: IClientDetails[]) => {
        console.log("client details at Add - ", details);
        setComplianceDetails(details);
    };

    const validate = () => {
        let returnArray = {
            status: true,
            message: "Please set mandatory fields!",
        };

        if (
            addCompliance.hasOwnProperty("start_date") &&
            addCompliance.start_date === ""
        ) {
            returnArray.status = false;
        } else if (
            addCompliance.hasOwnProperty("due_date") &&
            addCompliance.due_date === ""
        ) {
            returnArray.status = false;
        } else if (
            addCompliance.hasOwnProperty("mode") &&
            addCompliance.mode === ""
        ) {
            returnArray.status = false;
        } else if (
            addCompliance.hasOwnProperty("title") &&
            addCompliance.title === ""
        ) {
            returnArray.status = false;
        } else if (
            addCompliance.hasOwnProperty("workArea") &&
            addCompliance.workArea === ""
        ) {
            returnArray.status = false;
        } else if (
            addCompliance.hasOwnProperty("remark") &&
            addCompliance.remark === ""
        ) {
            returnArray.status = false;
        } else if (
            addCompliance.hasOwnProperty("budget_time") &&
            addCompliance.budget_time === ""
        ) {
            returnArray.status = false;
        } else if (
            addCompliance.hasOwnProperty("budget_time") &&
            addCompliance.budget_time === "00:00"
        ) {
            returnArray.status = false;
            returnArray.message = "Enter valid budget time.";
        } else if (
            addCompliance.hasOwnProperty("priority") &&
            addCompliance.priority === ""
        ) {
            returnArray.status = false;
        } else if (
            addCompliance.hasOwnProperty("billable") &&
            addCompliance.billable === ""
        ) {
            returnArray.status = false;
        }

        // Due date validation against the start date
        const startDateValue = dayjs(addCompliance.start_date);
        const dueDateValue = dayjs(addCompliance.due_date);
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

        // Clients validation
        if (complianceDetails === undefined || complianceDetails.length === 0) {
            returnArray.status = false;
            returnArray.message = "Enter enter at least 1 client details.";
        }

        return returnArray;
    };

    const handleAddCompliance = () => {
        let validateTaskData = validate();
        if (!validateTaskData.status) {
            toast.error(validateTaskData.message, {
                position: toast.POSITION.TOP_RIGHT,
            });

            return false;
        } else {
            const complianceData = JSON.parse(
                JSON.stringify(complianceDetails)
            );

            const newDataWithoutId = [];
            for (const obj of complianceData) {
                const newObj = { ...obj }; // Create a shallow copy of the object
                delete newObj._id;
                newDataWithoutId.push(newObj);
            }

            if (newDataWithoutId && newDataWithoutId.length > 0) {
                addCompliance.clients = newDataWithoutId;
            }

            let newDetails = [];
            let newDetails1 = [];
            console.log("Add time subCompliance", subCompliance);
            if (subCompliance && subCompliance.length > 0) {
                // filter any in-correct data
                newDetails = subCompliance.filter(
                    (item: IInsertSubCompliance) => {
                        return item.title !== "" && item.budget_time !== "";
                    }
                );

                console.log("Add time newDetails", newDetails);
                // Convert data into required format
                newDetails1 = newDetails.map((item: IInsertSubCompliance) => {
                    console.log("item=>", item);
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
                });

                addCompliance.subcompliance = newDetails1;
                //TODO:: @hitesh bhai
                // setSubCompliance(newDetails1); // remove due to override object please confirm @hitesh bhai
            }

            try {
                api.createCompliance(addCompliance).then((resp: any) => {
                    const fields = form.getFieldsValue();
                    Object.keys(fields).forEach((field) => {
                        form.setFieldsValue({ [field]: undefined });
                    });
                    setSubCompliance([]);
                    setComplianceDetails([]);
                    toast.success("Successfully Created Compliance", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    navigate("/add-compliance");
                });
            } catch (ex) {
                toast.error("Technical error while creating Compliance", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }
    };

    const updateSubComponents = (subCompliance: IInsertSubCompliance[]) => {
        console.log("updateSubComponents showSubCompliance", showSubCompliance);
        console.log("updateSubComponents subCompliance", subCompliance);
        setSubCompliance(showSubCompliance ? subCompliance : []);
    };

    return (
        <>
            {" "}
            <ToastContainer autoClose={25000} />
            <div
                className={classNames(
                    "card mb-3",
                    styles.addPromoCodeCardWrapper
                )}
            >
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
                                Add Compliance
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
                                onClick={cancelNewComplianceHandler}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={styles.addClientDetailBox}>
                    <Form
                        form={form}
                        initialValues={{
                            start_date: dayjs(),
                        }}
                        id="addTaskFrm"
                        name="basic"
                        autoComplete="off"
                        requiredMark={false}
                        className="customAddForm"
                    >
                        <div className="row">
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4"
                                )}
                            >
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
                                                    getFieldValue("due_date");
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
                                        format={dateFormat}
                                        className="customFormDatePicker"
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
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4"
                                )}
                            >
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
                                                const startDate =
                                                    getFieldValue("start_date");
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
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const startDate =
                                                    getFieldValue("start_date");
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
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const startDate =
                                                    getFieldValue("start_date");
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
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const startDate =
                                                    getFieldValue("start_date");
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
                                    />
                                </Form.Item>
                            </div>
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4"
                                )}
                            >
                                <Form.Item
                                    className="customAddClientSelectOptions"
                                    name="mode"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please select compliance mode.",
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
                                        className="w100"
                                    ></Select>
                                </Form.Item>
                            </div>
                        </div>
                        <div className="row">
                            <div
                                className={classNames(
                                    "col-12 col-md-8 col-lg-8"
                                )}
                            >
                                <Form.Item
                                    className="customAddClientSelectOptions"
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
                                        className="customAddFormInputText"
                                    />
                                </Form.Item>
                            </div>
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4"
                                )}
                            >
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
                            </div>
                        </div>
                        <div className="row">
                            <div
                                className={classNames(
                                    "col-12 col-md-12 col-lg-12"
                                )}
                            >
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
                                        id={"compliance_" + nanoid()}
                                        theme="snow"
                                        value={addCompliance.remark}
                                        placeholder="Compliance Remark"
                                        onChange={(event) => {
                                            inputChangeHandler(event, "remark");
                                        }}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="row">
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4"
                                )}
                            >
                                <Form.Item
                                    name="budget_time"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter budget time.",
                                        },
                                        {
                                            pattern:
                                                /^(?:[01]\d|2[0-3]):[0-5]\d$/,
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
                                        onInput={(event) => {
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
                                        className="w100"
                                        maxLength={5}
                                    />
                                </Form.Item>
                            </div>
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4"
                                )}
                            >
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
                            </div>
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4"
                                )}
                            >
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
                            </div>
                        </div>
                        <div className="row">
                            <div
                                className={classNames(
                                    "col-12 col-md-12 col-lg-12"
                                )}
                            >
                                <ComplianceDetails
                                    updateClients={complianceDetailsHandler}
                                    isAllowAdd={true}
                                    parentTitle="compliance"
                                    parentId={-1}
                                    scroll={{ x: 1000 }}
                                    data={[]}
                                    isEdit={true}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <Divider />
                        </div>
                        <div className="row">
                            <Col>
                                <Title level={5}>Sub Compliance</Title>
                            </Col>
                            <Col>
                                <Switch
                                    onChange={onSwitchSubCompliance}
                                ></Switch>
                            </Col>
                        </div>
                        {showSubCompliance && (
                            <Row
                                gutter={[8, 8]}
                                className={
                                    "form-row " +
                                    (!showSubCompliance ? "hide" : "")
                                }
                            >
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 24 }}
                                >
                                    <AddSubCompliance
                                        subComponentsHandler={
                                            updateSubComponents
                                        }
                                    />
                                </Col>
                            </Row>
                        )}
                        <div className="row mt-3">
                            <div
                                className={classNames(
                                    "col-12 col-md-4 col-lg-4"
                                )}
                            >
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    className="w100"
                                    onClick={handleAddCompliance}
                                >
                                    Add Compliance
                                </Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default AddCompliance;
