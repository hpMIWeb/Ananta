import { Form } from "antd";
import React, { memo, useEffect, useState } from "react";
import styles from "./subscriptionTabAddClient.module.scss";
import Select from "../../../../../components/Select/Index";
import Button from "../../../../../components/Button/Index";
import classNames from "classnames";
import Icon from "../../../../../components/Icon/Index";
import { useSelector } from "react-redux";
import Input from "../../../../../components/Input/Index";
import { RoleTypes } from "../../../../../utils/constant";
import Cookies from "js-cookie";
import api from "../../../../utilities/apiServices";

const SubscriptionAddonsCard = memo(
    ({
        handleAddonChange,
        handleRemoveAddon,
        cardIndex,
        subscriptionAddons,
        setTotalAddonAmount,
        isEdit,
        selectedSubscriptionPlan,
    }: any) => {
        const currentAddon = subscriptionAddons[cardIndex];
        const [selectNumber, setSelectNumber] = useState(
            currentAddon ? currentAddon.addOnQuantity : 1
        );
        const [addOnType, setAddOnType] = useState(currentAddon.addOnType);
        const [selectedAddonsPrice, setSelectedAddonPrice] = useState(0);
        const roleType = Cookies.get("roleTypeName");
        const [selectAddonDetails, setSelectedAddonDetails] = useState<any>(
            {} as any
        );
        const [selectAddonDetailsForString, setSelectedAddonDetailsForString] =
            useState<any>({} as any);
        const [addOnListOpts, setAddOnListOpts] = useState([]);

        const getAddonsCardList = useSelector(
            (state: any) => state.getAddonsList.data
        );

        const [addonsCardList, setAddonsCardList] = useState<any>([
            getAddonsCardList,
        ]);

        useEffect(() => {
            getAddonsCardData();
        }, []);

        const getAddonsCardData = () => {
            api.getAddonList().then((resp: any) => {
                setAddonsCardList(resp.data);
                calculateTotal(resp.data);
                generateAddonDetails();
            });
        };
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
                value: "client",
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
                value: "Turnover",
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
            roleType === RoleTypes.SuperAdmin
                ? superAdminAddonType
                : caAdminAddonType;

        const handleQtyChange = (value: any) => {
            setSelectNumber(value);
            handleAddonChange(
                cardIndex,
                "addOnQuantity",
                selectNumber,
                selectedAddonsPrice,
                currentAddon.addOnPlanName,
                setSelectedAddonDetails
            );
        };

        const handleAddonTypeChange = (value: any) => {
            setAddOnType(value);
            getAddonsCardData();

            const addOnList = addonsCardList.filter(
                (a: any) => a.add_on_type === value
            );

            setAddOnListOpts(addOnList);
            currentAddon.addOnPlans = undefined;
            setSelectedAddonDetailsForString({});
            generateAddonDetails();
            handleAddonChange(
                cardIndex,
                "addOnType",
                value,
                selectedAddonsPrice,
                currentAddon.addOnPlanName
            );
        };

        const handleAddonPlanChange = (value: any) => {
            let selectedAddonData = addonsCardList.filter(
                (a: any) => a._id === value
            )[0];

            let selectedAddonData1 = addonsCardList.filter(
                (a: any) => a._id === value
            )[0];

            setSelectedAddonDetailsForString(selectedAddonData1);
            if (selectedSubscriptionPlan.period_type === "MONTH") {
                if (selectedAddonData.time_period_type === "MONTH") {
                    let newAmountPerMonth =
                        selectedAddonData.price / selectedAddonData.time_period;
                    selectedAddonData.price =
                        newAmountPerMonth * selectedSubscriptionPlan.period;
                } else {
                    let newAmountAsPerDay =
                        selectedAddonData.price / selectedAddonData.time_period;

                    let newAmountAsPerMonth = newAmountAsPerDay * 30; // 30day per month
                    selectedAddonData.price =
                        newAmountAsPerMonth * selectedSubscriptionPlan.period;
                }
            } else if (selectedSubscriptionPlan.period_type === "DAY") {
                let newAmount =
                    selectedAddonData.price / selectedAddonData.time_period;

                selectedAddonData.price =
                    newAmount * selectedAddonData.time_period;

                /// new
                if (selectedAddonData.time_period_type === "MONTH") {
                    let newAmountPerMonth =
                        selectedAddonData.price / selectedAddonData.time_period;
                    selectedAddonData.price =
                        newAmountPerMonth * selectedSubscriptionPlan.period;
                } else {
                    let newAmountAsPerDay =
                        selectedAddonData.price / selectedAddonData.time_period;

                    let newAmountAsPerMonth = newAmountAsPerDay * 30; // 30day per month
                    selectedAddonData.price =
                        newAmountAsPerMonth * selectedSubscriptionPlan.period;
                }
            }

            setSelectedAddonDetails(selectedAddonData);
            setSelectedAddonPrice(selectedAddonData.price * selectNumber);

            handleAddonChange(
                cardIndex,
                "addOnPlans",
                value,
                selectedAddonData.price * selectNumber,
                currentAddon.addOnPlanName
            );
        };

        const handleAddOnRemove = (index: Number) => {
            calculateTotal();
            handleRemoveAddon(cardIndex);
        };

        const calculateTotal = (addonsCardList12 = []) => {
            let selectedAddonData = addonsCardList.find(
                (a: any) => a._id === currentAddon.addOnPlans
            );
            if (addonsCardList12.length > 0) {
                selectedAddonData = addonsCardList12.find(
                    (a: any) => a._id === currentAddon.addOnPlans
                );
            }

            const addonPrice = selectedAddonData ? selectedAddonData.price : 0;
            const updatedAddon = {
                ...currentAddon,
                addOnPrice: addonPrice * selectNumber,
            };

            // Assuming subscriptionAddons is an array, update it with the updated addon object.
            const updatedSubscriptionAddons = [...subscriptionAddons];
            updatedSubscriptionAddons[cardIndex] = updatedAddon;

            setSelectedAddonPrice(addonPrice * selectNumber);

            const total = updatedSubscriptionAddons.reduce(
                (acc: any, addon: any) => acc + addon.addOnPrice,
                0
            );

            setTotalAddonAmount(total);
        };

        useEffect(() => {
            calculateTotal();
            // Recalculate the total price when either quantity or addon value changes
        }, [currentAddon.addOnPlans, selectNumber, subscriptionAddons]);

        // page load effect
        useEffect(() => {
            const addOnList = addonsCardList
                .filter((a: any) => a.add_on_type === addOnType)
                .map((a: any) => ({
                    value: a._id,
                    label: a.add_on_title,
                }));
            setAddOnListOpts(addOnList);
        }, [addOnType, addonsCardList]);

        const handlerIncrease = () => {
            let newNumber = 0;
            setSelectNumber((prev: number) => (newNumber = prev + 1));
            handleAddonChange(
                cardIndex,
                "addOnQuantity",
                newNumber,
                selectedAddonsPrice,
                currentAddon.addOnPlanName,
                setSelectedAddonDetails
            );
        };

        const handlerDecrease = () => {
            let newNumber = 0;
            setSelectNumber((prev: number) => (newNumber = prev - 1));
            handleAddonChange(
                cardIndex,
                "addOnQuantity",
                newNumber,
                selectedAddonsPrice,
                currentAddon.addOnPlanName,
                setSelectedAddonDetails
            );
        };

        const generateAddonDetails = () => {
            const priceSuffix = "/-";
            const pricePrefix = " Rs ";

            // Check if selectAddonDetailsForString is empty
            if (
                !selectAddonDetailsForString ||
                Object.keys(selectAddonDetailsForString).length === 0
            ) {
                return "";
            }

            let addonStr =
                selectAddonDetailsForString.add_on_title +
                " " +
                selectAddonDetailsForString.add_on_type +
                " @ " +
                pricePrefix +
                selectAddonDetailsForString.price +
                priceSuffix;

            let dayStr = "";

            switch (selectAddonDetailsForString.time_period_type) {
                case "DAY": {
                    dayStr =
                        selectAddonDetailsForString.time_period > 1
                            ? "Days"
                            : "Day";
                    break;
                }
                case "MONTH": {
                    dayStr =
                        selectAddonDetailsForString.time_period > 1
                            ? "Months"
                            : "Month";
                    break;
                }
                default: {
                    dayStr = selectAddonDetailsForString.time_period_type;
                    break;
                }
            }

            const durationStr =
                ", For " +
                selectAddonDetailsForString.time_period +
                " " +
                dayStr;

            return addonStr.concat(durationStr);
        };

        return (
            <div className="row g-3 js-addons-row">
                <div className="col">
                    <label className="form-label mb-1">AddOn Plans</label>
                    <div className={classNames("row g-3")}>
                        <div className="col-6">
                            <Form.Item
                                className="customAddClientSelectOptions formItemSelect33"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your Subscription Plan!",
                                    },
                                ]}
                                style={{ height: 33 }}
                            >
                                <Select
                                    options={addonTypeOption}
                                    onChange={(e: any) => {
                                        handleAddonTypeChange(e);
                                        setAddOnType(e);
                                    }}
                                    showSearch
                                    placeholder="Select Type"
                                    value={currentAddon.addOnType || undefined}
                                />
                            </Form.Item>
                        </div>
                        <div className="col-6">
                            <Form.Item
                                //  name="addOnPlans" //TODO: need to check this - due to this Id display as value
                                className="customAddClientSelectOptions formItemSelect33"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your Addon Plan!",
                                    },
                                ]}
                            >
                                <Select
                                    options={addOnListOpts}
                                    onChange={(e: any) =>
                                        handleAddonPlanChange(e)
                                    }
                                    placeholder="Select AddOn"
                                    value={currentAddon.addOnPlans || undefined}
                                    disabled={!isEdit}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </div>
                <div className="col-auto">
                    <div className="row g-0">
                        <div className="col d-flex">
                            <div className="col padding8 d-flex flex-column">
                                <label
                                    className="mb-2 form-label"
                                    style={{ fontSize: 12, minWidth: "auto" }}
                                >
                                    Qty
                                </label>
                                <Form.Item initialValue={selectNumber}>
                                    <Input
                                        style={{
                                            width: 110,
                                            marginTop: "2px",
                                            border: "none",
                                        }}
                                        onKeyPress={(event: any) => {
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                        defaultValue={1}
                                        className="customInputNumber"
                                        addonBefore={
                                            <Button
                                                disabled={selectNumber === 1}
                                                style={{ padding: 10 }}
                                                className="transparentBtn"
                                                onClick={handlerDecrease}
                                            >
                                                -
                                            </Button>
                                        }
                                        addonAfter={
                                            <Button
                                                style={{ padding: 10 }}
                                                className="transparentBtn"
                                                onClick={handlerIncrease}
                                                disabled={!isEdit}
                                            >
                                                +
                                            </Button>
                                        }
                                        value={selectNumber}
                                        onChange={(e: any) => {
                                            handleQtyChange(e);
                                        }}
                                        min={1}
                                        max={100}
                                        step={1}
                                        controls
                                        disabled={!isEdit}
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-auto padding8 align-self-center">
                                <Button
                                    className={classNames(
                                        "cancelBtn",
                                        styles.deleteCardBtn
                                    )}
                                    type="primary"
                                    onClick={() => {
                                        handleAddOnRemove(cardIndex);
                                    }}
                                    danger
                                    disabled={!isEdit}
                                >
                                    <Icon
                                        height={14}
                                        width={14}
                                        name="trashIcon"
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="col-auto align-self-center"
                    style={{ maxWidth: "150px", width: "100px" }}
                >
                    <p
                        className={classNames(
                            "text-end mb-2",
                            styles.subscriptionPrice
                        )}
                    >
                        Rs. {selectedAddonsPrice.toFixed(2)}/-
                    </p>
                </div>
                {selectAddonDetails.add_on_title &&
                    selectAddonDetails.price && (
                        <div
                            className={classNames(
                                "row g-0",
                                styles.addonDetails
                            )}
                        >
                            <p className="semiBold">{generateAddonDetails()}</p>
                        </div>
                    )}
            </div>
        );
    }
);

export default SubscriptionAddonsCard;
