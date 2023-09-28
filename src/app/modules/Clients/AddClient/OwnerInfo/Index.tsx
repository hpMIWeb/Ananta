import styles from "./ownerInfo.module.scss";
import { Form } from "antd";

import OwnerInfoCardBox from "../OwnerInfoCardBox/Index";
import { useState } from "react";
import CardBottomAction from "./CardBottomAction";
import { filterObjectByKey } from "../../../../../utils/helpers";

const OwnerInfo = ({ onChange, setFormValue, clientType }: any) => {
    const [form] = Form.useForm();
    const [ownerInfoData, setOwnerInfoData] = useState([
        { type: "default", index: 0, name: "index0" },
    ]);
    const onFinish = (value: any) => {
        const filteredValue = filterObjectByKey(
            value.ownerDetails,
            ownerInfoData.map((a) => a.name)
        );

        setFormValue({ ownerDetails: Object.values(filteredValue) });
        onChange(5);
    };

    const ownerDetailsFormValue = Form.useWatch("ownerDetails", form) || {};

    const addMoreOwnerCard = () => {
        setOwnerInfoData((prev) => [
            ...prev,
            {
                type: "new",
                index: ownerInfoData.length,
                name: `index${ownerInfoData.length}`,
            },
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
                            {ownerInfoData.map((field, index) => (
                                <div
                                    style={{ marginTop: 2 }}
                                    key={index}
                                    className="row"
                                >
                                    {/* {form.type === "new" && (
                    <hr className={styles.ownerInfoCardLine} />
                  )} */}
                                    <OwnerInfoCardBox
                                        index={index}
                                        field={field}
                                        remove={remove}
                                        //  canDelete={form.type === "new"}
                                        onDeleteCardClick={onDeleteCardClick}
                                        clientType={clientType}
                                    />
                                </div>
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
