import classNames from "classnames";
import styles from "./subscription.module.scss";
import SubscriptionTab from "./SubscriptionTab/Index";
import SubscriptionAddOns from "../AddOns/SubscriptionAddOns/Index";
import { useEffect, useState } from "react";
import { getSubscriptionsListApi } from "../../../redux/getSubscriptionsReducers";
import { resetStateCreateSubscriptions } from "../../../redux/createSubscriptionsReducers";
import { getAddonsReducersListApi } from "../../../redux/getAddonsReducers";
import { resetStateCreateAddons } from "../../../redux/createAddonsReducers";
import { resetStateDeleteSubscriptions } from "../../../redux/deletePromoCodeReducers";
import { useAppDispatch } from "../../states/store";
import Button from "../../../components/Button/Index";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
    const dispatch = useAppDispatch();
    // const { loading, data: promoCodeList } = useSelector(
    //     (state: any) => state.getSub
    // );
    const navigation = useNavigate();
    // const [activeTab, setActiveTab] = useState("1");

    // const onChange = (key: any) => {
    //     setActiveTab(key);
    // };

    // const items = [
    //     {
    //         key: "1",
    //         label: `Subscription`,
    //         children: <SubscriptionTab />,
    //     },
    //     {
    //         key: "2",
    //         label: `AddOns`,
    //         children: <SubscriptionAddOns />,
    //     },
    // ];

    // const handleNewClick = () => {
    //     if (activeTab === "1") {
    //         navigation("/subscription/add-subscription");
    //     } else {
    //         navigation("/addons/create");
    //     }
    // };

    const handleNewClick = () => {
        navigation("/subscription/add-subscription");
    };

    useEffect(() => {
        dispatch(getSubscriptionsListApi());
        dispatch(getAddonsReducersListApi());
        dispatch(resetStateCreateSubscriptions());
        dispatch(resetStateDeleteSubscriptions());
        dispatch(resetStateCreateAddons());
    }, []);

    return (
        <div className={styles.subscriptionPageWrapper}>
            <div
                className={classNames(
                    "card-header d-flex",
                    styles.subscriptionPageHeader
                )}
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
                                styles.subscriptionLabel
                            )}
                        >
                            Subscription
                        </h5>
                    </div>
                    <div className={classNames("ms-auto z-index-1")}>
                        <Button
                            className={styles.newSubscriptionBtn}
                            type="primary"
                            onClick={handleNewClick}
                        >
                            Add New
                        </Button>
                    </div>
                </div>
            </div>
            <div className={styles.subscriptionBottomWrapper}>
                <SubscriptionTab />
            </div>
        </div>
    );
};

export default Subscription;
