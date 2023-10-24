import classNames from "classnames";
import styles from "./emergencyInfoCardBox.module.scss";
import { Form, InputNumber } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import Input from "../../../../../components/Input/Index";
import Button from "../../../../../components/Button/Index";
import Icon from "../../../../../components/Icon/Index";

const EmergencyInfoCardBox = ({
  index,
  displayNumber,
  field,
  branchDetailsFormValue,
  remove,
  canDelete,
  onDeleteCardClick,
  clientType,
  form,
}: any) => {
  return (
    <>
      <div className="col-12 col-md-12 col-lg-12">
        <div className="flex-shrink-0">
          <span className={styles.cardPointCounter}>{displayNumber + 1}</span>
        </div>
        <div className={classNames("row", styles.formFieldWrapper)}>
          <div
            className={classNames(
              "col-12 col-md-3 col-lg-3",
              styles.fieldPadding8
            )}
          >
            <div>
              <label style={{ marginBottom: 5 }} className="form-label">
                Contact Person
              </label>
              <Form.Item
                {...field}
                name={[field.name, "name"]}
                key={[field.fieldKey, "name"]}
                rules={[
                  {
                    pattern: /^[A-Za-z\s]+$/,
                    message: "Please enter alphabetic characters only.",
                  },
                ]}
              >
                <Input
                  id={`name-${field.key}`}
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
              <label style={{ marginBottom: 5 }} className="form-label">
                Relation
              </label>
              <Form.Item
                {...field}
                name={[field.name, "relation"]}
                key={[field.fieldKey, "relation"]}
                rules={[
                  {
                    pattern: /^[A-Za-z\s]+$/,
                    message: "Please enter alphabetic characters only.",
                  },
                ]}
              >
                <Input
                  id={`relation-${field.key}`}
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
              <label style={{ marginBottom: 5 }} className="form-label">
                Mobile
              </label>
              <Form.Item
                {...field}
                name={[field.name, "mobile"]}
                fieldKey={[field.fieldKey, "mobile"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const hasError = getFieldValue("mobile_hasError");
                      if (hasError) {
                        return Promise.reject(
                          new Error("Please enter a valid mobile number.")
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
              "col-12 col-md-2 col-lg-2",
              styles.fieldPadding8
            )}
          >
            <div>
              <label style={{ marginBottom: 5 }} className="form-label">
                Alternative Mobile
              </label>
              <Form.Item
                {...field}
                name={[field.name, "alternateMobile"]}
                fieldKey={[field.fieldKey, "alternateMobile"]}
              >
                <PhoneInput
                  containerClass="phoneNumberContainerClassInput"
                  country="in"
                  countryCodeEditable={false}
                  placeholder="Alt Mobile"
                  onChange={(data: any) => {
                    const { hasError, phoneNumber, countryCode } = data;
                    form.setFieldsValue({
                      alternateMobile_hasError: hasError,
                    });
                  }}
                />
              </Form.Item>
            </div>
          </div>
          {canDelete && (
            <div
              className={classNames("col-12 col-md-1 col-lg-1")}
              style={{ marginTop: "25px" }}
            >
              <div
                className={classNames(
                  "col-12 col-sm-6 col-md-1",
                  styles.instrumentFieldBox
                )}
              >
                <div>
                  <Button
                    className={classNames("cancelBtn", styles.deleteCardBtn)}
                    type="primary"
                    onClick={() => onDeleteCardClick(index)}
                    danger
                  >
                    <Icon height={14} width={14} name="trashIcon" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmergencyInfoCardBox;
