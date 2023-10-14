import classNames from "classnames";
import styles from "./emergencyInfoCardBox.module.scss";
import { Form, InputNumber } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import Input from "../../../../../components/Input/Index";

const EmergencyInfoCardBox = ({ form }: any) => {
    return (
        <>
            <div className="col-12 col-md-12 col-lg-12">
                <div className={classNames("row", styles.formFieldWrapper)}>
                    <div
                        className={classNames(
                            "col-12 col-md-3 col-lg-3",
                            styles.fieldPadding8
                        )}
                    >
                        <div>
                            <label
                                style={{ marginBottom: 5 }}
                                className="form-label"
                            >
                                Contact Person
                            </label>
                            <Form.Item
                                name="name"
                                rules={[
                                    {
                                        pattern: /^[A-Za-z\s]+$/,
                                        message:
                                            "Please enter alphabetic characters only.",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Contact Person"
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div
                        className={classNames(
                            "col-12 col-md-3 col-lg-3",
                            styles.fieldPadding8
                        )}
                    >
                        <div>
                            <label
                                style={{ marginBottom: 5 }}
                                className="form-label"
                            >
                                Relation
                            </label>
                            <Form.Item
                                name="relation"
                                rules={[
                                    {
                                        pattern: /^[A-Za-z\s]+$/,
                                        message:
                                            "Please enter alphabetic characters only.",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Relation"
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div
                        className={classNames(
                            "col-12 col-md-3 col-lg-3",
                            styles.fieldPadding8
                        )}
                    >
                        <div>
                            <label
                                style={{ marginBottom: 5 }}
                                className="form-label"
                            >
                                Mobile
                            </label>
                            <Form.Item
                                name="mobile"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter your Mobile!",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const hasError =
                                                getFieldValue(
                                                    "mobile_hasError"
                                                );
                                            if (hasError) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Please enter a valid mobile number."
                                                    )
                                                );
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <PhoneInput
                                    containerClass="phoneNumberContainerClassInput"
                                    country="in"
                                    placeholder="Mobile"
                                    countryCodeEditable={false}
                                    onChange={(data: any) => {
                                        const { hasError } = data;
                                        form.setFieldsValue({
                                            mobile_hasError: hasError,
                                        });
                                    }}
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div
                        className={classNames(
                            "col-12 col-md-3 col-lg-3",
                            styles.fieldPadding8
                        )}
                    >
                        <div>
                            <label
                                style={{ marginBottom: 5 }}
                                className="form-label"
                            >
                                Alternative Mobile
                            </label>
                            <Form.Item
                                name="alternateMobile"
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                getFieldValue(
                                                    "alternateMobile_hasError"
                                                )
                                            ) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Please enter a valid number."
                                                    )
                                                );
                                            }
                                            if (!value) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Alternate mobile is required."
                                                    )
                                                );
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <PhoneInput
                                    containerClass="phoneNumberContainerClassInput"
                                    country="in"
                                    countryCodeEditable={false}
                                    placeholder="Alt Mobile"
                                    onChange={(data: any) => {
                                        const {
                                            hasError,
                                            phoneNumber,
                                            countryCode,
                                        } = data;
                                        form.setFieldsValue({
                                            alternateMobile_hasError: hasError,
                                        });
                                    }}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </div>
                <div className="row"></div>
            </div>
        </>
    );
};

export default EmergencyInfoCardBox;
