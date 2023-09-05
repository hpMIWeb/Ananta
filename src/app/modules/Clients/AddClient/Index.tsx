import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";
import styles from "./addClient.module.scss";
import Tabs from "../../../components/ui/Tabs/Index";
import Button from "../../../components/ui/Button/Index";
import Icon from "../../../components/ui/Icon/Index";
import SubscriptionTabAddClient from "./SubscriptionTabAddClient/Index";
import { useEffect, useState } from "react";
import OwnerInfo from "./OwnerInfo/Index";
import PaymentTabAddClient from "./PaymentTabAddClient/Index";
import { useNavigate, useParams } from "react-router-dom";
import BasicInfo from "./BasicInfo/Index";
import Branches from "./Branches/Index";
import BankDetails from "./BankDetails/Index";
import VaultTabAddClient from "./VaultTabAddClient/Index";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import { getClientsReducersApi } from "../../../../redux/getClientsReducers";
import { createClientReducersApi } from "../../../../redux/createClientReducers";
import FormContentSkeletonLoader from "../../../components/ui/FormContentSkeletonLoader/Index";
import { getSubscriptionsListApi } from "../../../../redux/getSubscriptionsReducers";
import { useAppDispatch } from "../../../../states/store";

interface Payload {
    payload: any;
    subscriptionId: string;
}

const AddClient = () => {
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
    const getClientsList = useSelector((state: any) => state.getClients.data);
    const { loading, success } = useSelector(
        (state: any) => state.createClient
    );

    useEffect(() => {
        if (!getClientsListSuccess) {
            dispatch(getClientsReducersApi());
        }
        dispatch(getSubscriptionsListApi());
    }, []);

    const setFormValue = (formValue: any) => {
        setClientValue((prev) => ({ ...prev, ...formValue }));
    };

    const handleCancelClick = () => {
        navigation("/caclient");
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
            navigation("/caclient");
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

    const onChange = (key: any, formValue: any) => {
        if (key === 8) {
            const payloadData = { ...clientValue, ...formValue };
            delete payloadData.subscriptionPlan;
            delete payloadData.startDate;
            delete payloadData.paymentTerms;
            delete payloadData.paymentMode;
            delete payloadData.instrumentType;
            delete payloadData.instrumentDate;
            delete payloadData.instrumentId;
            delete payloadData.instrumentAmount;

            const newData = {
                payload: payloadData,
                subscriptionId: "",
            } as Payload;

            dispatch(createClientReducersApi(newData));
        } else {
            setActiveTab(key);
        }
    };

    const items = [
        {
            key: 1,
            label: `Basic Info`,
            children: (
                <BasicInfo onChange={onChange} setFormValue={setFormValue} />
            ),
        },
        {
            key: 2,
            label: `Branches`,
            children: (
                <Branches onChange={onChange} setFormValue={setFormValue} />
            ),
        },
        {
            key: 3,
            label: `Bank Details`,
            children: (
                <BankDetails onChange={onChange} setFormValue={setFormValue} />
            ),
        },
        {
            key: 4,
            label: `Owner Details`,
            children: (
                <OwnerInfo onChange={onChange} setFormValue={setFormValue} />
            ),
        },
        {
            key: 5,
            label: `Subscription`,
            children: (
                <SubscriptionTabAddClient
                    onChange={onChange}
                    setFormValue={setFormValue}
                />
            ),
        },
        {
            key: 6,
            label: `Payment`,
            children: (
                <PaymentTabAddClient
                    onChange={onChange}
                    setFormValue={setFormValue}
                />
            ),
        },
        {
            key: 7,
            label: `Vault`,
            children: (
                <VaultTabAddClient
                    onChange={onChange}
                    setFormValue={setFormValue}
                    loading={loading}
                />
            ),
        },
    ];

    const handleBulkClick = () => {
        navigation("/caclient/createbulk");
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
                            Add Client
                        </h5>
                    </div>
                    <div className="ms-auto z-index-1">
                        <Button
                            onClick={handleBulkClick}
                            className={styles.newPromoBtn}
                        >
                            Add In Bulk
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
                {!(getClientsListLoading && clientId) && (
                    <Tabs
                        tabBarExtraContent={operations}
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

export default AddClient;
