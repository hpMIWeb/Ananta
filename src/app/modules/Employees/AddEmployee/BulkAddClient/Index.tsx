import addSubImg from "../../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";
import styles from "./bulkAddEmployee.module.scss";
import { useNavigate } from "react-router-dom";
import Button from "../../../../../components/Button/Index";
import { Checkbox, Form } from "antd";
import Icon from "../../../../../components/Icon/Index";

const BulkAddEmployee = () => {
    const navigation = useNavigate();

    const handleBulkClick = () => {
        navigation("/employee/create");
    };

    const onFinish = () => {};
    const onFinishFailed = () => {};

    const onChange = (key: number, formValue: any) => {};

    return (
        <div
            className={classNames("card mb-3", styles.addPromoCodeCardWrapper)}
        >
            <div
                className={classNames(
                    "card-header d-flex",
                    styles.promoCodeCardHeaderBox
                )}
                style={{ minHeight: 90 }}
            >
                <div className="d-flex align-items-center w-100">
                    <div className="me-auto">
                        <h5
                            className={classNames(
                                "my-2 text-white position-relative z-index-1",
                                styles.addPromoCodeLabel
                            )}
                        >
                            Add in Bulk
                        </h5>
                    </div>
                    <div className="ms-auto z-index-1">
                        <Button
                            onClick={handleBulkClick}
                            className={styles.newPromoBtn}
                        >
                            Add Employee
                        </Button>
                    </div>
                </div>
                <div
                    style={{
                        backgroundImage: `url(${addSubImg})`,
                    }}
                    className={classNames(
                        "rounded-3 rounded-bottom-0",
                        styles.addPromoCodeImg
                    )}
                ></div>
            </div>
            <div className={styles.addEmployeeDetailBox}>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    requiredMark={false}
                    className="customAddForm"
                >
                    <div className="row align-items-center">
                        <div className="col">
                            <label className="form-label">Select Form:</label>
                            <div className="row g-2 mb-3">
                                <div className="col-12">
                                    <Checkbox onChange={() => onChange}>
                                        Branch Details
                                    </Checkbox>
                                    <Checkbox onChange={() => onChange}>
                                        Bank Details
                                    </Checkbox>
                                    <Checkbox onChange={() => onChange}>
                                        Owner Details
                                    </Checkbox>
                                    <Checkbox onChange={() => onChange}>
                                        Subscription
                                    </Checkbox>
                                    <Checkbox onChange={() => onChange}>
                                        Vault
                                    </Checkbox>
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="d-flex">
                                <Button
                                    className="primaryBlueBtn me-1 mb-1"
                                    // onClick={() => onChange(2)}
                                    type="primary"
                                >
                                    Export
                                </Button>
                                <Button
                                    className="primaryLightGreenBtn mb-1"
                                    //   onClick={() => onChange(2)}
                                    type="primary"
                                >
                                    Import
                                </Button>
                            </div>
                        </div>
                        <div className="col-12"></div>
                        <div className="col-12">
                            <Button
                                className="primaryBlueBtn me-2 mt-2"
                                //   onClick={() => onChange(2)}
                                type="primary"
                            >
                                <span style={{ marginRight: 5 }}>
                                    <Icon
                                        width={12.25}
                                        height={14}
                                        name="plus"
                                    />
                                </span>
                                New
                            </Button>
                            <Button
                                className="primaryLightGreenBtn mb-1"
                                // onClick={() => onChange(2)}
                                type="primary"
                            >
                                <span style={{ marginRight: 5 }}>
                                    <Icon
                                        width={12.25}
                                        height={14}
                                        name="plus"
                                    />
                                </span>
                                Save
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default BulkAddEmployee;
