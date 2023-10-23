import React, { useState } from "react";
import "./DeletePopupConfirm.scss";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
const { confirm } = Modal;

const DeletePopupConfirm = (props: any) => {
  const [buttonTitle, setModalMode] = useState<String>(
    props.buttonTitle ? props.buttonTitle : ""
  );
  const [label, setLabel] = useState<String>(props.label);
  const [popUpTitle, setPopUpTitle] = useState<String>(
    props.popUpTitle ? props.popUpTitle : "Do you Want to delete these items?"
  );

  const showConfirm = () => {
    //TODO:: icon need make dynamicaly
    confirm({
      title: popUpTitle,
      icon: <ExclamationCircleFilled />,
      content: props.content ? props.content : "",
      onOk() {
        if (props.onConfirm) {
          props.onConfirm();
        }
      },
      onCancel() {
        //cancel code
      },
    });
  };

  return (
    <FontAwesomeIcon
      icon={faTrash}
      className="btn-at"
      title={buttonTitle.toString()}
      style={{ color: "#fa5c7c" }}
      onClick={showConfirm}
    />
  );
};

export default DeletePopupConfirm;
