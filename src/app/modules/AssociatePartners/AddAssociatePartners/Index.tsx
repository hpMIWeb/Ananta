import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";
import styles from "./addClient.module.scss";
import Tabs from "../../../../components/Tabs/Index";
import Button from "../../../../components/Button/Index";
import Icon from "../../../../components/Icon/Index";
import { useEffect, useState } from "react";
import OwnerInfo from "./OwnerInfo/Index";
import { useNavigate, useParams } from "react-router-dom";
import BasicInfo from "./BasicInfo/Index";
import BankDetails from "./BankDetails/Index";
import { useSelector } from "react-redux";
import { Form } from "antd";
import { getClientsReducersApi } from "../../../../redux/getClientsReducers";
import { createClientReducersApi } from "../../../../redux/createClientReducers";
import FormContentSkeletonLoader from "../../../../components/FormContentSkeletonLoader/Index";
import { getSubscriptionsListApi } from "../../../../redux/getSubscriptionsReducers";
import { useAppDispatch } from "../../../states/store";
import Select from "../../../../components/Select/Index";

const AddAssociatePartners = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [clientValue, setClientValue] = useState({});
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
        setClientValue((prev) => ({ ...prev, ...formValue }));
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

    const operations = (
        <Button
            onClick={handleCancelClick}
            className={classNames("cancelBtn", styles.cancelAddClientBtn)}
            type="primary"
            danger
        >
            <Icon
                className={styles.cancelBtnIcon}
                name="cross"
                height={18}
                width={18}
            />
            Cancel
        </Button>
    );

    const onChange = (key: number, formValue: any) => {
        if (key === 4) {
            const payload = { ...clientValue, ...formValue };

            payload.partnerType = partnerType;
            // @ts-ignore
            dispatch(createClientReducersApi({ payload: payload }));
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
                <OwnerInfo
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
                            Add New Associate Partner
                        </h5>
                    </div>
                    <div className="ms-auto z-index-1">
                        <Button
                            onClick={handleCancelClick}
                            className={styles.newPromoBtn}
                            danger
                        >
                            <Icon
                                className={styles.cancelBtnIcon}
                                name="cross"
                                height={18}
                                width={18}
                            />
                            Cancel
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
            <div className={styles.addClientDetailBox}>
                {getClientsListLoading && clientId && (
                    <FormContentSkeletonLoader />
                )}
                <div className="row">
                    <div className={classNames("col-12 col-md-4 col-lg-4")}>
                        <div className="mb-3">
                            <label className="form-label">
                                Client Type
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
