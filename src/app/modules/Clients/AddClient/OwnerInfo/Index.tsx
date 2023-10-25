import styles from "./ownerInfo.module.scss";
import { Divider, Form } from "antd";

import OwnerInfoCardBox from "../OwnerInfoCardBox/Index";
import { useEffect, useState } from "react";
import CardBottomAction from "./CardBottomAction";
import { filterObjectByKey } from "../../../../../utils/helpers";
import dayjs from "dayjs";

const OwnerInfo = ({
  onChange,
  setFormValue,
  clientType,
  selectedClientData,
}: any) => {
  const [form] = Form.useForm();
  const [ownerInfoData, setOwnerInfoData] = useState([
    { type: "default", index: 1, name: "index1" },
  ]);
  const onFinish = (value: any) => {
    const filteredValue = filterObjectByKey(
      value.ownerDetails,
      ownerInfoData.map((a) => a.name)
    );

    setFormValue({ ownerDetails: Object.values(filteredValue) });
    onChange(5);
  };

  const addMoreOwnerCard = () => {
    setOwnerInfoData((prev) => [
      ...prev,
      {
        type: "new",
        index: ownerInfoData.length + 1,
        name: `index${ownerInfoData.length + 1}`,
      },
    ]);
  };

  useEffect(() => {
    // set fields
    form.setFieldsValue({
      ownerDetails: ownerInfoData,
    });
  }, [ownerInfoData]);

  const onDeleteCardClick = (cardIndex: any) => {
    const newOwnerInfoData = ownerInfoData.filter((a) => a.index !== cardIndex);
    setOwnerInfoData(newOwnerInfoData);
  };

  useEffect(() => {
    // if (selectedClientData && selectedClientData.ownerDetails) {
    //   setOwnerInfoData(selectedClientData.ownerDetails);
    //   form.setFieldsValue({
    //     ownerDetails: selectedClientData.ownerDetails,
    //   });
    // }
  }, []);

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
        <Form.List name="ownerDetails">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <>
                  {index !== 0 && <Divider type="horizontal" />}
                  <div
                    style={{
                      marginTop: 2,
                    }}
                    key={index}
                    className="row"
                  >
                    <OwnerInfoCardBox
                      index={index}
                      field={field}
                      remove={remove}
                      onDeleteCardClick={onDeleteCardClick}
                      clientType={clientType}
                    />
                  </div>
                </>
              ))}
            </>
          )}
        </Form.List>
        <div className="row">
          <div className={styles.formFooterAction}>
            <CardBottomAction
              addCardClick={addMoreOwnerCard}
              onChange={onChange}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default OwnerInfo;
