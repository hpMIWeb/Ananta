import classNames from "classnames";
import styles from "./subscriptionCard.module.scss";
import SubscriptionCardContent from "./SubscriptionCardContent";

const SubscriptionCard = ({ column = 4, onChangeActiveClick, ...rest }) => {
  return (
    <div
      className={classNames(
        styles.subscriptionCardWrapper,
        "card card-body mt-2 shadow-none bg-100 mb-3"
      )}
    >
      <SubscriptionCardContent
        {...rest}
        column={column}
        onChangeActiveClick={onChangeActiveClick}
      />
    </div>
  );
};

export default SubscriptionCard;
