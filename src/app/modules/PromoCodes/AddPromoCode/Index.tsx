import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";
import styles from "./addPromoCode.module.scss";
import Switch from "../../../components/ui/Switch/Index";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPromocodeReducersListApi } from "../../../../redux/getPromocodeReducers";
import { createPromoCodeApi } from "../../../../redux/createPromoCodeReducers";
import { useEffect, useState } from "react";
import moment from "moment";
import { useAppDispatch } from "../../../../states/store";

const AddPromoCode = () => {
    const { promocodeId } = useParams();
    const dispatch = useAppDispatch();
    const navigation = useNavigate();
    const [form] = Form.useForm();
    const [couponType, setCouponType] = useState("Percentage");
    const getPromocodeListSuccess = useSelector(
        (state: any) => state.getPromocodeList.success
    );
    const getPromocodeList = useSelector(
        (state: any) => state.getPromocodeList.data
    );
    const { loading, success } = useSelector(
        (state: any) => state.createPromoCode
    );

    useEffect(() => {
        const params = { userCategory: "", userEmail: "", orderPrice: 0 };
        params.userCategory = "ca";
        params.userEmail = "ABC@yopmail.com";
        params.orderPrice = 1200;
        if (!getPromocodeListSuccess) {
            dispatch(getPromocodeReducersListApi());
        }
    }, []);

    const onFinish = (e: any) => {
        dispatch(
            createPromoCodeApi({
                payload: { ...e, subscribers_count: 0, promoId: promocodeId },
                promoId: promocodeId,
            })
        );
    };

    const validateDiscountAmount = (_: any, value: any) => {
        if (
            couponType === "Percentage" &&
            (isNaN(value) || parseFloat(value) > 100)
        ) {
            return Promise.reject(
                new Error(
                    "Discount Amount should not be greater than 100 for Percentage coupon type"
                )
            );
        }
        return Promise.resolve();
    };

    useEffect(() => {
        if (getPromocodeList.length && promocodeId) {
            const currentCardDetail = getPromocodeList.find(
                (s: any) => s._id === promocodeId
            );
            form.setFieldsValue({
                ...currentCardDetail,
                endDateTime: moment(currentCardDetail?.endDateTime),
                startDateTime: moment(currentCardDetail?.startDateTime),
            });
        }
    }, [getPromocodeList, promocodeId, form]);

    useEffect(() => {
        if (success) {
            navigation("/promocodes");
        }
    }, [success]);

    const onCancelClick = () => {
        navigation("/promocodes");
    };
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
                            {!promocodeId
                                ? "Add Promo Code"
                                : "Edit Promo Code"}
                        </h5>
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
            <div className={styles.addPromoCodeFormWrapper}>
                <Form
                    form={form}
                    name="basic"
                    initialValues={{
                        remember: true,
                        type: "Percentage",
                        userTypes: "all",
                        userCategory: "Accountant",
                        status: "Active",
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                    requiredMark={false}
                    className="customAddForm"
                >
                    <div className="formFieldRowWrapper formAddPromoWrapper">
                        <div className="col-auto formLabelWrapper">
                            <label className="form-label">
                                Coupon Code Name
                            </label>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                            <Form.Item
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your Coupon Code Name!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Coupon Code Name"
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="formFieldRowWrapper formAddPromoWrapper">
                        <div className="col-auto formLabelWrapper">
                            <label className="form-label">
                                Coupon Description
                            </label>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                            <Form.Item
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your Coupon Description!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Coupon Description"
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="formFieldRowWrapper formAddPromoWrapper">
                        <div className="col-auto formLabelWrapper">
                            <label className="form-label">Coupon Type</label>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                            <Form.Item
                                name="type"
                                className="customAddFormSelectPeriodOptions"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your Coupon Type!",
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue="Percentage"
                                    style={{ height: 33 }}
                                    options={[
                                        {
                                            value: "Percentage",
                                            label: "Percentage",
                                        },
                                        { value: "Price", label: "Price" },
                                    ]}
                                    onChange={(value) => setCouponType(value)}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="formFieldRowWrapper formAddPromoWrapper">
                        <div className="col-auto formLabelWrapper">
                            <label className="form-label">
                                Discount Amount
                            </label>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                            <Form.Item
                                name="ammount"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your Discount Amount!",
                                    },
                                    { validator: validateDiscountAmount },
                                ]}
                            >
                                <InputNumber
                                    placeholder="Discount Amount"
                                    className="customInputNumber"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="formFieldRowWrapper formAddPromoWrapper">
                        <div className="col-auto formLabelWrapper">
                            <label className="form-label">
                                Maximum Discount Value
                            </label>
                        </div>
                        <div
                            style={{ marginLeft: "-8px" }}
                            className="col-12 col-sm-6 col-md-4 formInputWrapper"
                        >
                            <Form.Item
                                name="maxDiscount"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your Maximum Discount Value!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Maximum Discount Value"
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="formFieldRowWrapper formAddPromoWrapper">
                        <div className="col-auto formLabelWrapper">
                            <label className="form-label">
                                Maximum Order Value
                            </label>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                            <Form.Item
                                name="orderValue"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your Maximum Order Value!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Maximum Order Value"
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="formFieldRowWrapper formAddPromoWrapper">
                        <div className="col-auto formLabelWrapper">
                            <label className="form-label">
                                Start Date & Time
                            </label>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                            <Form.Item
                                name="startDateTime"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your Start Date & Time!",
                                    },
                                ]}
                            >
                                <DatePicker
                                    placeholder="Start Date & Time"
                                    className="customFormDatePicker"
                                    format="DD/MM/YYYY"
                                    showTime
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="formFieldRowWrapper formAddPromoWrapper">
                        <div className="col-auto formLabelWrapper">
                            <label className="form-label">
                                End Date & Time
                            </label>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                            <Form.Item
                                name="endDateTime"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your End Date & Time!",
                                    },
                                ]}
                            >
                                <DatePicker
                                    placeholder="End Date & Time"
                                    className="customFormDatePicker"
                                    format="DD/MM/YYYY"
                                    showTime
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="formFieldRowWrapper formAddPromoWrapper">
                        <div className="col-auto formLabelWrapper">
                            <label className="form-label">User Type</label>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                            <Form.Item
                                name="userTypes"
                                className="customAddFormSelectPeriodOptions"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter your User Type!",
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue="all"
                                    style={{ height: 33 }}
                                    options={[
                                        { value: "all", label: "All" },
                                        {
                                            value: "Existing User",
                                            label: "Existing User",
                                        },
                                        {
                                            value: "New User",
                                            label: "New User",
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="formFieldRowWrapper formAddPromoWrapper">
                        <div className="col-auto formLabelWrapper">
                            <label className="form-label">User Category</label>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                            <Form.Item
                                name="userCategory"
                                className="customAddFormSelectPeriodOptions"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your User Category!",
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue="Accountant"
                                    style={{ height: 33 }}
                                    options={[
                                        {
                                            value: "Accountant",
                                            label: "Accountant",
                                        },
                                        { value: "ca", label: "CA" },
                                        {
                                            value: "Tax Consultant",
                                            label: "Tax Consultant",
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="formFieldRowWrapper formAddPromoWrapper">
                        <div className="col-auto formLabelWrapper">
                            <label className="form-label">Life of Code</label>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                            <Form.Item
                                name="codeLife"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your Life of Code!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Life of Code"
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="formFieldRowWrapper formAddPromoWrapper">
                        <div className="col-auto formLabelWrapper">
                            <label className="form-label">Use per User</label>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                            <Form.Item
                                name="userPerUser"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your Use per User!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Use per User"
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="formFieldRowWrapper formAddPromoWrapper">
                        <div className="col-auto formLabelWrapper">
                            <label className="form-label">
                                Terms & Conditions
                            </label>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                            <Form.Item
                                name="termsAndConditions"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your Terms & Conditions!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Terms & Conditions"
                                    className="customAddFormInputText"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="formFieldRowWrapper formAddPromoWrapper">
                        <div className="col-auto formLabelWrapper">
                            <label className="form-label">Status</label>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                            <Form.Item
                                name="status"
                                className="customAddFormSelectPeriodOptions"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your Period Type!",
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue="Active"
                                    style={{ height: 33 }}
                                    options={[
                                        { value: "Active", label: "Active" },
                                        {
                                            value: "Inactive",
                                            label: "Inactive",
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="formFieldRowWrapper formAddPromoWrapper">
                        <div className="col-auto formLabelWrapper">
                            <label className="form-label">
                                Display on Portal
                            </label>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                            <div className={styles.featureCheckBoxLabelWrapper}>
                                <Form.Item
                                    name="display"
                                    className="customAddFormSelectPeriodOptions"
                                >
                                    <Switch
                                        size="small"
                                        defaultValue={true}
                                        className="smallCheckBox"
                                    ></Switch>
                                    <label
                                        className={styles.featureCheckBoxLabel}
                                    >
                                        Yes
                                    </label>
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 my-2 text-end">
                            <Form.Item>
                                {promocodeId && (
                                    <Button
                                        className={styles.deleteBtn}
                                        type="primary"
                                        danger
                                    >
                                        Delete
                                    </Button>
                                )}
                                <Button
                                    onClick={onCancelClick}
                                    className={styles.deleteBtn}
                                    type="primary"
                                    danger
                                >
                                    Cancel
                                </Button>
                                <Button
                                    loading={loading}
                                    type="primary"
                                    htmlType="submit"
                                >
                                    {!promocodeId
                                        ? "Add Promo Code"
                                        : "Edit Promo Code"}
                                </Button>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default AddPromoCode;
