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
  const getEmployeesList = useSelector((state: any) => state.getEmployees.data);
  const getEmployeesLoading = useSelector(
    (state: any) => state.getEmployees.loading
  );
  const [searchValue, setSearchValue] = useState("");
  const [sortState, setSortState] = useState({ type: "", sortOrder: "" });
  const [displayedPaginationItems, setPaginationDisplayedItems] = useState([]);

  const handleNewEmployeeClick = () => {
    navigation("/employee/add-employee");
  };

  useEffect(() => {
    // @ts-ignore
    dispatch(getEmployeesReducersApi());
  }, []);

  const cardDesc = () => {
    return [
      {
        iconName: "client",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Employees</p>
            <p className="semiBold">8/10</p>
          </>
        ),
      },
      {
        iconName: "employee",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Employees</p>
            <p className="semiBold">9</p>
          </>
        ),
      },
      {
        iconName: "transaction",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Transaction Credits</p>
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
            <p className="mb-0 fs--1 description-label">Associated Partners</p>
            <p className="semiBold">3</p>
          </>
        ),
      },
      {
        iconName: "cash",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Gold Subscription</p>
            <p className="semiBold">Expire on - 2023-09-18</p>
          </>
        ),
      },
    ];
  };

  const clientSortLabel = {
    Name: { asc: "Ascending", desc: "Descending" },
    Employees: { asc: "Ascending", desc: "Descending" },
    "Transactions Processed": { asc: "Ascending", desc: "Descending" },
    //Employees: { asc: "Highest", desc: "Lowest" },
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
            //setSortState={setSortState}
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
              titleDesc="Beatrice"
              planNameLabel="Firm GST"
              planName="First Firm"
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
