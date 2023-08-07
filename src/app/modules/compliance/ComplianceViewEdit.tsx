import React, { useState, useEffect } from "react";
import {
    Select,
    Form,
    Row,
    Col,
    Divider,
    Typography,
    Collapse,
    Tag,
    Input,
} from "antd";

import {
    capitalize,
    formatTime,
    priorityOpts,
    statusColors,
    statusList,
    upperText,
    Status,
    getTotalTime,
} from "../../utilities/utility";
import parse from "html-react-parser";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faExpandArrowsAlt,
    faCompressArrowsAlt,
    faXmark,
    faCommentDots,
    faClock,
    faUser,
    faSave,
} from "@fortawesome/free-solid-svg-icons";
import Stopwatch from "../../components/Stockwatch/Stopwatch";
import { ToastContainer, toast } from "react-toastify";
import api from "../../utilities/apiServices";
import {
    Compliance as ICompliance,
    SubCompliance as ISubCompliance,
    IClientDetails,
    SaveComplianceComment,
} from "./interfaces/ICompliance";
import ReactQuill from "react-quill";
import ComplianceDetails from "./ComplianceDetails";
import SubComplianceViewEdit from "./SubComplianceViewEdit";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import Comments from "../../components/Comments/Comments";
import type { TableProps } from "antd/es/table";
const { Title } = Typography;

dayjs.extend(customParseFormat);

