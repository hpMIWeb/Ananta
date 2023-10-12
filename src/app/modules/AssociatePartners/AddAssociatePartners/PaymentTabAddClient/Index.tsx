import classNames from "classnames";
import styles from "./paymentTabAddClient.module.scss";
import { DatePicker, Form, Select } from "antd";
import Button from "../../../../../components/Button/Index";
import Input from "../../../../../components/Input/Index";
import PaymentFieldRow from "./PaymentFieldRow";
import Icon from "../../../../../components/Icon/Index";
import React, { useState } from "react";
import moment from "moment";

const PaymentTabAddClient = ({ onChange, setFormValue }: any) => {
    const [paymentRowData, setPaymentRowData] = useState([
        { type: "default", index: 0 },
    ]);
    const [paymentForm, setPaymentForm] = useState({
        creditPeriodTime: "",
        creditPeriodType: "",
        paymentTerms: "",
    });
    const onFinish = (values: any) => {
        setFormValue(values);
        onChange(5);
    };

    const addMoreOwnerCard = () => {
        setPaymentRowData((prev) => [
            ...prev,
            { type: "new", index: paymentRowData.length },
        ]);
    };

    const onDeleteCardClick = (cardIndex: any) => {
        const newOwnerInfoData = paymentRowData.filter(
            (a) => a.index !== cardIndex
        );
        setPaymentRowData(newOwnerInfoData);
    };

    const currentDate = moment();
    const futureDate = "";
    // const futureDate = currentDate
    //   .add(paymentForm.creditPeriodTime, paymentForm.creditPeriodType)
    //   .format("YYYY-MM-DD");
    const onValuesChange = (changedValues: any, allValues: any) => {
        setPaymentForm(allValues);
    };

    return (
        <Form
            name="basic"
            initialValues={{ remember: true, creditPeriodType: "Days" }}
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
            className="customAddForm"
            onValuesChange={onValuesChange}
        >
            <div style={{ marginTop: 2 }}>
                <div className={classNames("row mb-3", styles.paymentFormRow)}>
                    <div className={classNames("col-auto", styles.padding8)}>
                        <label style={{ minWidth: 120 }} className="form-label">
                            Invoice Amount
                        </label>
                    </div>
                    <div
                        className={classNames(
                            "col-12 col-sm-6 col-md-4",
                            styles.padding8
                        )}
                    >
                        <p className={styles.invoiceAmount}>Rs. 0/-</p>
                    </div>
                </div>

                <div className={classNames("row mb-3", styles.paymentFormRow)}>
                    <div className={classNames("col-auto", styles.padding8)}>
                        <label style={{ minWidth: 120 }} className="form-label">
                            Payment Terms
                            <sup className="text-danger fs--1">*</sup>
                        </label>
                    </div>
                    <div
                        className={classNames(
                            "col-12 col-sm-6 col-md-4",
                            styles.padding8
                        )}
                    >
                        <Form.Item
                            name="paymentTerms"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Select Payment Term!",
                                },
                            ]}
                        >
                            <Select
                                options={[
                                    { value: "Credit", label: "Credit" },
                                    { value: "Advance", label: "Advance" },
                                ]}
                                placeholder="Select Payment Term"
                            />
                        </Form.Item>
                    </div>
                </div>

                {paymentForm.paymentTerms === "Credit" && (
                    <div
                        className={classNames(
                            "row mb-3",
                            styles.paymentFormRow
                        )}
                    >
                        <div
                            className={classNames("col-auto", styles.padding8)}
                        >
                            <label
                                style={{ minWidth: 120 }}
                                className="form-label"
                            >
                                Credit Period
                                <sup className="text-danger fs--1">*</sup>
                            </label>
                        </div>
                        <div
                            className={classNames(
                                "col-12 col-sm-6 col-md-4",
                                styles.padding8
                            )}
                        >
                            <div className="row">
                                <div className="col">
                                    <Form.Item
                                        name="creditPeriodTime"
                                        className="customAddFormSelect"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your Period!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Time"
                                            className="customAddFormInputText"
                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-auto">
                                    <div
                                        style={{ minWidth: 130 }}
                                        className="mb-3"
                                    >
                                        <Form.Item
                                            name="creditPeriodType"
                                            className="customAddFormSelectOptions"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please Enter your Period Type!",
                                                },
                                            ]}
                                        >
                                            <Select
                                                defaultValue="Days"
                                                style={{ width: 130 }}
                                                options={[
                                                    {
                                                        value: "Days",
                                                        label: "Days",
                                                    },
                                                    {
                                                        value: "Months",
                                                        label: "Months",
                                                    },
                                                ]}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {paymentForm.creditPeriodTime &&
                            paymentForm.creditPeriodType && (
                                <div
                                    className={classNames(
                                        "col",
                                        styles.padding8
                                    )}
                                >
                                    <div className="d-flex">
                                        <p className="semiBold me-3">
                                            Payment Due Date
                                        </p>
                                        <p>{futureDate}</p>
                                    </div>
                                </div>
                            )}
                    </div>
                )}

                <div className={classNames("row mb-3", styles.paymentFormRow)}>
                    <div className={classNames("col-auto", styles.padding8)}>
                        <label style={{ minWidth: 120 }} className="form-label">
                            Payment Mode
                            <sup className="text-danger fs--1">*</sup>
                        </label>
                    </div>
                    <div
                        className={classNames(
                            "col-12 col-sm-6 col-md-4",
                            styles.padding8
                        )}
                    >
                        <Form.Item
                            name="paymentMode"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Select Payment Mode!",
                                },
                            ]}
                        >
                            <Select
                                options={[
                                    { value: "Online", label: "Online" },
                                    { value: "Offline", label: "Offline" },
                                ]}
                                placeholder="Select Payment Mode"
                            />
                        </Form.Item>
                    </div>
                </div>
                {paymentRowData.map((payment, index) => (
                    <React.Fragment key={index}>
                        <PaymentFieldRow />
                        {payment.type === "new" && (
                            <hr style={{ marginTop: 0 }} />
                        )}
                        {payment.type === "new" && (
                            <div className="d-grid gap-2">
                                <Button
                                    className={classNames(
                                        "cancelBtn",
                                        styles.deleteCardBtn
                                    )}
                                    type="primary"
                                    onClick={() =>
                                        onDeleteCardClick(payment.index)
                                    }
                                    danger
                                >
                                    <Icon
                                        height={14}
                                        width={14}
                                        name="trashIcon"
                                    />
                                    <span style={{ marginLeft: 5 }}>
                                        Delete
                                    </span>
                                </Button>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div className="row">
                <div className="col-12 my-2">
                    <div className="d-flex">
                        <Button
                            className={styles.addPaymentRowBtn}
                            onClick={addMoreOwnerCard}
                            type="primary"
                        >
                            <Icon name="plus" width={14.25} height={16} />
                            Add
                        </Button>
                    </div>
                </div>
            </div>

            <div className={classNames("row", styles.paymentFormRow)}>
                <div
                    className={classNames(
                        "col-12 my-2",
                        styles.subscriptionFormFooter
                    )}
                >
                    <div className="d-flex">
                        <div className="ms-auto">
                            <Button
                                style={{ minWidth: 104, marginRight: 12 }}
                                className="greyBtn"
                                onClick={() => onChange(1)}
                            >
                                Previous
                            </Button>
                            <Button
                                className={styles.nextBtn}
                                type="primary"
                                htmlType="submit"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    );
};

export default PaymentTabAddClient;
