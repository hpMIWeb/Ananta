import { useState } from "react";
import Button from "../../../components/ui/Button/Index";
import styles from "./subscriptionAddOns.module.scss";
import AddOnsAccordianContent from "../AddOnsAccordianContent/Index";
import Icon from "../../../components/ui/Icon/Index";
import { useNavigate } from "react-router-dom";
import SearchFilterBar from "../../../components/ui/SearchFilterBar/Index";
import classNames from "classnames";
import Pagination from "../../../components/ui/Pagination/Index";
import NoDataAvailable from "../../../components/ui/NoDataAvailable/Index";
import { useSelector } from "react-redux";
import CardContentSkeletonLoader from "../../../components/ui/CardContentSkeletonLoader/Index";

import { getFilteredValue } from "../../../../utils/helpers";

const SubscriptionAddOns = () => {
    const { loading, data: addonsListCardList } = useSelector(
        (state: any) => state.getAddonsList
    );
    console.log("addonsListCardList", addonsListCardList);
    const [searchValue, setSearchValue] = useState("");
    const [sortState, setSortState] = useState({ type: "", sortOrder: "" });
    const [displayedPaginationItems, setPaginationDisplayedItems] = useState(
        []
    );
    const navigation = useNavigate();

    const handleNewAddOnsClick = () => {
        navigation("/addons/create");
    };

    const handleEditBtnClick = (id: string) => {
        navigation(`/addons/edit/${id}`);
    };

    return (
        <div className={styles.addOnsTabWrapper}>
            <SearchFilterBar
                showAddOn
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                sortState={sortState}
                setSortState={setSortState}
            />
            <div className="d-flex w-100">
                <div className="ms-auto">
                    <Button
                        className={classNames(
                            styles.subscriptionAddOnsBtn,
                            "me-1 mb-1 mt-1"
                        )}
                        type="primary"
                        onClick={handleNewAddOnsClick}
                    >
                        <Icon name="plus" width={12.25} height={14} />
                        New
                    </Button>
                </div>
            </div>
            <div className={styles.addOnsAccordianWrapper}>
                {loading && <CardContentSkeletonLoader />}
                {!loading &&
                    getFilteredValue(
                        displayedPaginationItems,
                        searchValue,
                        sortState
                    ).map((addOns: any) => (
                        <AddOnsAccordianContent
                            key={addOns._id}
                            addOnsDetail={addOns}
                            handleEditBtnClick={handleEditBtnClick}
                        />
                    ))}
            </div>
            {!loading && !addonsListCardList.length && (
                <NoDataAvailable name="No AddOns Available!" />
            )}
            <Pagination
                data={addonsListCardList}
                setPaginationDisplayedItems={setPaginationDisplayedItems}
            />
        </div>
    );
};

export default SubscriptionAddOns;
