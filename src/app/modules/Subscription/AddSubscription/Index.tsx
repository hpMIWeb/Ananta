import { Button, Form, Input, Select } from "antd";
import classNames from "classnames";
import styles from "./addSubscription.module.scss";
import Switch from "../../../../components/Switch/Index";
import Icon from "../../../../components/Icon/Index";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createSubscriptionsReducersApi } from "../../../../redux/createSubscriptionsReducers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getSubscriptionsListApi } from "../../../../redux/getSubscriptionsReducers";
import FormContentSkeletonLoader from "../../../../components/FormContentSkeletonLoader/Index";
import { deleteSubscriptionsReducersApi } from "../../../../redux/deleteSubscriptionsReducers";
import { useAppDispatch } from "../../../states/store";
import Cookies from "js-cookie";
import { featureList } from "../../../utilities/utility";

const AddSubscription = () => {
    // const featureList: any = [
    //     { label: "Task Manager", value: "TaskManager" },
    //     { label: "File Manager", value: "FileManager" },
    //     { label: "E-Commerce", value: "E_Commerce" },
    //     {
    //         label: "Template customization for import",
    //         value: "Tamplate_Customization_for_import",
    //     },
    //     {
    //         label: "Live Reports Client Mobile App",
    //         value: "Live_reports_on_client_mobile_app",
    //     },
    //     { label: "Client Login Mobile App", value: "Client_login_mobile_app" },
    // ];

    const dispatch = useAppDispatch();
    const navigation = useNavigate();
    const { state } = useLocation();
    const roleType = Cookies.get("roleTypeName");
    const [featureState, setFeatureState] = useState<any>(featureList[0]);
    const [isSpaceUnlimited, setIsSpaceUnlimited] = useState<boolean>(false);
    const [isTransactionCreditsUnlimited, setIsTransactionCreditsUnlimited] =
        useState<boolean>(false);
    const [isClientUnlimited, setIsClientUnlimited] = useState<boolean>(false);
    const [isBranchUnlimited, setIsBranchUnlimited] = useState<boolean>(false);
    const [isTurnoverUnlimited, setIsTurnoverUnlimited] =
        useState<boolean>(false);
    const [subscriptionCategory, setSubscriptionCategory] = useState<string>(); // Initialize with a default category

    const handleIsSpaceUnlimitedChange = (value: boolean) => {
        setIsSpaceUnlimited(value);
    };
    const [superAdminOptions, setSuperAdminOptions] = useState([
        {
            value: "consultant",
            label: "Consultant",
        },
        {
            value: "business_enterprise",
            label: "Business Enterprise",
        },
    ]);
    const [caAdminOption, setCAdminOption] = useState([
        {
            value: "client",
            label: "Client",
        },
        {
            value: "associate_partner",
            label: "Associate Partner",
        },
    ]);
    const categoryOptions =
        roleType === "superadmin" ? superAdminOptions : caAdminOption;

    const handleIsTransactionCreditsUnlimitedChange = (value: boolean) => {
        setIsTransactionCreditsUnlimited(value);
    };
    const handleIsClientUnlimitedChange = (value: boolean) => {
        setIsClientUnlimited(value);
    };

    // const { subscriptionId } = useParams();
    const [subscriptionId, setSubscriptionId] = useState<string>("");
    const [isEditMode, setIsEditMode] = useState(subscriptionId ? true : false);
    const [form] = Form.useForm();
    const { data: subscriptionCardList, loading: subscriptionCardListLoading } =
        useSelector((state: any) => state.getSubscriptionsListApi);
    const { loading, success } = useSelector(
        (state: any) => state.createSubscriptions
    );
    const {
        loading: deleteSubscriptionsLoading,
        success: successSubscriptionsSuccess,
    } = useSelector((state: any) => state.deleteSubscriptions);

    const handleFeatureToggle = (feature: any) => {
        setFeatureState((prevState: any) => ({
            ...prevState,
            [feature.value]: !prevState[feature.value],
        }));
    };

    const formValues = {
        // TODO: need to check why no append
        features: Object.fromEntries(
            featureList.map((task: any) => [
                task.value.replace(/\s+/g, "_"),
                featureState[task.value] || false,
            ])
        ),
    };

    useEffect(() => {
        if (!subscriptionCardList.length) {
            dispatch(getSubscriptionsListApi());
        }
    }, [subscriptionCardList]);

    useEffect(() => {
        if (state) setSubscriptionId(state.id);
    }, []);

    const onFinish = (e: any) => {
        const payload = {
            ...e,
            no_of_users: {
                office_users: e.office_users,
                client_office_users: e.client_office_users,
                client_vendor: e.client_vendor,
            },
            features: formValues?.features,
            transaction_credits: e.transaction_credits,
            subscribers_count: 0,
            transactions: {
                sales_and_purchase: e.sales_and_purchase,
                credit_and_debit_notes: e.credit_and_debit_notes,
                receipt_and_payments: e.receipt_and_payments,
                contras: e.contras,
                journals: e.journals,
                stock_journals: e.stock_journals,
            },
        };
        delete payload.employee_ca;
        delete payload.employee_client;
        delete payload.client_vendor;
        //TODO::
        dispatch(
            createSubscriptionsReducersApi({
                payload: payload,
                subscriptionId: subscriptionId,
            })
        );
    };

    const onDeleteClick = () => {
        dispatch(
            deleteSubscriptionsReducersApi({
                subscriptionId: subscriptionId,
            })
        );
    };

    const onCancelClick = () => {
        navigation("/subscription");
    };

    useEffect(() => {
        if (subscriptionCardList.length && subscriptionId) {
            const currentCardDetail = subscriptionCardList.find(
                (s: any) => s._id === subscriptionId
            );
            setFeatureState(currentCardDetail.features);
            setSubscriptionCategory(currentCardDetail.category);

            form.setFieldsValue({
                ...currentCardDetail,
                office_users: currentCardDetail.no_of_users.office_users,
                client_office_users:
                    currentCardDetail.no_of_users.client_office_users,
                client_vendor: currentCardDetail.no_of_users.client_vendor,

                sales_and_purchase: currentCardDetail.transactions
                    ? currentCardDetail.transactions.sales_and_purchase
                    : "",
                credit_and_debit_notes: currentCardDetail.transactions
                    ? currentCardDetail.transactions.credit_and_debit_notes
                    : "",
                receipt_and_payments: currentCardDetail.transactions
                    ? currentCardDetail.transactions.receipt_and_payments
                    : "",
                contras: currentCardDetail.transactions
                    ? currentCardDetail.transactions.contras
                    : "",
                journals: currentCardDetail.transactions
                    ? currentCardDetail.transactions.journals
                    : "",
                stock_journals: currentCardDetail.transactions
                    ? currentCardDetail.transactions.stock_journals
                    : "",
            });
        }
    }, [subscriptionCardList, subscriptionId, form]);

    useEffect(() => {
        if (success || successSubscriptionsSuccess) {
            navigation("/subscription");
        }
    }, [success, successSubscriptionsSuccess]);

    const handleSwitchChange = (value: any) => {
        form.setFieldsValue({ display_on_portal: value });
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
                        styles.subscriptionHeaderTitle
                    )}
                >
                    <div className="me-auto">
                        <h5
                            className={classNames(
                                "my-2 position-relative z-index-1",
                                styles.addSubscriptionLabel
                            )}
                        >
                            {!subscriptionId
                                ? "Add Subscription"
                                : "Edit Subscription"}
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
                {subscriptionCardListLoading && subscriptionId && (
                    <FormContentSkeletonLoader />
                )}
                {!(subscriptionCardListLoading && subscriptionId) && (
                    <Form
                        form={form}
                        name="basic"
                        initialValues={{
                            remember: true,
                            period_type: "MONTH",
                            status: "Active",
                            display_on_portal: true,
                            category: subscriptionCategory,
                            transaction: "applicable",
                        }}
                        onFinish={onFinish}
                        autoComplete="off"
                        requiredMark={false}
                        className="customAddForm"
                    >
                        <div className="formFieldRowWrapper">
                            <div className="col-auto formLabelWrapper">
                                <label className="form-label">
                                    Subscription Category
                                </label>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                <Form.Item
                                    name="category"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Enter your Subscription Plan Name!",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Select Category"
                                        options={categoryOptions}
                                        onChange={(value) =>
                                            setSubscriptionCategory(value)
                                        }
                                        disabled={isEditMode}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="formFieldRowWrapper">
                            <div className="col-auto formLabelWrapper">
                                <label className="form-label">
                                    Subscription Plan Name
                                </label>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                <Form.Item
                                    name="plan_name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Enter your Subscription Plan Name!",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Subscription Plan Title"
                                        className="customAddFormInputText"
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="formFieldRowWrapper">
                            <div className="col-auto formLabelWrapper">
                                <label className="form-label">
                                    Storage Space
                                </label>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                <Form.Item
                                    name="storage_space"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Enter your Storage Space!",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Storage Size"
                                        className="customAddFormInputText position-relative"
                                        suffix={
                                            <div className="inputSuffix">
                                                GB
                                            </div>
                                        }
                                        disabled={isSpaceUnlimited}
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                <div
                                    className={
                                        styles.featureCheckBoxLabelWrapper
                                    }
                                >
                                    <label
                                        className={styles.featureCheckBoxLabel}
                                    >
                                        Not Applicable
                                    </label>
                                    <Switch
                                        checked={isSpaceUnlimited}
                                        onChange={handleIsSpaceUnlimitedChange}
                                        className="smallCheckBox"
                                        size="small"
                                    ></Switch>
                                    <label
                                        className={styles.featureCheckBoxLabel}
                                    >
                                        Unlimited
                                    </label>
                                </div>
                            </div>
                        </div>

                        {subscriptionCategory === "consultant" && (
                            <div className="formFieldRowWrapper">
                                <div className="col-auto formLabelWrapper">
                                    <label className="form-label">
                                        No Of Clients
                                    </label>
                                </div>
                                <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                    <Form.Item
                                        name="no_of_client"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your No Of Clients!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="No Of Clients"
                                            className="customAddFormInputText"
                                            disabled={isClientUnlimited}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                    <div
                                        className={
                                            styles.featureCheckBoxLabelWrapper
                                        }
                                    >
                                        <label
                                            className={
                                                styles.featureCheckBoxLabel
                                            }
                                        >
                                            Not Applicable
                                        </label>
                                        <Switch
                                            size="small"
                                            checked={isClientUnlimited}
                                            onChange={
                                                handleIsClientUnlimitedChange
                                            }
                                            className="smallCheckBox"
                                        ></Switch>
                                        <label
                                            className={
                                                styles.featureCheckBoxLabel
                                            }
                                        >
                                            Unlimited
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {subscriptionCategory === "business_enterprise" ||
                            (subscriptionCategory === "client" && (
                                <div className="formFieldRowWrapper">
                                    <div className="col-auto formLabelWrapper">
                                        <label className="form-label">
                                            Branches
                                        </label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                        <Form.Item
                                            name="branches"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please Enter the number of branches",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Number Of Branches"
                                                className="customAddFormInputText"
                                                disabled={isBranchUnlimited}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                        <div
                                            className={
                                                styles.featureCheckBoxLabelWrapper
                                            }
                                        >
                                            <label
                                                className={
                                                    styles.featureCheckBoxLabel
                                                }
                                            >
                                                Not Applicable
                                            </label>
                                            <Switch
                                                size="small"
                                                checked={isBranchUnlimited}
                                                onChange={setIsBranchUnlimited}
                                                className="smallCheckBox"
                                            />
                                            <label
                                                className={
                                                    styles.featureCheckBoxLabel
                                                }
                                            >
                                                Unlimited
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        <div className="formFieldRowWrapper">
                            <div className="col-auto formLabelWrapper">
                                <label className="form-label">
                                    No Of Users
                                </label>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                <Form.Item
                                    name="office_users"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Enter your CA Office Users Number!",
                                        },
                                    ]}
                                >
                                    <Input
                                        className="customAddFormInputText"
                                        suffix={
                                            <div className="inputSuffix">
                                                {subscriptionCategory ===
                                                "consultant"
                                                    ? "CA Office Users"
                                                    : "Office Users"}
                                            </div>
                                        }
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        {subscriptionCategory !== "business_enterprise" &&
                            subscriptionCategory !== "client" && (
                                <div className="formFieldRowWrapper">
                                    <div className="col-auto formLabelWrapper">
                                        <label className="form-label"></label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                        <Form.Item
                                            name="client_office_users"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please Enter your Client Office Users Number!",
                                                },
                                            ]}
                                        >
                                            <Input
                                                className="customAddFormInputText"
                                                suffix={
                                                    <div className="inputSuffix">
                                                        {subscriptionCategory ===
                                                        "associate_partner"
                                                            ? "Client Users"
                                                            : "Client Office Users"}
                                                    </div>
                                                }
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            )}
                        <div className="formFieldRowWrapper">
                            <div className="col-auto formLabelWrapper">
                                <label className="form-label"></label>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                <Form.Item
                                    name="client_vendor"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please Enter your Client Vendor Users Number!",
                                        },
                                    ]}
                                >
                                    <Input
                                        className="customAddFormInputText"
                                        suffix={
                                            <div className="inputSuffix">
                                                {subscriptionCategory ===
                                                "consultant"
                                                    ? "Client Vendor Users"
                                                    : "Vendor Users"}
                                            </div>
                                        }
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        {subscriptionCategory === "client" && (
                            <div>
                                <div className="formFieldRowWrapper">
                                    <div className="col-auto formLabelWrapper">
                                        <label className="form-label">
                                            Turnover
                                        </label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                        <Form.Item
                                            name="turnover"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please Enter the number of turnover",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="turnover"
                                                className="customAddFormInputText"
                                                disabled={isTurnoverUnlimited}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                        <div
                                            className={
                                                styles.featureCheckBoxLabelWrapper
                                            }
                                        >
                                            <label
                                                className={
                                                    styles.featureCheckBoxLabel
                                                }
                                            >
                                                Not Applicable
                                            </label>
                                            <Switch
                                                size="small"
                                                checked={isTurnoverUnlimited}
                                                onChange={
                                                    setIsTurnoverUnlimited
                                                }
                                                className="smallCheckBox"
                                            />
                                            <label
                                                className={
                                                    styles.featureCheckBoxLabel
                                                }
                                            >
                                                Unlimited
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="formFieldRowWrapper">
                                    <div className="col-auto formLabelWrapper">
                                        <label className="form-label">
                                            Transaction
                                        </label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                        <Form.Item name="transaction">
                                            <Select
                                                options={[
                                                    {
                                                        value: "applicable",
                                                        label: "Applicable",
                                                    },
                                                ]}
                                                disabled={isEditMode}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                        )}
                        {subscriptionCategory === "client" && (
                            <>
                                <div className="formFieldRowWrapper">
                                    <div className="col-auto formLabelWrapper">
                                        <label className="form-label"></label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                        <div className="formPeriodWrapper">
                                            <label className="form-label">
                                                Sales & Purchase
                                            </label>

                                            <Form.Item name="sales_and_purchase">
                                                <Input
                                                    placeholder="No of Transaction"
                                                    className="customAddFormInputText"
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                                <div className="formFieldRowWrapper">
                                    <div className="col-auto formLabelWrapper">
                                        <label className="form-label"></label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                        <div className="formPeriodWrapper">
                                            <label className="form-label">
                                                Credit & Debit Notes
                                            </label>

                                            <Form.Item name="credit_and_debit_notes">
                                                <Input
                                                    placeholder="No of Transaction"
                                                    className="customAddFormInputText"
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                                <div className="formFieldRowWrapper">
                                    <div className="col-auto formLabelWrapper">
                                        <label className="form-label"></label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                        <div className="formPeriodWrapper">
                                            <label className="form-label">
                                                Receipt & Payment
                                            </label>

                                            <Form.Item name="receipt_and_payments">
                                                <Input
                                                    placeholder="No of Transaction"
                                                    className="customAddFormInputText"
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                                <div className="formFieldRowWrapper">
                                    <div className="col-auto formLabelWrapper">
                                        <label className="form-label"></label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                        <div className="formPeriodWrapper">
                                            <label className="form-label">
                                                Contras
                                            </label>

                                            <Form.Item name="contras">
                                                <Input
                                                    placeholder="No of Transaction"
                                                    className="customAddFormInputText"
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                                <div className="formFieldRowWrapper">
                                    <div className="col-auto formLabelWrapper">
                                        <label className="form-label"></label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                        <div className="formPeriodWrapper">
                                            <label className="form-label">
                                                Journals
                                            </label>

                                            <Form.Item name="journals">
                                                <Input
                                                    placeholder="No of Transaction"
                                                    className="customAddFormInputText"
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                                <div className="formFieldRowWrapper">
                                    <div className="col-auto formLabelWrapper">
                                        <label className="form-label"></label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                        <div className="formPeriodWrapper">
                                            <label className="form-label">
                                                Stock Journals
                                            </label>

                                            <Form.Item name="stock_journals">
                                                <Input
                                                    placeholder="No of Transaction"
                                                    className="customAddFormInputText"
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {subscriptionCategory !== "client" && (
                            <div className="formFieldRowWrapper">
                                <div className="col-auto formLabelWrapper">
                                    <label className="form-label">
                                        Transaction Credits
                                    </label>
                                </div>
                                <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                    <Form.Item
                                        name="transaction_credits"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your Transaction Credits!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="No Of Transaction Credits"
                                            className="customAddFormInputText"
                                            disabled={
                                                isTransactionCreditsUnlimited
                                            }
                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                    <div
                                        className={
                                            styles.featureCheckBoxLabelWrapper
                                        }
                                    >
                                        <label
                                            className={
                                                styles.featureCheckBoxLabel
                                            }
                                        >
                                            Not Applicable
                                        </label>
                                        <Switch
                                            checked={
                                                isTransactionCreditsUnlimited
                                            }
                                            size="small"
                                            onChange={
                                                handleIsTransactionCreditsUnlimitedChange
                                            }
                                            className="smallCheckBox"
                                        ></Switch>
                                        <label
                                            className={
                                                styles.featureCheckBoxLabel
                                            }
                                        >
                                            Unlimited
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* {hide when role is ca admin} */}

                        {subscriptionCategory === "associate_partner" ||
                            (subscriptionCategory === "business_enterprise" && (
                                <div className="formFieldRowWrapper">
                                    <div className="col-auto formLabelWrapper">
                                        <label className="form-label">
                                            Modules
                                        </label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                        <div
                                            className={
                                                styles.featureCheckBoxWrapper
                                            }
                                        >
                                            {featureList.map(
                                                (task: any, index: any) => (
                                                    <div key={index}>
                                                        <Switch
                                                            size="small"
                                                            className="smallCheckBox"
                                                            checked={
                                                                featureState
                                                                    ? featureState[
                                                                          task
                                                                              .value
                                                                      ]
                                                                    : task.defaultState
                                                            }
                                                            onChange={() =>
                                                                handleFeatureToggle(
                                                                    task
                                                                )
                                                            }
                                                        />
                                                        <label
                                                            className={
                                                                styles.featureCheckBoxLabel
                                                            }
                                                        >
                                                            {task.label}
                                                        </label>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                        <div className="formFieldRowWrapper">
                            <div className="col-auto formLabelWrapper">
                                <label className="form-label">Validity</label>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 formInputWrapper">
                                <div className="formPeriodWrapper">
                                    <Form.Item
                                        name="period"
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
                                            placeholder="Time"
                                            className="customAddFormInputText"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="period_type"
                                        className="customAddFormSelectOptions"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your Period Type!",
                                            },
                                        ]}
                                    >
                                        <Select
                                            style={{ width: 130 }}
                                            options={[
                                                {
                                                    value: "MONTH",
                                                    label: "Months",
                                                },
                                                { value: "DAY", label: "Days" },
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
                                <div className="position-relative">
                                    <span className={styles.rupeesInputIcon}>
                                        <Icon
                                            width={12}
                                            height={12}
                                            name="IndianRupee"
                                        />
                                    </span>
                                    <Form.Item
                                        name="price"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please Enter your Price!",
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
                                                "Please Enter your Status!",
                                        },
                                    ]}
                                >
                                    <Select
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
                                    {subscriptionId && (
                                        <Button
                                            onClick={onDeleteClick}
                                            loading={deleteSubscriptionsLoading}
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
                                        {!subscriptionId
                                            ? "Add Plan"
                                            : "Update"}
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

export default AddSubscription;
