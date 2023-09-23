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
import CardContentSkeletonLoader from "../../../components/CardContentSkeletonLoader/Index";
import { getFilteredValue } from "../../../utils/helpers";
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
  const [displayedPaginationItems, setPaginationDisplayedItems] = useState([]);

  const handleNewClientClick = () => {
    navigation("/caclient/create");
  };

  useEffect(() => {
    // @ts-ignore
    dispatch(getClientsReducersApi());
  }, []);

  const [addonOption, setAddonOption] = useState([
    {
      label: "All Clients",
      value: "all_clients",
    },
    {
      value: "CA",
      label: "CA",
    }, {
      label: "Tax Consultant",
      value: "tax_consultant",
    },
    {
      label: "Business Enterprise",
      value: "business_enterprise",
    },
  ]);

  const cardDesc = () => {
    return [
      {
        iconName: "client",
        descComponent: (
          <>
            <p className="mb-0 fs--1 description-label">Clients</p>
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
            defaultSortLabel={clientSortLabel}
            initialAddOnsValue="All Clients"
            searchValue={searchValue}
            showAddOn={true}
            setSearchValue={setSearchValue}
            sortState={sortState}
           addonOption={addonOption}
          />
        </div>
        {getClientsLoading && <CardContentSkeletonLoader />}
        {!getClientsLoading &&
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
              titleDesc={card.clientType}
              planNameLabel={card.firmGSTIN}
              planName={card.firmName}
              cardDesc={cardDesc}
              isProfileViewAction
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
