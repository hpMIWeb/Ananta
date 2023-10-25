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
import Cookies from "js-cookie";
import { getCurrentItemNumber } from "../../utilities/utility";
import { adminClientTypeOption } from "../../../utils/constant";

const Clients = () => {
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const roleType = Cookies.get("roleTypeName");
  const getClientsList = useSelector((state: any) => state.getClients.data);
  const getClientsLoading = useSelector(
    (state: any) => state.getClients.loading
  );
  const [sortState, setSortState] = useState({ type: "", sortOrder: "" });
  const [displayedPaginationItems, setPaginationDisplayedItems] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleNewClientClick = () => {
    navigation("/caclient/create");
  };

  const handleViewBtnClick = (id: string) => {
    navigation(`view-caclient/`, { state: { id: id } });
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

  const setPageChange = (pageNumber: number, pageSize: number) => {
    setCurrentPageNumber(pageNumber);
    setCurrentPageSize(pageSize);
  };

  const cardDesc = (cardInfo: any) => {
    if (roleType === "superadmin") {
      //super admin code
      return [
        {
          iconName: "client",
          descComponent: (
            <>
              <p className="mb-0 fs--1 description-label">Clients</p>
              <p className="semiBold">0/{cardInfo.assignClients.length}</p>
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
              <p className="mb-0 fs--1 description-label">Gold Subscription</p>
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
    } else {
      //super admin code
      return [
        {
          iconName: "client",
          descComponent: (
            <>
              <p className="mb-0 fs--1 description-label">Clients</p>
              <p className="semiBold">0/{cardInfo.assignClients.length}</p>
            </>
          ),
        },
        {},
        {
          iconName: "cash",
          descComponent: (
            <>
              <p className="mb-0 fs--1 description-label">Gold Subscription</p>
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
    }
  };

  const [superAdminAddon, setSuperAdminAddonOption] = useState([
    {
      value: "All Client",
      label: "All Client",
    },
    ...adminClientTypeOption,
  ]);
  const [caAdminAddonOption, setCAdminAddonOption] = useState([
    {
      value: "All Client",
      label: "All Client",
    },
    {
      value: "regular",
      label: "Regular",
    },
    {
      value: "non_regular",
      label: "Non Regular",
    },
  ]);
  const addonOption =
    roleType === "superadmin" ? superAdminAddon : caAdminAddonOption;

  const clientSortLabel = {
    Name: { asc: "Ascending", desc: "Descending" },
    Clients: { asc: "Ascending", desc: "Descending" },
    "Transactions Processed": { asc: "Ascending", desc: "Descending" },
    Employees: { asc: "Highest", desc: "Lowest" },
    Storage: { asc: "Highest", desc: "Lowest" },
  };

  // Search input change handler
  const handleSearch = (searchValue: string) => {
    setSearchQuery(searchValue);
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
              Clients
            </h5>
          </div>
          <div className={classNames("ms-auto z-index-1")}>
            <Button
              onClick={handleNewClientClick}
              className={styles.newPromoBtn}
              type="primary"
            >
              Add New
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.promoCodesBottomWrapper}>
        <div style={{ marginBottom: 4 }}>
          <SearchFilterBar
            showAddOn
            defaultSortLabel={clientSortLabel}
            initialAddOnsValue="All Clients"
            searchValue={searchQuery}
            setSearchValue={handleSearch}
            //sortState={sortState}
            // setSortStateHandler={(options: any) => {
            //   setSortState(options);
            // }}
            addonOption={addonOption}
            placeholder={"Select Client Type"}
          />
        </div>
        <div
          className="contentData"
          style={{
            height: "612px",
            overflowX: "hidden",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          {getClientsLoading && <CardContentSkeletonLoader />}
          {!getClientsLoading &&
            getFilteredValue(
              displayedPaginationItems,
              searchQuery,
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
                titleDesc={card.firmType}
                planNameLabel={card.firmGSTIN}
                planName={card.firmName}
                cardDesc={cardDesc}
                isProfileViewAction
                isActive={card.status}
                onChangeActiveClick={onChangeActiveClick}
                handleViewBtnClick={handleViewBtnClick}
              />
            ))}

          {!getClientsLoading && !getClientsList.length && (
            <NoDataAvailable name="No Clients Available!" />
          )}
          {getClientsList.length > 0 && (
            <Pagination
              data={getClientsList}
              setPaginationDisplayedItems={setPaginationDisplayedItems}
              setPageNumber={setPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;
