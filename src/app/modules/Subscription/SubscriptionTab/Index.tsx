import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Index";
import SubscriptionCard from "../../../components/SubscriptionCard/Index";
import styles from "./subscriptionTab.module.scss";
import Icon from "../../../components/Icon/Index";
import SearchFilterBar from "../../../components/SearchFilterBar/Index";
import classNames from "classnames";
import Pagination from "../../../components/Pagination/Index";
import SubscriptionHistoryModal from "../../../components/SubscriptionCard/SubscriptionHistoryModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoDataAvailable from "../../../components/NoDataAvailable/Index";
import CardContentSkeletonLoader from "../../../components/CardContentSkeletonLoader/Index";
import { getFilteredValue } from "../../../../utils/helpers";
import {
    createSubscriptionsReducersApi,
    resetStateCreateSubscriptions,
} from "../../../../redux/createSubscriptionsReducers";
import { useAppDispatch } from "../../../../states/store";

const SubscriptionTab = () => {
    const navigation = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, data: subscriptionCardList = [] } = useSelector(
        (state: any) => state.getSubscriptionsListApi
    );
    const { success: editSubscriptionsSuccess } = useSelector(
        (state: any) => state.createSubscriptions
    );
    const [modalOpen, setModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [sortState, setSortState] = useState({ type: "", sortOrder: "" });
    const [displayedPaginationItems, setPaginationDisplayedItems] = useState(
        []
    );

    const handleNewSubscriptionClick = () => {
        navigation("/subscription/add-subscription");
    };

    const handleSubscriptionHistoryModalClick = () => {
        setModalOpen(true);
    };

    const generateFeatureLists = (features: any) => {
        const featureLists = [];

        for (let i = 0; i < features.length; i += 3) {
            const featureList = (
                <ul
                    key={i}
                    style={{ display: "inline-block" }}
                    className="ps-3 mt-1 fw-semi-bold mb-1 feature-description-list"
                >
                    {features
                        .slice(i, i + 3)
                        .map((feature: any, index: any) => (
                            <li key={index}>{feature}</li>
                        ))}
                </ul>
            );

            featureLists.push(featureList);
        }

        return featureLists;
    };

    const cardDescContent = (cardInfo: any) => {
        const { features } = cardInfo;
        const keysWithTrueValue = Object.keys(features).filter(
            (key) => features[key] === true
        );

        return [
            {
                iconName: "time",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            {cardInfo.period_type === "DAY" && "Days"}
                            {cardInfo.period_type === "MONTH" && "Months"}
                        </p>
                        <p className="semiBold">{cardInfo.period}</p>
                    </>
                ),
            },
            {
                iconName: "cash",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">Price</p>
                        <p className="mb-0 fs--1 semiBold">
                            Rs. {cardInfo.price}
                        </p>
                    </>
                ),
            },
            {
                iconName: "transaction",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Transaction Credits
                        </p>
                        <p className="semiBold">
                            {cardInfo.no_of_transactions}
                        </p>
                    </>
                ),
            },
            {
                iconName: "client",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">Clients</p>
                        <p className="semiBold">{cardInfo.no_of_client}</p>
                    </>
                ),
            },
            {
                iconName: "storage",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">Storage</p>
                        <p className="semiBold">{cardInfo.storage_space} GB</p>
                    </>
                ),
            },
            {
                iconName: "subscribe",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Subscribers
                        </p>
                        <p className="semiBold">{cardInfo.subscribers_count}</p>
                    </>
                ),
            },
            {},
            {},
            {
                iconName: "clientLogin",
                styles: { width: "50%" },
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">Users</p>
                        <ul className="ps-3 mt-1 fw-semi-bold mb-1 feature-description-list">
                            <li>CA Office Users - {cardInfo.no_of_client}</li>
                            <li>
                                Client Office Users - {cardInfo.no_of_employee}
                            </li>
                            <li>
                                Client Vendors Users -{" "}
                                {cardInfo.no_of_client_login}
                            </li>
                        </ul>
                    </>
                ),
            },
            {
                iconName: "features",
                styles: { width: "50%" },
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">Modules</p>
                        <div style={{ display: "flex", columnGap: 15 }}>
                            {generateFeatureLists(keysWithTrueValue)}
                        </div>
                    </>
                ),
            },
        ];
    };

    const onChangeActiveClick = (e: any, id: any) => {
        dispatch(
            createSubscriptionsReducersApi({
                payload: { status: !!e ? "Active" : "Inactive" },
                subscriptionId: id,
            })
        );
    };

    const handleEditBtnClick = (id: string) => {
        navigation(`/subscription/edit-subscription/${id}`);
    };

    useEffect(() => {
        if (editSubscriptionsSuccess) {
            dispatch(resetStateCreateSubscriptions());
        }
    }, [editSubscriptionsSuccess]);

    return (
        <div>
            {
                <SearchFilterBar
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    sortState={sortState}
                    setSortHandler={sortState}
                />
            }
            <div className={styles.subscriptionHeaderBtnWrapper}>
                <Button
                    className={classNames(
                        styles.newSubscriptionBtn,
                        "me-1 mb-1 mt-1"
                    )}
                    onClick={handleNewSubscriptionClick}
                    type="primary"
                >
                    <Icon name="plus" width={12.25} height={14} />
                    New
                </Button>
            </div>
            {loading && <CardContentSkeletonLoader />}
            {!loading &&
                getFilteredValue(
                    displayedPaginationItems,
                    searchValue,
                    sortState
                ).map((card: any) => (
                    <SubscriptionCard
                        key={card._id}
                        id={card._id}
                        cardDesc={cardDescContent}
                        planName={card.plan_name}
                        isActive={card.status === "Active"}
                        cardDetails={card}
                        handleEditBtnClick={handleEditBtnClick}
                        onChangeActiveClick={onChangeActiveClick}
                        handleSubscriptionHistoryModalClick={
                            handleSubscriptionHistoryModalClick
                        }
                    />
                ))}

            {!loading && !subscriptionCardList.length && (
                <NoDataAvailable name="No Clients Available!" />
            )}
            <Pagination
                data={subscriptionCardList}
                setPaginationDisplayedItems={setPaginationDisplayedItems}
            />
            <SubscriptionHistoryModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </div>
    );
};

export default SubscriptionTab;
