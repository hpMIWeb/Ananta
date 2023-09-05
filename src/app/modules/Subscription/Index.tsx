import classNames from "classnames";
import styles from "./subscription.module.scss";
import Tabs from "../../components/Tabs/Index";
import SubscriptionTab from "./SubscriptionTab/Index";
import SubscriptionAddOns from "./SubscriptionAddOns/Index";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSubscriptionsListApi } from "../../../redux/getSubscriptionsReducers";
import { resetStateCreateSubscriptions } from "../../../redux/createSubscriptionsReducers";
import { getAddonsReducersListApi } from "../../../redux/getAddonsReducers";
import { resetStateCreateAddons } from "../../../redux/createAddonsReducers";
import { resetStateDeleteSubscriptions } from "../../../redux/deleteSubscriptionsReducers";
import { useAppDispatch } from "../../../states/store";
const Subscription = () => {
    const dispatch = useAppDispatch();
    const onChange = (key: any) => {
        console.log(key);
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
                />
            </div>
        </div>
    );
};

export default Subscription;
