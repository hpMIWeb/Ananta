import { useEffect, useState } from "react";
import styles from "./employee.module.scss";
import addSubImg from "../../../assets/images/add-subscription.jpg";
import classNames from "classnames";
import SubscriptionCard from "../../../components/SubscriptionCard/Index";
import Button from "../../../components/Button/Index";
import Icon from "../../../components/Icon/Index";
import { useNavigate } from "react-router-dom";
import SearchFilterBar from "../../../components/SearchFilterBar/Index";
import Pagination from "../../../components/Pagination/Index";
import NoDataAvailable from "../../../components/NoDataAvailable/Index";
import { useSelector } from "react-redux";
import { getEmployeesReducersApi } from "../../../redux/getEmployeesReducers";
import { createEmployeeReducersApi } from "../../../redux/createEmployeeReducers";
import CardContentSkeletonLoader from "../../../components/CardContentSkeletonLoader/Index";
import { getFilteredValue } from "../../../utils/helpers";
import { useAppDispatch } from "../../states/store";
import { getCurrentItemNumber } from "../../utilities/utility";

const Employees = () => {
    const navigation = useNavigate();
    const dispatch = useAppDispatch();
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
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
    const [currentPageSize, setCurrentPageSize] = useState<number>(5);

    const handleNewEmployeeClick = () => {
        navigation("/employee/add-employee");
    };

    const handleViewBtnClick = (id: string) => {
        console.log(id);
        navigation(`employee/view-employee/`, { state: { id: id } });
    };

    useEffect(() => {
        // @ts-ignore
        dispatch(getEmployeesReducersApi());
    }, []);

    const onChangeActiveClick = (e: any, id: any) => {
        dispatch(
            createEmployeeReducersApi({
                payload: { status: !!e ? true : false },
                employeeId: id,
            })
        );
    };
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
                        {cardData.subProfile.length > 0 ? (
                            <div>
                                <p className="mb-0 fs--1 description-label">
                                    Sub Profile
                                </p>
                                <p className="semiBold">
                                    {cardData.subProfile.length}
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className="mb-0 fs--1 description-label">
                                    Role
                                </p>
                                <p className="semiBold">Role Name</p>
                            </div>
                        )}
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

    const setPageChange = (pageNumber: number, pageSize: number) => {
        setCurrentPageNumber(pageNumber);
        setCurrentPageSize(pageSize);
    };

    return (
        <div className={styles.promoCodesPageWrapper}>
            <div
                className={classNames(
                    "card-header d-flex",
                    styles.promoCodesPageHeader
                )}
            >
                <div
                    className={classNames(
                        "d-flex align-items-center w-100",
                        styles.promocodeHeaderTitle
                    )}
                >
                    <div className="me-auto">
                        <h5
                            className={classNames(
                                "my-2 position-relative z-index-1",
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
                            type="primary"
                        >
                            Add New
                        </Button>
                    </div>
                </div>
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
                    ).map((card: any, index: number) => (
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
                            titleDesc={card.employeeId}
                            // planNameLabel={card.employeeId}
                            planName={card.firstName + " " + card.lastName}
                            cardDesc={cardDesc}
                            isProfileViewAction
                            onChangeActiveClick={onChangeActiveClick}
                            isActive={card.status}
                            handleViewBtnClick={handleViewBtnClick}
                        />
                    ))}

                {!getEmployeesLoading && !getEmployeesList.length && (
                    <NoDataAvailable name="No Employees Available!" />
                )}
                <Pagination
                    data={getEmployeesList}
                    setPaginationDisplayedItems={setPaginationDisplayedItems}
                    setPageNumber={setPageChange}
                />
            </div>
        </div>
    );
};

export default Employees;
