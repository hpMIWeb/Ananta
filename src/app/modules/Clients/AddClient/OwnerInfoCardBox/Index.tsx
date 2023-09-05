import classNames from "classnames";
import styles from "./ownerInfoCardBox.module.scss";
import { DatePicker, Form, Select } from "antd";
import Input from "../../../../components/ui/Input/Index";
import Button from "../../../../components/ui/Button/Index";
import uploadPhoto from "../../../../../assets/images/upload_photo.jpg";
import Upload from "../../../../components/ui/Upload/Index";
import Icon from "../../../../components/ui/Icon/Index";

const OwnerInfoCardBox = ({
    index,
    field,
    branchDetailsFormValue,
    remove,
    canDelete,
    onDeleteCardClick,
}: any) => {
    return (
        <>
            <div className="col-12 col-md-9 col-lg-9">
                <div className={classNames("row", styles.formFieldWrapper)}>
                    <div
                        className={classNames(
                            "col-12 col-md-4 col-lg-4",
                            styles.fieldPadding8
                        )}
                    >
                        <div>
                            <label
                                style={{ marginBottom: 5 }}
                                className="form-label"
                            >
                                First Name
                                <sup className="text-danger fs--1">*</sup>
                            </label>
                            <Form.Item
                                {...field}
                                name={[field.name, "firstName"]}
                                fieldKey={[field.fieldKey, "firstName"]}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your First Name!",
                                    },
                                ]}
                            >
                                <Input
                                    id={`firstName-${field.key}`}
                                    placeholder="First Name"
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div
                        className={classNames(
                            "col-12 col-md-4 col-lg-4",
                            styles.fieldPadding8
                        )}
                    >
                        <div>
                            <label
                                style={{ marginBottom: 5 }}
                                className="form-label"
                            >
                                Middle Name
                            </label>
                            <Form.Item
                                {...field}
                                name={[field.name, "middleName"]}
                                fieldKey={[field.fieldKey, "middleName"]}
                            >
                                <Input
                                    id={`middleName-${field.key}`}
                                    placeholder="Middle Name"
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div
                        className={classNames(
                            "col-12 col-md-4 col-lg-4",
                            styles.fieldPadding8
                        )}
                    >
                        <div>
                            <label
                                style={{ marginBottom: 5 }}
                                className="form-label"
                            >
                                Last Name
                                <sup className="text-danger fs--1">*</sup>
                            </label>
                            <Form.Item
                                {...field}
                                name={[field.name, "lastName"]}
                                fieldKey={[field.fieldKey, "lastName"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter your Last Name!",
                                    },
                                ]}
                            >
                                <Input
                                    id={`lastName-${field.key}`}
                                    placeholder="Last Name"
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div
                        className={classNames(
                            "col-12 col-md-4 col-lg-4",
                            styles.fieldPadding8
                        )}
                    >
                        <div>
                            <label
                                style={{ marginBottom: 5 }}
                                className="form-label"
                            >
                                Select Gender
                                <sup className="text-danger fs--1">*</sup>
                            </label>
                            <Form.Item
                                {...field}
                                className="customAddFormSelectOptions"
                                name={[field.name, "gender"]}
                                fieldKey={[field.fieldKey, "gender"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Select gender!",
                                    },
                                ]}
                            >
                                <Select
                                    id={`gender-${field.key}`}
                                    placeholder={<span>Select Gender</span>}
                                    options={[
                                        { value: "male", label: "Male" },
                                        { value: "female", label: "Female" },
                                        { value: "Other", label: "Other" },
                                    ]}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div
                        className={classNames(
                            "col-12 col-md-4 col-lg-4",
                            styles.fieldPadding8
                        )}
                    >
                        <div>
                            <label
                                style={{ marginBottom: 5 }}
                                className="form-label"
                            >
                                Date of Birth
                                <sup className="text-danger fs--1">*</sup>
                            </label>
                            <Form.Item
                                {...field}
                                name={[field.name, "birthDate"]}
                                fieldKey={[field.fieldKey, "birthDate"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Date of Birth!",
                                    },
                                ]}
                            >
                                <DatePicker
                                    id={`birthDate-${field.key}`}
                                    placeholder="Date of Birth"
                                    className="customFormDatePicker"
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div
                        className={classNames(
                            "col-12 col-md-4 col-lg-4",
                            styles.fieldPadding8
                        )}
                    >
                        <div>
                            <label
                                style={{ marginBottom: 5 }}
                                className="form-label"
                            >
                                Email Id
                                <sup className="text-danger fs--1">*</sup>
                            </label>
                            <Form.Item
                                {...field}
                                name={[field.name, "email"]}
                                fieldKey={[field.fieldKey, "email"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Email id!",
                                    },
                                ]}
                            >
                                <Input
                                    id={`email-${field.key}`}
                                    type="email"
                                    placeholder="Email Id"
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div
                        className={classNames(
                            "col-12 col-md-4 col-lg-4",
                            styles.fieldPadding8
                        )}
                    >
                        <div>
                            <label
                                style={{ marginBottom: 5 }}
                                className="form-label"
                            >
                                Mobile
                            </label>
                            <Form.Item
                                {...field}
                                name={[field.name, "mobile"]}
                                fieldKey={[field.fieldKey, "mobile"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter your Mobile!",
                                    },
                                ]}
                            >
                                <Input
                                    id={`mobile-${field.key}`}
                                    placeholder="Mobile"
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div
                        className={classNames(
                            "col-12 col-md-4 col-lg-4",
                            styles.fieldPadding8
                        )}
                    >
                        <div>
                            <label
                                style={{ marginBottom: 5 }}
                                className="form-label"
                            >
                                {canDelete ? "Alternate Mobile" : "Alt Mobile"}
                            </label>
                            <Form.Item
                                {...field}
                                name={[field.name, "altMobile"]}
                                fieldKey={[field.fieldKey, "altMobile"]}
                            >
                                <Input
                                    id={`altMobile-${field.key}`}
                                    placeholder={
                                        canDelete
                                            ? "Alternate Mobile"
                                            : "Alt Mobile"
                                    }
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div
                        className={classNames(
                            "col-12 col-md-4 col-lg-4",
                            styles.fieldPadding8
                        )}
                    >
                        <div>
                            <label
                                style={{ marginBottom: 5 }}
                                className="form-label"
                            >
                                {canDelete ? "Alternate Mobile" : "Referred By"}
                            </label>
                            <Form.Item
                                {...field}
                                name={[field.name, "refferedBy"]}
                                fieldKey={[field.fieldKey, "refferedBy"]}
                            >
                                <Input
                                    id={`refferedBy-${field.key}`}
                                    placeholder={
                                        canDelete
                                            ? "Alternate Mobile"
                                            : "Referred By"
                                    }
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>
                </div>
                <div className="row"></div>
            </div>
            <div className="col-12 col-md-3 col-lg-3 text-center">
                <div className={styles.avatarOutlineBoxWrapper}>
                    <div className="h-100 w-100 rounded-circle overflow-hidden position-relative">
                        <Upload
                            name="avatar"
                            listType="picture-circle"
                            className="avatar-uploader"
                            showUploadList={false}
                            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            // beforeUpload={beforeUpload}
                            // onChange={handleChange}
                        >
                            <img
                                src={uploadPhoto}
                                alt="upload Photo"
                                style={{ width: "100%" }}
                            />
                        </Upload>
                    </div>
                </div>
                <div className={styles.uploadLogoText}>Upload Photo</div>
            </div>
            {canDelete && (
                <div className="d-grid gap-2">
                    <Button
                        className={classNames(
                            "cancelBtn",
                            styles.deleteCardBtn
                        )}
                        type="primary"
                        onClick={() => onDeleteCardClick(index)}
                        danger
                    >
                        <Icon height={14} width={14} name="trashIcon" />
                        <span style={{ marginLeft: 5 }}>Delete</span>
                    </Button>
                </div>
            )}
        </>
    );
};

export default OwnerInfoCardBox;
