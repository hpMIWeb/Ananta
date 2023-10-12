import classNames from "classnames";
import styles from "./addAssociatePartner.module.scss";
import Tabs from "../../../../components/Tabs/Index";
import Button from "../../../../components/Button/Index";
import { useEffect, useState } from "react";
import OwnerInfo from "./OwnerInfo/Index";
import { useNavigate, useParams } from "react-router-dom";
import BasicInfo from "./BasicInfo/Index";
import BankDetails from "./BankDetails/Index";
import { useSelector } from "react-redux";
import { Form } from "antd";
import { getClientsReducersApi } from "../../../../redux/getClientsReducers";
import { createAssociatePartnerReducersApi } from "../../../../redux/createAssociatePartnerReducers";
import FormContentSkeletonLoader from "../../../../components/FormContentSkeletonLoader/Index";
import { getSubscriptionsListApi } from "../../../../redux/getSubscriptionsReducers";
import { useAppDispatch } from "../../../states/store";
import Select from "../../../../components/Select/Index";
import RevenueProgram from "./RevenueProgram/Index";

const AddAssociatePartners = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [associatePartnerValue, setAssociatePartner] = useState({});
    const dispatch = useAppDispatch();
    const navigation = useNavigate();
    const { clientId } = useParams();
    const [form] = Form.useForm();
    const getClientsListSuccess = useSelector(
        (state: any) => state.getClients.success
    );
    const getClientsListLoading = useSelector(
        (state: any) => state.getClients.loading
    );
    const [partnerType, setPartnerType] = useState("ca");
    const [partnerTypeLabel, setPartnerTypeLabel] = useState("Partners ");

    const getClientsList = useSelector((state: any) => state.getClients.data);
    const { loading, success } = useSelector(
        (state: any) => state.createClient
    );

    useEffect(() => {
        //TODO:: Need to convert in GET API
        if (!getClientsListSuccess) {
            dispatch(getClientsReducersApi());
        }
        dispatch(getSubscriptionsListApi());
    }, []);

    const setFormValue = (formValue: any) => {
        setAssociatePartner((prev) => ({ ...prev, ...formValue }));
    };

    const handleCancelClick = () => {
        navigation("/associatePartners");
    };

    useEffect(() => {
        if (getClientsList.length && clientId) {
            const currentCardDetail = getClientsList.find(
                (s: any) => s._id === clientId
            );
            form.setFieldsValue(currentCardDetail);
        }
    }, [getClientsList, clientId, form]);

    useEffect(() => {
        if (success) {
            navigation("/associatePartners");
        }
    }, [success]);

    const onChange = (key: number, formValue: any) => {
        if (key === 5) {
            const payload = { ...associatePartnerValue, ...formValue };

            payload.partnerType = partnerType;
            payload.industryType = "Gold";
            payload.lineOfBusiness = "Gold";
            payload.fileNumber = "cnjkdcjk";
            // @ts-ignore
            dispatch(createAssociatePartnerReducersApi({ payload: payload }));
        } else {
            setActiveTab(key);
        }
    };

    const items = [
        {
            key: 1,
            label: `Firm Info`,
            children: (
                <BasicInfo
                    onChange={onChange}
                    setFormValue={setFormValue}
                    partnerType={partnerType}
                />
            ),
        },
        {
            key: 2,
            label: `Owner Details`,
            children: (
                <OwnerInfo
                    onChange={onChange}
                    setFormValue={setFormValue}
                    partnerType={partnerType}
                />
            ),
        },
        {
            key: 3,
            label: `Revenue Program`,
            children: (
                <RevenueProgram
                    onChange={onChange}
                    setFormValue={setFormValue}
                    partnerType={partnerType}
                />
            ),
        },
        {
            key: 4,
            label: `Bank Details`,
            children: (
                <BankDetails
                    onChange={onChange}
                    setFormValue={setFormValue}
                    partnerType={partnerType}
                />
            ),
        },
    ];

    return (
        <div
            className={classNames("card mb-3", styles.addPromoCodeCardWrapper)}
        >
            <div
                className={classNames(
                    "card-header d-flex",
                    styles.promoCodeCardHeaderBox
                )}
                style={{ minHeight: 60 }}
            >
                <div
                    className={classNames(
                        "d-flex align-items-center w-100",
                        styles.promocodeHeaderTitle
                    )}
                >
                    <div className="me-auto">
                        <h5
                            className={classNames(
                                "my-2 position-relative z-index-1",
                                styles.addPromoCodeLabel
                            )}
                        >
                            Add New Associate Partner
                        </h5>
                    </div>
                    <div className={classNames("ms-auto z-index-1")}>
                        <Button
                            onClick={handleCancelClick}
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
            <div className={styles.addClientDetailBox}>
                {getClientsListLoading && clientId && (
                    <FormContentSkeletonLoader />
                )}
                <div className="row">
                    <div className={classNames("col-12 col-md-4 col-lg-4")}>
                        <div className="mb-3">
                            <label
                                className={classNames(
                                    "form-label",
                                    styles.rowTitle
                                )}
                            >
                                Partners Category
                                <sup className="text-danger fs--1">*</sup>
                            </label>
                            <Form.Item
                                name="partnerCategory"
                                className="customAddClientSelectOptions"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Select Category!",
                                    },
                                ]}
                            >
                                <Select
                                    options={[
                                        {
                                            value: "sales_partner",
                                            label: "Sales Partner",
                                        },
                                        {
                                            value: "service_partner",
                                            label: "Service Partner",
                                        },
                                    ]}
                                    placeholder="Select Type"
                                    onChange={(value: any) => {
                                        if (value === "sales_partner") {
                                            setPartnerTypeLabel(
                                                "Sales Partner"
                                            );
                                        } else {
                                            setPartnerTypeLabel(
                                                "Service Partner"
                                            );
                                        }
                                    }}
                                />
                            </Form.Item>
                        </div>
                    </div>{" "}
                    <div className={classNames("col-12 col-md-4 col-lg-4")}>
                        <div className="mb-3">
                            <label
                                className={classNames(
                                    "form-label",
                                    styles.rowTitle
                                )}
                            >
                                {partnerTypeLabel} Type
                                <sup className="text-danger fs--1">*</sup>
                            </label>
                            <Form.Item
                                name="partnerType"
                                className="customAddClientSelectOptions"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Enter Client Type!",
                                    },
                                ]}
                            >
                                <Select
                                    options={[
                                        { value: "ca", label: "CA" },
                                        {
                                            value: "accountant",
                                            label: "Accountant",
                                        },
                                        {
                                            value: "tax_consultant",
                                            label: "Tax Consultant",
                                        },
                                        {
                                            value: "business_enterprise",
                                            label: "Business Enterprise",
                                        },
                                    ]}
                                    placeholder="Select Type"
                                    onChange={(value: any) =>
                                        setPartnerType(value)
                                    }
                                />
                            </Form.Item>
                        </div>
                    </div>
                </div>
                {!(getClientsListLoading && clientId) && (
                    <Tabs
                        // tabBarExtraContent={operations}
                        className="subscriptionTabs"
                        defaultActiveKey="1"
                        activeKey={activeTab}
                        items={items}
                        onChange={onChange}
                    />
                )}
            </div>
        </div>
    );
};

export default AddAssociatePartners;
