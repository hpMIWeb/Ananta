import classNames from "classnames";
import styles from "./vaultTabAddClient.module.scss";
import { DatePicker, Form, Select } from "antd";
import Button from "../../../../components/ui/Button/Index";
import Input from "../../../../components/ui/Input/Index";
import PaymentFieldRow from "./VaultFieldRow";
import Icon from "../../../../components/ui/Icon/Index";
import React, { useState } from "react";
import moment from "moment";

const VaultTabAddClient = ({ onChange, setFormValue, loading }: any) => {
    const [paymentRowData, setPaymentRowData] = useState([
        { type: "default", index: 0 },
    ]);
    const [paymentForm, setPaymentForm] = useState({});
    const onFinish = (values: any) => {
        setFormValue({ vaultDetails: [values] });
        onChange(8, { vaultDetails: [values] });
    };

    const addMoreOwnerCard = () => {
        setPaymentRowData((prev) => [
            ...prev,
            { type: "new", index: paymentRowData.length },
        ]);
    };

    const onDeleteCardClick = (cardIndex: number) => {
        const newOwnerInfoData = paymentRowData.filter(
            (a) => a.index !== cardIndex
        );
        setPaymentRowData(newOwnerInfoData);
    };

    const onValuesChange = (changedValues: any, allValues: any[]) => {
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
                            className={classNames(
                                "me-auto",
                                styles.addPaymentRowBtn
                            )}
                            onClick={addMoreOwnerCard}
                            type="primary"
                        >
                            <Icon name="plus" width={14.25} height={16} />
                            Add
                        </Button>
                        <Button
                            className={classNames(
                                "ms-auto",
                                styles.addPaymentRowBtn
                            )}
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </Form>
    );
};

export default VaultTabAddClient;
