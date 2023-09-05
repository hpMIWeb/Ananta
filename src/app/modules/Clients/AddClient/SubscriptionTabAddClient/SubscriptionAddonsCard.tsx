import { Form, InputNumber } from "antd";
import React, { memo, useEffect, useState } from "react";
import styles from "./subscriptionTabAddClient.module.scss";
import Select from "../../../../components/ui/Select/Index";
import Button from "../../../../components/ui/Button/Index";
import classNames from "classnames";
import Icon from "../../../../components/ui/Icon/Index";
import { getAddonsReducersListApi } from "../../../../../redux/getAddonsReducers";
import { useDispatch, useSelector } from "react-redux";

const SubscriptionAddonsCard = memo(
    ({ handleAddonChange, handleRemoveAddon, cardIndex }: any) => {
        const [selectNumber, setSelectNumber] = useState(0);
        const [addOnType, setAddOnType] = useState("");

        const addonsCardList = useSelector(
            (state: any) => state.getAddonsList.data
        );

        const getAddOnsList = () => {
            return addonsCardList.filter(
                (a: any) => a.add_on_type === addOnType
            );
        };

        const handleQtyChange = (value: any) => {
            setSelectNumber(value);
            handleAddonChange(cardIndex, "addOnQuantity", value);
        };

        const handleAddonTypeChange = (value: any) => {
            setAddOnType(value);
            handleAddonChange(cardIndex, "addOnType", value);
        };

        const handleAddonPlanChange = (value: any) => {
            handleAddonChange(cardIndex, "addOnPlans", value);
        };

        const getAddOnsListOptions = getAddOnsList().map((a: any) => ({
            value: a._id,
            label: a.add_on_title,
        }));

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
                                name="addOnPlans"
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
                                    options={[...getAddOnsListOptions]}
                                    showSearch
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
                                <Form.Item name="addOnQuantity">
                                    <InputNumber
                                        style={{ width: 110 }}
                                        defaultValue={1}
                                        className="customInputNumber"
                                        addonBefore={
                                            <Button
                                                disabled={selectNumber === 0}
                                                style={{ padding: 10 }}
                                                className="transparentBtn"
                                                onClick={() =>
                                                    setSelectNumber(
                                                        (prev) => prev - 1
                                                    )
                                                }
                                            >
                                                -
                                            </Button>
                                        }
                                        addonAfter={
                                            <Button
                                                style={{ padding: 10 }}
                                                className="transparentBtn"
                                                onClick={() =>
                                                    setSelectNumber(
                                                        (prev) => prev + 1
                                                    )
                                                }
                                            >
                                                +
                                            </Button>
                                        }
                                        value={selectNumber}
                                        onChange={(e: any) => {
                                            handleQtyChange(e);
                                            setSelectNumber(e);
                                        }}
                                        min={0}
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
                            <div
                                style={{ padding: 8 }}
                                className="col-auto align-self-center"
                            >
                                <Button
                                    className={classNames(styles.infoCardBtn)}
                                    type="primary"
                                >
                                    <Icon height={14} width={14} name="info" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-auto align-self-center">
                    <p
                        className={classNames(
                            "text-end mb-2",
                            styles.subscriptionPrice
                        )}
                    >
                        Rs. 0/-
                    </p>
                </div>
            </div>
        );
    }
);

export default SubscriptionAddonsCard;
