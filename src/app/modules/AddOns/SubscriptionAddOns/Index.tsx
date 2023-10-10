import { useState } from "react";
import Button from "../../../../components/Button/Index";
import styles from "./subscriptionAddOns.module.scss";
import AddOnsAccordianContent from "../../Subscription/AddOnsAccordianContent/Index";
import Icon from "../../../../components/Icon/Index";
import { useNavigate } from "react-router-dom";
import SearchFilterBar from "../../../../components/SearchFilterBar/Index";
import classNames from "classnames";
import Pagination from "../../../../components/Pagination/Index";
import NoDataAvailable from "../../../../components/NoDataAvailable/Index";
import { useSelector } from "react-redux";
import CardContentSkeletonLoader from "../../../../components/CardContentSkeletonLoader/Index";
import { getFilteredValue } from "../../../../utils/helpers";

const SubscriptionAddOns = () => {
    const { loading, data: addonsListCardList } = useSelector(
        (state: any) => state.getAddonsList
    );
    const [searchValue, setSearchValue] = useState("");
    const [sortState, setSortState] = useState({ type: "", sortOrder: "" });
    const [displayedPaginationItems, setPaginationDisplayedItems] = useState(
        []
    );
    const navigation = useNavigate();

    const handleEditBtnClick = (id: string) => {
        navigation(`/addons/edit`, { state: { id: id } });
    };

    return (
        <div className={styles.addOnsTabWrapper}>
            <SearchFilterBar
                showAddOn
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                sortState={sortState}
                setSortState={setSortState}
                setSortStateHandler={(options: any) => {
                    setSortState(options);
                }}
            />
            {/* <div className="d-flex w-100">
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
            </div> */}
            <div className={styles.addOnsAccordianWrapper}>
                {loading && <CardContentSkeletonLoader />}
                {!loading &&
                    getFilteredValue(
                        displayedPaginationItems,
                        searchValue,
                        sortState
                    ).map((addOns: any, index: number) => (
                        <AddOnsAccordianContent
                            displayIndex={index + 1}
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