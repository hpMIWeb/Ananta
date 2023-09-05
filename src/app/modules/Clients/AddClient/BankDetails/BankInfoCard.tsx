import styles from "./bankdetails.module.scss";
import classNames from "classnames";
import { Form, Select } from "antd";
import Input from "../../../../components/ui/Input/Index";
import TextArea from "antd/es/input/TextArea";
import Button from "../../../../components/ui/Button/Index";
import BankNames from "../../../../../jsonData/BankNames.json";
import Icon from "../../../../components/ui/Icon/Index";

const BankInfoCard = ({
    index,
    field,
    branchDetailsFormValue,
    remove,
    onDeleteCardClick,
}: any) => {
    const bankDataJson = BankNames;
    return (
        <div
            key={index}
            className={classNames(
                styles.branchInfoCard,
                "bg-white border rounded-1 p-3 js-branches"
            )}
        >
            <div className="col-12 col-md-12 col-lg-12">
                <div className={styles.branchFieldWrapper}>
                    <div className={classNames("row", styles.formFieldWrapper)}>
                        <div
                            className={classNames(
                                "col-12 col-md-4 col-lg-4",
                                styles.fieldPadding8
                            )}
                        >
                            <div>
                                <label
                                    style={{ marginBottom: 7 }}
                                    className="custom-label"
                                >
                                    Bank Name
                                    <sup className="text-danger fs--1">*</sup>
                                </label>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "bankName"]}
                                    fieldKey={[field.fieldKey, "bankName"]}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Enter your Bank Name!",
                                        },
                                    ]}
                                >
                                    <Select
                                        id={`bankName-${field.key}`}
                                        showSearch
                                        placeholder="Select Bank"
                                        options={bankDataJson.map((b) => ({
                                            label: b.name,
                                            value: b.name,
                                        }))}
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
                                    style={{ marginBottom: 7 }}
                                    className="custom-label"
                                >
                                    Branch Name
                                    <sup className="text-danger fs--1">*</sup>
                                </label>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "branchName"]}
                                    fieldKey={[field.fieldKey, "branchName"]}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Enter your Branch Name!",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Select Branch"
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
                                    style={{ marginBottom: 7 }}
                                    className="custom-label"
                                >
                                    Account No
                                    <sup className="text-danger fs--1">*</sup>
                                </label>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "accountNo"]}
                                    fieldKey={[field.fieldKey, "accountNo"]}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Enter your Account No!",
                                        },
                                    ]}
                                >
                                    <Input
                                        id={`accountNo-${field.key}`}
                                        placeholder="Account No"
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
                                    style={{ marginBottom: 7 }}
                                    className="custom-label"
                                >
                                    Account Type
                                    <sup className="text-danger fs--1">*</sup>
                                </label>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "accountType"]}
                                    fieldKey={[field.fieldKey, "accountType"]}
                                    className="customAddFormSelectOptions"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Select your Account Type!",
                                        },
                                    ]}
                                >
                                    <Select
                                        id={`accountType-${field.key}`}
                                        placeholder="Select Type"
                                        options={[
                                            {
                                                label: "Saving",
                                                value: "Saving",
                                            },
                                            {
                                                label: "Current",
                                                value: "Current",
                                            },
                                            {
                                                label: "Over Draft",
                                                value: "Over Draft",
                                            },
                                            {
                                                label: "Cash Credit",
                                                value: "Cash Credit",
                                            },
                                            {
                                                label: "required",
                                                value: "required",
                                            },
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
                                    style={{ marginBottom: 7 }}
                                    className="custom-label"
                                >
                                    IFCS Code
                                    <sup className="text-danger fs--1">*</sup>
                                </label>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "ifscCode"]}
                                    fieldKey={[field.fieldKey, "ifscCode"]}
                                    className="customAddFormSelectOptions"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Enter your IFCS Code!",
                                        },
                                        {
                                            len: 11, // IFCS Code length should be 11 characters
                                            message:
                                                "IFCS Code must be 11 characters long!",
                                        },
                                    ]}
                                >
                                    <Input
                                        id={`ifscCode-${field.key}`}
                                        placeholder="IFCS Code"
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
                                    style={{ marginBottom: 7 }}
                                    className="custom-label"
                                >
                                    MIRC Code
                                    <sup className="text-danger fs--1">*</sup>
                                </label>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "micrCode"]}
                                    fieldKey={[field.fieldKey, "micrCode"]}
                                    className="customAddFormSelectOptions"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Enter your MIRC Code!",
                                        },
                                    ]}
                                >
                                    <Input
                                        id={`micrCode-${field.key}`}
                                        placeholder="MIRC Code"
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
                                    style={{ marginBottom: 7 }}
                                    className="custom-label"
                                >
                                    Swift Code
                                    <sup className="text-danger fs--1">*</sup>
                                </label>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "swiftCode"]}
                                    fieldKey={[field.fieldKey, "swiftCode"]}
                                    className="customAddFormSelectOptions"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter Swift Code!",
                                        },
                                        {
                                            len: [8, 11], // Swift Code can be 8 or 11 characters long
                                            message:
                                                "Swift Code must be 8 or 11 characters long!",
                                        },
                                    ]}
                                >
                                    <Input
                                        id={`swiftCode-${field.key}`}
                                        placeholder="Swift Code"
                                        className="customAddFormInputText"
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-grid gap-2">
                <Button
                    className={classNames("cancelBtn", styles.deleteCardBtn)}
                    type="primary"
                    onClick={() => onDeleteCardClick(index)}
                    danger
                >
                    <Icon height={14} width={14} name="trashIcon" />
                    <span style={{ marginLeft: 5 }}>Delete</span>
                </Button>
            </div>
        </div>
    );
};

export default BankInfoCard;
