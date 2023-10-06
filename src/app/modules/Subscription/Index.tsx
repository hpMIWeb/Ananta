import classNames from "classnames";
import styles from "./subscription.module.scss";
import Tabs from "../../../components/Tabs/Index";
import SubscriptionTab from "./SubscriptionTab/Index";
import SubscriptionAddOns from "./SubscriptionAddOns/Index";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getSubscriptionsListApi } from "../../../redux/getSubscriptionsReducers";
import { resetStateCreateSubscriptions } from "../../../redux/createSubscriptionsReducers";
import { getAddonsReducersListApi } from "../../../redux/getAddonsReducers";
import { resetStateCreateAddons } from "../../../redux/createAddonsReducers";
import { resetStateDeleteSubscriptions } from "../../../redux/deletePromoCodeReducers";
import { useAppDispatch } from "../../states/store";
import Button from "../../../components/Button/Index";
import Icon from "../../../components/Icon/Index";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Subscription = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigate();
    const [activeTab, setActiveTab] = useState("1");

    const onChange = (key: any) => {
        setActiveTab(key);
    };

    const items = [
        {
            key: "1",
            label: `Subscription`,
            children: <SubscriptionTab />,
        },
        {
            key: "2",
            label: `AddOns`,
            children: <SubscriptionAddOns />,
        },
    ];

    const handleNewClick = () => {
        if (activeTab === "1") {
            navigation("/subscription/add-subscription");
        } else {
            navigation("/addons/create");
        }
    };

    useEffect(() => {
        dispatch(getSubscriptionsListApi());
        dispatch(getAddonsReducersListApi());
        dispatch(resetStateCreateSubscriptions());
        dispatch(resetStateDeleteSubscriptions());
        dispatch(resetStateCreateAddons());
    }, []);

    return (
        <div className={classNames("card mb-3", styles.subscriptionCardBox)}>
            <div className={styles.subscriptionCardBody}>
                <Tabs
                    className="subscriptionTabs"
                    defaultActiveKey="1"
                    items={items}
                    onChange={onChange}
                    tabBarExtraContent={
                        <div className={styles.subscriptionHeaderBtnWrapper}>
                            <Button
                                className={classNames(
                                    styles.newSubscriptionBtn,
                                    "me-3"
                                )}
                                onClick={handleNewClick}
                                type="primary"
                                style={{ marginBottom: "12px" }}
                            >
                                <Icon name="plus" width={12.25} height={14} />
                                New
                            </Button>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default Subscription;
