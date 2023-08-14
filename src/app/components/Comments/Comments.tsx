import React, { useState, useEffect } from "react";
import { setLocalstorage, getLocalStorage } from "../../utilities/utility";
import api from "../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import { IComment } from "../../utilities/globalInterfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAt,
    faPaperclip,
    faEdit,
    faTrash,
    faClose,
} from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Input, Button, Typography, Divider, Popconfirm } from "antd";
import "./Comments.scss";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(tz);

const Comments = (props: any) => {
    const timeZone = dayjs.tz.guess();

    const { TextArea } = Input;
    const [taskComments, setTaskComments] = useState<[]>(props.comments);
    const [comment, setComment] = useState<string>("");
    const [isEditComment, setIsEditComment] = useState<Boolean>(false);
    const [editCommentItem, setEditCommentItem] = useState<IComment>(
        {} as IComment
    );
    const [updateComment, setUpdateComment] = useState<string>("");
    const { Title } = Typography;

    useEffect(() => {
        // console.log("render", "test");
    }, []);

    const inputChangeHandler = (event: any) => {
        setComment(event.target.value);
    };

    const updateInputCommentChangeHandler = (event: any) => {
        setUpdateComment(event.target.value);
    };

    // Add comment for the task
    const addCommentHandler = () => {
        setComment("");
        if (props.addComment) {
            props.addComment(comment);
        }
    };

    // Update comment
    const updateCommentHandler = (
        commentId: string,
        parentId: string,
        commentItem: IComment
    ) => {
        console.log(commentId, parentId, commentItem, updateComment);
        setIsEditComment(false);
        if (props.editComment) {
            props.editComment(commentId, parentId, updateComment);
        }
    };

    // make editable comment
    const editCommentHandler = (
        commentId: string,
        parentId: string,
        commentItem: IComment
    ) => {
        console.log(commentId, parentId, commentItem);
        setIsEditComment(true);
        setEditCommentItem(commentItem);
        setUpdateComment(commentItem.comment);
    };

    // delete comment
    const deleteCommentHandler = (commentId: string, parentId: string) => {
        console.log(commentId, parentId);
        if (props.deleteComment) {
            props.deleteComment(commentId, parentId);
        }
    };

    // close edit comment
    const cancelEditCommentHandler = () => {
        setIsEditComment(false);
    };

    const renderComment =
        props.comments &&
        Object.keys(props.comments).length > 0 &&
        props.comments.map((commentItem: any, index: number) => {
            return (
                <li
                    key={index}
                    style={{
                        listStyleType: "none",
                    }}
                >
                    <div className="commentcnt">
                        <Title
                            level={5}
                            style={{
                                textAlign: "left",
                                color: "#6c757d",
                                fontSize: "15px",
                            }}
                        >
                            {commentItem.comment_by}
                            <strong className="float-end text-muted comment-date">
                                <span>
                                    {dayjs
                                        .utc(commentItem.comment_date)
                                        .tz(timeZone)
                                        .local()
                                        .format("YYYY-MM-DD, HH:mm a")}
                                </span>
                                <span>
                                    <FontAwesomeIcon
                                        icon={
                                            isEditComment &&
                                            commentItem._id ===
                                                editCommentItem._id
                                                ? faClose
                                                : faEdit
                                        }
                                        className="btn-at"
                                        title="Edit comment"
                                        style={{
                                            color: "#2c7be5",
                                            marginLeft: "15px",
                                        }}
                                        onClick={() => {
                                            if (
                                                isEditComment &&
                                                commentItem._id ===
                                                    editCommentItem._id
                                            ) {
                                                cancelEditCommentHandler();
                                            } else {
                                                editCommentHandler(
                                                    commentItem._id,
                                                    props.parentId,
                                                    commentItem
                                                );
                                            }
                                        }}
                                    />
                                </span>
                                <span>
                                    <Popconfirm
                                        title="Sure to Delete?"
                                        onConfirm={() =>
                                            deleteCommentHandler(
                                                commentItem._id,
                                                props.parentId
                                            )
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="btn-at"
                                            title="Delete comment"
                                            style={{ color: "#fa5c7c" }}
                                        />
                                    </Popconfirm>
                                </span>
                            </strong>
                        </Title>
                        <p
                            style={{
                                display:
                                    isEditComment &&
                                    commentItem._id === editCommentItem._id
                                        ? "none"
                                        : "block",
                            }}
                        >
                            {parse(
                                commentItem.comment.replace(/\n/g, "<br />")
                            )}
                        </p>
                        <div
                            style={{
                                display:
                                    isEditComment &&
                                    commentItem._id === editCommentItem._id
                                        ? "block"
                                        : "none",
                            }}
                        >
                            <div>
                                <TextArea
                                    placeholder="Your comment..."
                                    rows={6}
                                    onChange={updateInputCommentChangeHandler}
                                    value={updateComment}
                                />
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        updateCommentHandler(
                                            commentItem._id,
                                            props.parentId,
                                            commentItem
                                        );
                                    }}
                                    style={{
                                        float: "right",
                                        marginTop: "10px",
                                        marginBottom: "20px",
                                    }}
                                >
                                    Update
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Divider />
                </li>
            );
        });

    return (
        <>
            <ToastContainer />
            <ul className="commentlist">{renderComment}</ul>
            <Divider />
            <div className="addcmtform">
                <div>
                    <TextArea
                        placeholder="Your comment..."
                        rows={4}
                        onChange={inputChangeHandler}
                        value={comment}
                    />
                </div>
                <div className="addcmtbtn">
                    <FontAwesomeIcon
                        icon={faPaperclip}
                        className="btn-paper-clip"
                        title="Upload"
                    />
                    <FontAwesomeIcon
                        icon={faAt}
                        className="btn-at"
                        title="Add Person"
                    />
                    <Button type="primary" onClick={addCommentHandler}>
                        Submit
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Comments;
