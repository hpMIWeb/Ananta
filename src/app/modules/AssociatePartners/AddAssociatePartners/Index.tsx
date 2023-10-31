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
import {
    createAssociatePartnerReducersApi,
    resetStateCreateAssociatePartner,
} from "../../../../redux/createAssociatePartnerReducers";
import FormContentSkeletonLoader from "../../../../components/FormContentSkeletonLoader/Index";
import { getSubscriptionsListApi } from "../../../../redux/getSubscriptionsReducers";
import { useAppDispatch } from "../../../states/store";
import Select from "../../../../components/Select/Index";
import RevenueProgram from "./RevenueProgram/Index";
import SubscriptionTabAddClient from "./SubscriptionTabAddClient/Index";
import PaymentTabAddClient from "./PaymentTabAddClient/Index";
import Cookies from "js-cookie";

const AddAssociatePartners = ({ selectedAssociatePartnerData }: any) => {
    const [activeTab, setActiveTab] = useState(1);
    const [disableTabArray, setDisableTabArray] = useState({
        1: false,
        2: true,
        3: true,
        4: true,
    });
    const [associatePartnerValue, setAssociatePartner] = useState({});
    const dispatch = useAppDispatch();
    const navigation = useNavigate();
    const { clientId } = useParams();
    const [form] = Form.useForm();
    const roleType = Cookies.get("roleTypeName");

    const getAssociatePartnerListLoading = useSelector(
        (state: any) => state.getAssociatePartner.loading
    );
    const [partnerType, setPartnerType] = useState<string>("");
    const [partnerTypeLabel, setPartnerTypeLabel] = useState("Partner ");
    const [partnerCategory, setPartnerCategory] = useState("");

    const getAssociatePartnerList = useSelector(
        (state: any) => state.getAssociatePartner.data
    );
    const { loading, success } = useSelector(
        (state: any) => state.createClient
    );
    const partnerTypeOption = [
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
        {
            value: "other",
            label: "Other",
        },
    ];

    useEffect(() => {
        //TODO:: Need to convert in GET API
        if (!getAssociatePartnerList) {
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
        if (getAssociatePartnerList.length && clientId) {
            const currentCardDetail = getAssociatePartnerList.find(
                (s: any) => s._id === clientId
            );
            form.setFieldsValue(currentCardDetail);
        }

        if (selectedAssociatePartnerData) {
            setPartnerType(selectedAssociatePartnerData.partnerType);

            form.setFieldsValue({
                partnerType: selectedAssociatePartnerData.employeeId,
            });
        }
    }, [getAssociatePartnerList, clientId, form]);

    useEffect(() => {
        if (success) {
            dispatch(resetStateCreateAssociatePartner());
            navigation("/associatePartners");
        }
    }, [success]);

    const onChange = (key: number, formValue: any) => {
        if (key === 5) {
            const payload = { ...associatePartnerValue, ...formValue };

            payload.partnerType = partnerType;
            // TODO Remove static value
            payload.fileNumber = "kok";

            dispatch(
                createAssociatePartnerReducersApi({
                    payload: payload,
                    associatePartnerId: "",
                })
            );
        } else {
            setDisableTabArray((prevDisableTabArray) => ({
                ...prevDisableTabArray,
                [key]: false,
            }));
            setActiveTab(key);
        }
    };

    const items = [
        {
            key: 1,
            label: `Firm Info`,
            disabled: disableTabArray[1],
            children: (
                <BasicInfo
                    onChange={onChange}
                    setFormValue={setFormValue}
                    partnerType={partnerType}
                    selectedAssociatePartnerData={selectedAssociatePartnerData}
                />
            ),
        },
        {
            key: 2,
            label: `Owner Details`,
            disabled: disableTabArray[2],
            children: (
                <OwnerInfo
                    onChange={onChange}
                    setFormValue={setFormValue}
                    partnerType={partnerType}
                    selectedAssociatePartnerData={selectedAssociatePartnerData}
                />
            ),
        },
        {
            key: 3,
            disabled: disableTabArray[3],
            label:
                partnerTypeLabel !== "Service Partner"
                    ? `Revenue Program`
                    : `Billing`,
            children:
                partnerTypeLabel !== "Service Partner" ? (
                    <RevenueProgram
                        onChange={onChange}
                        setFormValue={setFormValue}
                        partnerType={partnerType}
                        selectedAssociatePartnerData={
                            selectedAssociatePartnerData
                        }
                    />
                ) : (
                    <SubscriptionTabAddClient
                        onChange={onChange}
                        setFormValue={setFormValue}
                        selectedAssociatePartnerData={
                            selectedAssociatePartnerData
                        }
                    />
                ),
        },
        {
            key: 4,
            disabled: disableTabArray[4],
            label:
                partnerTypeLabel !== "Service Partner"
                    ? `Bank Details`
                    : `Payment`,
            children:
                partnerTypeLabel !== "Service Partner" ? (
                    <BankDetails
                        onChange={onChange}
                        setFormValue={setFormValue}
                        partnerType={partnerType}
                        selectedAssociatePartnerData={
                            selectedAssociatePartnerData
                        }
                    />
                ) : (
                    <PaymentTabAddClient
                        onChange={onChange}
                        setFormValue={setFormValue}
                        selectedAssociatePartnerData={
                            selectedAssociatePartnerData
                        }
                    />
                ),
        },
    ];

    return (
        <div
            className={classNames("card mb-3", styles.addPromoCodeCardWrapper)}
        >
            {!selectedAssociatePartnerData ? (
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
            ) : null}

            <div className={styles.addClientDetailBox}>
                {getAssociatePartnerListLoading && clientId && (
                    <FormContentSkeletonLoader />
                )}
                <div className="row">
                    {roleType === "client" && (
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
                                            setPartnerCategory(value);
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
                        </div>
                    )}

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
                                    options={partnerTypeOption.map(
                                        (partnerType: any) => ({
                                            label: partnerType?.label,
                                            value: partnerType?.value,
                                        })
                                    )}
                                    placeholder="Select Type"
                                    onChange={(value: any) =>
                                        setPartnerType(value)
                                    }
                                />
                            </Form.Item>
                        </div>
                    </div>
                </div>
                {partnerType && partnerType !== "" && (
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
