import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Button/Index";
import SubscriptionCard from "../../../../components/SubscriptionCard/Index";
import styles from "./subscriptionTab.module.scss";
import Icon from "../../../../components/Icon/Index";
import SearchFilterBar from "../../../../components/SearchFilterBar/Index";
import classNames from "classnames";
import Pagination from "../../../../components/Pagination/Index";
import SubscriptionHistoryModal from "../../../../components/SubscriptionCard/SubscriptionHistoryModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoDataAvailable from "../../../../components/NoDataAvailable/Index";
import CardContentSkeletonLoader from "../../../../components/CardContentSkeletonLoader/Index";
import { capitalize, getCurrentItemNumber } from "../../../utilities/utility";
import {
    displayNumberInCurrencyFormate,
    getFilteredValue,
} from "../../../../utils/helpers";
import {
    createSubscriptionsReducersApi,
    resetStateCreateSubscriptions,
} from "../../../../redux/createSubscriptionsReducers";
import { useAppDispatch } from "../../../states/store";
import Cookies from "js-cookie";
import { RoleTypes } from "../../../../utils/constant";

const SubscriptionTab = () => {
    const navigation = useNavigate();
    const dispatch = useAppDispatch();
    const roleType = Cookies.get("roleTypeName");
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
    const [selectedSubscriptionHistory, setSelectedSubscriptionHistory] =
        useState();
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState("");
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
    const [currentPageSize, setCurrentPageSize] = useState<number>(5);
    const [superAdminAddon, setSuperAdminAddonOption] = useState([
        {
            value: "All Subscription",
            label: "All Subscription",
        },
        {
            value: "Consultant",
            label: "Consultant",
        },
        {
            value: "Business Enterprise",
            label: "Business Enterprise",
        },
    ]);
    const [caAdminAddonOption, setCAdminAddonOption] = useState([
        {
            value: "All Subscription",
            label: "All Subscription",
        },
        {
            value: "client",
            label: "Client",
        },
        {
            value: "associate_partner",
            label: "Associate Partner",
        },
    ]);
    const addonOption =
        roleType === RoleTypes.SuperAdmin
            ? superAdminAddon
            : caAdminAddonOption;
    const handleSubscriptionHistoryModalClick = (
        subscriptionHistory: any,
        subscriptionId: string
    ) => {
        setSelectedSubscriptionHistory(subscriptionHistory);
        setSelectedSubscriptionId(subscriptionId);
        setModalOpen(true);
    };

    const featureList: any = [
        { label: "Task Manager", value: "TaskManager" },
        { label: "File Manager", value: "FileManager" },
        { label: "E-Commerce", value: "E_Commerce" },
        {
            label: "Template customization for import",
            value: "Tamplate_Customization_for_import",
        },
        {
            label: "Live Reports Client Mobile App",
            value: "Live_reports_on_client_mobile_app",
        },
        { label: "Client Login Mobile App", value: "Client_login_mobile_app" },
    ];

    const generateFeatureLists = (features: any) => {
        const featureItems = [];

        for (let i = 0; i < features.length; i += 3) {
            const featureListUI = (
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

            featureItems.push(featureListUI);
        }

        return featureItems;
    };

    const cardDescContent = (cardInfo: any) => {
        const { features } = cardInfo;
        const keysWithTrueValue = Object.keys(features)
            .filter((key) => features[key] === true)
            .map((featureItem: any) => {
                if (featureItem) {
                    const matchedItem = featureList.find((item: any) => {
                        return item.value === featureItem;
                    });
                    return matchedItem ? matchedItem.label : featureItem;
                }
                return featureItem;
            });

        // Conditionally render the content based on roleType
        if (roleType === RoleTypes.SuperAdmin) {
            //super admin code
            return [
                {
                    iconName: "time",
                    descComponent: (
                        <>
                            <p className="mb-0 fs--1 description-label">
                                Validity
                            </p>
                            <p className="semiBold">{cardInfo.period}</p>
                        </>
                    ),
                },
                {
                    iconName: "cash",
                    descComponent: (
                        <>
                            <p className="mb-0 fs--1 description-label">
                                Price
                            </p>
                            <p className="mb-0 fs--1 semiBold">
                                Rs.{" "}
                                {displayNumberInCurrencyFormate(cardInfo.price)}
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
                            <p className="mb-0 fs--1 description-label">
                                Clients
                            </p>
                            <p className="semiBold">{cardInfo.no_of_client}</p>
                        </>
                    ),
                },
                {
                    iconName: "storage",
                    descComponent: (
                        <>
                            <p className="mb-0 fs--1 description-label">
                                Storage
                            </p>
                            <p className="semiBold">
                                {cardInfo.is_space_unlimited
                                    ? "Unlimited"
                                    : cardInfo.storage_space + "GB"}
                            </p>
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
                            <p className="semiBold">
                                {cardInfo.subscribers_count}
                            </p>
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
                            <p className="mb-0 fs--1 description-label">
                                Users
                            </p>
                            <ul className="ps-3 mt-1 fw-semi-bold mb-1 feature-description-list">
                                <li>
                                    CA Office Users -{" "}
                                    {cardInfo.no_of_users &&
                                    cardInfo.no_of_users.office_users
                                        ? cardInfo.no_of_users.office_users
                                        : 0}
                                </li>
                                <li>
                                    Client Office Users -{" "}
                                    {cardInfo.no_of_users &&
                                    cardInfo.no_of_users.client_office_users
                                        ? cardInfo.no_of_users
                                              .client_office_users
                                        : 0}
                                </li>
                                <li>
                                    Client Vendors Users -{" "}
                                    {cardInfo.no_of_users &&
                                    cardInfo.no_of_users.client_vendor
                                        ? cardInfo.no_of_users.client_vendor
                                        : 0}
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
                            <p className="mb-0 fs--1 description-label">
                                Modules
                            </p>
                            <div style={{ display: "flex", columnGap: 15 }}>
                                {generateFeatureLists(keysWithTrueValue)}
                            </div>
                        </>
                    ),
                },
            ];
        } else {
            return [
                {
                    iconName: "time",
                    descComponent: (
                        <>
                            <p className="mb-0 fs--1 description-label">
                                Validity
                            </p>
                            <p className="semiBold">{cardInfo.period}</p>
                        </>
                    ),
                },
                {
                    iconName: "time",
                    descComponent: (
                        <>
                            <p className="mb-0 fs--1 description-label">
                                Validity
                            </p>
                            <p className="semiBold">
                                {cardInfo.period}{" "}
                                {capitalize(cardInfo.period_type)}
                            </p>
                        </>
                    ),
                },

                {
                    iconName: "cash",
                    descComponent: (
                        <>
                            <p className="mb-0 fs--1 description-label">
                                Price
                            </p>
                            <p className="mb-0 fs--1 semiBold">
                                {displayNumberInCurrencyFormate(cardInfo.price)}
                            </p>
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
                            <p className="semiBold">
                                {cardInfo.subscribers_count}
                            </p>
                        </>
                    ),
                },
                {
                    iconName: "storage",
                    descComponent: (
                        <>
                            <p className="mb-0 fs--1 description-label">
                                Storage
                            </p>
                            <p className="semiBold">
                                {cardInfo.storage_space} GB
                            </p>
                        </>
                    ),
                },
                {
                    iconName: "storage",
                    descComponent: (
                        <>
                            <p className="mb-0 fs--1 description-label">
                                Branches
                            </p>
                            <p className="semiBold">
                                {cardInfo.branches ? cardInfo.branches : 0}
                            </p>
                        </>
                    ),
                },
                {
                    iconName: "storage",
                    descComponent: (
                        <>
                            <p className="mb-0 fs--1 description-label">
                                Turnover Limit
                            </p>
                            <p className="semiBold">
                                {displayNumberInCurrencyFormate(
                                    cardInfo.turnover
                                )}
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
                            <p className="semiBold">Not Applicable</p>
                        </>
                    ),
                },
                {
                    iconName: "clientLogin",
                    descComponent: (
                        <>
                            <p className="mb-0 fs--1 description-label">
                                Transaction
                            </p>
                            <ul className="ps-3 mt-1 fw-semi-bold mb-1 feature-description-list">
                                <li>
                                    Sale & Purchase-{" "}
                                    {cardInfo.transactions &&
                                    cardInfo.transactions.sales_and_purchase
                                        ? cardInfo.transactions
                                              .sales_and_purchase
                                        : 0}
                                </li>
                                <li>
                                    Credit & Debit Notes -{" "}
                                    {cardInfo.transactions &&
                                    cardInfo.transactions.credit_and_debit_notes
                                        ? cardInfo.transactions
                                              .credit_and_debit_notes
                                        : 0}
                                </li>
                                <li>
                                    Receipt & Payments -{" "}
                                    {cardInfo.transactions &&
                                    cardInfo.transactions.receipt_and_payments
                                        ? cardInfo.transactions
                                              .receipt_and_payments
                                        : 0}
                                </li>
                                <li>
                                    Contras -{" "}
                                    {cardInfo.transactions &&
                                    cardInfo.transactions.contras
                                        ? cardInfo.transactions.contras
                                        : 0}
                                </li>{" "}
                                <li>
                                    Journals -{" "}
                                    {cardInfo.transactions &&
                                    cardInfo.transactions.journals
                                        ? cardInfo.transactions.journals
                                        : 0}
                                </li>
                                <li>
                                    Stock Journals -{" "}
                                    {cardInfo.transactions &&
                                    cardInfo.transactions.stock_journals
                                        ? cardInfo.transactions.stock_journals
                                        : 0}
                                </li>
                            </ul>
                        </>
                    ),
                },
                {
                    iconName: "features",
                    descComponent: (
                        <>
                            <p className="mb-0 fs--1 description-label">
                                Modules
                            </p>
                            <div style={{ display: "flex", columnGap: 15 }}>
                                {generateFeatureLists(keysWithTrueValue)}
                            </div>
                        </>
                    ),
                },
                {
                    iconName: "clientLogin",

                    descComponent: (
                        <>
                            <p className="mb-0 fs--1 description-label">
                                Users
                            </p>
                            <ul className="ps-3 mt-1 fw-semi-bold mb-1 feature-description-list">
                                <li>
                                    CA Office Users -{" "}
                                    {cardInfo.no_of_users &&
                                    cardInfo.no_of_users.office_users
                                        ? cardInfo.no_of_users.office_users
                                        : 0}
                                </li>
                                <li>
                                    Client Office Users -{" "}
                                    {cardInfo.no_of_users &&
                                    cardInfo.no_of_users.client_office_users
                                        ? cardInfo.no_of_users
                                              .client_office_users
                                        : 0}
                                </li>
                                <li>
                                    Client Vendors Users -{" "}
                                    {cardInfo.no_of_users &&
                                    cardInfo.no_of_users.client_vendor
                                        ? cardInfo.no_of_users.client_vendor
                                        : 0}
                                </li>
                            </ul>
                        </>
                    ),
                },
            ];
        }
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
        navigation(`/subscription/edit-subscription`, { state: { id: id } });
    };

    useEffect(() => {
        if (editSubscriptionsSuccess) {
            dispatch(resetStateCreateSubscriptions());
        }
    }, [editSubscriptionsSuccess]);

    const setPageChange = (pageNumber: number, pageSize: number) => {
        setCurrentPageNumber(pageNumber);
        setCurrentPageSize(pageSize);
    };

    return (
        <div>
            <SearchFilterBar
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                sortState={sortState}
                setSortStateHandler={setSortState}
                showAddOn={true}
                addonOption={addonOption}
                initialAddOnsValue="All Subscription"
            />

            {loading && <CardContentSkeletonLoader />}
            {!loading &&
                getFilteredValue(
                    displayedPaginationItems,
                    searchValue,
                    sortState
                ).map((card: any, index: number) => (
                    <SubscriptionCard
                        displayIndex={getCurrentItemNumber(
                            index + 1,
                            currentPageNumber,
                            currentPageSize
                        )}
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
                        historyData={card.editHistory}
                    />
                ))}

            {!loading && !subscriptionCardList.length && (
                <NoDataAvailable name="No Clients Available!" />
            )}
            <Pagination
                data={subscriptionCardList}
                setPaginationDisplayedItems={setPaginationDisplayedItems}
                setPageNumber={setPageChange}
            />
            <SubscriptionHistoryModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                subscriptionHistoryData={selectedSubscriptionHistory}
                subscriptionId={selectedSubscriptionId}
            />
        </div>
    );
};

export default SubscriptionTab;
