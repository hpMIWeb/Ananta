import { Button, Form, Input, Select, Switch } from "antd";
import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";
import styles from "./newAddOns.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AddOnTypeContent from "./AddOnTypeContent";
import { useDispatch, useSelector } from "react-redux";
import { createAddonsReducersReducersApi } from "../../../../redux/createAddonsReducers";
import { getAddonsReducersListApi } from "../../../../redux/getAddonsReducers";
import FormContentSkeletonLoader from "../../../../components/FormContentSkeletonLoader/Index";
import { useAppDispatch } from "../../../states/store";
import Cookies from "js-cookie";

const NewAddOns = () => {
    const [selectedAddonType, setSelectedAddonType] = useState("Storage Space");
    const { addonsId } = useParams();
    const roleType = Cookies.get("roleTypeName");
    const dispatch = useAppDispatch();
    const navigation = useNavigate();
    const [form] = Form.useForm();
    const { data: addonsCardList, loading: addonsCardListLoading } =
        useSelector((state: any) => state.getAddonsList);
    const { loading, success } = useSelector((state: any) => state.createAddon);

    useEffect(() => {
        if (!addonsCardList.length) {
            dispatch(getAddonsReducersListApi());
        }
    }, [addonsCardList]);

    const superAdminAddonType = [
        {
            value: "storage_space",
            label: "Storage Space",
        },
        {
            value: "No. Of Clients",
            label: "No. Of Clients",
        },
        {
            value: "No. Of Employees",
            label: "No. Of Employees",
        },
        {
            value: "No. Of Client Login",
            label: "No. Of Client Login",
        },
        {
            value: "No. Of Transactions",
            label: "No. Of Transactions",
        },
        {
            value: "Features List",
            label: "Features List",
        },
    ];
    const caAdminAddonType = [
        {
            value: "storage_space",
            label: "Storage Space",
        },
        {
            value: "client",
            label: "Clients",
        },
        {
            value: "office_users",
            label: "Office Users",
        },
        {
            value: "client_users",
            label: "Client Users",
        },
        {
            value: "vendor_users",
            label: "Vendor Users",
        },
        {
            value: "transactional_credit",
            label: "Transactional Credit",
        },
        {
            value: "branches",
            label: "Branches",
        },
        {
            value: "feature",
            label: "Feature",
        },
        {
            value: "turnover",
            label: "Turnover",
        },
        {
            value: "sales_and_purchase",
            label: "Sales And Purchase",
        },
        {
            value: "credit_and_debit_notes",
            label: "Credit And Debit notes",
        },
        {
            value: "recipt_and_payments",
            label: "Receipt and payments",
        },
        {
            value: "contras",
            label: "Contras",
        },
        {
            value: "journals",
            label: "Journals",
        },
        {
            value: "stock_journals",
            label: "Stock Journals",
        },
        {
            value: "transactional_all",
            label: "Transactional All",
        },
    ];

    const addonTypeOption =
        roleType === "superadmin" ? superAdminAddonType : caAdminAddonType;

    const onFinish = (e: any) => {
        console.log(e);
        dispatch(
            createAddonsReducersReducersApi({
                payload: { ...e, subscribers_count: 0 },
                addonsId: addonsId,
            })
        );
    };

    useEffect(() => {
        if (addonsCardList.length && addonsId) {
            const currentCardDetail = addonsCardList.find(
                (s: any) => s._id === addonsId
            );
            form.setFieldsValue(currentCardDetail);
        }
    }, [addonsCardList, addonsId, form]);

    useEffect(() => {
        if (success) {
            navigation("/subscription");
        }
    }, [success]);

    const handleSwitchChange = (value: any) => {
        form.setFieldsValue({ display_on_portal: value });
    };
    const onCancelClick = () => {
        navigation("/subscription");
    };

    const display_on_portal = Form.useWatch("display_on_portal", form);
    return (
        <div
            className={classNames(
                "card mb-3",
                styles.addSubscriptionCardWrapper
            )}
        >
            <div
                className={classNames(
                    "card-header d-flex",
                    styles.subscriptionCardHeaderBox
                )}
                style={{ minHeight: 90 }}
            >
                <div className="d-flex align-items-center w-100">
                    <div className="me-auto">
                        <h5
                            className={classNames(
                                "my-2 text-white position-relative z-index-1",
                                styles.addSubscriptionLabel
                            )}
                        >
                            {!addonsId ? "Add Addons" : "Edit Addons"}
                        </h5>
                    </div>
                </div>
                <div
                    style={{
                        backgroundImage: `url(${addSubImg})`,
                    }}
                    className={classNames(
                        "rounded-3 rounded-bottom-0",
                        styles.addSubscriptionImg
                    )}
                ></div>
            </div>
            <div className={styles.customAddFormWrapper}>
                {addonsCardListLoading && addonsId && (
                    <FormContentSkeletonLoader />
                )}
                {!(addonsCardListLoading && addonsId) && (
                    <Form
                        form={form}
                        name="basic"
                        initialValues={{
                            remember: true,
                            add_on_type: "Storage Space",
                            time_period_type: "DAY",
                            status: "Active",
                            display_on_portal: true,
                        }}
                        onFinish={onFinish}
                        autoComplete="off"
                        requiredMark={false}
                        className="customAddForm"
                    >
                        <div className="formFieldRowWrapper">
                            <div className="col-auto formLabelWrapper">
                                <label className="form-label">AddOn Type</label>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                <Form.Item
                                    name="add_on_type"
                                    className="customAddFormSelectPeriodOptions"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Enter your AddOn Type!",
                                        },
                                    ]}
                                >
                                    <Select
                                        style={{ height: 33 }}
                                        options={addonTypeOption}
                                        onChange={(value) =>
                                            setSelectedAddonType(value)
                                        }
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <AddOnTypeContent
                            selectedAddonType={selectedAddonType}
                        />

                        <div className="formFieldRowWrapper">
                            <div className="col-auto formLabelWrapper">
                                <label className="form-label">
                                    AddOn Title
                                </label>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                <Form.Item
                                    name="add_on_title"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Enter your AddOn Title!",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="AddOn Title"
                                        className="customAddFormInputText"
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="formFieldRowWrapper">
                            <div className="col-auto formLabelWrapper">
                                <label className="form-label">Validity</label>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                <div className="formPeriodWrapper">
                                    <Form.Item
                                        name="time_period"
                                        className="customAddFormSelect"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your Validity!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Validity"
                                            className="customAddFormInputText"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="time_period_type"
                                        className="customAddFormSelectOptions"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Select your Period Type!",
                                            },
                                        ]}
                                    >
                                        <Select
                                            defaultValue="Days"
                                            style={{ width: 130 }}
                                            options={[
                                                { value: "DAY", label: "Days" },
                                                {
                                                    value: "MONTH",
                                                    label: "Months",
                                                },
                                            ]}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>

                        <div className="formFieldRowWrapper">
                            <div className="col-auto formLabelWrapper">
                                <label className="form-label">Price</label>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                <Form.Item
                                    name="price"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter your Price!",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Price"
                                        className="customAddFormInputText"
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="formFieldRowWrapper">
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
                                            {
                                                value: "Active",
                                                label: "Active",
                                            },
                                            {
                                                value: "Inactive",
                                                label: "Inactive",
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="formFieldRowWrapper">
                            <div className="col-auto formLabelWrapper">
                                <label className="form-label">
                                    Display on Portal
                                </label>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                <div
                                    className={
                                        styles.featureCheckBoxLabelWrapper
                                    }
                                >
                                    <Switch
                                        checked={display_on_portal}
                                        defaultChecked
                                        size="small"
                                        onChange={handleSwitchChange}
                                        className="smallCheckBox"
                                    ></Switch>
                                    <label
                                        className={styles.featureCheckBoxLabel}
                                    >
                                        Yes
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 my-2 text-end">
                                <Form.Item>
                                    {addonsId && (
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
                                        style={{
                                            minWidth: 104,
                                            marginRight: 12,
                                        }}
                                        className="greyBtn"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        loading={loading}
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        {!addonsId ? "Add AddOns" : "Update"}
                                    </Button>
                                </Form.Item>
                            </div>
                        </div>
                    </Form>
                )}
            </div>
        </div>
    );
};

export default NewAddOns;
