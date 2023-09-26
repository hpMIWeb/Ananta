import styles from "./bankdetails.module.scss";
import { Form } from "antd";
import CardBottomAction from "../EmergencyInfo/CardBottomAction";
import { useState } from "react";
import BankInfoCard from "./BankInfoCard";

const BankDetails = ({ onChange, setEmployeeInfo }: any) => {
    const [bankInfoData, setBankInfoData] = useState<any>([]);

    const onFinish = (value: any) => {
        setEmployeeInfo({ clientBankDetails: value });
        onChange(5);
    };

    const addMoreOwnerCard = () => {
        setBankInfoData((prev: any) => [
            ...prev,
            { type: "new", index: bankInfoData.length },
        ]);
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
                <BankInfoCard />

                <CardBottomAction
                    showAdd={false}
                    addCardClick={addMoreOwnerCard}
                    onChange={onChange}
                />
            </Form>
        </div>
    );
};

export default BankDetails;
