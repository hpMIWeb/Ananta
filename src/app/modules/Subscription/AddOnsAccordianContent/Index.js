import classNames from "classnames";
import SubscriptionCardContent from "../../../components/SubscriptionCard/SubscriptionCardContent";

import styles from "./addOnsAccordianContent.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
    createAddonsReducersReducersApi,
    resetStateCreateAddons,
} from "../../../../redux/createAddonsReducers";
import { useEffect } from "react";

const AddOnsAccordianContent = ({ handleEditBtnClick, addOnsDetail }) => {
    const dispatch = useDispatch();
    const createAddonSuccess = useSelector(
        (state) => state.createAddon.success
    );
    const cardDesc = () => {
        return [
            {
                iconName: "cash",
                descComponent: (
                    <>
                        <p
                            className={classNames(
                                "mb-0 fs--1",
                                styles.descLabel
                            )}
                        >
                            Price
                        </p>
                        <p className={styles.semiBold}>
                            {addOnsDetail.price}/-
                        </p>
                    </>
                ),
            },
            {
                iconName: "time",
                descComponent: (
                    <>
                        <p
                            className={classNames(
                                "mb-0 fs--1",
                                styles.descLabel
                            )}
                        >
                            Validity
                        </p>
                        <p className={styles.semiBold}>
                            {addOnsDetail.time_period}{" "}
                            {addOnsDetail.time_period_type === "MONTH"
                                ? "Months"
                                : "Days"}
                        </p>
                    </>
                ),
            },
            {
                iconName: "storage",
                descComponent: (
                    <>
                        <p
                            className={classNames(
                                "mb-0 fs--1",
                                styles.descLabel
                            )}
                        >
                            Storage
                        </p>
                        <p className={styles.semiBold}>
                            {addOnsDetail.storage_size} GB
                        </p>
                    </>
                ),
            },
            {
                iconName: "subscribe",
                descComponent: (
                    <>
                        <p
                            className={classNames(
                                "mb-0 fs--1",
                                styles.descLabel
                            )}
                        >
                            Subscribers
                        </p>
                        <p className={styles.semiBold}>0</p>
                    </>
                ),
            },
        ];
    };

    const onChangeActiveClick = (e, id) => {
        dispatch(
            createAddonsReducersReducersApi({
                payload: { status: !!e ? "Active" : "Inactive" },
                addonsId: id,
            })
        );
    };

    useEffect(() => {
        if (createAddonSuccess) {
            dispatch(resetStateCreateAddons());
        }
    }, [createAddonSuccess]);

    return (
        <div className={classNames(styles.addOnsAccordianContentWrapper)}>
            <SubscriptionCardContent
                key={addOnsDetail._id}
                id={addOnsDetail._id}
                planName={addOnsDetail.add_on_title}
                isActive={addOnsDetail.status === "Active"}
                cardDetails={addOnsDetail}
                cardDesc={cardDesc}
                handleEditBtnClick={handleEditBtnClick}
                onChangeActiveClick={onChangeActiveClick}
                column={4}
            />
        </div>
    );
};

export default AddOnsAccordianContent;
