import classNames from "classnames";
import React, { memo, useEffect, useState } from "react";
import styles from "./paymentTabAddClient.module.scss";
import Input from "../../../../../components/Input/Index";
import Button from "../../../../../components/Button/Index";
import Icon from "../../../../../components/Icon/Index";
import { DatePicker, Form, Select } from "antd";
import dayjs from "dayjs";

const PaymentFieldRow = ({
    onDelete,
    _id,
    handleInstrumentChange,
    data,
    isEdit,
    ...props
}: any) => {
    return (
        <div className={classNames("row", styles.paymentFormRow)}>
            <div
                className={classNames(
                    "col-12 col-sm-6 col-md-3",
                    styles.instrumentFieldBox
                )}
            >
                <div>
                    <label className="form-label">Instrument Type</label>
                    <Form.Item id={`name-${_id}`}>
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
                            onChange={(value) =>
                                handleInstrumentChange(
                                    "instrumentType",
                                    value,
                                    _id
                                )
                            }
                            value={data.instrumentType}
                            disabled={!isEdit}
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
                    <Form.Item id={`date-${_id}`}>
                        <DatePicker
                            placeholder="Instrument Date"
                            className="customFormDatePicker"
                            format="DD/MM/YYYY"
                            onChange={(value) =>
                                handleInstrumentChange(
                                    "instrumentDate",
                                    value,
                                    _id
                                )
                            }
                            value={dayjs(data.instrumentDate)}
                            disabled={!isEdit}
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
                    <Form.Item id={`ins-id-${_id}`}>
                        <Input
                            id={`ins-id-${_id}`}
                            placeholder="Instrument ID"
                            className="customAddFormInputText"
                            onChange={(item: any) =>
                                handleInstrumentChange(
                                    "instrumentId",
                                    item.target.value,
                                    _id
                                )
                            }
                            value={data.instrumentId}
                            disabled={!isEdit}
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
                    <Form.Item id={`inst-amt-${_id}`}>
                        <Input
                            placeholder="Instrument Amount"
                            className="customAddFormInputText"
                            onKeyPress={(event: any) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                            maxLength="15"
                            onChange={(item: any) =>
                                handleInstrumentChange(
                                    "instrumentAmount",
                                    item.target.value,
                                    _id
                                )
                            }
                            value={data.instrumentAmount}
                            disabled={!isEdit}
                        />
                    </Form.Item>
                </div>
            </div>
            {_id !== 0 && (
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
                            onClick={() => onDelete(_id)}
                            danger
                            disabled={!isEdit}
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
