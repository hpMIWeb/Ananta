import { useEffect, useState } from "react";
import styles from "./associatePartner.module.scss";
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
import { getAssociatePartnerReducersApi } from "../../../redux/getAssociatePartnerReducers";
import { createAssociatePartnerReducersApi } from "../../../redux/createAssociatePartnerReducers";
import CardContentSkeletonLoader from "../../../components/CardContentSkeletonLoader/Index";
import { getFilteredValue } from "../../../utils/helpers";
import dayjs from "dayjs";
import { useAppDispatch } from "../../states/store";
import Cookies from "js-cookie";
import { getCurrentItemNumber } from "../../utilities/utility";

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
  const [searchValue, setSearchValue] = useState("");
  const [sortState, setSortState] = useState({ type: "", sortOrder: "" });
  const [displayedPaginationItems, setPaginationDisplayedItems] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(5);
  const handleViewBtnClick = (id: string) => {
    navigation(`view-associatePartners/`, { state: { id: id } });
  };
  const superAdminAddonOption = [
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
    { value: "sales_partner", label: "Sales Partner" },
    { value: "service_partner", label: "Service Partner" },
  ];

  const addonOption =
    roleType === "superadmin" ? superAdminAddonOption : caAdminAddonOption;

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
  useEffect(() => {
    // @ts-ignore
    dispatch(getAssociatePartnerReducersApi());
  }, []);

  const setPageChange = (pageNumber: number, pageSize: number) => {
    setCurrentPageNumber(pageNumber);
    setCurrentPageSize(pageSize);
  };

  const cardDesc = (cardInfo: any) => {
    if (roleType === "superadmin") {
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
          iconName: "sale",
          descComponent: (
            <>
              <p className="mb-0 fs--1 description-label">Sales</p>
              <p className="semiBold">2 / 4 GB</p>
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
              <p className="mb-0 fs--1 description-label">Category</p>
              <p className="semiBold">0/{cardInfo.assignClients.length}</p>
            </>
          ),
        },
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
      ];
    }
  };

  const clientSortLabel = {
    Name: { asc: "Ascending", desc: "Descending" },
    Clients: { asc: "Ascending", desc: "Descending" },
    "Transactions Processed": { asc: "Ascending", desc: "Descending" },
    Employees: { asc: "Highest", desc: "Lowest" },
    Storage: { asc: "Highest", desc: "Lowest" },
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
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            sortState={sortState}
            showAddOn={true}
            addonOption={addonOption}
            initialAddOnsValue="All Partner"
            setSortStateHandler={(options: any) => {
              setSortState(options);
            }}
          />
        </div>
        {getAssociatePartnerLoading && <CardContentSkeletonLoader />}
        {!getAssociatePartnerLoading &&
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

        {!getAssociatePartnerLoading && !getAssociatePartnerList.length && (
          <NoDataAvailable name="No Clients Available!" />
        )}
        <Pagination
          data={getAssociatePartnerList}
          setPaginationDisplayedItems={setPaginationDisplayedItems}
          setPageNumber={setPageChange}
        />
      </div>
    </div>
  );
};

export default AssociatePartners;
