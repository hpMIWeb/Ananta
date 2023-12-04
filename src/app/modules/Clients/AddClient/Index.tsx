import classNames from "classnames";
import styles from "./addClient.module.scss";
import Tabs from "../../../../components/Tabs/Index";
import Button from "../../../../components/Button/Index";
import SubscriptionTabAddClient from "./SubscriptionTabAddClient/Index";
import { useEffect, useState } from "react";
import OwnerInfo from "./OwnerInfo/Index";
import PaymentTabAddClient from "./PaymentTabAddClient/Index";
import { useNavigate, useParams } from "react-router-dom";
import BasicInfo from "./BasicInfo/Index";
import { useSelector } from "react-redux";
import { Form } from "antd";
import { getClientsReducersApi } from "../../../../redux/getClientsReducers";
import {
    createClientReducersApi,
    resetStateCreateClient,
} from "../../../../redux/createClientReducers";
import FormContentSkeletonLoader from "../../../../components/FormContentSkeletonLoader/Index";
import { getSubscriptionsListApi } from "../../../../redux/getSubscriptionsReducers";
import { getLineOfBusinessReducersApi } from "../../../../redux/getLineOfBusinessReducers";
import { getIndustryTypeListReducersApi } from "../../../../redux/getIndustryTypeReducers";
import { getPromocodeReducersListApi } from "../../../../redux/getPromocodeReducers";
import { useAppDispatch } from "../../../states/store";
import Select from "../../../../components/Select/Index";
import Cookies from "js-cookie";
import { RoleTypes, adminClientTypeOption } from "../../../../utils/constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faEdit, faXmark } from "@fortawesome/free-solid-svg-icons";

