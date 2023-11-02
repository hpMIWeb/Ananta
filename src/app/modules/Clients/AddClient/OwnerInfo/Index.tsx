import styles from "./ownerInfo.module.scss";
import { Divider, Form } from "antd";

import OwnerInfoCardBox from "../OwnerInfoCardBox/Index";
import { useEffect, useState } from "react";
import CardBottomAction from "./CardBottomAction";
import { filterObjectByKey } from "../../../../../utils/helpers";
import dayjs from "dayjs";
interface IOwnerInfo {
    _id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    birthDate: string;
    membershipNo: string;
    email: string;
    mobile: string;
    altMobile: string;
}
const OwnerInfo = ({
    onChange,
    setFormValue,
    clientType,
    selectedClientData,
}: any) => {
    const [form] = Form.useForm();

    const [ownerInfoData, setOwnerInfoData] = useState<IOwnerInfo[]>([
        {
            _id: 1,
        } as IOwnerInfo,
    ]);

    const onFinish = (value: any) => {
        setFormValue({ ownerDetails: ownerInfoData });
        onChange(5, { ownerDetails: ownerInfoData });
    };
    // Set the locale

    const addMoreOwnerCard = () => {
        setOwnerInfoData((prev) => [
            ...prev,
            {
                _id: ownerInfoData.length + 1,
            } as IOwnerInfo,
        ]);
    };

    const handleOwnerInfoChange = (key: any, value: any, index: any) => {
        const ownerInfoRowsData = ownerInfoData.find((a) => a._id === index);
        if (ownerInfoRowsData) {
            const updatedOwnerInfoRowsData = {
                ...ownerInfoRowsData,
                [key]: value,
            };

            const updatedPaymentRowData = ownerInfoData.map((rowData) =>
                rowData._id === index ? updatedOwnerInfoRowsData : rowData
            );

            setOwnerInfoData(updatedPaymentRowData);
        }
    };

    useEffect(() => {
        if (selectedClientData && selectedClientData.ownerDetails) {
            // Loop through the array and format the date strings with 'moment'
            const formattedOwnerDetails = selectedClientData.ownerDetails.map(
                (owner: any) => {
                    if (owner.birthDate) {
                        return {
                            ...owner,
                            birthDate: dayjs(owner.birthDate),
                        };
                    }
                    return owner;
                }
            );

            setOwnerInfoData(formattedOwnerDetails);
        }
    }, []);

    const onDeleteCardClick = (cardIndex: any) => {
        const newOwnerInfoData = ownerInfoData.filter(
            (a) => a._id !== cardIndex
        );
        setOwnerInfoData(newOwnerInfoData);
    };

    return (
        <div>
            <Form
                name="basic"
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                requiredMark={false}
                className="customAddForm"
            >
                {ownerInfoData.map((owner, index: number) => (
                    <div
                        style={{
                            marginTop: 2,
                        }}
                        key={index}
                        className="row"
                    >
                        <OwnerInfoCardBox
                            key={index}
                            displayNumber={index}
                            onDelete={onDeleteCardClick}
                            _id={owner._id}
                            clientType
                            handleOwnerInfoChange={handleOwnerInfoChange}
                            data={owner}
                        />
                        <Divider></Divider>
                    </div>
                ))}
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