const ComplianceViewEdit = (props: any) => {
    const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);
    const [updateCompliance, setUpdateCompliance] = useState<ICompliance>(
        props.tableRowSelected
    );
    const [complianceComments, setComplianceComments] = useState<Comment[]>(
        props.tableRowSelected.comments
    );
    const [subCompliances, setSubCompliances] = useState<ISubCompliance[]>(
        props.tableRowSelected.subcompliance ?? []
    );
    const [currentCollapse, setCurrentCollapse] = useState<string>("");
    const [complianceClients, setComplianceClients] = useState<
        IClientDetails[]
    >(props.tableRowSelected.clients);

    interface DataType {
        key: React.Key;
        client_name: string;
        remark: number;
        budget_time: string;
        actual_time: string;
    }

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
        if (updateCompliance.remark) {
            return parse(updateCompliance.remark);
        } else {
            return "";
        }
    };

    // event handler from `stopwatch` action - play & stop
    const handleTaskStatus = (
        isRunning: boolean,
        time: string,
        isStop: boolean
    ) => {
        const complianceUpdate = {} as ICompliance;
        complianceUpdate.status = isStop
            ? Status.completed
            : Status.in_progress;
        if (!isRunning) complianceUpdate.actual_time = time;

        api.updateCompliance(updateCompliance._id, complianceUpdate).then(
            (resp: any) => {
                toast.success("Successfully Updated Compliance", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                if (props.handleListUpdate) props.handleListUpdate();
            }
        );
    };

    // event handler from `stopwatch` action - play & stop
    const handleClientStatus = (
        isRunning: boolean,
        time: string,
        isStop: boolean,
        recordId: string
    ) => {
        // const clientDetails = {} as IClientDetails;
        // clientDetails._id = recordId;
        // clientDetails.status = isStop ? Status.completed : Status.in_progress;
        // if (!isRunning) clientDetails.actual_time = time;

        let matchedItem = complianceClients.find(
            (clientItem: IClientDetails) => {
                return clientItem._id === recordId;
            }
        );

        if (matchedItem) {
            matchedItem.status = isStop ? Status.completed : Status.in_progress;
            if (!isRunning) matchedItem.actual_time = time;

            const complianceUpdate = {} as ICompliance;
            complianceUpdate._id = updateCompliance._id;
            complianceUpdate.clients = complianceClients;

            api.updateCompliance(updateCompliance._id, complianceUpdate).then(
                (resp: any) => {
                    toast.success("Successfully Updated Compliance", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    if (props.handleListUpdate) props.handleListUpdate();
                }
            );
        }
    };

    // Update `Compliance` clients
    const complianceClientsHandler = (clientDetails: IClientDetails[]) => {
        setComplianceClients(clientDetails);
    };

    const editClickHandler = () => {
        setIsEdit(!isEdit);
    };

    const statusChangeHandler = (event: any, value: string) => {
        const complianceUpdate = {} as ICompliance;
        complianceUpdate.status = value;

        api.updateCompliance(updateCompliance._id, complianceUpdate).then(
            (resp: any) => {
                // localStorage.setItem("task", JSON.stringify(taskUpdate));
                toast.success("Successfully Updated Compliance", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                if (props.handleListUpdate) props.handleListUpdate();
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

    useEffect(() => {
        setUpdateCompliance(props.tableRowSelected);
        setSubCompliances(props.tableRowSelected.subcompliance);
        setComplianceComments(props.tableRowSelected.comments);
    }, [props.tableRowSelected]);

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

        // const taskUpdate = {} as ICompliance;
        //taskUpdate.status = value;
        setUpdateCompliance({
            ...updateCompliance,
            [name]: value,
        });
    };

    /* comment code start */

    // add comment code
    const addCommentHandler = (comment: string) => {
        const addComment = {} as SaveComplianceComment;
        addComment.comment = comment;
        addComment.complianceId = updateCompliance._id;
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
        api.deleteComplianceComment(updateCompliance._id, commentId, "")
            .then((resp: any) => {
                toast.success("Successfully deleted comment", {
                    position: toast.POSITION.TOP_RIGHT,
                });

                const newSubComments = complianceComments.filter(
                    (comment: any) => {
                        return comment._id !== commentId;
                    }
                );
                setComplianceComments(newSubComments);

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

    const handleUpdateTask = () => {
        updateCompliance.subcompliance = subCompliances;

        api.updateCompliance(updateCompliance._id, updateCompliance).then(
            (resp: any) => {
                toast.success("Successfully Updated Compliance.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setIsEdit(false);
                if (props.handleListUpdate) props.handleListUpdate();
            }
        );
    };

    // calculate client count
    const getSubCompliancesCount = (data: any) => {
        let totalCount = 0;
        let completedCount = 0;

        if (data.clients) {
            totalCount = data.clients.length;
            // const matchedItems = data.clients.filter((item: any) => {
            //     item.status === "completed";
            // });
        }

        return `${completedCount} / ${totalCount}`;
    };

    const updateSubComplianceList = (subComplianceItem: ISubCompliance) => {
        // const subComplianceData = updateCompliance.subcompliance;
        // let matchedItem = subComplianceData.find(
        //     (subComplianceItem: ISubCompliance) => {
        //         return subComplianceItem._id === compliance._id;
        //     }
        // );
        // matchedItem = compliance;

        const data = JSON.parse(JSON.stringify(subCompliances));
        const newData = data.map((subCompItem: ISubCompliance) =>
            subCompItem._id === subComplianceItem._id
                ? subComplianceItem
                : subCompItem
        );

        setSubCompliances(newData);

        // if (props.handleListUpdate) props.handleListUpdate();
    };

    const updateCurrentCompliance = (complianceItem: ICompliance) => {};

    const subComplianceHeader = (subComplianceItem: any, index: number) => {
        return (
            <div className="sub-task-header">
                <div>
                    <span
                        style={{
                            marginRight: "10px",
                        }}
                    >
                        {index + 1}.
                    </span>
                </div>
                <div
                    className={`task-header-cell short-title`}
                    style={{
                        flex: props.fullScreenMode ? 1 : 8.5,
                    }}
                    title={subComplianceItem.title}
                >
                    {subComplianceItem.title}
                </div>
                <div
                    className="task-header-cell"
                    style={{
                        flex: props.fullScreenMode ? 0.2 : 3,
                        textAlign: "center",
                    }}
                >
                    <>
                        <FontAwesomeIcon
                            icon={faUser}
                            className="timer-play"
                            style={{
                                marginRight: "10px",
                            }}
                        />
                        {getSubCompliancesCount(subComplianceItem)}
                    </>
                </div>
                {props.fullScreenMode &&
                    index.toString() !== currentCollapse && (
                        <div
                            className="task-header-cell"
                            style={{
                                flex: props.fullScreenMode ? 0.2 : 2,
                                textAlign: "center",
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faClock}
                                className="timer-play"
                                style={{
                                    marginRight: "10px",
                                }}
                            />
                            {formatTime(subComplianceItem.budget_time)}
                        </div>
                    )}
                {(index.toString() !== currentCollapse ||
                    !props.fullScreenMode) && (
                    <div
                        className="task-header-cell"
                        style={{
                            flex: props.fullScreenMode ? 0.2 : 2,
                            textAlign: "center",
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faCommentDots}
                            className="timer-play"
                            style={{
                                marginRight: "10px",
                            }}
                        />
                        {subComplianceItem.comments
                            ? subComplianceItem.comments.length
                            : 0}
                    </div>
                )}
                {index.toString() !== currentCollapse &&
                    props.fullScreenMode && (
                        <div
                            className="task-header-cell"
                            style={{
                                flex: props.fullScreenMode ? 0.2 : 2,
                                textAlign: "center",
                            }}
                        >
                            <Tag
                                color={statusColors(subComplianceItem.status)}
                                style={{
                                    fontWeight: "500",
                                    fontSize: "12px",
                                    flex: props.fullScreenMode ? 0.2 : 0.5,
                                }}
                            >
                                {upperText(subComplianceItem.status)}
                            </Tag>
                        </div>
                    )}
                <div
                    className={`task-header-cell ${
                        props.fullScreenMode ? "" : "task_priorty"
                    } ${subComplianceItem.priority} ${
                        subComplianceItem.priority === "high" ? "blink" : ""
                    }`}
                >
                    {props.fullScreenMode
                        ? capitalize(subComplianceItem.priority)
                        : " "}
                </div>
            </div>
        );
    };

    const collapseChangeHandler = (key: string | string[]) => {
        const selectedKey = key.length > 0 ? key[0] : "";
        setCurrentCollapse(selectedKey);
    };

    return (
        <>
            <div
                style={{
                    display:
                        Object.keys(updateCompliance).length > 0
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
                                    {updateCompliance.title}
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
                                        defaultValue={updateCompliance.title}
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
                            md={{ span: props.fullScreenMode ? 4 : 5 }}
                        >
                            <Title level={5} style={{ textAlign: "right" }}>
                                {capitalize(updateCompliance.assignee)}
                            </Title>
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: props.fullScreenMode ? 3 : 4 }}
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
                                <>
                                    <FontAwesomeIcon
                                        icon={isEdit ? faXmark : faEdit}
                                        style={{
                                            fontSize: isEdit ? "27px" : "20px",
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
                                    {isEdit && (
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            style={{
                                                fontSize: "23px",
                                                color: "#2c7be5",
                                                cursor: "pointer",
                                                marginRight: "15px",
                                                float: "right",
                                                marginTop: isEdit
                                                    ? "-1px"
                                                    : "0",
                                            }}
                                            title={"Click here to Save"}
                                            onClick={handleUpdateTask}
                                        />
                                    )}
                                </>
                            )}
                        </Col>
                    </Row>
                    {dividerRow()}
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 12 }}
                            md={{ span: 16 }}
                            lg={{ span: props.fullScreenMode ? 14 : 10 }}
                        >
                            <div className="timerbuttons">
                                {subCompliances &&
                                    subCompliances.length <= 0 && (
                                        <Stopwatch
                                            parentId={updateCompliance._id}
                                            handleTaskStatus={handleTaskStatus}
                                            status={updateCompliance.status}
                                            label={"compliance"}
                                            showSeconds={true}
                                        />
                                    )}
                                {subCompliances &&
                                    subCompliances.length > 0 && (
                                        <span className="stopwatch-time">
                                            {getTotalTime(
                                                subCompliances.map(
                                                    (item: ISubCompliance) => {
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
                            lg={{ span: props.fullScreenMode ? 5 : 7 }}
                        >
                            {!isEdit && (
                                <Title
                                    level={4}
                                    style={{
                                        textAlign: "right",
                                        marginRight: "30px",
                                    }}
                                    className={`text-priority ${
                                        updateCompliance.priority
                                    } ${
                                        updateCompliance.priority === "high"
                                            ? "blink"
                                            : ""
                                    }`}
                                >
                                    {capitalize(updateCompliance.priority)}
                                </Title>
                            )}
                            {isEdit && (
                                <Select
                                    allowClear
                                    placeholder="Select Priority"
                                    options={priorityOpts}
                                    value={updateCompliance.priority}
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
                            lg={{ span: props.fullScreenMode ? 5 : 7 }}
                        >
                            <Select
                                allowClear
                                placeholder="Select Status"
                                options={statusList}
                                value={updateCompliance.status}
                                className="w100"
                                onChange={(value, event) => {
                                    statusChangeHandler(event, value);
                                }}
                                disabled={true}
                            />
                        </Col>
                    </Row>
                    {dividerRow()}
                    <Row
                        gutter={[8, 8]}
                        className="form-row"
                        style={{
                            border: "1px solid #d8e2ef",
                            padding: "15px",
                            marginBottom: "20px",
                        }}
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
                                    value={updateCompliance.remark}
                                    placeholder="Remark"
                                    onChange={(event) => {
                                        inputChangeHandler(event, "remark");
                                    }}
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
                                id="complianceClients"
                                isEdit={isEdit}
                                isAllowAdd={isEdit}
                                scroll={{ x: 1000 }}
                                data={complianceClients}
                                subcompliance={updateCompliance.subcompliance}
                                handleTaskStatus={handleClientStatus}
                                updateClients={complianceClientsHandler}
                            />
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

                            <Collapse
                                accordion
                                expandIconPosition="end"
                                onChange={collapseChangeHandler}
                            >
                                {updateCompliance.subcompliance.map(
                                    (
                                        subComplianceItem: ISubCompliance,
                                        index: number
                                    ) => (
                                        <CollapsePanel
                                            header={
                                                !isEdit
                                                    ? subComplianceHeader(
                                                          subComplianceItem,
                                                          index
                                                      )
                                                    : subComplianceItem.title
                                            }
                                            key={index}
                                        >
                                            <SubComplianceViewEdit
                                                subComplianceData={
                                                    subComplianceItem
                                                }
                                                isEdit={isEdit}
                                                complianceId={
                                                    updateCompliance._id
                                                }
                                                handleListUpdate={
                                                    updateSubComplianceList
                                                }
                                                handleComplianceUpdate={
                                                    updateCurrentCompliance
                                                }
                                            />
                                        </CollapsePanel>
                                    )
                                )}
                            </Collapse>
                        </Col>
                    </Row>
                    {!isEdit && (
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
                                    comments={complianceComments}
                                    parentId={updateCompliance._id}
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
