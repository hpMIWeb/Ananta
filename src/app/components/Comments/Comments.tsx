import React, { useState, useEffect } from "react";
import { setLocalstorage, getLocalStorage } from "../../utilities/utility";
import api from "../../utilities/apiServices";
import { ToastContainer, toast } from "react-toastify";
import { SaveComment } from "../../modules/task/interfaces/ITask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser";
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
} from "antd";
import "./Comments.scss";

const Comments = (props: any) => {
    const { TextArea } = Input;
    const [taskComments, setTaskComments] = useState<[]>(props.comments);
    const [comment, setComment] = useState<string>("");

    const inputChangeHandler = (event: any) => {
        setComment(event.target.value);
    };

    // Add comment for the task
    const addCommentHandler = () => {
        const addComment = {} as SaveComment;
        addComment.comment = comment;
        addComment.taskId = props.taskId;

        api.addTaskComment(addComment)
            .then(() => {
                setComment("");
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

    const parseComment = (comment: string) => {
        return parse(comment);
    };

    const renderComment = () => {
        console.log("taskComments -", taskComments);

        if (taskComments && taskComments.length > 0) {
            taskComments.map((commentItem: any, index: number) => {
                console.log(commentItem.comment_date);

                return <>No comments</>;

                return (
                    <>
                        <li key={index}>
                            <div>Test</div>
                            {/* <div className="commentcnt">
                                <h6>
                                    {commentItem.comment_by}
                                    <strong className="float-end text-muted">
                                        {commentItem.comment_date}
                                    </strong>
                                </h6>
                                <p>{commentItem.comment}</p>
                            </div> */}
                        </li>
                        <Divider />
                    </>
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
