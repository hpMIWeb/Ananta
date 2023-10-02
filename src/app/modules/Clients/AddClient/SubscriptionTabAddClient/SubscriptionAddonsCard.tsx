import { Form, InputNumber } from "antd";
import React, { memo, useEffect, useState } from "react";
import styles from "./subscriptionTabAddClient.module.scss";
import Select from "../../../../../components/Select/Index";
import Button from "../../../../../components/Button/Index";
import classNames from "classnames";
import Icon from "../../../../../components/Icon/Index";
import { getAddonsReducersListApi } from "../../../../../redux/getAddonsReducers";
import { useDispatch, useSelector } from "react-redux";

const SubscriptionAddonsCard = memo(
    ({
        handleAddonChange,
        handleRemoveAddon,
        cardIndex,
        subscriptionAddons,
        setTotalAddonAmount,
    }: any) => {
        const [selectNumber, setSelectNumber] = useState(1);
        const currentAddon = subscriptionAddons[cardIndex];

        const [addOnType, setAddOnType] = useState("");
        const [selectedAddonsPrice, setSelectedAddonPrice] = useState(0);
        const [selectAddonDetails, setSelectedAddonDetails] = useState<any>(
            {} as any
        );
        const [addOnListOpts, setAddOnListOpts] = useState([]);

        const addonsCardList = useSelector(
            (state: any) => state.getAddonsList.data
        );

        // const getAddOnsList = () => {
        //     return addonsCardList.filter(
        //         (a: any) => a.add_on_type === addOnType
        //     );
        // };

        const handleQtyChange = (value: any) => {
            setSelectNumber(value);
            handleAddonChange(
                cardIndex,
                "addOnQuantity",
                value,
                selectedAddonsPrice,
                currentAddon.addOnPlanName,
                setSelectedAddonDetails
            );
        };

        const handleAddonTypeChange = (value: any) => {
            setAddOnType(value);
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
            console.log("selectedAddonData", selectedAddonData);
            //  setSelectedAddonPrice(selectedAddonData.price);
            setSelectedAddonDetails(selectedAddonData);
            setSelectedAddonPrice(selectedAddonData.price * selectNumber);
            handleAddonChange(
                cardIndex,
                "addOnPlans",
                value,
                selectedAddonsPrice,
                currentAddon.addOnPlanName
            );
        };

        useEffect(() => {
            // Recalculate the total price when either quantity or addon value changes
            const selectedAddonData = addonsCardList.find(
                (a: any) => a._id === currentAddon.addOnPlans
            );
            const addonPrice = selectedAddonData ? selectedAddonData.price : 0;
            setSelectedAddonPrice(addonPrice * selectNumber);
            console.log(selectedAddonData);
            currentAddon.addonsPrice = addonPrice * selectNumber;
            const total = subscriptionAddons.reduce(
                (acc: any, addon: any) => acc + addon.addonsPrice,
                0
            );
            setTotalAddonAmount(total);
        }, [currentAddon.addOnPlans, selectNumber, subscriptionAddons]);

        // const getAddOnsListOptions = getAddOnsList().map((a: any) => ({
        //     value: a._id,
        //     label: a.add_on_title,
        // }));

        // page load effect
        useEffect(() => {
            const addOnList = addonsCardList
                .filter((a: any) => a.add_on_type === addOnType)
                .map((a: any) => ({
                    value: a._id,
                    label: a.add_on_title,
                }));
            console.log(addOnList);
            setAddOnListOpts(addOnList);
        }, [addOnType]);

        const handlerIncrease = () => {
            setSelectNumber((prev) => prev + 1);
        };

        const handlerDecrease = () => {
            setSelectNumber((prev) => prev - 1);
        };

        return (
            <div className="row g-3 js-addons-row">
                <div className="col">
                    <label className="form-label mb-1">Addon Plans</label>
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
                                    options={[
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
                                    ]}
                                    onChange={(e: any) => {
                                        handleAddonTypeChange(e);
                                        setAddOnType(e);
                                    }}
                                    showSearch
                                    placeholder="Select Type"
                                />
                            </Form.Item>
                        </div>
                        <div className="col-6">
                            <Form.Item
                                // name="addOnPlans" //TODO: need to check this - due to this Id display as value
                                className="customAddClientSelectOptions formItemSelect33"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please Enter your Subscription Plan!",
                                    },
                                ]}
                            >
                                <Select
                                    options={
                                        // getAddOnsListOptions &&
                                        // getAddOnsListOptions.length > 0
                                        //     ? getAddOnsListOptions
                                        //     : []
                                        addOnListOpts
                                    }
                                    // showSearch
                                    onChange={(e: any) =>
                                        handleAddonPlanChange(e)
                                    }
                                    placeholder="Select Addons"
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
                                <Form.Item
                                    //name="addOnQuantity" //TODO: Need to think on this - how to update the field on final submit button
                                    initialValue={selectNumber}
                                >
                                    <InputNumber
                                        style={{ width: 110 }}
                                        onKeyPress={(event: any) => {
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                        defaultValue={1}
                                        className="customInputNumber"
                                        addonBefore={
                                            <Button
                                                disabled={selectNumber === 0}
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
                                            >
                                                +
                                            </Button>
                                        }
                                        value={selectNumber}
                                        onChange={(e: any) => {
                                            handleQtyChange(e);
                                            // setSelectNumber(e);
                                        }}
                                        min={0}
                                        max={100}
                                        step={1}
                                        controls
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
                                    onClick={() => handleRemoveAddon(cardIndex)}
                                    danger
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
                    <div className="row g-0">
                        <p className="semiBold" style={{ color: "#20c997" }}>
                            {selectAddonDetails.add_on_title}
                            {" @ RS "}
                            {selectAddonDetails.price} /-{"   , For "}
                            {selectAddonDetails.time_period}{" "}
                            {selectAddonDetails.time_period_type}
                        </p>
                    </div>
                </div>
                <div className="col-auto align-self-center">
                    <p
                        className={classNames(
                            "text-end mb-2",
                            styles.subscriptionPrice
                        )}
                    >
                        Rs. {selectedAddonsPrice.toFixed(2)}/-
                    </p>
                </div>
            </div>
        );
    }
);

export default SubscriptionAddonsCard;
