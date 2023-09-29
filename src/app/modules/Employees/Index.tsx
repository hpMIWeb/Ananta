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
import { getEmployeesReducersApi } from "../../../redux/getEmployeesReducers";
import CardContentSkeletonLoader from "../../../components/CardContentSkeletonLoader/Index";
import { getFilteredValue } from "../../../utils/helpers";

const Employees = () => {
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const getEmployeesList = useSelector(
        (state: any) => state.getEmployees.data
    );
    const getEmployeesLoading = useSelector(
        (state: any) => state.getEmployees.loading
    );
    const [searchValue, setSearchValue] = useState("");
    const [sortState, setSortState] = useState({ type: "", sortOrder: "" });
    const [displayedPaginationItems, setPaginationDisplayedItems] = useState(
        []
    );

    const handleNewEmployeeClick = () => {
        navigation("/employee/add-employee");
    };

    useEffect(() => {
        // @ts-ignore
        dispatch(getEmployeesReducersApi());
    }, []);

    const cardDesc = (cardData: any) => {
        return [
            {
                iconName: "client",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Department
                        </p>
                        <p className="semiBold"></p>
                    </>
                ),
            },
            {
                iconName: "employee",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Designation
                        </p>
                        <p className="semiBold">Accountant</p>
                    </>
                ),
            },
            {
                iconName: "transaction",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Sub Profile
                        </p>
                        <p className="semiBold">100</p>
                    </>
                ),
            },
            {
                iconName: "storage",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Client Assign
                        </p>
                        <p className="semiBold">5</p>
                    </>
                ),
            },
            {
                iconName: "subscribe",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Current Task
                        </p>
                        <p className="semiBold">3/6</p>
                    </>
                ),
            },
            {
                iconName: "cash",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Total Task
                        </p>
                        <p className="semiBold">56/85</p>
                    </>
                ),
            },
            {
                iconName: "order",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Pending Approval
                        </p>
                        <p className="semiBold">56</p>
                    </>
                ),
            },
            {
                iconName: "time",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Total Hours
                        </p>
                        <p className="semiBold">45:11 Hours</p>
                    </>
                ),
            },
            {
                iconName: "time",
                descComponent: (
                    <>
                        <p className="mb-0 fs--1 description-label">
                            Billable Hours
                        </p>
                        <p className="semiBold">45:11 Hours</p>
                    </>
                ),
            },
        ];
    };

    const clientSortLabel = {
        Name: { asc: "Ascending", desc: "Descending" },
        Client: { asc: "Ascending", desc: "Descending" },
        "Transactions Processed": { asc: "Ascending", desc: "Descending" },
        Employees: { asc: "Ascending", desc: "Descending" },
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
                            Employees
                        </h5>
                    </div>
                    <div className={classNames("ms-auto z-index-1")}>
                        <Button
                            onClick={handleNewEmployeeClick}
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
                        defaultSortLabel={clientSortLabel}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        sortState={sortState}
                        setSortState={setSortState}
                    />
                </div>
                {getEmployeesLoading && <CardContentSkeletonLoader />}
                {!getEmployeesLoading &&
                    getFilteredValue(
                        displayedPaginationItems,
                        searchValue,
                        sortState
                    ).map((card: any) => (
                        <SubscriptionCard
                            key={card._id}
                            id={card._id}
                            planNameLabelBlue
                            column={3}
                            cardDetails={card}
                            titleDesc={card.employeeId}
                            // planNameLabel={card.employeeId}
                            planName={card.firstName + " " + card.lastName}
                            cardDesc={cardDesc}
                            isProfileViewAction
                        />
                    ))}

                {!getEmployeesLoading && !getEmployeesList.length && (
                    <NoDataAvailable name="No Employees Available!" />
                )}
                <Pagination
                    data={getEmployeesList}
                    setPaginationDisplayedItems={setPaginationDisplayedItems}
                />
            </div>
        </div>
    );
};

export default Employees;
