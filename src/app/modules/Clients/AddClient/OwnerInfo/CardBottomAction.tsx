import styles from "./ownerInfo.module.scss";
import Button from "../../../../components/ui/Button/Index";
import Icon from "../../../../components/ui/Icon/Index";

const CardBottomAction = ({ onChange, addCardClick }: any) => {
    return (
        <div className="d-flex">
            <div className="me-auto">
                <Button
                    className={styles.addOwnerInfoBtn}
                    onClick={addCardClick}
                    type="primary"
                >
                    <Icon name="plus" width={14.25} height={16} />
                    Add
                </Button>
            </div>
            <div className="ms-auto">
                <Button
                    style={{ minWidth: 104, marginRight: 12 }}
                    className="greyBtn"
                    onClick={() => onChange(1)}
                >
                    Previous
                </Button>
                <Button
                    className={styles.nextBtn}
                    type="primary"
                    htmlType="submit"
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default CardBottomAction;
