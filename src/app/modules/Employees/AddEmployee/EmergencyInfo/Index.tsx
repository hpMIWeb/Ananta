import styles from "./emergencyInfo.module.scss";
import { Form } from "antd";
import { useState } from "react";
import CardBottomAction from "./CardBottomAction";
import EmergencyInfoCardBox from "../EmergencyInfoCardBox/Index";
import { filterObjectByKey } from "../../../../../utils/helpers";

const EmergencyInfo = ({ onChange, setEmployeeInfo, loading }: any) => {
    const [form] = Form.useForm();
    const [ownerInfoData, setOwnerInfoData] = useState([
        { type: "default", index: 0 },
    ]);

    const onFinish = (value: any) => {
        // const mobilePhoneNumber = value.mobile.phoneNumber;
        // const formattedMobilePhoneNumber = mobilePhoneNumber.replace("-", "");
        // const combinedMobile = `${
        //     value.mobile.validData.countryCode || "+91"
        // }${formattedMobilePhoneNumber}`;

        // const alternateMobilePhoneNumber = value.alternateMobile.phoneNumber;
        // const combinedAlternateMobile = alternateMobilePhoneNumber
        //     ? `${
        //           value.alternateMobile.countryCode || "+91"
        //       }${alternateMobilePhoneNumber}`
        //     : null;
        const emergencyDetails = {
            ...value,
            mobile: value.mobile?.replace(/-/g, ""),
            alternateMobile: value.alternateMobile?.replace(/-/g, ""),
        };
        const filteredValue = filterObjectByKey(
            value.ownerDetails,
            ownerInfoData.map((a: any) => a.name)
        );

        setEmployeeInfo({ emergencyDetails: Object.values(filteredValue) });
        onChange(6, { emergencyDetails });
    };

    const addMoreOwnerCard = () => {
        setOwnerInfoData((prev) => [
            ...prev,
            { type: "new", index: ownerInfoData.length },
        ]);
    };

    const onDeleteCardClick = (cardIndex: any) => {
        const newOwnerInfoData = ownerInfoData.filter(
            (a) => a.index !== cardIndex
        );
        setOwnerInfoData(newOwnerInfoData);
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
                <div style={{ marginTop: 2 }} className="row">
                    <EmergencyInfoCardBox
                        form={form}
                        onDeleteCardClick={onDeleteCardClick}
                    />
                </div>
                <div className="row">
                    <div className={styles.formFooterAction}>
                        <CardBottomAction
                            showAdd={false}
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
