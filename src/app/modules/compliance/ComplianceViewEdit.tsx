import React, { useState, useEffect } from "react";
import type { CollapseProps } from "antd";
import {
    Select,
    Form,
    Row,
    Col,
    Divider,
    Typography,
    DatePicker,
    TimePicker,
    Input,
    Button,
    Collapse,
    Table,
} from "antd";

import {
    assigneeOpts,
    capitalize,
    dateFormat,
    priorityOpts,
    statusList,
} from "../../utilities/utility";
import parse from "html-react-parser";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";

import {
    faEdit,
    faExpandArrowsAlt,
    faCompressArrowsAlt,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Stopwatch from "../../components/Stockwatch/Stopwatch";
import { ToastContainer, toast } from "react-toastify";
import api from "../../utilities/apiServices";
import {
    AddCompliance as IAddCompliance,
    SubCompliance as ISubCompliance,
    ClientDetails as IClientDetails,
    SaveComplianceComment,
} from "./interfaces/ICompliance";
import ReactQuill from "react-quill";
import ComplianceDetails from "./ComplianceDetails";
import SubCompliance from "./SubCompliance";
import SubComplianceViewEdit from "./SubComplianceViewEdit";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import Comments from "../../components/Comments/Comments";
import type { ColumnsType, TableProps } from "antd/es/table";
const { Title } = Typography;

dayjs.extend(customParseFormat);

const columns: ColumnsType<DataType> = [
    {
        title: "Action",
        dataIndex: "_id",
        key: "_id",
        render: (text: any, record: any, index: number) => (
            <div className="timerbuttons">
                <Stopwatch />
            </div>
        ),
    },
    {
        title: "Client Name",
        dataIndex: "client_name",
        key: "client_name",
        sorter: (a: any, b: any) => a.client_name - b.client_name,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "Assign To",
        dataIndex: "assigned_to",
        key: "assigned_to",
        sorter: (a: any, b: any) => a.assigned_to - b.assigned_to,
    },
    {
        title: "Remarks",
        dataIndex: "remark",
        key: "remark",
        sorter: (a: any, b: any) => a.remark - b.remark,
    },
    {
        title: "Budget Time",
        dataIndex: "budget_time",
        key: "budget_time",
        sorter: (a: any, b: any) => a.budget_time - b.budget_time,
    },
    {
        title: "Actual Time",
        dataIndex: "budget_time",
        key: "budget_time",
        sorter: (a: any, b: any) => a.budget_time - b.budget_time,
    },
];

interface DataType {
    key: React.Key;
    client_name: string;
    remark: number;
    budget_time: string;
}

const ComplianceViewEdit = (props: any) => {
    const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);

    const fullScreenModeToggle = () => {
        if (props.handleScreenMode) {
            props.handleScreenMode();
        }
    };

    const dividerRow = () => {
        return (
            <Row gutter={[8, 8]} className="form-row">
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                    <Divider />
                </Col>
            </Row>
        );
    };

    const getRemark = () => {
        if (props.tableRowSelected.remark) {
            return parse(props.tableRowSelected.remark);
        } else {
            return "";
        }
    };

    const editClickHandler = () => {
        setIsEdit(!isEdit);
    };

    const statusChangeHandler = (event: any, value: string) => {
        console.log("Status change - ", event);

        const complianceUpdate = {} as IAddCompliance;
        complianceUpdate.status = value;

        api.updateCompliance(props.tableRowSelected._id, complianceUpdate).then(
            (resp: any) => {
                // localStorage.setItem("task", JSON.stringify(taskUpdate));
                toast.success("Successfully Updated Compliance", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        );
    };

    const onChange: TableProps<DataType>["onChange"] = (
        pagination,
        filters,
        sorter,
        extra
    ) => {
        console.log("params", sorter);
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

        const taskUpdate = {} as IAddCompliance;
        taskUpdate.status = value;
    };

    /* comment code start */

    // add comment code
    const addCommentHandler = (comment: string) => {
        const addComment = {} as SaveComplianceComment;
        addComment.comment = comment;
        addComment.complianceId = props.tableRowSelected._id;
        api.addComplianceComment(addComment)
            .then(() => {
                toast.success("Successfully added comment", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .catch((error: any) => {
                const msg = JSON.parse(error.response.data).message;
                toast.error(msg, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    const editCommentHandler = (
        commentId: string,
        parentId: string,
        comment: string
    ) => {
        const updateComment = {} as SaveComplianceComment;
        updateComment.commentId = commentId;
        updateComment.comment = comment;
        updateComment.complianceId = parentId;

        api.updateComplianceComment(updateComment)
            .then((resp: any) => {
                toast.success("Successfully updated comment", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                //setTaskComments(resp.data.comments);
            })
            .catch((error: any) => {
                const msg = JSON.parse(error.response.data).message;
                toast.error(msg, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    const deleteCommentHandler = (commentId: string, parentId: string) => {
        api.deleteTaskComment(props.tableRowSelected._id, commentId)
            .then((resp: any) => {
                toast.success("Successfully deleted comment", {
                    position: toast.POSITION.TOP_RIGHT,
                });

                // setTaskComments(resp.data.comments);
            })
            .catch((error: any) => {
                const msg = JSON.parse(error.response.data).message;
                toast.error(msg, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    /* comment code end */

    const handleUpdateTask = () => {};

    return (
        <>
            <div
                style={{
                    display:
                        Object.keys(props.tableRowSelected).length > 0
                            ? "block"
                            : "none",
                }}
            >
                <ToastContainer />
                <Form style={{ padding: "15px 0 0 0" }}>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: props.fullScreenMode ? 17 : 15 }}
                        >
                            {!isEdit && (
                                <Title level={4} style={{ textAlign: "left" }}>
                                    {props.tableRowSelected.title}
                                </Title>
                            )}
                            {isEdit && (
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
                                        placeholder="Compliance"
                                        name="title"
                                        defaultValue={
                                            props.tableRowSelected.title
                                        }
                                        onChange={(event) => {
                                            inputChangeHandler(event);
                                        }}
                                    />
                                </Form.Item>
                            )}
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 5 }}
                        >
                            <Title level={5} style={{ textAlign: "right" }}>
                                {capitalize(props.tableRowSelected.assignee)}
                            </Title>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: props.fullScreenMode ? 2 : 4 }}
                        >
                            <FontAwesomeIcon
                                icon={
                                    props.fullScreenMode
                                        ? faCompressArrowsAlt
                                        : faExpandArrowsAlt
                                }
                                onClick={fullScreenModeToggle}
                                style={{
                                    fontSize: "20px",
                                    color: "#2c7be5",
                                    float: "right",
                                    cursor: "pointer",
                                }}
                                title={
                                    "Click here to" +
                                    (props.fullScreenMode
                                        ? "minimize"
                                        : "maximize")
                                }
                            />
                            {props.fullScreenMode && (
                                <FontAwesomeIcon
                                    icon={isEdit ? faXmark : faEdit}
                                    style={{
                                        fontSize: isEdit ? "25px" : "20px",
                                        color: "#2c7be5",
                                        cursor: "pointer",
                                        marginRight: "15px",
                                        float: "right",
                                        marginTop: isEdit ? "-3px" : "0",
                                    }}
                                    title={
                                        "Click here to " +
                                        (isEdit ? "cancel" : "edit")
                                    }
                                    onClick={editClickHandler}
                                />
                            )}
                        </Col>
                    </Row>
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: props.fullScreenMode ? 1 : 3 }}
                    >
                        {isEdit && (
                            <Button
                                htmlType="submit"
                                type="primary"
                                onClick={handleUpdateTask}
                            >
                                Update
                            </Button>
                        )}
                    </Col>
                    {dividerRow()}
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 12 }}
                            md={{ span: 16 }}
                            lg={{ span: 14 }}
                        >
                            <div className="timerbuttons">
                                <Stopwatch
                                    complianceId={props.tableRowSelected._id}
                                />
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 6 }}
                            md={{ span: 4 }}
                            lg={{ span: 5 }}
                        >
                            {!isEdit && (
                                <Title
                                    level={4}
                                    style={{
                                        textAlign: "right",
                                        marginRight: "30px",
                                    }}
                                    className={`text-priority ${
                                        props.tableRowSelected.priority ===
                                        "high"
                                            ? "blink"
                                            : ""
                                    }`}
                                >
                                    {capitalize(
                                        props.tableRowSelected.priority
                                    )}
                                </Title>
                            )}
                            {isEdit && (
                                <Select
                                    allowClear
                                    placeholder="Select Priority"
                                    options={priorityOpts}
                                    value={props.tableRowSelected.priority}
                                    className="w100"
                                    onChange={(value, event) => {
                                        statusChangeHandler(event, value);
                                    }}
                                />
                            )}
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 6 }}
                            md={{ span: 4 }}
                            lg={{ span: 5 }}
                        >
                            <Select
                                allowClear
                                placeholder="Select Status"
                                options={statusList}
                                value={props.tableRowSelected.status}
                                className="w100"
                                onChange={(value, event) => {
                                    statusChangeHandler(event, value);
                                }}
                            />
                        </Col>
                    </Row>
                    {dividerRow()}
                    <Row
                        gutter={[8, 8]}
                        className="form-row"
                        style={{ border: "1px solid #d8e2ef", padding: "15px" }}
                    >
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        >
                            {!isEdit && getRemark()}
                            {isEdit && (
                                <ReactQuill
                                    theme="snow"
                                    value={props.tableRowSelected.remark}
                                    placeholder="Remark"
                                    onChange={(event) => {
                                        inputChangeHandler(event, "remark");
                                    }}
                                />
                            )}{" "}
                        </Col>
                    </Row>
                    {!props.isEdit && (
                        <Row
                            gutter={[8, 8]}
                            className="form-row"
                            style={{ marginTop: "15px" }}
                        >
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 24 }}
                            >
                                <Table
                                    id="complianceViewEdit"
                                    dataSource={props.tableRowSelected.clients}
                                    columns={columns}
                                    size="small"
                                    onChange={onChange}
                                />
                            </Col>
                        </Row>
                    )}

                    {isEdit && (
                        <Row gutter={[8, 8]} className="form-row">
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 24 }}
                            >
                                <ComplianceDetails
                                    updateClients={
                                        props.tableRowSelected.clients
                                    }
                                    isAllowAdd={false}
                                    parentTitle={"sub_compliance"}
                                    parentId={
                                        props.tableRowSelected.subcompliance._id
                                    }
                                />
                            </Col>
                        </Row>
                    )}
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        >
                            {isEdit && <ComplianceDetails />}{" "}
                        </Col>
                    </Row>

                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        >
                            <Title level={5} style={{ textAlign: "left" }}>
                                Sub-Compliance
                            </Title>
                            {!isEdit && (
                                <Collapse>
                                    {props.tableRowSelected.subcompliance.map(
                                        (
                                            subComplianceItem: any,
                                            index: number
                                        ) => (
                                            <CollapsePanel
                                                header={subComplianceItem.title}
                                                key={index}
                                            >
                                                <SubComplianceViewEdit
                                                    subComplianceData={
                                                        subComplianceItem
                                                    }
                                                    isEdit={isEdit}
                                                    complianceId={
                                                        props.tableRowSelected
                                                            ._id
                                                    }
                                                />
                                            </CollapsePanel>
                                        )
                                    )}
                                </Collapse>
                            )}
                            {isEdit && (
                                <div>
                                    {props.tableRowSelected.subcompliance.map(
                                        (
                                            subComplianceItem: any,
                                            index: number
                                        ) => (
                                            <SubComplianceViewEdit
                                                subComplianceData={
                                                    subComplianceItem
                                                }
                                                isEdit={isEdit}
                                                complianceId={
                                                    props.tableRowSelected._id
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </Col>
                    </Row>
                    {!isEdit && (
                        <Row gutter={[8, 8]} className="form-row">
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 24 }}
                            >
                                <Title level={5} style={{ textAlign: "left" }}>
                                    Comments
                                </Title>
                                <Comments
                                    comments={props.tableRowSelected.comments}
                                    parentId={props.tableRowSelected._id}
                                    addComment={addCommentHandler}
                                    editComment={editCommentHandler}
                                    deleteComment={deleteCommentHandler}
                                />
                            </Col>
                        </Row>
                    )}
                    <Row gutter={[8, 8]} className="form-row">
                        <div style={{ height: "30px" }}></div>
                    </Row>
                </Form>
            </div>
        </>
    );
};
export default ComplianceViewEdit;
