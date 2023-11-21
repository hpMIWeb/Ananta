import { Button, Form, Input, Select, Switch } from "antd";
import classNames from "classnames";
import styles from "./newAddOns.module.scss";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AddOnTypeContent from "./AddOnTypeContent";
import { useDispatch, useSelector } from "react-redux";
import { createAddonsReducersApi } from "../../../../redux/createAddonsReducers";
import { getAddonsReducersListApi } from "../../../../redux/getAddonsReducers";
import FormContentSkeletonLoader from "../../../../components/FormContentSkeletonLoader/Index";
import { useAppDispatch } from "../../../states/store";
import Cookies from "js-cookie";
import { deleteAddonReducersApi } from "../../../../redux/deleteAddonReducers";

const NewAddOns = () => {
    const [selectedAddonType, setSelectedAddonType] = useState("Storage Space");
    const roleType = Cookies.get("roleTypeName");
    const dispatch = useAppDispatch();
    const navigation = useNavigate();
    const { state } = useLocation();
    const [form] = Form.useForm();

    const [addonsId, setAddonsId] = useState<string>("");
    const { data: addonsCardList, loading: addonsCardListLoading } =
        useSelector((state: any) => state.getAddonsList);
    const { loading, success } = useSelector((state: any) => state.createAddon);
    const { loading: deleteAddonLoading, success: deleteAddonCodeSuccess } =
        useSelector((state: any) => state.deleteAddon);

    useEffect(() => {
        if (!addonsCardList.length) {
            dispatch(getAddonsReducersListApi());
        }
    }, [addonsCardList]);

    const superAdminAddonType = [
        {
            value: "Storage Space",
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
            value: "Storage Space",
            label: "Storage Space",
        },
        {
            value: "Clients",
            label: "Clients",
        },
        {
            value: "Office Users",
            label: "Office Users",
        },
        {
            value: "Client Users",
            label: "Client Users",
        },
        {
            value: "Vendor Users",
            label: "Vendor Users",
        },
        {
            value: "Transactional Credit",
            label: "Transactional Credit",
        },
        {
            value: "Branches",
            label: "Branches",
        },
        {
            value: "Feature",
            label: "Feature",
        },
        {
            value: "turnover",
            label: "Turnover",
        },
        {
            value: "Sales And Purchase",
            label: "Sales And Purchase",
        },
        {
            value: "Credit And Debit notes",
            label: "Credit And Debit notes",
        },
        {
            value: "Receipt and payments",
            label: "Receipt and payments",
        },
        {
            value: "Contras",
            label: "Contras",
        },
        {
            value: "Journals",
            label: "Journals",
        },
        {
            value: "Stock Journals",
            label: "Stock Journals",
        },
        {
            value: "Transactional All",
            label: "Transactional All",
        },
    ];

    const addonTypeOption =
        roleType === "superadmin" ? superAdminAddonType : caAdminAddonType;

    const onFinish = (e: any) => {
        dispatch(
            createAddonsReducersApi({
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
        if (success || deleteAddonCodeSuccess) {
            navigation("/addons");
        }
    }, [success, deleteAddonCodeSuccess]);

    useEffect(() => {
        if (state) setAddonsId(state.id);
    }, []);

    const handleSwitchChange = (value: any) => {
        form.setFieldsValue({ display_on_portal: value });
    };
    const onCancelClick = () => {
        navigation("/addons");
    };

    const onDeleteClick = () => {
        dispatch(
            deleteAddonReducersApi({
                addonId: addonsId,
            })
        );
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
                style={{ minHeight: 60 }}
            >
                <div
                    className={classNames(
                        "d-flex align-items-center w-100",
                        styles.addOnsHeaderTitle
                    )}
                >
                    <div className="me-auto">
                        <h5
                            className={classNames(
                                "my-2 position-relative z-index-1",
                                styles.addSubscriptionLabel
                            )}
                        >
                            {!addonsId ? "Create New AddOn" : "Edit AddOn"}
                        </h5>
                    </div>
                    <div className={classNames("ms-auto z-index-1")}>
                        <Button
                            onClick={onCancelClick}
                            style={{
                                minWidth: 104,
                            }}
                            className="greyBtn"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
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
                                    {addonsId && (
                                        <Button
                                            onClick={onDeleteClick}
                                            className={styles.deleteBtn}
                                            type="primary"
                                            danger
                                        >
                                            Delete
                                        </Button>
                                    )}
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
