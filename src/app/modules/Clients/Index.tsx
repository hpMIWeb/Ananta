import { useEffect, useState } from "react";
import styles from "./clients.module.scss";
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
import { getClientsReducersApi } from "../../../redux/getClientsReducers";
import { createClientReducersApi } from "../../../redux/createClientReducers";
import CardContentSkeletonLoader from "../../../components/CardContentSkeletonLoader/Index";
import { getFilteredValue } from "../../../utils/helpers";
import dayjs from "dayjs";
import { useAppDispatch } from "../../states/store";

const Clients = () => {
    const navigation = useNavigate();
    const dispatch = useAppDispatch();
    const getClientsList = useSelector((state: any) => state.getClients.data);
    const getClientsLoading = useSelector(
        (state: any) => state.getClients.loading
    );
    const [searchValue, setSearchValue] = useState("");
    const [sortState, setSortState] = useState({ type: "", sortOrder: "" });
    const [displayedPaginationItems, setPaginationDisplayedItems] = useState(
        []
    );

    const handleNewClientClick = () => {
        navigation("/caclient/create");
    };

    const onChangeActiveClick = (e: any, id: any) => {
        dispatch(
            createClientReducersApi({
                payload: { status: !!e ? true : false },
                clientId: id,
            })
        );
    };
    useEffect(() => {
        // @ts-ignore
        dispatch(getClientsReducersApi());
    }, []);

    const cardDesc = (cardInfo: any) => {
        console.log("cardInfo");

        return [
            {
                iconName: "client",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">Clients</p>
                        <p className="semiBold">
                            0/{cardInfo.assignClients.length}
                        </p>
                    </>
                ),
            },
            {
                iconName: "employee",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Employees
                        </p>
                        <p className="semiBold">9</p>
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
                        <p className="semiBold">12423/15000</p>
                    </>
                ),
            },
            {
                iconName: "storage",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">Storage</p>
                        <p className="semiBold">2 / 4 GB</p>
                    </>
                ),
            },
            {
                iconName: "subscribe",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Associated Partners
                        </p>
                        <p className="semiBold">3</p>
                    </>
                ),
            },
            {
                iconName: "cash",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Gold Subscription
                        </p>
                        <p className="semiBold">
                            Expire on -{" "}
                            {dayjs(cardInfo.subscriptionDetails.endDate).format(
                                "YYYY-MM-DD"
                            )}
                        </p>
                    </>
                ),
            },
        ];
    };

    const clientSortLabel = {
        Name: { asc: "Ascending", desc: "Descending" },
        Clients: { asc: "Ascending", desc: "Descending" },
        "Transactions Processed": { asc: "Ascending", desc: "Descending" },
        Employees: { asc: "Highest", desc: "Lowest" },
        Storage: { asc: "Highest", desc: "Lowest" },
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
                            Clients
                        </h5>
                    </div>
                    <div className={classNames("ms-auto z-index-1")}>
                        <Button
                            onClick={handleNewClientClick}
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
                        showAddOn
                        defaultSortLabel={clientSortLabel}
                        initialAddOnsValue="All Clients"
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        sortState={sortState}
                        setSortStateHandler={(options: any) => {
                            setSortState(options);
                        }}
                    />
                </div>
                {getClientsLoading && <CardContentSkeletonLoader />}
                {!getClientsLoading &&
                    getFilteredValue(
                        displayedPaginationItems,
                        searchValue,
                        sortState
                    ).map((card: any, index: number) => (
                        <SubscriptionCard
                            displayIndex={index + 1}
                            key={card._id}
                            id={card._id}
                            planNameLabelBlue
                            column={3}
                            cardDetails={card}
                            titleDesc={card.firmType}
                            planNameLabel={card.firmGSTIN}
                            planName={card.firmName}
                            cardDesc={cardDesc}
                            isProfileViewAction
                            isActive={card.status}
                            onChangeActiveClick={onChangeActiveClick}
                        />
                    ))}

                {!getClientsLoading && !getClientsList.length && (
                    <NoDataAvailable name="No Clients Available!" />
                )}
                <Pagination
                    data={getClientsList}
                    setPaginationDisplayedItems={setPaginationDisplayedItems}
                />
            </div>
        </div>
    );
};

export default Clients;
