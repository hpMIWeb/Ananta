import styles from "./bankdetails.module.scss";
import classNames from "classnames";
import { Form, InputNumber, Select } from "antd";
import Input from "../../../../../components/Input/Index";
import BankNames from "../../../../../jsonData/BankNames.json";

const BankInfoCard = () => {
    const bankDataJson = BankNames;
    return (
        <div>
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
                                </label>
                                <Form.Item name="bankName">
                                    <Select
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
                                </label>
                                <Form.Item name="branchName">
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
                                </label>
                                <Form.Item
                                    name="accountNo"
                                    rules={[
                                        {
                                            pattern: /^[0-9]{16}$/,
                                            message:
                                                "Invalid 16-digit account number format.",
                                        },
                                    ]}
                                >
                                    <Input
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
                                </label>
                                <Form.Item
                                    name="accountType"
                                    className="customAddFormSelectOptions"
                                >
                                    <Select
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
                                </label>
                                <Form.Item
                                    name="ifscCode"
                                    className="customAddFormSelectOptions"
                                    rules={[
                                        {
                                            pattern: /^[A-Za-z]{4}[0-9]{7}$/,
                                            message:
                                                "Invalid IFSC code format.",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="IFSC Code"
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
                                </label>
                                <Form.Item
                                    name="micrCode"
                                    className="customAddFormSelectOptions"
                                    rules={[
                                        {
                                            pattern: /^[0-9]{9}$/,
                                            message:
                                                "Invalid MICR code format.",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="MICR Code"
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
                                </label>
                                <Form.Item
                                    name="swiftCode"
                                    className="customAddFormSelectOptions"
                                    rules={[
                                        {
                                            pattern:
                                                /^[A-Za-z]{6}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/,
                                            message:
                                                "Invalid SWIFT code format.",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="SWIFT Code"
                                        className="customAddFormInputText"
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankInfoCard;
