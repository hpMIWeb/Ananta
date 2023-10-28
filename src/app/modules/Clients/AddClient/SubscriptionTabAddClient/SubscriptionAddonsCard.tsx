import { Form, InputNumber } from "antd";
import React, { memo, useEffect, useState } from "react";
import styles from "./subscriptionTabAddClient.module.scss";
import Select from "../../../../../components/Select/Index";
import Button from "../../../../../components/Button/Index";
import classNames from "classnames";
import Icon from "../../../../../components/Icon/Index";
import { getAddonsReducersListApi } from "../../../../../redux/getAddonsReducers";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../../../../components/Input/Index";
import { RoleTypes } from "../../../../../utils/constant";
import Cookies from "js-cookie";

const SubscriptionAddonsCard = memo(
  ({
    handleAddonChange,
    handleRemoveAddon,
    cardIndex,
    subscriptionAddons,
    setTotalAddonAmount,
  }: any) => {
    const [selectNumber, setSelectNumber] = useState(1);
    console.log("subscriptionAddons", subscriptionAddons);
    const currentAddon = subscriptionAddons[cardIndex];

    const [addOnType, setAddOnType] = useState("");
    const [selectedAddonsPrice, setSelectedAddonPrice] = useState(0);
    const roleType = Cookies.get("roleTypeName");
    const [selectAddonDetails, setSelectedAddonDetails] = useState<any>(
      {} as any
    );
    const [addOnListOpts, setAddOnListOpts] = useState([]);

    const addonsCardList = useSelector(
      (state: any) => state.getAddonsList.data
    );

    const superAdminAddonType = [
      {
        value: "storage_space",
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
        value: "storage_space",
        label: "Storage Space",
      },
      {
        value: "client",
        label: "Clients",
      },
      {
        value: "office_users",
        label: "Office Users",
      },
      {
        value: "client_users",
        label: "Client Users",
      },
      {
        value: "vendor_users",
        label: "Vendor Users",
      },
      {
        value: "transactional_credit",
        label: "Transactional Credit",
      },
      {
        value: "branches",
        label: "Branches",
      },
      {
        value: "feature",
        label: "Feature",
      },
      {
        value: "turnover",
        label: "Turnover",
      },
      {
        value: "sales_and_purchase",
        label: "Sales And Purchase",
      },
      {
        value: "credit_and_debit_notes",
        label: "Credit And Debit notes",
      },
      {
        value: "receipt_and_payments",
        label: "Receipt and payments",
      },
      {
        value: "contras",
        label: "Contras",
      },
      {
        value: "journals",
        label: "Journals",
      },
      {
        value: "stock_journals",
        label: "Stock Journals",
      },
      {
        value: "transactional_all",
        label: "Transactional All",
      },
    ];

    const addonTypeOption =
      roleType === RoleTypes.SuperAdmin
        ? superAdminAddonType
        : caAdminAddonType;
    // const getAddOnsList = () => {
    //     return addonsCardList.filter(
    //         (a: any) => a.add_on_type === addOnType
    //     );
    // };

    const handleQtyChange = (value: any) => {
      //  if (isNaN(value)) return false;
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
      //  setSelectedAddonPrice(selectedAddonData.price);

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

    // const calculateTotal = () => {
    //   const selectedAddonData = addonsCardList.find(
    //     (a: any) => a._id === currentAddon.addOnPlans
    //   );
    //   const addonPrice = selectedAddonData ? selectedAddonData.price : 0;
    //   setSelectedAddonPrice(addonPrice * selectNumber);
    //   currentAddon.addOnPrice = addonPrice * selectNumber;
    //   const total = subscriptionAddons.reduce(
    //     (acc: any, addon: any) => acc + addon.addonsPrice,
    //     0
    //   );
    //   setTotalAddonAmount(total);
    // };

    const calculateTotal = () => {
      const selectedAddonData = addonsCardList.find(
        (a: any) => a._id === currentAddon.addOnPlans
      );
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
      setAddOnListOpts(addOnList);
    }, [addOnType]);

    const handlerIncrease = () => {
      let newNumber = 0;
      setSelectNumber((prev) => (newNumber = prev + 1));
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
      setSelectNumber((prev) => (newNumber = prev - 1));
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

      let addonStr =
        selectAddonDetails.add_on_title +
        " " +
        selectAddonDetails.add_on_type +
        " @ " +
        pricePrefix +
        selectAddonDetails.price +
        priceSuffix;

      let dayStr = "";

      switch (selectAddonDetails.time_period_type) {
        case "DAY": {
          dayStr = selectAddonDetails.time_period > 1 ? "Days" : "Day";
          break;
        }
        case "MONTH": {
          dayStr = selectAddonDetails.time_period > 1 ? "Months" : "Month";
          break;
        }
        default: {
          dayStr = selectAddonDetails.time_period_type;
          break;
        }
      }

      const durationStr =
        ", For " + selectAddonDetails.time_period + " " + dayStr;

      const priceStr = ", " + pricePrefix + selectedAddonsPrice + priceSuffix;

      return addonStr.concat(durationStr).concat(priceStr);
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
                    message: "Please Enter your Subscription Plan!",
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
                />
              </Form.Item>
            </div>
            <div className="col-6">
              <Form.Item
                name="addOnPlans" //TODO: need to check this - due to this Id display as value
                className="customAddClientSelectOptions formItemSelect33"
                rules={[
                  {
                    required: true,
                    message: "Please Enter your Subscription Plan!",
                  },
                ]}
              >
                <Select
                  options={addOnListOpts}
                  onChange={(e: any) => handleAddonPlanChange(e)}
                  placeholder="Select AddOn"
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
                  className={classNames("cancelBtn", styles.deleteCardBtn)}
                  type="primary"
                  onClick={() => {
                    handleAddOnRemove(cardIndex);
                  }}
                  danger
                >
                  <Icon height={14} width={14} name="trashIcon" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-auto align-self-center"
          style={{ maxWidth: "150px", width: "100px" }}
        >
          <p className={classNames("text-end mb-2", styles.subscriptionPrice)}>
            Rs. {selectedAddonsPrice.toFixed(2)}/-
          </p>
        </div>
        {selectAddonDetails.add_on_title && selectAddonDetails.price && (
          <div className={classNames("row g-0", styles.addonDetails)}>
            <p className="semiBold">{generateAddonDetails()}</p>
          </div>
        )}
      </div>
    );
  }
);

export default SubscriptionAddonsCard;
