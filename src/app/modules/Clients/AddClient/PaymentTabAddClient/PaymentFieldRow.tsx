import classNames from "classnames";
import React, { memo, useEffect, useState } from "react";
import styles from "./paymentTabAddClient.module.scss";
import Input from "../../../../../components/Input/Index";
import Button from "../../../../../components/Button/Index";
import Icon from "../../../../../components/Icon/Index";
import { DatePicker, Form, Select } from "antd";

const PaymentFieldRow = ({ onDelete, instrumentIndex }: any) => {
    return (
        <div className={classNames("row", styles.paymentFormRow)}>
            <div>{instrumentIndex}</div>
            <div
                className={classNames(
                    "col-12 col-sm-6 col-md-3",
                    styles.instrumentFieldBox
                )}
            >
                <div>
                    <label className="form-label">Instrument Type</label>
                    <Form.Item name="instrumentType">
                        <Select
                            options={[
                                { value: "NEFT", label: "NEFT" },
                                { value: "RTGS", label: "RTGS" },
                                { value: "UPI", label: "UPI" },
                                { value: "IMPS", label: "IMPS" },
                                { value: "Cheque", label: "Cheque" },
                                {
                                    value: "CacheVoucher",
                                    label: "Cash Voucher",
                                },
                                { value: "DD", label: "DD" },
                            ]}
                            placeholder="Select Payment Term"
                        />
                    </Form.Item>
                </div>
            </div>
            <div
                className={classNames(
                    "col-12 col-sm-6 col-md-3",
                    styles.instrumentFieldBox
                )}
            >
                <div>
                    <label className="form-label">Instrument Date</label>
                    <Form.Item name="instrumentDate">
                        <DatePicker
                            placeholder="Instrument Date"
                            className="customFormDatePicker"
                            format="DD/MM/YYYY"
                        />
                    </Form.Item>
                </div>
            </div>
            <div
                className={classNames(
                    "col-12 col-sm-6 col-md-3",
                    styles.instrumentFieldBox
                )}
            >
                <div>
                    <label className="form-label">Instrument ID</label>
                    <Form.Item name="instrumentId">
                        <Input
                            placeholder="Instrument ID"
                            className="customAddFormInputText"
                        />
                    </Form.Item>
                </div>
            </div>
            <div
                className={classNames(
                    "col-12 col-sm-6 col-md-2",
                    styles.instrumentFieldBox
                )}
            >
                <div>
                    <label className="form-label">Instrument Amount</label>
                    <Form.Item name="instrumentAmount">
                        <Input
                            placeholder="Instrument Amount"
                            className="customAddFormInputText"
                            onKeyPress={(event: any) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                            maxLength="15"
                        />
                    </Form.Item>
                </div>
            </div>
            {instrumentIndex !== 0 && (
                <div
                    className={classNames(
                        "col-12 col-sm-6 col-md-1",
                        styles.instrumentFieldBox
                    )}
                >
                    <div>
                        <Button
                            className={classNames(
                                "cancelBtn",
                                styles.deleteCardBtn
                            )}
                            type="primary"
                            onClick={() => onDelete(instrumentIndex)}
                            danger
                        >
                            <Icon height={14} width={14} name="trashIcon" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentFieldRow;
