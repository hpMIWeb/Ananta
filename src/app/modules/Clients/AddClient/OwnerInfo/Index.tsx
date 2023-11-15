import styles from "./ownerInfo.module.scss";
import { Divider, Form, Space } from "antd";

import OwnerInfoCardBox from "../OwnerInfoCardBox/Index";
import { useEffect, useState } from "react";
import CardBottomAction from "./CardBottomAction";
import { filterObjectByKey } from "../../../../../utils/helpers";
import dayjs from "dayjs";

const OwnerInfo = ({
    onChange,
    setFormValue,
    clientType,
    clientValue,
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
        const existingData = form.getFieldsValue();
        const newIndex = existingData.ownerDetails.length;
        form.setFieldsValue({
            ownerDetails: [
                ...existingData.ownerDetails,
                {
                    _id: dayjs(new Date()).valueOf(),
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
            form.setFieldsValue({
                ownerDetails: formattedOwnerDetails,
            });
        }
    }, []);

    useEffect(() => {
        // set fields
        form.setFieldsValue({
            ownerInfoData: ownerInfoData,
        });
    }, [ownerInfoData]);

    const onDeleteCardClick = (cardIndex: any) => {
        const newOwnerInfoData = ownerInfoData.filter(
            (a, index: number) => index !== cardIndex
        );
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
                                <Space key={field.key}>
                                    <div
                                        style={{
                                            marginTop: 2,
                                        }}
                                        key={index}
                                        className="row"
                                    >
                                        <OwnerInfoCardBox
                                            form={form}
                                            index={index}
                                            field={field}
                                            displayNumber={index++}
                                            remove={remove}
                                            onDeleteCardClick={
                                                onDeleteCardClick
                                            }
                                            clientType={clientType}
                                        />
                                        <Divider></Divider>
                                    </div>
                                </Space>
                            ))}
                        </>
                    )}
                </Form.List>
                <div className="row">
                    <div className={styles.formFooterAction}>
                        <CardBottomAction
                            addCardClick={addMoreOwnerCard}
                            onChange={onChange}
                            firmType={clientValue.firmType}
                        />
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default OwnerInfo;
