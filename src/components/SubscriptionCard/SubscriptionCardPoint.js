import classNames from "classnames";
import styles from "./subscriptionCard.module.scss";
import SubscriptionCardIcon from "./SubscriptionCardIcon/Index";

const SubscriptionCardPoint = ({ card }) => {
  const { customRender, styles = {} } = card;
  if (customRender) return customRender;
  return (
    <div
      className={classNames("col", styles.cardDescBox, {
        [card.className]: card.className,
      })}
      style={styles}
    >
      <div className="d-flex">
        <div className="flex-shrink-0">
          <SubscriptionCardIcon name={card.iconName} />
        </div>
        <div className="flex-grow-1 ms-2">{card.descComponent}</div>
      </div>
    </div>
  );
};

export default SubscriptionCardPoint;
