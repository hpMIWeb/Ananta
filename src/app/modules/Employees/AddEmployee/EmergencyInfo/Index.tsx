import styles from "./emergencyInfo.module.scss";
import { Form } from "antd";
import { useEffect, useState } from "react";
import CardBottomAction from "./CardBottomAction";
import EmergencyInfoCardBox from "../EmergencyInfoCardBox/Index";
import { filterObjectByKey } from "../../../../../utils/helpers";

const EmergencyInfo = ({
  onChange,
  setEmployeeInfo,
  loading,
  selectedEmployeeData,
}: any) => {
  const [form] = Form.useForm();
  const [emergencyInfoData, setEmergencyInfoData] = useState([
    { type: "default", index: 0, name: "index0" },
  ]);

  const onFinish = (value: any) => {
    const filteredValue = filterObjectByKey(
      value,
      emergencyInfoData.map((a: any) => a.name)
    );

    console.log("value", value);
    console.log(filteredValue);
    setEmployeeInfo({ emergencyDetails: Object.values(filteredValue) });
    // onChange(6, { emergencyDetails: Object.values(filteredValue) });
  };

  useEffect(() => {
    if (selectedEmployeeData && selectedEmployeeData.emergencyDetails) {
      console.log("Nnkn");
      setEmergencyInfoData(selectedEmployeeData.emergencyDetails);
      form.setFieldsValue({
        emergencyDetails: selectedEmployeeData.emergencyDetails,
      });
    }
  }, []);

  const addMoreOwnerCard = () => {
    const newIndex = emergencyInfoData.length;
    setEmergencyInfoData((prev) => [
      ...prev,
      {
        type: "new",
        index: newIndex,
        name: `index${newIndex}`,
      },
    ]);
  };

  useEffect(() => {
    // set fields
    form.setFieldsValue({
      emergencyDetails: emergencyInfoData,
    });
  }, [emergencyInfoData]);

  const onDeleteCardClick = (cardIndex: any) => {
    const newOwnerInfoData = emergencyInfoData.filter(
      (a) => a.index !== cardIndex
    );
    setEmergencyInfoData(newOwnerInfoData);
    form.setFieldsValue({
      emergencyDetails: newOwnerInfoData,
    });
  };
  return (
    <div>
      <Form
        name="basic"
        form={form}
        // initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        requiredMark={false}
        className="customAddForm"
      >
        <Form.List name="emergencyDetails">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div style={{ marginTop: 2 }} key={index} className="row">
                  <EmergencyInfoCardBox
                    form={form}
                    index={index}
                    displayNumber={index++}
                    field={field}
                    remove={remove}
                    canDelete={true}
                    onDeleteCardClick={onDeleteCardClick}
                  />
                  <hr className={styles.ownerInfoCardLine} />
                </div>
              ))}
            </>
          )}
        </Form.List>

        <div className="row">
          <div className={styles.formFooterAction}>
            <CardBottomAction
              showAdd={true}
              loading={loading}
              addCardClick={addMoreOwnerCard}
              onChange={onChange}
              primaryButtonText="Save"
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default EmergencyInfo;
