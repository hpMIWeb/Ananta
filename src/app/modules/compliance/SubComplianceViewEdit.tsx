import React, { useEffect, useState } from "react";
import { Input, Select, Row, Col, Divider, Table, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
    Status,
    capitalize,
    getTotalTime,
    priorityOpts,
    statusList,
} from "../../utilities/utility";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    SubCompliance as ISubCompliance,
    IClientDetails,
    SubCompliance,
    UpdateSubCompliance,
    SaveSubComplianceComment,
    Comment as IComment,
} from "./interfaces/ICompliance";
import "./subCompliance.scss";
import ComplianceDetails from "./ComplianceDetails";
import parse from "html-react-parser";
import Stopwatch from "../../components/Stockwatch/Stopwatch";
import { ToastContainer, toast } from "react-toastify";
import api from "../../utilities/apiServices";
import type { ColumnsType, TableProps } from "antd/es/table";
import Comments from "../../components/Comments/Comments";
const { Title } = Typography;

const SubComplianceViewEdit = (props: any) => {
    const [subCompliance, setSubCompliance] = useState<ISubCompliance>({
        _id: "1",
        status: "pending",
    } as ISubCompliance);

    // const [subComplianceClients, setSubComplianceClients] = useState<
    //     IClientDetails[]
    // >([]);

    const [subComments, setSubComments] = useState<IComment[]>([]);

    useEffect(() => {
        if (props.subComplianceData) {
            setSubCompliance(props.subComplianceData);
            setSubComments(props.subComplianceData.comments);
            //setSubComplianceClients([props.subComplianceData.clients]);
        }
    }, [props.subComplianceData]);

    useEffect(() => {
        console.log(subCompliance);
    }, [subCompliance]);

    const dividerRow = () => {
        return (
            <Row gutter={[8, 8]} className="form-row">
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                    <Divider />
                </Col>
            </Row>
        );
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

        // const updatedCompliance = [...subCompliance].map((item: any) => {
        //     if (item._id === subCompliance._id) {
        //         item[name] = value;
        //     }
        //     return item;
        // });

        // setSubCompliance(updatedCompliance);
    };

    const statusChangeHandler = (
        event: any,
        value: string,
        subCompliance: SubCompliance
    ) => {
        const subComplianceUpdate = {} as UpdateSubCompliance;
        if (event.name === "priority") {
            subComplianceUpdate.priority = value;
        } else if (event.name === "status") {
            subComplianceUpdate.status = value;
        }
        subComplianceUpdate.ComplianceId = props.complianceId;
        subComplianceUpdate.subComplianceId = subCompliance._id!;
        api.updateSubCompliance(subComplianceUpdate).then((resp: any) => {
            toast.success("Successfully Updated", {
                position: toast.POSITION.TOP_RIGHT,
            });
        });
    };

    interface DataType {
        key: React.Key;
        client_name: string;
        remark: number;
        budget_time: string;
    }

    const onChange: TableProps<DataType>["onChange"] = (
        pagination,
        filters,
        sorter,
        extra
    ) => {
        console.log("params", sorter);
    };

    // event handler from `stopwatch` action - play & stop
    const handleTaskStatus = (
        isRunning: boolean,
        time: string,
        isStop: boolean,
        subCompliance: SubCompliance
    ) => {
        const complianceUpdate = {} as UpdateSubCompliance;
        complianceUpdate.status = isStop
            ? Status.completed
            : Status.in_progress;
        if (!isRunning) complianceUpdate.actual_time = time;

        complianceUpdate.ComplianceId = props.complianceId;
        complianceUpdate.subComplianceId = subCompliance._id!;

        api.updateSubCompliance(complianceUpdate).then((resp: any) => {
            toast.success("Successfully Updated Sub Compliance", {
                position: toast.POSITION.TOP_RIGHT,
            });
            if (props.handleListUpdate) props.handleListUpdate();
        });
    };

    /* comment code start */

    // add comment code
    const addCommentHandler = (comment: string) => {
        const addComment = {} as SaveSubComplianceComment;
        addComment.comment = comment;
        addComment.complianceId = props.complianceId;
        addComment.subcomplianceId = subCompliance._id;

        api.addComplianceComment(addComment)
            .then((resp: any) => {
                toast.success("Successfully added comment", {
                    position: toast.POSITION.TOP_RIGHT,
                });

                // Update the comments & parent sub-tasks
                if (resp) {
                    const allSubCompliances = resp.data.subcompliance;
                    const matchedItem = allSubCompliances.find(
                        (complianceItem: ISubCompliance) => {
                            return complianceItem._id === subCompliance._id;
                        }
                    );
                    if (matchedItem) {
                        setSubComments(matchedItem.comments);
                    }
                }
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
        const updateComment = {} as SaveSubComplianceComment;
        updateComment.commentId = commentId;
        updateComment.comment = comment;
        updateComment.complianceId = props.complianceId;
        updateComment.subcomplianceId = subCompliance._id;

        api.updateSubComplianceComment(updateComment)
            .then((resp: any) => {
                toast.success("Successfully updated comment", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                //TODO: API is not sending updated comment. once done, update comments here
            })
            .catch((error: any) => {
                const msg = JSON.parse(error.response.data).message;
                toast.error(msg, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    const deleteCommentHandler = (commentId: string, parentId: string) => {
        api.deleteComplianceComment(
            props.complianceId,
            commentId,
            subCompliance._id
        )
            .then((resp: any) => {
                toast.success("Successfully deleted comment", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                const newSubComments = subComments.filter(
                    (comment: IComment) => {
                        return comment._id !== commentId;
                    }
                );
                setSubComments(newSubComments);
            })
            .catch((error: any) => {
                const msg = JSON.parse(error.response.data).message;
                toast.error(msg, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    /* comment code end */

    return (
        <div>
            {/* {subCompliance.map((subComplianceItem: any, index: number) => ( */}
            <div key={subCompliance._id}>
                {/* {index !== 0 && (
                    <Divider style={{ backgroundColor: "#9da9bb" }} />
                )} */}
                <div className="sub-compliance-header"></div>
                <div className="sub-compliance-content">
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 12 }}
                            md={{ span: 16 }}
                            lg={{ span: 14 }}
                        >
                            <div className="timerbuttons">
                                {subCompliance.clients &&
                                    subCompliance.clients.length <= 0 && (
                                        <Stopwatch
                                            parentId={subCompliance._id}
                                            handleTaskStatus={(
                                                isRunning: boolean,
                                                time: string,
                                                isStop: boolean
                                            ) => {
                                                handleTaskStatus(
                                                    isRunning,
                                                    time,
                                                    isStop,
                                                    subCompliance
                                                );
                                            }}
                                            status={subCompliance.status}
                                            label={"subCompliance"}
                                            showSeconds={true}
                                        />
                                    )}
                                {subCompliance.clients &&
                                    subCompliance.clients.length > 0 && (
                                        <span className="stopwatch-time">
                                            {getTotalTime(
                                                subCompliance.clients.map(
                                                    (item: IClientDetails) => {
                                                        return item.actual_time;
                                                    }
                                                )
                                            )}
                                        </span>
                                    )}
                            </div>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 6 }}
                            md={{ span: 4 }}
                            lg={{ span: 5 }}
                        >
                            {!props.isEdit && (
                                <Title
                                    level={4}
                                    style={{
                                        textAlign: "right",
                                        marginRight: "30px",
                                    }}
                                    className={`text-priority ${
                                        subCompliance.priority
                                    } ${
                                        subCompliance.priority === "high"
                                            ? "blink"
                                            : ""
                                    }`}
                                >
                                    {capitalize(subCompliance.priority)}
                                </Title>
                            )}
                            {props.isEdit && (
                                <Select
                                    allowClear
                                    placeholder="Select Priority"
                                    options={priorityOpts}
                                    value={subCompliance.priority}
                                    className="w100"
                                    onChange={(value, event) => {
                                        statusChangeHandler(
                                            event,
                                            value,
                                            subCompliance
                                        );
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
                                value={subCompliance.status}
                                className="w100"
                                onChange={(value, event) => {
                                    statusChangeHandler(
                                        event,
                                        value,
                                        subCompliance
                                    );
                                }}
                            />
                        </Col>
                    </Row>
                    {dividerRow()}
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        >
                            {!props.isEdit && <b>{subCompliance.title}</b>}
                            {props.isEdit && (
                                <Input
                                    placeholder="Compliance"
                                    name="title"
                                    defaultValue={subCompliance.title}
                                />
                            )}
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        >
                            {!props.isEdit && (
                                <b>
                                    {subCompliance.remark &&
                                        parse(subCompliance.remark)}
                                </b>
                            )}
                            {props.isEdit && (
                                <ReactQuill
                                    theme="snow"
                                    value={subCompliance.remark}
                                    placeholder="Remark"
                                    // onChange={(event) => {
                                    //     inputChangeHandler(event, "remark");
                                    // }}
                                />
                            )}
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        >
                            <ComplianceDetails
                                handleTaskStatus={(
                                    isRunning: boolean,
                                    time: string,
                                    isStop: boolean
                                ) => {
                                    handleTaskStatus(
                                        isRunning,
                                        time,
                                        isStop,
                                        subCompliance
                                    );
                                }}
                                isAllowAdd={false}
                                parentTitle={"sub_compliance"}
                                parentId={subCompliance._id}
                                data={subCompliance.clients}
                                scroll={{ x: 1000 }}
                                isEdit={props.isEdit}
                            />
                        </Col>
                    </Row>
                    {!props.isEdit && (
                        <Row gutter={[8, 8]} className="form-row">
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 24 }}
                            >
                                <Title
                                    level={5}
                                    style={{
                                        textAlign: "left",
                                        marginTop: "10px",
                                    }}
                                >
                                    Comments
                                </Title>
                                <Comments
                                    comments={subComments}
                                    parentId={subCompliance._id}
                                    addComment={addCommentHandler}
                                    editComment={editCommentHandler}
                                    deleteComment={deleteCommentHandler}
                                />
                            </Col>
                        </Row>
                    )}
                </div>
            </div>
            {/* ))} */}
        </div>
    );
};

export default SubComplianceViewEdit;
