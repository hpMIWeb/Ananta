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
    isEdit,
}: any) => {
    const [form] = Form.useForm();
    const [emergencyInfoData, setEmergencyInfoData] = useState([
        { type: "default", _id: 1, name: "index0" },
    ]);

    const onFinish = (value: any) => {
        setEmployeeInfo(value);
        onChange(6, value);
    };

    useEffect(() => {
        if (selectedEmployeeData && selectedEmployeeData.emergencyDetails) {
            setEmergencyInfoData(selectedEmployeeData.emergencyDetails);
            form.setFieldsValue({
                emergencyDetails: selectedEmployeeData.emergencyDetails,
            });
        }
    }, []);

    const addMoreOwnerCard = () => {
        const existingData = form.getFieldsValue();
        const newIndex = existingData.emergencyDetails.length + 1;
        form.setFieldsValue({
            emergencyDetails: [
                ...existingData.emergencyDetails,
                {
                    type: "new",
                    _id: newIndex,
                    name: `index${newIndex}`,
                },
            ],
        });
    };

    useEffect(() => {
        // set fields
        form.setFieldsValue({
            emergencyDetails: emergencyInfoData,
        });
    }, [emergencyInfoData]);

    const onDeleteCardClick = (cardIndex: any) => {
        const newOwnerInfoData = emergencyInfoData.filter(
            (a) => a._id !== cardIndex
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
                                <div
                                    style={{ marginTop: 2 }}
                                    key={index}
                                    className="row"
                                >
                                    <EmergencyInfoCardBox
                                        form={form}
                                        index={index}
                                        displayNumber={index++}
                                        field={field}
                                        remove={remove}
                                        canDelete={true}
                                        onDeleteCardClick={onDeleteCardClick}
                                        isEdit={isEdit}
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
                            previousTab={4}
                            primaryButtonText="Save"
                            isEdit={isEdit}
                        />
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default EmergencyInfo;
