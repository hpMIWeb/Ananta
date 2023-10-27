import styles from "./ownerInfo.module.scss";
import { Divider, Form } from "antd";

import OwnerInfoCardBox from "../OwnerInfoCardBox/Index";
import { useEffect, useState } from "react";
import CardBottomAction from "./CardBottomAction";
import { filterObjectByKey } from "../../../../../utils/helpers";
import moment from "moment";
moment.locale("en"); // Replace 'en' with your desired locale
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
    setFormValue(value);
    onChange(5);
  };
  // Set the locale

  const addMoreOwnerCard = () => {
    setOwnerInfoData((prev) => [
      ...prev,
      {
        type: "new",
        index: ownerInfoData.length + 1,
        name: `index${ownerInfoData.length + 1}`,
      },
    ]);
    const existingData = form.getFieldsValue();
    const newIndex = existingData.ownerDetails.length;
    form.setFieldsValue({
      ownerDetails: [
        ...existingData.ownerDetails,
        {
          type: "new",
          index: newIndex,
          name: `index${newIndex}`,
        },
      ],
    });
  };

  useEffect(() => {
    // set fields
    form.setFieldsValue({
      ownerDetails: ownerInfoData,
    });
  }, [ownerInfoData]);

  useEffect(() => {
    // set fields
    form.setFieldsValue({
      ownerDetails: ownerInfoData,
    });
  }, [ownerInfoData]);

  useEffect(() => {
    if (selectedClientData && selectedClientData.ownerDetails) {
      // Loop through the array and format the date strings with 'moment'
      const formattedOwnerDetails = selectedClientData.ownerDetails.map(
        (owner: any) => {
          if (owner.birthDate) {
            return {
              ...owner,
              birthDate: moment(owner.birthDate),
            };
          }
          return owner;
        }
      );
      console.log("formattedOwnerDetails");

      setOwnerInfoData(formattedOwnerDetails);
      form.setFieldsValue({
        ownerDetails: formattedOwnerDetails,
      });
    }
  }, []);

  const onDeleteCardClick = (cardIndex: any) => {
    const newOwnerInfoData = ownerInfoData.filter((a) => a.index !== cardIndex);
    setOwnerInfoData(newOwnerInfoData);
    form.setFieldsValue({
      ownerDetails: newOwnerInfoData,
    });
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
