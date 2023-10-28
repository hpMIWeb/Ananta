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
  const getEmployeesList = useSelector((state: any) => state.getEmployees.data);
  const getEmployeesLoading = useSelector(
    (state: any) => state.getEmployees.loading
  );
  const [sortState, setSortState] = useState({ type: "", sortOrder: "" });
  const [addonFilterState, setAddonFilterValueState] = useState({
    type: "",
    value: "",
  });
  const [displayedPaginationItems, setPaginationDisplayedItems] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [employeeData, setEmployeeData] = useState<any>(
    getFilteredValue(getEmployeesList, searchQuery, sortState, addonFilterState)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data
        await dispatch(getEmployeesReducersApi());
      } catch (error) {
        // Handle error, e.g., set an error state
      }
    };
    fetchData();
  }, []);

  const handleNewEmployeeClick = () => {
    navigation("/employee/add-employee");
  };

  const handleViewBtnClick = (id: string) => {
    navigation(`view-employee/`, { state: { id: id } });
  };

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
            <p className="mb-0 fs--1 description-label">Department</p>
            <p className="semiBold">
              {" "}
              {cardData.organizationDetails[0]?.department?.name ||
                "Department Not Available"}
            </p>
          </>
        ),
      },
      {
        iconName: "employee",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Designation</p>
            <p className="semiBold">
              {" "}
              {cardData.organizationDetails[0]?.designation?.name ||
                "Designation Not Available"}
            </p>
          </>
        ),
      },
      {
        iconName: "transaction",
        descComponent: (
          <>
            {cardData.subProfile.length > 0 ? (
              <div>
                <p className="mb-0 fs--1 description-label">Sub Profile</p>
                <p className="semiBold">{cardData.subProfile.length}</p>
              </div>
            ) : (
              <div>
                <p className="mb-0 fs--1 description-label">Role</p>
                <p className="semiBold">
                  {" "}
                  {cardData.organizationDetails[0]?.role?.roleName ||
                    "Role Not Available"}
                </p>
              </div>
            )}
          </>
        ),
      },
      {
        iconName: "storage",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Client Assign</p>
            <p className="semiBold">{cardData.assignClients.length}</p>
          </>
        ),
      },
      {
        iconName: "subscribe",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Current Task</p>
            <p className="semiBold">0/0</p>
          </>
        ),
      },
      {
        iconName: "cash",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Total Task</p>
            <p className="semiBold">0/0</p>
          </>
        ),
      },
      {
        iconName: "order",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Pending Approval</p>
            <p className="semiBold">0</p>
          </>
        ),
      },
      {
        iconName: "time",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Total Hours</p>
            <p className="semiBold">00:00 Hours</p>
          </>
        ),
      },
      {
        iconName: "time",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Billable Hours</p>
            <p className="semiBold">00:00 Hours</p>
          </>
        ),
      },
    ];
  };

  useEffect(() => {
    const employeeData = getFilteredValue(
      getEmployeesList,
      searchQuery,
      sortState
    );
    setEmployeeData(employeeData);
  }, [searchQuery]);

  // Search input change handler
  const handleSearch = (searchValue: string) => {
    setSearchQuery(searchValue);
  };

  const clientSortLabel = {
    Name: { asc: "Ascending", desc: "Descending" },
    Client: { asc: "Highest", desc: "Lowest" },
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
            searchValue={searchQuery}
            setSearchValue={handleSearch}
            defaultSortLabel={clientSortLabel}
            sortState={sortState}
            setSortStateHandler={(options: any) => {
              setSortState(options);
              const employeeDataList = getFilteredValue(
                employeeData,
                searchQuery,
                sortState,
                addonFilterState
              );

              setEmployeeData(employeeDataList);
            }}
            setAddonFilterHandler={(fillerValue: any) => {
              setAddonFilterValueState(fillerValue);
              const employeeDataList = getFilteredValue(
                employeeData,
                searchQuery,
                sortState,
                addonFilterState
              );
              setEmployeeData(employeeDataList);
            }}
          />
        </div>
        {getEmployeesLoading && <CardContentSkeletonLoader />}
        {!getEmployeesLoading &&
          employeeData.map((card: any, index: number) => (
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

        {!getEmployeesLoading && !employeeData.length && (
          <NoDataAvailable name="No Employees Available!" />
        )}
        <Pagination
          data={employeeData}
          setPaginationDisplayedItems={setPaginationDisplayedItems}
          setPageNumber={setPageChange}
        />
      </div>
    </div>
  );
};

export default Employees;
