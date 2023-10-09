import classNames from "classnames";
import SubscriptionCardContent from "../../../../components/SubscriptionCard/SubscriptionCardContent";
import styles from "./addOnsAccordianContent.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
    createAddonsReducersApi,
    resetStateCreateAddons,
} from "../../../../redux/createAddonsReducers";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../states/store";
import AddOnHistoryModal from "../../../../components/SubscriptionCard/AddOnHistoryModal";

const AddOnsAccordianContent = ({
    handleEditBtnClick,
    displayIndex,
    addOnsDetail,
}: any) => {
    const dispatch = useAppDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSubscriptionHistory, setSelectedSubscriptionHistory] =
        useState();
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState("");

    const createAddonSuccess = useSelector(
        (state: any) => state.createAddon.success
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

    const onChangeActiveClick = (e: any, id: any) => {
        //TODO:: check response message
        dispatch(
            createAddonsReducersApi({
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

    const handleSubscriptionHistoryModalClick = (
        subscriptionHistory: any,
        subscriptionId: string
    ) => {
        setSelectedSubscriptionHistory(subscriptionHistory);
        setSelectedSubscriptionId(subscriptionId);
        setModalOpen(true);
    };

    return (
        <div className={classNames(styles.addOnsAccordianContentWrapper)}>
            <SubscriptionCardContent
                displayIndex={displayIndex}
                key={addOnsDetail._id}
                id={addOnsDetail._id}
                planName={addOnsDetail.add_on_title}
                isActive={addOnsDetail.status === "Active"}
                cardDetails={addOnsDetail}
                cardDesc={cardDesc}
                handleEditBtnClick={handleEditBtnClick}
                onChangeActiveClick={onChangeActiveClick}
                column={4}
                handleSubscriptionHistoryModalClick={
                    handleSubscriptionHistoryModalClick
                }
                historyData={addOnsDetail.editHistory}
            />
            <AddOnHistoryModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                subscriptionHistoryData={selectedSubscriptionHistory}
                subscriptionId={selectedSubscriptionId}
            />
        </div>
    );
};

export default AddOnsAccordianContent;
