import classNames from "classnames";
import styles from "./addons.module.scss";
import SubscriptionAddOns from "./SubscriptionAddOns/Index";
import { useEffect, useState } from "react";
import { getSubscriptionsListApi } from "../../../redux/getSubscriptionsReducers";
import { resetStateCreateSubscriptions } from "../../../redux/createSubscriptionsReducers";
import { getAddonsReducersListApi } from "../../../redux/getAddonsReducers";
import { resetStateCreateAddons } from "../../../redux/createAddonsReducers";
import { resetStateDeleteSubscriptions } from "../../../redux/deletePromoCodeReducers";
import { useAppDispatch } from "../../states/store";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Index";

const Subscription = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigate();

    useEffect(() => {
        dispatch(getSubscriptionsListApi());
        dispatch(getAddonsReducersListApi());
        dispatch(resetStateCreateSubscriptions());
        dispatch(resetStateDeleteSubscriptions());
        dispatch(resetStateCreateAddons());
    }, []);

    const handleNewClick = () => {
        navigation("/addons/create");
    };

    return (
        <div className={styles.addonsPageWrapper}>
            <div
                className={classNames(
                    "card-header d-flex",
                    styles.addonsPageHeader
                )}
            >
                <div
                    className={classNames(
                        "d-flex align-items-center w-100",
                        styles.addonsHeaderTitle
                    )}
                >
                    <div className="me-auto">
                        <h5
                            className={classNames(
                                "my-2 position-relative z-index-1",
                                styles.addonsLabel
                            )}
                        >
                            AddOns
                        </h5>
                    </div>
                    <div className={classNames("ms-auto z-index-1")}>
                        <Button
                            className={styles.newBtn}
                            type="primary"
                            onClick={handleNewClick}
                        >
                            Add New
                        </Button>
                    </div>
                </div>
            </div>
            <div className={styles.addonsBottomWrapper}>
                <SubscriptionAddOns />
            </div>
        </div>
    );
};

export default Subscription;
