import styles from "./emergencyInfo.module.scss";
import { Form } from "antd";
import { useState } from "react";
import CardBottomAction from "./CardBottomAction";
import EmergencyInfoCardBox from "../EmergencyInfoCardBox/Index";
import { filterObjectByKey } from "../../../../../utils/helpers";

const EmergencyInfo = ({ onChange, setEmployeeInfo, loading }: any) => {
    const [form] = Form.useForm();
    const [emergencyInfoData, setEmergencyInfoData] = useState([
        { type: "default", index: 0 },
    ]);

    const onFinish = (value: any) => {
        const emergencyDetails = {
            ...value,
            mobile: value.mobile?.replace(/-/g, ""),
            alternateMobile: value.alternateMobile?.replace(/-/g, ""),
        };
        console.log("emergencyDetails", emergencyDetails);
        const filteredValue = filterObjectByKey(
            value.emergencyDetails,
            emergencyInfoData.map((a: any) => a.name)
        );

        console.log("filteredValue", filteredValue);
        setEmployeeInfo({ emergencyDetails: Object.values(emergencyDetails) });
        onChange(6, { emergencyDetails: Object.values(emergencyDetails) });
    };

    const addMoreOwnerCard = () => {
        setEmergencyInfoData((prev) => [
            ...prev,
            {
                type: "new",
                index: emergencyInfoData.length,
                name: `index${emergencyInfoData.length}`,
            },
        ]);
    };

    const onDeleteCardClick = (cardIndex: any) => {
        const newOwnerInfoData = emergencyInfoData.filter(
            (a) => a.index !== cardIndex
        );
        setEmergencyInfoData(newOwnerInfoData);
    };
    return (
        <div>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                requiredMark={false}
                className="customAddForm"
            >
                <Form.List name="ownerDetails">
                    {(fields, { add, remove }) => (
                        <>
                            {emergencyInfoData.map((field, index) => (
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
                                        canDelete={field.type === "new"}
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
