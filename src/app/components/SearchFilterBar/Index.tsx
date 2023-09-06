import Input from "../Input/Index";
import Icon from "../Icon/Index";
import classNames from "classnames";
import Button from "../Button/Index";
import styles from "./searchFilterBar.module.scss";
import "./searchFilterBar.scss";
import Select from "../Select/Index";
import { useState } from "react";

const SearchFilterBar = ({
    searchValue,
    setSearchValue,
    sortState = {},
    setSortHandler = () => {},
    showAddOn = false,
    defaultSortLabel,
    initialAddOnsValue = "All Addons",
}: any) => {
    const [expandSort, setExpandSort] = useState(false);
    // const [sortState, setSortState] = useState({ type: "", sortOrder: "" });

    const initialSortLabel = {
        Latest: { asc: "Latest", desc: "Oldest" },
        Name: { asc: "Ascending", desc: "Descending" },
        Price: { asc: "Highest", desc: "Lowest" },
        Subscribers: { asc: "Highest", desc: "Lowest" },
    };

    const sortLabel = defaultSortLabel || initialSortLabel;

    const onSortClick = (type: string) => {
        let direction = sortLabel[type].asc;
        if (
            sortState &&
            sortState.type === type &&
            sortState.sortOrder === sortLabel[type].asc
        ) {
            direction = sortLabel[type].desc;
        } else if (
            sortState &&
            sortState.type === type &&
            sortState.sortOrder === sortLabel[type].desc
        ) {
            direction = "";
        }

        setSortHandler({ type, sortOrder: direction });
    };

    return (
        <>
            <div
                style={{ marginTop: 2 }}
                className="d-flex align-items-center w-100 mb-3"
            >
                <div className="me-auto">
                    <Input
                        className={classNames(
                            "headerSearchInput",
                            "searchFilterBarInput"
                        )}
                        placeholder="Search"
                        value={searchValue}
                        onChange={(e: any) => setSearchValue(e.target.value)}
                        prefix={
                            <Icon width={13.33} height={13.33} name="search" />
                        }
                    />
                </div>

                {showAddOn && (
                    <div className="ms-auto">
                        <Select
                            style={{ width: 120 }}
                            className="addOnSelectDropdown"
                            popupMatchSelectWidth={false}
                            placeholder="Select AddOn Type"
                            defaultValue={initialAddOnsValue}
                            clearIcon={
                                <Icon name="downArrow" width={9} height={14} />
                            }
                            suffixIcon={
                                <Icon name="downArrow" width={9} height={14} />
                            }
                            value={sortState?.addOnValue}
                            onChange={(value: any) => {
                                setSortHandler((prev: any) => ({
                                    ...prev,
                                    addOnValue: value,
                                }));
                            }}
                            allowClear
                            options={[
                                {
                                    value: initialAddOnsValue,
                                    label: initialAddOnsValue,
                                },
                                {
                                    value: "Storage Space",
                                    label: "Storage Space",
                                },
                                {
                                    value: "No. Of Clients",
                                    label: "No. Of Clients",
                                },
                                {
                                    value: "No. Of Employees",
                                    label: "No. Of Employees",
                                },
                                {
                                    value: "No. Of Client Login",
                                    label: "No. Of Client Login",
                                },
                                {
                                    value: "No. Of Transactions",
                                    label: "No. Of Transactions",
                                },
                                {
                                    value: "Features List",
                                    label: "Features List",
                                },
                            ]}
                        />
                    </div>
                )}

                <div style={{ marginLeft: 10 }}>
                    <button
                        onClick={() => setExpandSort(!expandSort)}
                        className={classNames("transparentBtn", "sortByBtn")}
                    >
                        <span>Sort By</span>
                        <Icon name="downArrow" width={9} height={14} />
                    </button>
                </div>
            </div>
            {expandSort && (
                <div className={styles.filterBoxWrapper}>
                    <div
                        className={`g-2 row ${
                            Object.keys(sortLabel).length === 5
                                ? "row-cols-md-5"
                                : "row-cols-md-4"
                        }`}
                    >
                        {Object.keys(sortLabel).map((label) => (
                            <button
                                onClick={() => onSortClick(label)}
                                className="transparentBtn"
                            >
                                <div
                                    className={classNames(
                                        "col",
                                        styles.filterBoxColumn
                                    )}
                                >
                                    <span className="d-flex">
                                        <h6 className={styles.filterHeader}>
                                            {label}
                                        </h6>
                                        {sortState.type === label &&
                                            sortState.sortOrder && (
                                                <span
                                                    className={
                                                        styles.filterSortLabel
                                                    }
                                                >
                                                    ({sortState.sortOrder})
                                                </span>
                                            )}
                                    </span>
                                    <Icon
                                        className={classNames(
                                            styles.filterBoxColumnIcon,
                                            {
                                                [styles.alwaysShowIcon]:
                                                    sortState.type === label &&
                                                    !!sortState.sortOrder,
                                                [styles.rotateArrow]:
                                                    sortState.type === label &&
                                                    sortState.sortOrder ===
                                                        label,
                                            }
                                        )}
                                        name={
                                            sortState.type === label
                                                ? sortState.sortOrder
                                                    ? "downArrow"
                                                    : "resetArrow"
                                                : "resetArrow"
                                        }
                                        width={
                                            sortState.type === label
                                                ? sortState.sortOrder
                                                    ? 15
                                                    : 18
                                                : 18
                                        }
                                        height={
                                            sortState.type === label
                                                ? sortState.sortOrder
                                                    ? 17
                                                    : 21
                                                : 21
                                        }
                                    />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchFilterBar;
