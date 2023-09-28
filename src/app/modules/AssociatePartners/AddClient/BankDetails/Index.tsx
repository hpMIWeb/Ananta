import styles from "./bankdetails.module.scss";
import Switch from "../../../../../components/Switch/Index";
import { Form } from "antd";
import CardBottomAction from "../OwnerInfo/CardBottomAction";
import { useState } from "react";
import BankInfoCard from "./BankInfoCard";
import { filterObjectByKey } from "../../../../../utils/helpers";

const initialBankInfoData = [{ type: "default", index: 0, name: "index0" }];

const BankDetails = ({ onChange, setFormValue }: any) => {
  const [form] = Form.useForm();
  const [bankInfoData, setBankInfoData] = useState<any>([]);
  const [bankChecked, setBankChecked] = useState(false);

  const onFinish = (value: any) => {
    const filteredValue = filterObjectByKey(
      value.clientBankDetails,
      bankInfoData.map((a: any) => a.name)
    );
    setFormValue({ clientBankDetails: Object.values(filteredValue) });
    onChange(4);
  };

  const bankDetailsFormValue = Form.useWatch("clientBankDetails", form) || {};

  const addMoreOwnerCard = () => {
    setBankInfoData((prev: any) => [
      ...prev,
      {
        type: "new",
        index: bankInfoData.length,
        name: `index${bankInfoData.length}`,
      },
    ]);
  };

  const onDeleteCardClick = (cardIndex: boolean) => {
    const newOwnerInfoData = bankInfoData.filter(
      (a: any) => a.index !== cardIndex
    );
    setBankInfoData(newOwnerInfoData);
  };

  const handleBankChecked = (cheked: boolean) => {
    setBankChecked(cheked);
    if (cheked) {
      setBankInfoData(initialBankInfoData);
    } else {
      setBankInfoData([]);
    }
  };

  return (
    <div>
      <Form
        name="basic"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        requiredMark={false}
        className="customAddForm"
      >
        <div className={styles.featureCheckBoxLabelWrapper}>
          <Switch
            onChange={(e: any) => handleBankChecked(e)}
            size="small"
            className="smallCheckBox"
          ></Switch>
          <label className={styles.featureCheckBoxLabel}>Bank Details</label>
        </div>
        <div className={styles.bankesContentWrapper}>
          <Form.List name="clientBankDetails">
            {(fields, { add, remove }) => (
              <>
                {bankInfoData.map((field: any, index: number) => (
                  <BankInfoCard
                    index={index}
                    field={field}
                    remove={remove}
                    bankDetailsFormValue={bankDetailsFormValue[field.name]}
                    onDeleteCardClick={onDeleteCardClick}
                  />
                ))}
              </>
            )}
          </Form.List>

          {!!bankChecked && (
            <CardBottomAction
              addCardClick={addMoreOwnerCard}
              onChange={onChange}
            />
          )}
        </div>
      </Form>
    </div>
  );
};

export default BankDetails;
