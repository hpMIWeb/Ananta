import classNames from "classnames";
import styles from "./paymentTabAddClient.module.scss";
import Input from "../../../../../components/Input/Index";
import { DatePicker, Form } from "antd";

const PaymentFieldRow = () => {
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
          <Form.Item name="instrumentType">
            <Input
              placeholder="Instrument Type"
              className="customAddFormInputText"
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
          "col-12 col-sm-6 col-md-3",
          styles.instrumentFieldBox
        )}
      >
        <div>
          <label className="form-label">Instrument Amount</label>
          <Form.Item name="instrumentAmount">
            <Input
              placeholder="Instrument Amount"
              className="customAddFormInputText"
            />
          </Form.Item>{" "}
        </div>
      </div>
    </div>
  );
};

export default PaymentFieldRow;
