import styles from "./emergencyInfo.module.scss";
import Button from "../../../../components/ui/Button/Index";
import Icon from "../../../../components/ui/Icon/Index";

const CardBottomAction = ({
    onChange,
    addCardClick,
    showAdd = true,
    loading,
    primaryButtonText,
}: any) => {
    return (
        <div className="d-flex">
            <div className="me-auto">
                {showAdd && (
                    <Button
                        className={styles.addOwnerInfoBtn}
                        onClick={addCardClick}
                        type="primary"
                    >
                        <Icon name="plus" width={14.25} height={16} />
                        Add
                    </Button>
                )}
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
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                >
                    {primaryButtonText || "Next"}
                </Button>
            </div>
        </div>
    );
};

export default CardBottomAction;