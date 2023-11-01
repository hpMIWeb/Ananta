import classNames from "classnames";
import styles from "./paymentTabAddClient.module.scss";
import { DatePicker, Form, Select } from "antd";
import Button from "../../../../../components/Button/Index";
import Input from "../../../../../components/Input/Index";
import PaymentFieldRow from "./PaymentFieldRow";
import Icon from "../../../../../components/Icon/Index";
import React, { useEffect, useState } from "react";
import moment from "moment";

interface IInstrument {
    instrumentAmount: number;
    instrumentDate: string;
    instrumentId: number;
    _id: number;
    instrumentType: string;
}

const PaymentTabAddClient = ({
    onChange,
    setFormValue,
    clientValue,
    selectedClientData,
    loading,
}: any) => {
    const [paymentRowData, setPaymentRowData] = useState<IInstrument[]>([
        {
            _id: 1,
        } as IInstrument,
    ]);
    const [form] = Form.useForm();

    const [billingMethod, setBillingMethod] = useState<string>(
        clientValue?.subscriptionDetails?.subscriptionType || "subscription"
    );

    const [makeValidate, setMakeValidate] = useState(true);

    const [paymentForm, setPaymentForm] = useState({
        creditPeriodTime: "",
        creditPeriodType: "",
        paymentTerms: "",
    });

    useEffect(() => {
        if (selectedClientData && Object.keys(selectedClientData).length > 0) {
            form.setFieldsValue({
                paymentTerms: selectedClientData?.paymentDetails.paymentTerms,
                paymentMode: selectedClientData?.paymentDetails.paymentMode,
                creditPeriodTime:
                    selectedClientData?.paymentDetails.creditPeriod,
                creditType: selectedClientData?.paymentDetails.creditType,
            });
            setPaymentForm({
                paymentTerms: selectedClientData?.paymentDetails.paymentTerms,
                creditPeriodTime:
                    selectedClientData?.paymentDetails.creditPeriod,
                creditPeriodType: selectedClientData?.paymentDetails.creditType,
            });
            setPaymentRowData(
                selectedClientData?.paymentDetails.instrumentDetails
            );
        }
    }, []);

    useEffect(() => {
        if (billingMethod !== "subscription") {
            setMakeValidate(false);
        }
    }, []);

    const onFinish = (values: any) => {
        if (billingMethod === "subscription") {
            const finalFormValues = {
                invoiceAmount: clientValue?.subscriptionDetails?.invoicePrice,
                paymentTerms: values.paymentTerms,
                creditPeriod: values.creditPeriodTime,
                creditType: values.creditPeriodType,
                paymentMode: values.paymentMode,
                instrumentDetails: paymentRowData,
            };
            setFormValue({ paymentDetails: finalFormValues });
            onChange(8, { paymentDetails: finalFormValues });
        } else {
            const finalFormValues = {
                instrumentDetails: [],
            };
            setFormValue({ paymentDetails: finalFormValues });
            onChange(8, { paymentDetails: finalFormValues });
        }
    };

    const addMoreOwnerCard = () => {
        const fieldData = form.getFieldsValue();
        setPaymentRowData((prev) => [
            ...prev,
            {
                _id: paymentRowData.length + 1,
            } as IInstrument,
        ]);
    };

    const handleInstrumentChange = (key: any, value: any, index: any) => {
        const instrumentInfoData = paymentRowData.find((a) => a._id === index);
        if (instrumentInfoData) {
            const updatedInstrumentInfoData = {
                ...instrumentInfoData,
                [key]: value,
            };

            const updatedPaymentRowData = paymentRowData.map((rowData) =>
                rowData._id === index ? updatedInstrumentInfoData : rowData
            );

            setPaymentRowData(updatedPaymentRowData);
        }
    };

    const onDeleteCardClick = (cardIndex: any) => {
        const newOwnerInfoData = paymentRowData.filter(
            (a) => a._id !== cardIndex
        );
        setPaymentRowData(newOwnerInfoData);
    };

    const currentDate = moment();
    let futureDate = "";
    if (
        clientValue &&
        clientValue.subscriptionDetails &&
        clientValue.subscriptionDetails.startDate
    ) {
        futureDate = clientValue.subscriptionDetails.startDate
            .add(paymentForm.creditPeriodTime, paymentForm.creditPeriodType)
            .format("DD/MM/YYYY");
    }
    // const futureDate = currentDate
    //   .add(paymentForm.creditPeriodTime, paymentForm.creditPeriodType)
    //   .format("YYYY-MM-DD");
    const onValuesChange = (changedValues: any, allValues: any) => {
        setPaymentForm(allValues);
    };

    return (
        <Form
            name="basic"
            form={form}
            initialValues={{ remember: true, creditPeriodType: "Days" }}
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
            className="customAddForm"
            onValuesChange={onValuesChange}
        >
            {billingMethod === "subscription" && ( // Conditionally render this section
                <>
                    <div style={{ marginTop: 2 }}>
                        <div
                            className={classNames(
                                "row mb-3",
                                styles.paymentFormRow
                            )}
                        >
                            <div
                                className={classNames(
                                    "col-auto",
                                    styles.padding8
                                )}
                            >
                                <label
                                    style={{ minWidth: 120 }}
                                    className="form-label"
                                >
                                    Invoice Amount
                                </label>
                            </div>
                            <div
                                className={classNames(
                                    "col-12 col-sm-6 col-md-4",
                                    styles.padding8
                                )}
                            >
                                <p className={styles.invoiceAmount}>
                                    Rs.
                                    {clientValue &&
                                    clientValue.subscriptionDetails
                                        ? clientValue.subscriptionDetails
                                              .invoicePrice
                                        : 0}
                                    /-
                                </p>
                            </div>
                        </div>

                        <div
                            className={classNames(
                                "row mb-3",
                                styles.paymentFormRow
                            )}
                        >
                            <div
                                className={classNames(
                                    "col-auto",
                                    styles.padding8
                                )}
                            >
                                <label
                                    style={{ minWidth: 120 }}
                                    className="form-label"
                                >
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
                                            required: makeValidate,
                                            message:
                                                "Please Select Payment Term!",
                                        },
                                    ]}
                                >
                                    <Select
                                        options={[
                                            {
                                                value: "Credit",
                                                label: "Credit",
                                            },
                                            {
                                                value: "Advance",
                                                label: "Advance",
                                            },
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
                                    className={classNames(
                                        "col-auto",
                                        styles.padding8
                                    )}
                                >
                                    <label
                                        style={{ minWidth: 120 }}
                                        className="form-label"
                                    >
                                        Credit Period
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
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
                                                        required: makeValidate,
                                                        message:
                                                            "Please Enter your Period!",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    placeholder="Time"
                                                    className="customAddFormInputText"
                                                    onKeyPress={(
                                                        event: any
                                                    ) => {
                                                        if (
                                                            !/[0-9]/.test(
                                                                event.key
                                                            )
                                                        ) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    maxLength="4"
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
                                                            required:
                                                                makeValidate,
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

                        <div
                            className={classNames(
                                "row mb-3",
                                styles.paymentFormRow
                            )}
                        >
                            <div
                                className={classNames(
                                    "col-auto",
                                    styles.padding8
                                )}
                            >
                                <label
                                    style={{ minWidth: 120 }}
                                    className="form-label"
                                >
                                    Payment Mode
                                    {paymentForm.paymentTerms !== "Advance" && (
                                        <sup className="text-danger fs--1">
                                            *
                                        </sup>
                                    )}
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
                                            required:
                                                makeValidate &&
                                                paymentForm.paymentTerms !==
                                                    "Advance",
                                            message:
                                                "Please Select Payment Mode!",
                                        },
                                    ]}
                                >
                                    <Select
                                        options={[
                                            {
                                                value: "Online",
                                                label: "Online",
                                            },
                                            {
                                                value: "Offline",
                                                label: "Offline",
                                            },
                                        ]}
                                        placeholder="Select Payment Mode"
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        {paymentRowData.map((payment, index: number) => (
                            <PaymentFieldRow
                                key={index}
                                onDelete={onDeleteCardClick}
                                _id={payment._id}
                                handleInstrumentChange={handleInstrumentChange}
                                data={payment}
                            />
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
                                    <Icon
                                        name="plus"
                                        width={14.25}
                                        height={16}
                                    />
                                    Add
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
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
                                onClick={() => onChange(5)}
                            >
                                Previous
                            </Button>
                            <Button
                                className={styles.nextBtn}
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    );
};

export default PaymentTabAddClient;
