import Icon from "../../Icon/Index";
import styles from "./subscriptionCardIcon.module.scss";

const SubscriptionCardIcon = ({ name }: any) => {
    const getIconContent = (name: string) => {
        switch (name) {
            case "time":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="time"
                        height={19.19}
                        width={19.19}
                    />
                );
            case "modules":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="modules"
                        height={19.19}
                        width={19.19}
                    />
                );
            case "users":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="users"
                        width={24}
                        height={19.19}
                    />
                );
            case "cash":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="cash"
                        width={24}
                        height={19.19}
                    />
                );
            case "transaction":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="transaction"
                        width={24}
                        height={19.19}
                    />
                );
            case "employee":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="employee"
                        width={24}
                        height={19.19}
                    />
                );
            case "client":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="client"
                        width={16.8}
                        height={19.19}
                    />
                );
            case "clientLogin":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="clientLogin"
                        width={24}
                        height={19.19}
                    />
                );
            case "features":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="features"
                        width={19.19}
                        height={19.19}
                    />
                );
            case "storage":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="storage"
                        width={16.8}
                        height={19.19}
                    />
                );
            case "subscribe":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="subscribe"
                        width={24}
                        height={19.19}
                    />
                );
            case "Info":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="Info"
                        width={19.19}
                        height={19.19}
                    />
                );
            case "discount":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="discount"
                        width={19.19}
                        height={19.19}
                    />
                );
            case "order":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="order"
                        width={14.4}
                        height={19.19}
                    />
                );
            case "useOfCode":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="useOfCode"
                        width={24}
                        height={19.19}
                    />
                );
            case "usePerUser":
                return (
                    <Icon
                        className={styles.cardDescBtn}
                        name="usePerUser"
                        width={24}
                        height={19.19}
                    />
                );
        }
    };
    return <>{getIconContent(name)}</>;
};

export default SubscriptionCardIcon;
