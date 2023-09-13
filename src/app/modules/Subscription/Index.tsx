import classNames from "classnames";
import styles from "./subscription.module.scss";
import Tabs from "../../components/ui/Tabs/Index";
import SubscriptionTab from "./SubscriptionTab/Index";
import SubscriptionAddOns from "./SubscriptionAddOns/Index";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { getSubscriptionsListApi } from "../../../redux/getSubscriptionsReducers";
import { resetStateCreateSubscriptions } from "../../../redux/createSubscriptionsReducers";
import { getAddonsReducersListApi } from "../../../redux/getAddonsReducers";
import { resetStateCreateAddons } from "../../../redux/createAddonsReducers";
import { resetStateDeleteSubscriptions } from "../../../redux/deleteSubscriptionsReducers";
import { useAppDispatch } from "../../../states/store";
import Button from "../../components/ui/Button/Index";
import Icon from "../../components/ui/Icon/Index";
import { useNavigate } from "react-router-dom";
const Subscription = () => {
    const dispatch = useAppDispatch();
    const onChange = (key: any) => {
        console.log(key);
    };
    const navigation = useNavigate();
    const [cardHeight, setCardHeight] = useState(0);

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

        //TODO: need to make this `height` dynamically (Total height - header height - footer height)
        const totalHeight = window.innerHeight - 70 - 20 - 36;
        console.log(window.innerHeight);
        setCardHeight(totalHeight);
    }, []);

    const handleNewSubscriptionClick = () => {
        navigation("/subscription/add-subscription");
    };

    return (
        <div
            style={{ height: cardHeight }}
            className={classNames("card ", styles.addSubscriptionCardWrapper)}
        >
            <div className={styles.subscriptionCardBody}>
                <Tabs
                    className=""
                    defaultActiveKey="1"
                    items={items}
                    onChange={onChange}
                    tabBarExtraContent={
                        <Button
                            className={classNames(styles.newSubscriptionBtn)}
                            onClick={handleNewSubscriptionClick}
                            type="primary"
                        >
                            <Icon name="plus" width={12.25} height={14} />
                            New
                        </Button>
                    }
                />
            </div>
        </div>
    );
};

export default Subscription;
