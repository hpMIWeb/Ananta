import { useState } from "react";
import styles from "./assignClient.module.scss";
import classNames from "classnames";
import Input from "../../../../components/ui/Input/Index";
import Button from "../../../../components/ui/Button/Index";

const AssignClientBox = ({
    clientHeader,
    selectedClientId,
    setSelectedClientId,
    btnText,
    clientList = [],
    onAssignClick,
}: any) => {
    const [searchClientText, setSearchClientText] = useState("");

    const getFilteredClient = () => {
        const filterValue = clientList.filter((item: any) => {
            return item.name
                ?.toLowerCase()
                .includes(searchClientText?.toLowerCase());
        });
        return filterValue;
    };

    return (
        <div className="col-12 col-md-6 col-lg-6 padding8">
            <div className="p-3 border border-300 rounded-1 bg-white mb-3">
                <h5 className={classNames("mb-2", styles.clientHeaderText)}>
                    {clientHeader}
                </h5>
                <Input
                    placeholder="Search"
                    value={searchClientText}
                    onChange={(e: any) => setSearchClientText(e.target.value)}
                    className="customAddFormInputText"
                />
                <div className={styles.clientList}>
                    {getFilteredClient().map((list: any) => (
                        <div
                            className={classNames(
                                styles.clientNameLabel,
                                "border",
                                {
                                    [styles.selectedClientNameLabel]:
                                        selectedClientId === list._id,
                                }
                            )}
                            onClick={() => setSelectedClientId(list._id)}
                        >
                            {list.name}
                        </div>
                    ))}
                </div>
                <div className="d-flex justify-content-end">
                    <Button
                        onClick={onAssignClick}
                        className="primaryBlueBtn me-2 mt-2"
                        type="primary"
                    >
                        {btnText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AssignClientBox;
