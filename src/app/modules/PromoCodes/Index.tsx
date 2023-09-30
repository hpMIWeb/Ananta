import styles from "./promoCodes.module.scss";
import addSubImg from "../../../assets/images/add-subscription.jpg";
import classNames from "classnames";
import SubscriptionCard from "../../../components/SubscriptionCard/Index";
import Button from "../../../components/Button/Index";
import Icon from "../../../components/Icon/Index";
import { useNavigate } from "react-router-dom";
import SearchFilterBar from "../../../components/SearchFilterBar/Index";
import Pagination from "../../../components/Pagination/Index";
import NoDataAvailable from "../../../components/NoDataAvailable/Index";
import { useDispatch, useSelector } from "react-redux";
import { getPromocodeReducersListApi } from "../../../redux/getPromocodeReducers";
import CardContentSkeletonLoader from "../../../components/CardContentSkeletonLoader/Index";
import { useEffect, useState } from "react";
import {
    createPromoCodeApi,
    resetStateCreatePromocode,
} from "../../../redux/createPromoCodeReducers";
import { getFilteredValue } from "../../../utils/helpers";
import PromocodeHistoryModal from "../../../components/SubscriptionCard/PromocodeHistoryModal";
import moment from "moment";

const PromoCodes = () => {
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const { loading, data: promoCodeList } = useSelector(
        (state: any) => state.getPromocodeList
    );
    const userInfo = useSelector((state: any) => state.userInfo.data);
    console.log(`userInfo`, userInfo);
    const createPromoCodeSuccess = useSelector(
        (state: any) => state.createPromoCode.success
    );
    const [searchValue, setSearchValue] = useState("");
    const [sortState, setSortState] = useState({ type: "", sortOrder: "" });
    const [displayedPaginationItems, setPaginationDisplayedItems] = useState(
        []
    );

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSubscriptionHistory, setSelectedSubscriptionHistory] =
        useState();
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState("");

    useEffect(() => {
        if (!userInfo?.email) return;
        const params = {
            userCategory: "",
            orderPrice: 0,
            userEmail: "",
        };
        // params.userCategory = "superadmin";
        params.userCategory = "ca";
        params.userEmail = userInfo?.email;
        params.orderPrice = 1200;
        // @ts-ignore
        dispatch(getPromocodeReducersListApi(params));
        dispatch(resetStateCreatePromocode());
    }, [userInfo]);

    const handleNewPromoClick = () => {
        navigation("/promocodes/create");
    };

    const handleEditBtnClick = (id: string) => {
        navigation(`/promocodes/edit/${id}`);
    };

    const cardDesc = (cardDetails: any) => {
        const {
            description,
            startDateTime,
            endDateTime,
            ammount,
            userPerUser,
            timesUsed,
            codeLife,
            maxDiscount,
            orderValue,
        } = cardDetails;

        return [
            {
                iconName: "Info",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 semiBold">{description}</p>
                    </>
                ),
            },
            {
                iconName: "time",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">Start</p>
                        <p className="semiBold">
                            {moment(startDateTime).format("DD-MM-YYYY h:mm a")}
                        </p>
                    </>
                ),
            },
            {
                iconName: "time",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">End</p>
                        <p className="semiBold">
                            {moment(endDateTime).format("DD-MM-YYYY h:mm a")}
                        </p>
                    </>
                ),
            },
            {
                iconName: "discount",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Maximum Discount
                        </p>
                        <p className="semiBold">{ammount}</p>
                    </>
                ),
            },
            {
                iconName: "order",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Maximum Order Value
                        </p>
                        <p className="semiBold">{maxDiscount}</p>
                    </>
                ),
            },
            {
                iconName: "useOfCode",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Use of code
                        </p>
                        <p className="semiBold">{userPerUser}</p>
                    </>
                ),
            },
            {
                iconName: "usePerUser",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Use per user
                        </p>
                        <p className="semiBold">{codeLife}</p>
                    </>
                ),
            },
            {
                iconName: "time",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Time Utilized
                        </p>
                        <p className="semiBold">{timesUsed}</p>
                    </>
                ),
            },
        ];
    };

    const onChangeActiveClick = (e: any, id: string) => {
        //TODO:: need to solve
        // dispatch(
        //   createPromoCodeApi({
        //     payload: { status: !!e ? "Active" : "Inactive", promoId: id },
        //     promoId: id,
        //   })
        // );
    };

    useEffect(() => {
        if (createPromoCodeSuccess) {
            dispatch(resetStateCreatePromocode());
        }
    }, [createPromoCodeSuccess]);

    const promoFilteredValue = getFilteredValue(
        displayedPaginationItems,
        searchValue,
        sortState
    );

    const handleSubscriptionHistoryModalClick = (
        subscriptionHistory: any,
        subscriptionId: string
    ) => {
        console.log(subscriptionHistory, subscriptionId);
        setSelectedSubscriptionHistory(subscriptionHistory);
        setSelectedSubscriptionId(subscriptionId);
        setModalOpen(true);
    };

    return (
        <div className={styles.promoCodesPageWrapper}>
            <div
                className={classNames(
                    "card-header d-flex",
                    styles.promoCodesPageHeader
                )}
            >
                <div className="d-flex align-items-center w-100">
                    <div className="me-auto">
                        <h5
                            className={classNames(
                                "my-2 text-white position-relative z-index-1",
                                styles.promoCodesLabel
                            )}
                        >
                            Promo Code
                        </h5>
                    </div>
                    <div className={classNames("ms-auto z-index-1")}>
                        <Button
                            onClick={handleNewPromoClick}
                            className={styles.newPromoBtn}
                        >
                            <Icon width={12.25} height={14} name="plus" />
                            New
                        </Button>
                    </div>
                </div>
                <div
                    style={{
                        backgroundImage: `url(${addSubImg})`,
                    }}
                    className={classNames(
                        "rounded-3 rounded-bottom-0",
                        styles.promoCodesImg
                    )}
                ></div>
            </div>
            <div className={styles.promoCodesBottomWrapper}>
                <div style={{ marginBottom: 24 }}>
                    <SearchFilterBar
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        sortState={sortState}
                        setSortState={setSortState}
                    />
                </div>
                {loading && <CardContentSkeletonLoader />}
                {!loading &&
                    promoFilteredValue.map((promo: any) => (
                        <SubscriptionCard
                            key={promo._id}
                            id={promo._id}
                            planName={promo.name}
                            cardDesc={cardDesc}
                            isActive={promo.status === "Active"}
                            cardDetails={promo}
                            onChangeActiveClick={onChangeActiveClick}
                            handleEditBtnClick={handleEditBtnClick}
                            handleSubscriptionHistoryModalClick={
                                handleSubscriptionHistoryModalClick
                            }
                            historyData={promo.editHistory}
                        />
                    ))}
                {!loading && !promoCodeList.length && (
                    <NoDataAvailable name="No Promo Codes Available!" />
                )}
                <Pagination
                    data={promoCodeList}
                    setPaginationDisplayedItems={setPaginationDisplayedItems}
                />
                <PromocodeHistoryModal
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    subscriptionHistoryData={selectedSubscriptionHistory}
                    subscriptionId={selectedSubscriptionId}
                />
            </div>
        </div>
    );
};

export default PromoCodes;