const AddClient = ({ selectedClientData }: any) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [showEditButton, setShowEditButton] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState(1);
    const [disableTabArray, setDisableTabArray] = useState({
        1: false,
        4: true,
        5: true,
        6: true,
    });
    const [clientValue, setClientValue] = useState({});
    const roleType = Cookies.get("roleTypeName");
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
    const [clientType, setClientType] = useState("");
    const [selectedClientId, setSelectedClientId] = useState("");

    const { loading, success } = useSelector(
        (state: any) => state.createClient
    );
    let clientTypeOption = adminClientTypeOption;

    if (roleType !== RoleTypes.SuperAdmin) {
        clientTypeOption = [
            {
                value: "regular",
                label: "Regular",
            },
            {
                value: "non_regular",
                label: "Non Regular",
            },
        ];
    }
    useEffect(() => {
        if (!getClientsListSuccess) {
            dispatch(getClientsReducersApi());
        }
        dispatch(getSubscriptionsListApi());
        dispatch(getLineOfBusinessReducersApi());
        dispatch(getIndustryTypeListReducersApi());
        dispatch(getPromocodeReducersListApi());
    }, []);

    const setFormValue = (formValue: any) => {
        setClientValue((prev) => ({ ...prev, ...formValue }));
    };

    // Set clientType based on selectedClientData or a default value
    useEffect(() => {
        if (selectedClientData) {
            setShowEditButton(true);

            setClientType(selectedClientData.clientType);
            setSelectedClientId(selectedClientData._id);
            form.setFieldsValue({ clientType: selectedClientData.clientType });
            setDisableTabArray({
                1: false,
                4: false,
                5: false,
                6: false,
            });
        } else {
            setIsEdit(true);
        }
    }, [selectedClientData]);

    const handleCancelClick = () => {
        navigation("/caclient");
    };

    const editClickHandler = () => {
        setIsEdit(!isEdit);
    };

    useEffect(() => {
        if (success) {
            dispatch(resetStateCreateClient());
            navigation("/caclient");
        }
    }, [success]);

    const onChange = (key: number, formValue: any) => {
        if (key === 8) {
            const payload = { ...clientValue, ...formValue };
            payload.clientType = clientType;
            dispatch(
                createClientReducersApi({
                    payload: payload,
                    clientId: selectedClientId,
                })
            );
            if (success) {
                navigation("/caclient"); // Replace with your actual route
            }
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
                    clientType={clientType}
                    handleCancelClick={handleCancelClick}
                    selectedClientData={selectedClientData}
                    isEdit={isEdit}
                    showEditButton={showEditButton}
                />
            ),
        },
        // {
        //   key: 2,
        //   label: `Branches`,
        //   children: <Branches onChange={onChange} setFormValue={setFormValue} />,
        // },
        // {
        //   key: 3,
        //   label: `Bank Details`,
        //   children: <BankDetails onChange={onChange} setFormValue={setFormValue} />,
        // },
        {
            key: 4,
            label: `Owner Info`,
            disabled: disableTabArray[4],
            children: (
                <OwnerInfo
                    onChange={onChange}
                    setFormValue={setFormValue}
                    clientType={clientType}
                    clientValue={clientValue}
                    selectedClientData={selectedClientData}
                    isEdit={isEdit}
                />
            ),
        },
        {
            key: 5,
            label: roleType === "superadmin" ? `Subscription` : `Billing`,
            disabled: disableTabArray[5],
            children: (
                <SubscriptionTabAddClient
                    onChange={onChange}
                    setFormValue={setFormValue}
                    clientType={clientType}
                    clientValue={clientValue}
                    selectedClientData={selectedClientData}
                    isEdit={isEdit}
                />
            ),
        },
        {
            key: 6,
            label: `Payment`,
            disabled: disableTabArray[6],
            children: (
                <PaymentTabAddClient
                    onChange={onChange}
                    setFormValue={setFormValue}
                    clientType={clientType}
                    clientValue={clientValue}
                    selectedClientData={selectedClientData}
                    loading={loading}
                    isEdit={isEdit}
                />
            ),
        },
        // {
        //   key: 7,
        //   label: `Vault`,
        //   children: (
        //     <VaultTabAddClient
        //       onChange={onChange}
        //       setFormValue={setFormValue}
        //       loading={loading}
        //     />
        //   ),
        // },
    ];

    const handleBulkClick = () => {
        navigation("/caclient/createbulk");
    };

    return (
        <div
            className={classNames("card mb-3", styles.addPromoCodeCardWrapper)}
        >
            {!selectedClientData ? (
                <div
                    className={classNames(
                        "card-header d-flex",
                        styles.promoCodeCardHeaderBox
                    )}
                    style={{ minHeight: 60 }}
                >
                    <div
                        className={classNames(
                            "card-header d-flex",
                            styles.promoCodeCardHeaderBox
                        )}
                        style={{ minHeight: 60 }}
                    >
                        <div className="me-auto">
                            <h5
                                className={classNames(
                                    "my-2 position-relative z-index-1",
                                    styles.addPromoCodeLabel
                                )}
                            >
                                Add New Client
                            </h5>
                        </div>
                        <div className={classNames("ms-auto z-index-1")}>
                            <Button
                                onClick={handleCancelClick}
                                className={classNames(
                                    "greyBtn",
                                    styles.cancelAddClientBtn
                                )}
                                style={{
                                    minWidth: 104,
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
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
                                Client Type
                                <sup className="text-danger fs--1">*</sup>
                            </label>
                            <Form
                                form={form}
                                name="basic"
                                autoComplete="off"
                                className="customAddForm"
                                disabled={!isEdit}
                            >
                                <Form.Item
                                    name="clientType"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Enter Client Type!",
                                        },
                                    ]}
                                >
                                    <Select
                                        options={clientTypeOption}
                                        className="customAddClientSelectOptions"
                                        placeholder="Select Type"
                                        onChange={(value: any) =>
                                            setClientType(value)
                                        }
                                        value={clientType}
                                    />
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                    <div
                        className={classNames("col-12 col-md-6 col-lg-6")}
                    ></div>
                    {showEditButton && (
                        <div className={classNames("col-12 col-md-2 col-lg-2")}>
                            <div className="mb-3">
                                <div
                                    className="ms-auto mt-5"
                                    style={{ float: "right" }}
                                >
                                    <FontAwesomeIcon
                                        icon={isEdit ? faXmark : faEdit}
                                        style={{
                                            fontSize: isEdit ? "25px" : "20px",
                                            color: "#2c7be5",
                                            cursor: "pointer",
                                            marginRight: "15px",
                                            float: "right",
                                            marginTop: isEdit ? "-3px" : "0",
                                        }}
                                        title={
                                            "Click here to " +
                                            (isEdit ? "cancel" : "edit")
                                        }
                                        onClick={editClickHandler}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {clientType !== "" && (
                    <Tabs
                        //tabBarExtraContent={operations}
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
