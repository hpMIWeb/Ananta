import classNames from "classnames";
import React, { memo, useEffect, useState } from "react";
import styles from "./paymentTabAddClient.module.scss";
import Input from "../../../../../components/Input/Index";
import Button from "../../../../../components/Button/Index";
import Icon from "../../../../../components/Icon/Index";
import { DatePicker, Form, Select } from "antd";

const PaymentFieldRow = ({
  onDelete,
  instrumentIndex,
  handleInstrumentChange,
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
          <Form.Item id={`name-${instrumentIndex}`}>
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
                handleInstrumentChange("instrumentType", value, instrumentIndex)
              }
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
          <Form.Item id={`date-${instrumentIndex}`}>
            <DatePicker
              placeholder="Instrument Date"
              className="customFormDatePicker"
              format="DD/MM/YYYY"
              onChange={(value) =>
                handleInstrumentChange("instrumentDate", value, instrumentIndex)
              }
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
          <Form.Item id={`ins-id-${instrumentIndex}`}>
            <Input
              id={`ins-id-${instrumentIndex}`}
              placeholder="Instrument ID"
              className="customAddFormInputText"
              onChange={(item: any) =>
                handleInstrumentChange(
                  "instrumentId",
                  item.target.value,
                  instrumentIndex
                )
              }
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
          <Form.Item id={`inst-amt-${instrumentIndex}`}>
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
                  instrumentIndex
                )
              }
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
              className={classNames("cancelBtn", styles.deleteCardBtn)}
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
