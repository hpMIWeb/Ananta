import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Select,
    Row,
    Col,
    Divider,
    TimePicker,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { priorityOpts, workAreaOpts } from "../../utilities/utility";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    SubCompliance as ISubCompliance,
    ClientDetails as IClientDetails,
} from "./interfaces/ICompliance";
import "./subCompliance.scss";
import ComplianceDetails from "./ComplianceDetails";

const SubCompliance = (props: any) => {
    const [subCompliances, setSubCompliance] = useState<ISubCompliance[]>([
        {
            _id: 1,
            status: "Pending",
        } as ISubCompliance,
    ]);
    const [complianceDetails, setComplianceDetails] = useState<
        IClientDetails[]
    >([]);

    const addNewCompliance = () => {
        let newCompliance = {
            _id: subCompliances.length + 1,
            status: "Pending",
        } as ISubCompliance;

        setSubCompliance([...subCompliances, newCompliance]);

        // TODO: update parent compliance
        // if (props.updateClients) {
        //     props.updateClients(subCompliances);
        // }
    };

    const removeTask = (item: ISubCompliance) => {
        const index = subCompliances.indexOf(item);
        if (index > -1) {
            const compliance = [...subCompliances].filter((compliance: any) => {
                return compliance._id !== item._id;
            });
            setSubCompliance(compliance);
        }
    };

    const inputChangeHandler = (
        event: any,
        subCompliance: ISubCompliance,
        nameItem: string = ""
    ) => {
        let name: any = "";
        let value: any = "";

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

        const updatedCompliance = [...subCompliances].map((item: any) => {
            if (item._id === subCompliance._id) {
                item[name] = value;
            }
            return item;
        });

        console.log(name, value, updatedCompliance);

        setSubCompliance(updatedCompliance);
    };

    const complianceDetailsHandler = (details: IClientDetails[]) => {
        console.log("client details at Add SubCompliance - ", details);
        const matchedItem = subCompliances.find((item: ISubCompliance) => {
            return item._id === details[0].parentId;
        });

        if (matchedItem) {
            matchedItem.clients = details;
            setComplianceDetails(details);
            //setSubCompliance([...subCompliances, matchedItem]);
        }
    };

    useEffect(() => {
        console.log(subCompliances);
        if (props.subComponentsHandler) {
            props.subComponentsHandler(subCompliances);
        }
    }, [subCompliances]);

    return (
        <div>
            {subCompliances.map((subComplianceItem: any, index: number) => (
                <div key={subComplianceItem._id}>
                    {index !== 0 && (
                        <Divider style={{ backgroundColor: "#9da9bb" }} />
                    )}
                    <div className="sub-compliance-header">
                        <div className="sub-compliance-number">{index + 1}</div>
                        <div className="sub-compliance-delete">
                            <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    removeTask(subComplianceItem);
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                    <div className="sub-compliance-content">
                        <Row gutter={[8, 8]} className="form-row">
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 12 }}
                            >
                                <Form.Item
                                    name={
                                        "sub_compliance_title" +
                                        subComplianceItem._id
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter Compliance.",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Compliance"
                                        name={"sub_compliance_title"}
                                        value={subComplianceItem.title}
                                        onChange={(event) => {
                                            inputChangeHandler(
                                                event,
                                                subComplianceItem,
                                                "sub_compliance_title"
                                            );
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 6 }}
                            >
                                <Form.Item
                                    name={
                                        "sub_compliance_budget_time" +
                                        subComplianceItem._id
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please select budget time.",
                                        },
                                    ]}
                                >
                                    <TimePicker
                                        placeholder="Time"
                                        name={
                                            "sub_compliance_budget_time" +
                                            subComplianceItem._id
                                        }
                                        onChange={(date, dateString) => {
                                            inputChangeHandler(
                                                dateString,
                                                subComplianceItem,
                                                "sub_compliance_budget_time"
                                            );
                                        }}
                                        className="w100"
                                        format={"HH:mm"}
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 6 }}
                            >
                                <Form.Item
                                    name={
                                        "sub_compliance_work_area" +
                                        subComplianceItem._id
                                    }
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
                                        value={subComplianceItem.workArea}
                                        className="w100"
                                        onChange={(value, event) => {
                                            inputChangeHandler(
                                                event,
                                                subComplianceItem
                                            );
                                        }}
                                    ></Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[8, 8]} className="form-row">
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 18 }}
                            >
                                <ReactQuill
                                    theme="snow"
                                    value={subComplianceItem.remark}
                                    placeholder="Remark"
                                    onChange={(event) => {
                                        inputChangeHandler(
                                            event,
                                            subComplianceItem,
                                            "remark"
                                        );
                                    }}
                                    style={{
                                        minHeight: "0 !important",
                                    }}
                                />
                            </Col>
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 6 }}
                            >
                                <Form.Item
                                    name={
                                        "sub_compliance_priority" +
                                        subComplianceItem._id
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select work area.",
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        placeholder="Priority"
                                        options={priorityOpts}
                                        onChange={(value, event) => {
                                            inputChangeHandler(
                                                event,
                                                subComplianceItem
                                            );
                                        }}
                                        className="w100"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[8, 8]} className="form-row">
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 24 }}
                            >
                                <ComplianceDetails
                                    updateClients={complianceDetailsHandler}
                                    isAllowAdd={false}
                                    parentTitle={"sub_compliance"}
                                    parentId={subComplianceItem._id}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
            ))}
            <div className="sub-task-add">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addNewCompliance}
                >
                    Add
                </Button>
            </div>
        </div>
    );
};

export default SubCompliance;
