import classNames from "classnames";
import styles from "./subscriptionCard.module.scss";
import Switch from "../Switch/Index";
import Icon from "../Icon/Index";
import SubscriptionCardPoint from "./SubscriptionCardPoint";

const SubscriptionCardContent = ({
    id,
    cardDesc,
    cardDetails,
    isActive,
    planName = "",
    titleDesc,
    column,
    planNameLabel,
    planNameLabelBlue,
    isProfileViewAction,
    onChangeActiveClick = () => {},
    handleEditBtnClick = () => {},
    handleSubscriptionHistoryModalClick = () => {},
    historyData,
    displayIndex,
    handleViewBtnClick = () => {},
    handleProfileClick = () => {},
    isColorHeader = true,
}: any) => {
    const onChangeActive = (e: any) => {
        onChangeActiveClick(e, id);
    };

    const viewBtnClick = (e: any) => {
        handleViewBtnClick(id);
    };

    const profileClick = (e: any) => {
        //  handleProfileClick(id);
        handleViewBtnClick(id);
    };

    return (
        <div>
            <div className="d-flex w-100">
                <div className="me-auto">
                    <div className="d-flex">
                        <div className="flex-shrink-0">
                            <span className={styles.cardPointCounter}>
                                {displayIndex}
                            </span>
                        </div>
                        <div className="flex-grow-1 ms-2">
                            <h5
                                className={classNames(
                                    "mb-0",
                                    styles.subscriptionNameLabel,
                                    {
                                        [styles.subscriptionNameLabelBlue]:
                                            planNameLabelBlue,
                                    }
                                )}
                            >
                                <span
                                    style={{
                                        color: isColorHeader ? "#2c7be5" : "",
                                        cursor: "pointer",
                                    }}
                                    onClick={viewBtnClick}
                                >
                                    {planName}
                                </span>
                                {planNameLabel && (
                                    <span
                                        className={
                                            styles.subscriptionNameLabelDesc
                                        }
                                    >{`( ${planNameLabel} )`}</span>
                                )}
                            </h5>
                            {titleDesc && (
                                <p className={styles.cardTitleDesc}>
                                    {titleDesc}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="ms-auto">
                    {isProfileViewAction ? (
                        <div className="d-flex">
                            <button
                                className="transparentBtn"
                                onClick={profileClick}
                            >
                                <Icon name="profile" />
                                Profile
                            </button>
                            <div className="d-flex align-items-center">
                                <Switch
                                    size="small"
                                    className="smallCheckBox"
                                    defaultChecked={isActive}
                                    onChange={onChangeActive}
                                />
                                <label className={styles.cardSwitchLabel}>
                                    Active
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center">
                            <div className="d-flex align-items-center">
                                <Switch
                                    size="small"
                                    className="smallCheckBox"
                                    defaultChecked={isActive}
                                    onChange={onChangeActive}
                                />
                                <label className={styles.cardSwitchLabel}>
                                    Active
                                </label>
                            </div>
                            <span
                                className={classNames(
                                    styles.switchDevider,
                                    "mx-2 text-400"
                                )}
                            >
                                |
                            </span>
                            <button
                                onClick={() => handleEditBtnClick(id)}
                                className={styles.transparentHistoryBtn}
                            >
                                <span
                                    style={{
                                        marginRight: 3,
                                        height: 12,
                                        width: 12,
                                    }}
                                >
                                    <Icon name="edit" height={12} width={12} />
                                </span>
                                Edit
                            </button>
                            <button
                                style={{
                                    marginLeft: 4,
                                    fontSize: 13,
                                    lineHeight: "22px",
                                }}
                                className={styles.transparentHistoryBtn}
                                onClick={() =>
                                    handleSubscriptionHistoryModalClick(
                                        historyData,
                                        id
                                    )
                                }
                            >
                                (History)
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.cardDescWrapper}>
                <div
                    className={classNames(
                        styles.cardDescBoxWrapper,
                        {
                            ["row row-cols-1 row-cols-sm-4 row-col-md-4"]:
                                column === 4,
                        },
                        {
                            ["row row-cols-1 row-cols-sm-3 row-col-md-3"]:
                                column === 3,
                        }
                    )}
                >
                    {cardDesc(cardDetails).map((card: any, index: any) => (
                        <SubscriptionCardPoint key={index} card={card} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionCardContent;
