import {
    JSXElementConstructor,
    ReactElement,
    ReactNode,
    useEffect,
    useState,
} from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Card, Col, DatePicker, Drawer, Form, Row, Select } from "antd";
import styles from "./subscriptionTabAddClient.module.scss";
import Button from "../../../../../components/Button/Index";
import Icon from "../../../../../components/Icon/Index";
import { SearchOutlined } from "@ant-design/icons";
import Input from "../../../../../components/Input/Index";
import SubscriptionCardPoint from "../../../../../components/SubscriptionCard/SubscriptionCardPoint";
import SubscriptionAddonsCard from "./SubscriptionAddonsCard";
import { getAddonsReducersListApi } from "../../../../../redux/getAddonsReducers";
import { getPromocodeReducersListApi } from "../../../../../redux/getPromocodeReducers";
import { JSX } from "react/jsx-runtime";
import { useAppDispatch } from "../../../../states/store";
import { Option } from "antd/es/mentions";
import { toast } from "react-toastify";
import { ClientType, RoleTypes } from "../../../../../utils/constant";
import Cookies from "js-cookie";
import dayjs from "dayjs";

const SubscriptionTabAddClient = ({
    onChange,
    setFormValue,
    clientType,
    clientValue,
    selectedClientData,
}: any) => {
    const dispatch = useAppDispatch();
    const subscriptionCardList = useSelector(
        (state: any) => state.getSubscriptionsListApi.data
    );
    const promoCardList = useSelector(
        (state: any) => state.getPromocodeList.data
    );
    const [subscriptionAddons, setSubscriptionAddons] = useState<any>([]);
    const [promoCodeList, setPromoCodeList] = useState<any>(promoCardList);

    const [form] = Form.useForm();
    const startDate = Form.useWatch("startDate", form);
    const subscriptionType = Form.useWatch("subscriptionType", form);
    const subscriptionPlan = Form.useWatch("subscriptionPlan", form);
    const adminDiscount = Form.useWatch("adminDiscount", form) || 0;
    const roundOff = Form.useWatch("roundOff", form) || 0;
    const [openPromoCodeDrawer, setOpenPromoCodeDrawer] = useState(false);

    const [totalAddonAmount, setTotalAddonAmount] = useState(0);

    const [filteredPromoCodes, setFilteredPromoCodes] = useState(promoCardList);
    const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
    const [selectedCouponId, setSelectedCouponId] = useState<string>("");
    const [billingMethod, setBillingMethod] = useState<string>("subscription");
    const [makeValidate, setMakeValidate] = useState(true);
    const [couponDiscount, setCouponDiscount] = useState<number>(0);
    const roleType = Cookies.get("roleTypeName");

    // Search input change handler
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        // Filter the promo codes based on the search input
        const filteredCodes = promoCardList.filter((code: any) =>
            code.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPromoCodes(filteredCodes);
    };
    useEffect(() => {
        dispatch(getAddonsReducersListApi());
        dispatch(getPromocodeReducersListApi());
    }, []);

    const showDrawer = () => {
        dispatch(getAddonsReducersListApi());
        dispatch(getPromocodeReducersListApi());
        setPromoCodeList(promoCardList);
        setOpenPromoCodeDrawer(true);
    };

    const onClose = () => {
        setOpenPromoCodeDrawer(false);
    };

    const [subscriptionValue, setSubscriptionValue] = useState<any>({});

    const generateFeatureLists = (features: any) => {
        const featureLists: any = [];

        features.map((f: any, index: number) => {
            const [name, value] = f;
            if (value) {
                const featureList = <li key={index}>{name}</li>;
                featureLists.push(featureList);
            }
        });
        for (let i = 0; i < features.length; i += 3) {}

        return (
            <ul
                style={{ display: "inline-block" }}
                className="ps-3 mt-1 semiBold mb-1 feature-description-list"
            >
                {" "}
                {featureLists}{" "}
            </ul>
        );
    };

    const cardDesc = (details: any) => {
        const features = details.features || {};
        const noOfUsers = details.no_of_users || {};
        console.log("details", details);
        return [
            {
                iconName: "time",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Time Period
                        </p>
                        <p className="semiBold">
                            {details.period}
                            {details.period_type === "DAY" ? "Days" : "Months"}
                        </p>
                    </>
                ),
            },
            {
                iconName: "storage",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">Storage</p>
                        <p className="semiBold">{details.storage_space} GB</p>
                    </>
                ),
            },
            {
                iconName: "client",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">Clients</p>
                        <p className="semiBold">{details.no_of_client}</p>
                    </>
                ),
            },
            {
                iconName: "transaction",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Transactions
                        </p>
                        <p className="semiBold">{details.no_of_transactions}</p>
                    </>
                ),
            },
            {
                iconName: "employee",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Employees
                        </p>
                        <p className="semiBold">{details.no_of_employee}0</p>
                    </>
                ),
            },
            {
                iconName: "users",
                className: "w-100",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">Users</p>
                        <ul className="ps-3 mt-1 semiBold mb-1 feature-description-list">
                            <li>
                                CA Office Users -{" "}
                                {noOfUsers.office_users
                                    ? noOfUsers.office_users
                                    : 0}
                            </li>
                            <li>
                                Client Office Users -{" "}
                                {noOfUsers.client_office_users
                                    ? noOfUsers.client_office_users
                                    : 0}
                            </li>
                            <li>
                                Vendor Users -{" "}
                                {noOfUsers.client_vendor
                                    ? noOfUsers.client_vendor
                                    : 0}
                            </li>
                        </ul>
                    </>
                ),
            },
            {
                iconName: "modules",
                className: "w-100",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">Modules</p>
                        {generateFeatureLists(Object.entries(features))}
                    </>
                ),
            },
            {
                customRender: (
                    <div className="col w-100 text-center">
                        <hr />
                        <h3
                            style={{ fontSize: "1.728rem" }}
                            className={classNames(
                                "fw-bold mb-0 mt-3",
                                styles.addCaPlanHeader
                            )}
                        >
                            Rs. {details.price}
                        </h3>
                        <p className="mb-1">Price</p>
                    </div>
                ),
            },
        ];
    };

    const selectedSubscriptionPlan =
        subscriptionCardList.find(
            (plan: any) => plan._id === subscriptionPlan
        ) || {};

    const onValuesChange = (changedFields: any, allFields: any) => {
        setSubscriptionValue(allFields);
    };

    const handleAddonClick = () => {
        const newAddon = {
            addOnType: "",
            addOnPlans: "",
            addOnPlanName: "",
            addOnQuantity: 1,
            addOnPrice: 0,
        };
        setSubscriptionAddons((prevAddons: any) => [...prevAddons, newAddon]);
    };

    useEffect(() => {
        if (selectedClientData && Object.keys(selectedClientData).length > 0) {
            let subscriptionDetails = selectedClientData.subscriptionDetails;
            const addons = subscriptionDetails?.addOns || [];
            setBillingMethod(subscriptionDetails?.subscriptionType);
            setSubscriptionValue({
                subscriptionType: subscriptionDetails?.subscriptionType,
                subscriptionPlan: subscriptionDetails?.subscriptionPlan?._id,
                startDate: dayjs(subscriptionDetails?.startDate),
                endDate: dayjs(subscriptionDetails?.endDate),
                promoCode: subscriptionDetails?.promoCode?._id,
                roundOff: subscriptionDetails?.roundOff,
            });
            setSubscriptionAddons(addons);
            setSelectedCoupon(subscriptionDetails.promoCode);
            setSelectedCouponId(subscriptionDetails?.promoCode?._id);

            form.setFieldsValue({
                subscriptionType: subscriptionDetails?.subscriptionType,
                subscriptionPlan: subscriptionDetails?.subscriptionPlan?._id,
                startDate: dayjs(subscriptionDetails?.startDate),
                endDate: dayjs(subscriptionDetails?.endDate),
                promoCode: subscriptionDetails?.promoCode?._id,
                adminDiscount: subscriptionDetails.adminDiscount,
                roundOff: subscriptionDetails.roundOff,
            });
        }
    }, [selectedClientData]);

    const isPlanSelected = !!subscriptionValue.subscriptionPlan;
    const period_type =
        selectedSubscriptionPlan.period_type === "DAY" ? "day" : "months";

    const monthAdded = startDate?.add(
        selectedSubscriptionPlan.period,
        period_type
    );

    const taxableValue =
        selectedSubscriptionPlan.price +
        totalAddonAmount -
        adminDiscount -
        couponDiscount;
    const gstAmount = (taxableValue / 100) * 18;
    const invoiceAmount =
        taxableValue +
        gstAmount +
        (isNaN(parseFloat(roundOff)) ? 0 : parseFloat(roundOff));

    const handleRemoveAddon = (index: any) => {
        const updatedAddons = subscriptionAddons.filter(
            (_: any, i: any) => i !== index
        );
        setSubscriptionAddons(updatedAddons);

        // Reset total addon amount in case of no addons
        if (updatedAddons.length === 0) {
            setTotalAddonAmount(0);
        }
    };

    const handleAddonChange = (
        index: number,
        field: any,
        value: any,
        priceValue: number,
        addOnPlanName: string
    ) => {
        const updatedAddons = subscriptionAddons.map(
            (addon: any, i: number) => {
                if (i === index) {
                    return {
                        ...addon,
                        [field]: value,
                        addOnPrice: priceValue,
                        planName: addOnPlanName,
                    };
                }
                return addon;
            }
        );
        setSubscriptionAddons(updatedAddons);
    };

    const onFinish = (values: any) => {
        if (billingMethod === "subscription") {
            const {
                subscriptionType,
                subscriptionPlan,
                promocode,
                startDate,
                adminDiscount,
                roundOff,
            } = values;

            const formattedAddons = subscriptionAddons.map((addon: any) => ({
                addOnType: addon.addOnType,
                addOnPlans: addon.addOnPlans,
                addOnQuantity: addon.addOnQuantity,
                addOnPrice: addon.addOnPrice,
            }));

            const period_type =
                selectedSubscriptionPlan.period_type === "DAY"
                    ? "day"
                    : "months";
            const monthAdded = startDate.add(
                selectedSubscriptionPlan.period,
                period_type
            );

            //const taxableValue = selectedSubscriptionPlan.price - adminDiscount;
            const taxableValue =
                selectedSubscriptionPlan.price +
                totalAddonAmount -
                (adminDiscount ?? 0) -
                couponDiscount;
            const gstAmount = (taxableValue / 100) * 18;
            const invoiceAmount =
                taxableValue +
                gstAmount +
                (isNaN(parseFloat(roundOff)) ? 0 : parseFloat(roundOff));

            const finalFormValues = {
                subscriptionType: subscriptionType
                    ? subscriptionType
                    : "subscription",
                subscriptionPlan,
                addOns: formattedAddons,
                promoCode:
                    selectedCouponId && selectedCouponId !== ""
                        ? selectedCouponId
                        : undefined, // Pass promocode if available, or omit it if not
                startDate,
                endDate: monthAdded,
                adminDiscount: adminDiscount ? adminDiscount : 0,
                invoicePrice: Math.round(invoiceAmount),
                roundOff: roundOff ? roundOff : 0,
            };

            setFormValue({ subscriptionDetails: finalFormValues });
        } else {
            const finalFormValues = {
                subscriptionType: subscriptionType
                    ? subscriptionType
                    : "subscription",
                startDate: dayjs(),
                endDate: dayjs(),
            };
            setFormValue({ subscriptionDetails: finalFormValues });
        }

        onChange(6);
    };

    useEffect(() => {
        if (selectedCoupon) {
            let discountVal = selectedCoupon.ammount;
            if (selectedCoupon.type === "Percentage") {
                const pctValue =
                    (selectedSubscriptionPlan.price * selectedCoupon.ammount) /
                    100;
                discountVal = pctValue;
            }

            // Validate `maxDiscount`
            if (discountVal > selectedCoupon.maxDiscount) {
                discountVal = selectedCoupon.maxDiscount;
            }

            // Validate `discountValue` with actual plan price
            if (discountVal > selectedSubscriptionPlan.price) {
                discountVal = selectedSubscriptionPlan.price;
            }

            setCouponDiscount(discountVal);
        }
    }, [selectedCoupon]);

    const applyCoupon = (coupon: any) => {
        setSelectedCoupon(coupon);
        setSelectedCouponId(coupon._id);
        setOpenPromoCodeDrawer(false);
        if (coupon) {
            toast.success(`Coupon "${coupon.name}" applied successfully!`);
        } else {
            toast.error("Please select a coupon.");
        }
    };

    return (
        <Form
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
            className="customAddForm"
            onValuesChange={onValuesChange}
        >
            <div className="my-3">
                <div className={classNames("row", styles.subscriptionFormBox)}>
                    <div
                        className={classNames(
                            "col-12 col-sm-8 col-md-7",
                            styles.subscriptionFormWrapper
                        )}
                    >
                        {roleType === RoleTypes.CAAdmin && (
                            <div className="row g-3">
                                <div
                                    className={classNames(
                                        "col-6",
                                        styles.subscriptionFormColumn
                                    )}
                                >
                                    <div className="mb-2">
                                        <label
                                            className={classNames(
                                                "form-label",
                                                styles.subscriptionFormLabel
                                            )}
                                        >
                                            Billing Method
                                            <sup className="text-danger fs--1">
                                                *
                                            </sup>
                                        </label>
                                        <Form.Item
                                            name="subscriptionType"
                                            className="customAddClientSelectOptions"
                                        >
                                            <Select
                                                options={[
                                                    {
                                                        value: "subscription",
                                                        label: "Subscription",
                                                    },
                                                    {
                                                        value: "invoicing",
                                                        label: "Invoicing",
                                                    },
                                                    {
                                                        value: "pay_per_use",
                                                        label: "Pay Per Use",
                                                    },
                                                ]}
                                                showSearch
                                                placeholder="Select Billing Type"
                                                onChange={(value: string) => {
                                                    setBillingMethod(value);
                                                    if (
                                                        value !== "subscription"
                                                    ) {
                                                        setMakeValidate(false);
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                        )}
                        {billingMethod === "subscription" && ( // Conditionally render this section
                            <>
                                <div className="row g-3">
                                    <div
                                        className={classNames(
                                            "col",
                                            styles.subscriptionFormColumn
                                        )}
                                    >
                                        <div className="mb-2">
                                            <label
                                                className={classNames(
                                                    "form-label",
                                                    styles.subscriptionFormLabel
                                                )}
                                            >
                                                Subscription Plan
                                                <sup className="text-danger fs--1">
                                                    *
                                                </sup>
                                            </label>
                                            <Form.Item
                                                name="subscriptionPlan"
                                                className="customAddClientSelectOptions"
                                                rules={[
                                                    {
                                                        required: makeValidate,
                                                        message:
                                                            "Please Enter your Subscription Plan!",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    options={subscriptionCardList.map(
                                                        (s: any) => ({
                                                            value: s._id,
                                                            label: s.plan_name,
                                                        })
                                                    )}
                                                    showSearch
                                                    placeholder="Select Plan"
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="col-auto align-self-center">
                                        <div className={styles.addCa}></div>
                                    </div>
                                    <div className="col-auto">
                                        {isPlanSelected && (
                                            <p
                                                className={classNames(
                                                    "text-end mb-2",
                                                    styles.subscriptionPrice
                                                )}
                                            >
                                                Rs.{" "}
                                                {selectedSubscriptionPlan.price}
                                                /-
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {[...subscriptionAddons].map(
                                    (addOns: any, index: number) => (
                                        <SubscriptionAddonsCard
                                            key={index}
                                            cardIndex={index}
                                            handleAddonChange={
                                                handleAddonChange
                                            }
                                            handleRemoveAddon={
                                                handleRemoveAddon
                                            }
                                            subscriptionAddons={
                                                subscriptionAddons
                                            } // Pass the subscriptionAddons array
                                            //totalAddonAmount={totalAddonAmount} // Pass the total addon amount
                                            setTotalAddonAmount={
                                                setTotalAddonAmount
                                            } // Pass the function to update total
                                        />
                                    )
                                )}
                                {isPlanSelected && (
                                    <div className="d-flex mt-2">
                                        <div className="me-auto">
                                            <Button
                                                className={
                                                    styles.addOwnerInfoBtn
                                                }
                                                onClick={handleAddonClick}
                                                type="primary"
                                            >
                                                <Icon
                                                    name="plus"
                                                    width={14.25}
                                                    height={16}
                                                />
                                                Add AddOns
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <hr className={styles.subscriptionLine} />
                                {isPlanSelected && (
                                    <div className="row">
                                        <div
                                            className={classNames(
                                                "col-auto",
                                                styles.subscriptionLineLeft
                                            )}
                                        >
                                            <div className="d-flex mb-3">
                                                <label
                                                    className="form-label form-label text-nowrap mt-2 me-2"
                                                    style={{ minWidth: 85 }}
                                                >
                                                    Start Date
                                                    <sup className="text-danger fs--1">
                                                        *
                                                    </sup>
                                                </label>
                                                <Form.Item
                                                    name="startDate"
                                                    rules={[
                                                        {
                                                            required:
                                                                makeValidate,
                                                            message:
                                                                "Please Enter Start Date!",
                                                        },
                                                    ]}
                                                >
                                                    <DatePicker
                                                        placeholder="Start Date"
                                                        style={{
                                                            maxWidth: 154,
                                                            marginBottom: 0,
                                                        }}
                                                        className="customFormDatePicker"
                                                        format="DD/MM/YYYY"
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <label
                                                    className="form-label form-label text-nowrap mt-1 me-2"
                                                    style={{
                                                        minWidth: 85,
                                                        top: 0,
                                                    }}
                                                >
                                                    End Date
                                                </label>
                                                <p
                                                    className={classNames(
                                                        "text-end mb-0",
                                                        styles.subscriptionPrice
                                                    )}
                                                >
                                                    {monthAdded ? (
                                                        <DatePicker
                                                            placeholder="Start Date"
                                                            style={{
                                                                maxWidth: 154,
                                                                marginBottom: 0,
                                                            }}
                                                            className="customFormDatePicker"
                                                            format="DD/MM/YYYY"
                                                            value={monthAdded}
                                                            disabled
                                                        />
                                                    ) : (
                                                        <DatePicker
                                                            placeholder="Start Date"
                                                            style={{
                                                                maxWidth: 154,
                                                                marginBottom: 0,
                                                            }}
                                                            className="customFormDatePicker"
                                                            format="DD/MM/YYYY"
                                                            disabled
                                                        />
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className={classNames(
                                                "col",
                                                styles.subscriptionLineRight
                                            )}
                                        >
                                            <div className="row rowPadding">
                                                <div className="col">
                                                    <p className="text-end mb-1">
                                                        Total
                                                    </p>
                                                </div>
                                                <div className="col-auto">
                                                    <div style={{ width: 100 }}>
                                                        <p
                                                            className="text-end mb-1"
                                                            id="total"
                                                        >
                                                            Rs.{" "}
                                                            {selectedSubscriptionPlan.price +
                                                                (subscriptionAddons &&
                                                                subscriptionAddons.length >
                                                                    0
                                                                    ? totalAddonAmount
                                                                    : 0)}
                                                            /-
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row rowPadding">
                                                <div className="col right-align-cell">
                                                    <a
                                                        className="text-end mb-1 promocode-link"
                                                        onClick={showDrawer}
                                                    >
                                                        Apply Promo Code
                                                    </a>
                                                </div>
                                                <div className="col-auto">
                                                    <div style={{ width: 100 }}>
                                                        <p
                                                            className="text-end mb-1 success-text"
                                                            id="total"
                                                        >
                                                            -Rs.{" "}
                                                            {couponDiscount}/-
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row rowPadding">
                                                <div className="col">
                                                    <p className="text-end mb-1">
                                                        Admin Discount
                                                    </p>
                                                </div>
                                                <div className="col-auto">
                                                    <div style={{ width: 100 }}>
                                                        <Form.Item
                                                            name="adminDiscount"
                                                            className="customAddFormSelectOptions"
                                                        >
                                                            <Input
                                                                onKeyPress={(
                                                                    event: any
                                                                ) => {
                                                                    if (
                                                                        !/[0-9]/.test(
                                                                            event.key
                                                                        )
                                                                    ) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                                defaultValue={0}
                                                                className="customAddFormInputText text-end"
                                                                maxLength="10"
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr
                                                className={
                                                    styles.subscriptionLine
                                                }
                                                style={{ marginTop: 0 }}
                                            />

                                            <div className="row rowPadding">
                                                <div className="col">
                                                    <p className="text-end mb-1">
                                                        Taxable Value
                                                    </p>
                                                </div>
                                                <div className="col-auto">
                                                    <div style={{ width: 100 }}>
                                                        <p
                                                            className="text-end mb-1"
                                                            id="total"
                                                        >
                                                            Rs. {taxableValue}/-
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {clientValue.state !==
                                                "Gujarat" && (
                                                <div className="row rowPadding">
                                                    <div className="col">
                                                        <p className="text-end mb-1">
                                                            GST @ 18%
                                                        </p>
                                                    </div>
                                                    <div className="col-auto">
                                                        <div
                                                            style={{
                                                                width: 100,
                                                            }}
                                                        >
                                                            <p
                                                                className="text-end mb-1"
                                                                id="total"
                                                            >
                                                                Rs.
                                                                {Math.round(
                                                                    gstAmount
                                                                )}
                                                                /-
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* {clientValue.state ===
                                                "Gujarat" && (
                                                <>
                                                    <div className="row rowPadding">
                                                        <div className="col">
                                                            <p className="text-end mb-1">
                                                                SGST @ 9%
                                                            </p>
                                                        </div>
                                                        <div className="col-auto">
                                                            <div
                                                                style={{
                                                                    width: 100,
                                                                }}
                                                            >
                                                                <p
                                                                    className="text-end mb-1"
                                                                    id="total"
                                                                >
                                                                    Rs.
                                                                    {Math.round(
                                                                        (taxableValue /
                                                                            100) *
                                                                            9
                                                                    )}
                                                                    /-
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row rowPadding">
                                                        <div className="col">
                                                            <p className="text-end mb-1">
                                                                CGST @ 9%
                                                            </p>
                                                        </div>
                                                        <div className="col-auto">
                                                            <div
                                                                style={{
                                                                    width: 100,
                                                                }}
                                                            >
                                                                <p
                                                                    className="text-end mb-1"
                                                                    id="total"
                                                                >
                                                                    Rs.
                                                                    {Math.round(
                                                                        (taxableValue /
                                                                            100) *
                                                                            9
                                                                    )}
                                                                    /-
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )} */}
                                            <div className="row rowPadding">
                                                <div className="col">
                                                    <p className="text-end mb-1">
                                                        GST @ 18%
                                                    </p>
                                                </div>
                                                <div className="col-auto">
                                                    <div
                                                        style={{
                                                            width: 100,
                                                        }}
                                                    >
                                                        <p
                                                            className="text-end mb-1"
                                                            id="total"
                                                        >
                                                            Rs.
                                                            {Math.round(
                                                                (taxableValue /
                                                                    100) *
                                                                    18
                                                            )}
                                                            /-
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row rowPadding">
                                                <div className="col">
                                                    <p className="text-end mb-1">
                                                        Round Off
                                                    </p>
                                                </div>
                                                <div className="col-auto">
                                                    <div style={{ width: 100 }}>
                                                        <Form.Item
                                                            name="roundOff"
                                                            className="customAddFormSelectOptions"
                                                        >
                                                            <Input
                                                                defaultValue={0}
                                                                className="customAddFormInputText text-end"
                                                                maxLength={6}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                style={{ marginTop: "-16px" }}
                                                className="row rowPadding"
                                            >
                                                <div className="col">
                                                    <p className="text-end mb-1">
                                                        <b>Invoice Value</b>
                                                    </p>
                                                </div>
                                                <div className="col-auto">
                                                    <div style={{ width: 100 }}>
                                                        <p
                                                            className="text-end mb-1"
                                                            id="total"
                                                        >
                                                            Rs.{" "}
                                                            {Math.round(
                                                                invoiceAmount
                                                            )}
                                                            /-
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div
                        className={classNames(
                            "col-12 col-sm-4 col-md-5",
                            styles.subscriptionFormWrapper
                        )}
                    >
                        {isPlanSelected && (
                            <div className={styles.addCaPlanBorder}>
                                <div className="mt-2 mb-3">
                                    <h2
                                        className={classNames(
                                            "fw-bold text-center mb-0",
                                            styles.addCaPlanHeader
                                        )}
                                    >
                                        {selectedSubscriptionPlan.plan_name}
                                    </h2>
                                    <p className="text-center mb-0">
                                        subscription
                                    </p>
                                </div>
                                <hr className={styles.subscriptionLine} />
                                <div className="mb-3 mt-3">
                                    <div
                                        className={classNames(
                                            "row row-cols-sm-2 row-cols-1",
                                            styles.subscriptionCardBox
                                        )}
                                    >
                                        {cardDesc(selectedSubscriptionPlan).map(
                                            (card, index) => (
                                                <SubscriptionCardPoint
                                                    key={index}
                                                    card={card}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className={classNames("col-12 my-2")}>
                    <div className="d-flex">
                        <div className="ms-auto">
                            <Button
                                style={{ minWidth: 104, marginRight: 12 }}
                                className="greyBtn"
                                onClick={() => onChange(4)}
                            >
                                Previous
                            </Button>
                            <Button
                                className={styles.nextBtn}
                                type="primary"
                                htmlType="submit"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Drawer
                title="Apply Coupon"
                placement="right"
                onClose={onClose}
                open={openPromoCodeDrawer}
            >
                <Row
                    gutter={[8, 8]}
                    className="form-row"
                    style={{ marginTop: "0" }}
                >
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 24 }}
                        style={{
                            float: "right",
                            marginBottom: "10px",
                            marginTop: "7px",
                        }}
                    >
                        <Input
                            placeholder="Search..."
                            className="search-box"
                            bordered={false}
                            onChange={handleSearch}
                            prefix={<SearchOutlined />}
                        />
                    </Col>
                </Row>
                {filteredPromoCodes.map((coupon: any) => (
                    <Card
                        key={coupon._id}
                        style={{
                            marginBottom: "16px",
                            borderRadius: "10px",
                            padding: "0",
                            textAlign: "center",
                            border: "1px solid #c7bdbd",
                        }}
                    >
                        <p
                            style={{
                                margin: "16px 0",
                                fontWeight: 600,
                                fontSize: "16px",
                            }}
                        >
                            {coupon.name}
                        </p>
                        <Button
                            type="primary"
                            style={{ width: "100%" }}
                            onClick={() => {
                                applyCoupon(coupon);
                            }}
                        >
                            Apply Coupon
                        </Button>
                    </Card>
                ))}
            </Drawer>
        </Form>
    );
};

export default SubscriptionTabAddClient;
