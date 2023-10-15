import styles from "./bankdetails.module.scss";
import { Form } from "antd";
import CardBottomAction from "../EmergencyInfo/CardBottomAction";
import { useState } from "react";
import BankInfoCard from "./BankInfoCard";
import axios from "axios";
import Input from "../../../../../components/Input/Index";
import classNames from "classnames";
import Select from "../../../../../components/Select/Index";

const BankDetails = ({ onChange, setEmployeeInfo }: any) => {
    const [form] = Form.useForm();
    const [bankInfoData, setBankInfoData] = useState<any>([]);
    // const [bankData, setBankData] = useState<any>({ BANK: "" });
    const handleFormValuesChange = (changedValues: any, allValues: any) => {
        if (
            "ifscCode" in changedValues &&
            changedValues.ifscCode.length === 11
        ) {
            getBankDetails(changedValues.ifscCode);
        }
    };

    const getBankDetails = async (ifscCode: any) => {
        try {
            const response = await axios.get(
                `https://ifsc.razorpay.com/${ifscCode}`
            );

            const bankData = response.data;
            console.log(bankData.BANK);

            // form.setFieldsValue({ bankName: bankData.BANK });
            form.setFieldsValue({
                bankName: bankData.BANK,
                branchName: bankData.BRANCH,
                micrCode: bankData.MICR,
            });
        } catch (error) {
            console.error("Error fetching location data:", error);
        }
    };
    const onFinish = (value: any) => {
        setEmployeeInfo({ clientBankDetails: value });
        console.log(value);
        onChange(5);
    };

    const addMoreOwnerCard = () => {
        setBankInfoData((prev: any) => [
            ...prev,
            { type: "new", index: bankInfoData.length },
        ]);
    };

    return (
        <div>
            <Form
                form={form}
                name="basic"
                //initialValues={{ bankName: bankData.BANK }}
                onFinish={onFinish}
                autoComplete="off"
                requiredMark={false}
                className="customAddForm"
                onValuesChange={handleFormValuesChange}
            >
                <div>
                    <div className="col-12 col-md-12 col-lg-12">
                        <div className={styles.branchFieldWrapper}>
                            <div
                                className={classNames(
                                    "row",
                                    styles.formFieldWrapper
                                )}
                            >
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
                            </div>{" "}
                            <div
                                className={classNames(
                                    "row",
                                    styles.formFieldWrapper
                                )}
                            >
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
                            </div>
                            <div
                                className={classNames(
                                    "row",
                                    styles.formFieldWrapper
                                )}
                            >
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
                                            // rules={[
                                            //     {
                                            //         pattern: /^[A-Za-z]{4}[0-9]{7}$/,
                                            //         message:
                                            //             "Invalid IFSC code format.",
                                            //     },
                                            // ]}
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

                <CardBottomAction
                    showAdd={false}
                    addCardClick={addMoreOwnerCard}
                    onChange={onChange}
                />
            </Form>
        </div>
    );
};

export default BankDetails;
