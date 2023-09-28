import classNames from "classnames";
import styles from "./vaultTabAddClient.module.scss";
import Input from "../../../../../components/Input/Index";
import { DatePicker, Form } from "antd";
import Select from "../../../../../components/Select/Index";

const PaymentFieldRow = () => {
  return (
    <div className={classNames("row", styles.paymentFormRow)}>
      <div className={classNames("col", styles.instrumentFieldBox)}>
        <div>
          <label className="form-label">Select Portal</label>
          <Form.Item name="portal">
            <Select
              options={[
                { value: "Anydesk", label: "Anydesk" },
                { value: "GST", label: "GST" },
                { value: "Income Tax", label: "Income Tax" },
                { value: "Mail", label: "Mail" },
                { value: "RDP", label: "RDP" },
                { value: "TDS", label: "TDS" },
                { value: "TeamViewr", label: "TeamViewr" },
              ]}
              placeholder="Select Portal"
            />
          </Form.Item>
        </div>
      </div>
      <div className={classNames("col", styles.instrumentFieldBox)}>
        <div>
          <label className="form-label">UserId</label>
          <Form.Item name="userId">
            <Input placeholder="UserId" className="customAddFormInputText" />
          </Form.Item>
        </div>
      </div>
      <div className={classNames("col", styles.instrumentFieldBox)}>
        <div>
          <label className="form-label">Password</label>
          <Form.Item name="password">
            <Input placeholder="Password" className="customAddFormInputText" />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default PaymentFieldRow;
