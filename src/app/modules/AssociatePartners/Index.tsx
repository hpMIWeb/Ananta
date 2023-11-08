import { useEffect, useState } from "react";
import styles from "./associatePartner.module.scss";
import classNames from "classnames";
import SubscriptionCard from "../../../components/SubscriptionCard/Index";
import Button from "../../../components/Button/Index";
import { useNavigate } from "react-router-dom";
import SearchFilterBar from "../../../components/SearchFilterBar/Index";
import Pagination from "../../../components/Pagination/Index";
import NoDataAvailable from "../../../components/NoDataAvailable/Index";
import { useSelector } from "react-redux";
import { getAssociatePartnerReducersApi } from "../../../redux/getAssociatePartnerReducers";
import { createAssociatePartnerReducersApi } from "../../../redux/createAssociatePartnerReducers";
import CardContentSkeletonLoader from "../../../components/CardContentSkeletonLoader/Index";
import { getFilteredValue } from "../../../utils/helpers";
import { useAppDispatch } from "../../states/store";
import Cookies from "js-cookie";
import { getCurrentItemNumber } from "../../utilities/utility";
import { RoleTypes } from "../../../utils/constant";

const AssociatePartners = () => {
    const navigation = useNavigate();
    const dispatch = useAppDispatch();
    const roleType = Cookies.get("roleTypeName");
    const getAssociatePartnerList = useSelector(
        (state: any) => state.getAssociatePartner.data
    );
    const getAssociatePartnerLoading = useSelector(
        (state: any) => state.getAssociatePartner.loading
    );
    const [sortState, setSortState] = useState({ type: "", sortOrder: "" });
    const [addonFilterState, setAddonFilterValueState] = useState({
        type: "partnerType",
        value: "",
    });

    const [displayedPaginationItems, setPaginationDisplayedItems] = useState(
        []
    );
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
    const [currentPageSize, setCurrentPageSize] = useState<number>(5);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [associatePartnerData, setAssociatePartnerData] = useState<any>([]);

    useEffect(() => {
        if (roleType === RoleTypes.CAAdmin) {
            setAddonFilterValueState({
                type: "partnerCategory",
                value: "",
            });
        }
        dispatch(getAssociatePartnerReducersApi());
    }, []);

    // Set the initial state of clientData to all clients
    useEffect(() => {
        setAssociatePartnerData(
            getFilteredValue(
                getAssociatePartnerList,
                "",
                sortState,
                addonFilterState
            )
        );
    }, [getAssociatePartnerList, sortState, addonFilterState]);

    const handleViewBtnClick = (id: string) => {
        navigation(`view-associatePartners/`, { state: { id: id } });
    };
    const superAdminAddonOption = [
        { value: "", label: "All Partner" },
        { value: "ca", label: "CA" },
        {
            value: "accountant",
            label: "Accountant",
        },
        {
            value: "tax_consultant",
            label: "Tax Consultant",
        },
        {
            value: "other",
            label: "Other",
        },
    ];

    const caAdminAddonOption = [
        { value: "", label: "All Partner" },
        { value: "sales_partner", label: "Sales Partner" },
        { value: "service_partner", label: "Service Partner" },
    ];

    const addonOption =
        roleType === RoleTypes.SuperAdmin
            ? superAdminAddonOption
            : caAdminAddonOption;

    const handleNewAssociatePartnerClick = () => {
        navigation("/associatePartners/create");
    };

    const onChangeActiveClick = (e: any, id: any) => {
        dispatch(
            createAssociatePartnerReducersApi({
                payload: { status: !!e ? true : false },
                associatePartnerId: id,
            })
        );
    };

    const setPageChange = (pageNumber: number, pageSize: number) => {
        setCurrentPageNumber(pageNumber);
        setCurrentPageSize(pageSize);
    };

    const cardDesc = (cardInfo: any) => {
        if (roleType === RoleTypes.SuperAdmin) {
            return [
                {
                    iconName: "client",
                    descComponent: (
                        <>
                            <p className="mb-0 fs--1 description-label">
                                Clients
                            </p>
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
                            <p className="semiBold">0</p>
                        </>
                    ),
                },

                {
                    iconName: "sale",
                    descComponent: (
                        <>
                            <p className="mb-0 fs--1 description-label">
                                Sales
                            </p>
                            <p className="semiBold">Rs 0/-</p>
                        </>
                    ),
                },
            ];
        } else {
            return [
                {
                    iconName: "client",
                    descComponent: (
                        <>
                            <p className="mb-0 fs--1 description-label">
                                Category
                            </p>
                            <p className="semiBold">
                                0/{cardInfo.assignClients.length}
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
                            <p className="semiBold">0</p>
                        </>
                    ),
                },
            ];
        }
    };

    useEffect(() => {
        const filteredAssociatePartnersData = getFilteredValue(
            getAssociatePartnerList,
            searchQuery,
            sortState,
            addonFilterState
        );
        setAssociatePartnerData(filteredAssociatePartnersData);
    }, [searchQuery]);

    // Search input change handler
    const handleSearch = (searchValue: string) => {
        setSearchQuery(searchValue);
        const filteredAssociatePartnersData = getFilteredValue(
            getAssociatePartnerList,
            searchQuery,
            sortState,
            addonFilterState
        );
        setAssociatePartnerData(filteredAssociatePartnersData);
    };

    return (
        <div className={styles.associatePartnerPageWrapper}>
            <div
                className={classNames(
                    "card-header d-flex",
                    styles.associatePartnerPageHeader
                )}
            >
                <div
                    className={classNames(
                        "d-flex align-items-center w-100",
                        styles.associatePartnerTitle
                    )}
                >
                    <div className="me-auto">
                        <h5
                            className={classNames(
                                "my-2 position-relative z-index-1",
                                styles.associatePartnerLabel
                            )}
                        >
                            Associate Partners
                        </h5>
                    </div>
                    <div className={classNames("ms-auto z-index-1")}>
                        <Button
                            onClick={handleNewAssociatePartnerClick}
                            className={styles.newPromoBtn}
                            type="primary"
                        >
                            Add New
                        </Button>
                    </div>
                </div>
            </div>
            <div className={styles.associatePartnerBottomWrapper}>
                <div style={{ marginBottom: 24 }}>
                    <SearchFilterBar
                        searchValue={searchQuery}
                        setSearchValue={handleSearch}
                        sortState={sortState}
                        showAddOn={true}
                        addonOption={addonOption}
                        addonFilterState={addonFilterState}
                        initialAddOnsValue="All Partner"
                        setSortStateHandler={(options: any) => {
                            setSortState(options);
                            const filteredAssociatePartnersData =
                                getFilteredValue(
                                    getAssociatePartnerList,
                                    searchQuery,
                                    sortState,
                                    addonFilterState
                                );
                            setAssociatePartnerData(
                                filteredAssociatePartnersData
                            );
                        }}
                        setAddonFilterHandler={(fillerValue: any) => {
                            setAddonFilterValueState(fillerValue);
                            const filteredAssociatePartnersData =
                                getFilteredValue(
                                    getAssociatePartnerList,
                                    searchQuery,
                                    sortState,
                                    addonFilterState
                                );
                            setAssociatePartnerData(
                                filteredAssociatePartnersData
                            );
                        }}
                    />
                </div>
                {getAssociatePartnerLoading && <CardContentSkeletonLoader />}
                {!getAssociatePartnerLoading &&
                    displayedPaginationItems.map((card: any, index: number) => (
                        <SubscriptionCard
                            displayIndex={getCurrentItemNumber(
                                index + 1,
                                currentPageNumber,
                                currentPageSize
                            )}
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
                            onChangeActiveClick={onChangeActiveClick}
                            isActive={card.status}
                            handleViewBtnClick={handleViewBtnClick}
                        />
                    ))}

                {!getAssociatePartnerLoading &&
                    !associatePartnerData.length && (
                        <NoDataAvailable name="No Associate Partners Available!" />
                    )}
                <Pagination
                    data={associatePartnerData}
                    setPaginationDisplayedItems={setPaginationDisplayedItems}
                    setPageNumber={setPageChange}
                />
            </div>
        </div>
    );
};

export default AssociatePartners;
