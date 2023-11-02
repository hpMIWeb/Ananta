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
    onDelete,
    displayNumber,
    _id,
    handleOwnerInfoChange,
    data,
    clientType,
    ...props
}: any) => {
    return (
        <>
            <div>
                <div className={styles.itemNumber}>{displayNumber + 1}</div>
                <div>
                    <Button
                        className={classNames(
                            "cancelBtn",
                            styles.deleteCardBtn
                        )}
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            onDelete(_id);
                        }}
                    >
                        Delete
                    </Button>
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
                                id={`firstName-${_id}`}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your First Name!",
                                    },
                                ]}
                            >
                                <Input
                                    id={`firstName-${_id}`}
                                    placeholder="First Name"
                                    className="customAddFormInputText"
                                    onChange={(item: any) =>
                                        handleOwnerInfoChange(
                                            "firstName",
                                            item.target.value,
                                            _id
                                        )
                                    }
                                    value={data.firstName}
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
                            <Form.Item id={`middleName-${_id}`}>
                                <Input
                                    id={`middleName-${_id}`}
                                    placeholder="Middle Name"
                                    className="customAddFormInputText"
                                    onChange={(item: any) =>
                                        handleOwnerInfoChange(
                                            "middleName",
                                            item.target.value,
                                            _id
                                        )
                                    }
                                    value={data.middleName}
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
                                id={`lastName-${_id}`}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter your Last Name!",
                                    },
                                ]}
                            >
                                <Input
                                    id={`lastName-${_id}`}
                                    placeholder="Last Name"
                                    className="customAddFormInputText"
                                    onChange={(item: any) =>
                                        handleOwnerInfoChange(
                                            "lastName",
                                            item.target.value,
                                            _id
                                        )
                                    }
                                    value={data.lastName}
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
                                id={`gender-${_id}`}
                                rules={[
                                    {
                                        required: false,
                                        message: "Please Select gender!",
                                    },
                                ]}
                            >
                                <Select
                                    id={`gender-${_id}`}
                                    placeholder={<span>Select Gender</span>}
                                    options={[
                                        { value: "male", label: "Male" },
                                        { value: "female", label: "Female" },
                                        { value: "Other", label: "Other" },
                                    ]}
                                    onChange={(value: any) =>
                                        handleOwnerInfoChange(
                                            "gender",
                                            value,
                                            _id
                                        )
                                    }
                                    value={data.gender}
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
                                id={`birthDate-${_id}`}
                                rules={[
                                    {
                                        required: false,
                                        message: "Please Enter Date of Birth!",
                                    },
                                ]}
                            >
                                <DatePicker
                                    id={`birthDate-${_id}`}
                                    placeholder="Date of Birth"
                                    className="customFormDatePicker"
                                    format="DD/MM/YYYY"
                                    onChange={(value: any) =>
                                        handleOwnerInfoChange(
                                            "birthDate",
                                            value,
                                            _id
                                        )
                                    }
                                    value={data.birthDate}
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
                                    id={`membershipNo-${_id}`}
                                    rules={[
                                        {
                                            pattern: /^(?:\d*)$/,
                                            message:
                                                "Value should contain just number !!",
                                        },
                                    ]}
                                >
                                    <Input
                                        id={`membershipNo-${_id}`}
                                        placeholder={"Membership No"}
                                        className="customAddFormInputText"
                                        maxLength={6}
                                        onKeyPress={(event: any) => {
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                        onChange={(item: any) =>
                                            handleOwnerInfoChange(
                                                "membershipNo",
                                                item.target.value,
                                                _id
                                            )
                                        }
                                        value={data.membershipNo}
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
                                id={`email-${_id}`}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Email id!",
                                        type: "email",
                                    },
                                ]}
                            >
                                <Input
                                    id={`email-${_id}`}
                                    type="email"
                                    placeholder="Email Id"
                                    className="customAddFormInputText"
                                    onChange={(item: any) =>
                                        handleOwnerInfoChange(
                                            "email",
                                            item.target.value,
                                            _id
                                        )
                                    }
                                    value={data.email}
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
                                id={`mobile-${_id}`}
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
                                    onChange={(value: any) =>
                                        handleOwnerInfoChange(
                                            "mobile",
                                            value,
                                            _id
                                        )
                                    }
                                    value={data.mobile}
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
                            <Form.Item id={`altMobile-${_id}`}>
                                <PhoneInput
                                    countryCodeEditable={false}
                                    containerClass="phoneNumberContainerClassInput"
                                    country="in"
                                    placeholder={"Alternate Mobile"}
                                    onChange={(value: any) =>
                                        handleOwnerInfoChange(
                                            "altMobile",
                                            value,
                                            _id
                                        )
                                    }
                                    value={data.altMobile}
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
        </>
    );
};

export default OwnerInfoCardBox;
