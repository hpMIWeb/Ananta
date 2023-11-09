import classNames from "classnames";
import styles from "./ownerInfoCardBox.module.scss";
import { DatePicker, Divider, Form, Select } from "antd";
import Input from "../../../../../components/Input/Index";
import Button from "../../../../../components/Button/Index";
import uploadPhoto from "../../../../../assets/images/upload_photo.jpg";
import Upload from "../../../../../components/Upload/Index";
import Icon from "../../../../../components/Icon/Index";
import PhoneInput from "react-phone-input-2";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
moment.locale("en"); // Replace 'en' with your desired locale

const OwnerInfoCardBox = ({
    index,
    field,
    branchDetailsFormValue,
    remove,
    canDelete,
    onDeleteCardClick,
    clientType,
    form,
    displayNumber,
}: any) => {
    return (
        <>
            <div>
                <div className={styles.itemNumber}>{displayNumber + 1}</div>
                <div>
                    {displayNumber !== 0 && (
                        <Button
                            className={classNames(
                                "cancelBtn",
                                styles.deleteCardBtn
                            )}
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                onDeleteCardClick(field.fieldKey, "_id");
                            }}
                        >
                            Delete
                        </Button>
                    )}
                </div>
            </div>
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
                                key={[field.fieldKey, "firstName"]}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please enter your First Name!",
                                    },
                                    {
                                        pattern: /^[A-Za-z]+$/,
                                        message:
                                            "Please enter only alphabets for First Name!",
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
                                key={[field.fieldKey, "middleName"]}
                                rules={[
                                    {
                                        pattern: /^[A-Za-z]+$/,
                                        message:
                                            "Please enter only alphabets for Middle Name!",
                                    },
                                ]}
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
                                Key={[field.fieldKey, "lastName"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter your Last Name!",
                                    },
                                    {
                                        pattern: /^[A-Za-z]+$/,
                                        message:
                                            "Please enter only alphabets for Last Name!",
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
                                Gender
                            </label>
                            <Form.Item
                                {...field}
                                className="customAddFormSelectOptions"
                                name={[field.name, "gender"]}
                                Key={[field.fieldKey, "gender"]}
                                rules={[
                                    {
                                        required: false,
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
                            </label>
                            <Form.Item
                                {...field}
                                name={[field.name, "birthDate"]}
                                Key={[field.fieldKey, "birthDate"]}
                                rules={[
                                    {
                                        required: false,
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
                    {clientType === "ca" && ( // Check if clientType is "CA"
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
                                    Membership No
                                    <sup className="text-danger fs--1">*</sup>
                                </label>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "membershipNo"]}
                                    key={[field.fieldKey, "membershipNo"]}
                                    rules={[
                                        {
                                            pattern: /^\d{6}$/,
                                            message:
                                                "Membership number should be exactly six digits and contain only numbers!",
                                        },
                                    ]}
                                >
                                    <Input
                                        id={`membershipNo-${field.key}`}
                                        placeholder="Membership No"
                                        className="customAddFormInputText"
                                        maxLength={6}
                                        onKeyPress={(event: any) => {
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    )}
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
                                Key={[field.fieldKey, "email"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Email id!",
                                        type: "email",
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
                                <sup className="text-danger fs--1">*</sup>
                            </label>
                            <Form.Item
                                {...field}
                                name={[field.name, "mobile"]}
                                Key={[field.fieldKey, "mobile"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter your Mobile!",
                                    },
                                ]}
                            >
                                <PhoneInput
                                    countryCodeEditable={false}
                                    containerClass="phoneNumberContainerClassInput"
                                    country="in"
                                    placeholder="Mobile"
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
                                Alternate Mobile
                            </label>
                            <Form.Item
                                {...field}
                                name={[field.name, "altMobile"]}
                                Key={[field.fieldKey, "altMobile"]}
                            >
                                <PhoneInput
                                    countryCodeEditable={false}
                                    containerClass="phoneNumberContainerClassInput"
                                    country="in"
                                    placeholder={"Alternate Mobile"}
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
                                style={{ width: "100%", marginBottom: "5px" }}
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
