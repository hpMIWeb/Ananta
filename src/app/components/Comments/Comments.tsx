import React, { useState, useEffect } from "react";
import { setLocalstorage, getLocalStorage } from "../../utilities/utility";
import api from "../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import { Comment } from "../../modules/task/interfaces/ITask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAt,
    faPaperclip,
    faEdit,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Input, Button, Typography, Divider } from "antd";
import "./Comments.scss";

dayjs.extend(customParseFormat);

const Comments = (props: any) => {
    const { TextArea } = Input;
    const [taskComments, setTaskComments] = useState<[]>(props.comments);
    const [comment, setComment] = useState<string>("");
    const [isEditComment, setIsEditComment] = useState<Boolean>(false);
    const [editComment, setEditComment] = useState<Comment>({} as Comment);
    const { Title } = Typography;

    const inputChangeHandler = (event: any) => {
        setComment(event.target.value);
    };

    // Add comment for the task
    const addCommentHandler = () => {
        setComment("");
        if (props.addComment) {
            props.addComment(comment);
        }
    };

    const editCommentHandler = (
        commentId: string,
        parentId: string,
        comment: Comment
    ) => {
        console.log(commentId, parentId, comment);
        setIsEditComment(true);
        setEditComment(comment);
        // if (props.editComment) {
        //     props.editComment(commentId, parentId, comment);
        // }
    };

    const deleteCommentHandler = (commentId: string, parentId: string) => {
        console.log(commentId, parentId);
        if (props.deleteComment) {
            props.deleteComment(commentId, parentId);
        }
    };

    const renderComment = () => {
        console.log("taskComments -", taskComments);

        if (taskComments && taskComments.length > 0) {
            return taskComments.map((commentItem: any, index: number) => {
                console.log(commentItem.comment_date);
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
                                        {dayjs(commentItem.comment_date).format(
                                            "YYYY-MM-DD, HH:mm a"
                                        )}
                                    </span>
                                    <span>
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            className="btn-at"
                                            title="Edit comment"
                                            style={{
                                                color: "#2c7be5",
                                                marginLeft: "15px",
                                            }}
                                            onClick={() => {
                                                editCommentHandler(
                                                    commentItem._id,
                                                    props.parentId,
                                                    commentItem
                                                );
                                            }}
                                        />
                                    </span>
                                    <span>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="btn-at"
                                            title="Delete comment"
                                            style={{ color: "#fa5c7c" }}
                                            onClick={() => {
                                                deleteCommentHandler(
                                                    commentItem._id,
                                                    props.parentId
                                                );
                                            }}
                                        />
                                    </span>
                                </strong>
                            </Title>
                            <p>{parse(commentItem.comment)}</p>
                            <div
                                style={{
                                    display:
                                        isEditComment &&
                                        commentItem._id === editComment._id
                                            ? "block"
                                            : "none",
                                }}
                            >
                                <div>
                                    <TextArea
                                        placeholder="Your comment..."
                                        rows={4}
                                        onChange={inputChangeHandler}
                                        defaultValue={editComment.comment}
                                    />
                                </div>
                            </div>
                        </div>
                        <Divider />
                    </li>
                );
            });
        } else {
            return <>No comments</>;
        }
    };

    return (
        <>
            <ToastContainer />
            <ul className="commentlist">{renderComment()}</ul>
            <Divider />
            <div className="addcmtform">
                <div>
                    <TextArea
                        placeholder="Your comment..."
                        rows={4}
                        onChange={inputChangeHandler}
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
