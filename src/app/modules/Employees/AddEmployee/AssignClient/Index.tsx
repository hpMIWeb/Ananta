import classNames from "classnames";
import styles from "./assignClient.module.scss";
import { Form } from "antd";
import Button from "../../../../../components/Button/Index";
import { useState } from "react";
import AssignClientBox from "./AssignClientBox";
import { useSelector } from "react-redux";

const AssignClient = ({ onChange, setEmployeeInfo }: any) => {
    const getClients = useSelector((state: any) => state.getClients.data);
    const [addedClientList, setAddedClientList] = useState<any>([]);
    const [selectedClientId, setSelectedClientId] = useState("");

    const onFinish = () => {
        setEmployeeInfo({ assignClients: addedClientList });
        onChange(4);
    };

    const onAddedClientList = (id: any) => {
        setAddedClientList([...addedClientList, selectedClientId]);
        setSelectedClientId("");
    };

    const onRemoveClientList = (id: any) => {
        setAddedClientList(
            addedClientList.filter((a: any) => a !== selectedClientId)
        );
        setSelectedClientId("");
    };

    return (
        <Form
            name="basic"
            initialValues={{ remember: true, creditPeriodType: "Days" }}
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
            className="customAddForm"
        >
            <div className="row">
                <AssignClientBox
                    clientHeader="List of Clients"
                    selectedClientId={selectedClientId}
                    setSelectedClientId={setSelectedClientId}
                    clientList={getClients.filter(
                        (a: any) => !addedClientList.includes(a._id)
                    )}
                    onAssignClick={onAddedClientList}
                    btnText="Assign"
                />
                <AssignClientBox
                    clientHeader="Assigned Clients"
                    selectedClientId={selectedClientId}
                    setSelectedClientId={setSelectedClientId}
                    clientList={getClients.filter((a: any) =>
                        addedClientList.includes(a._id)
                    )}
                    btnText="Unassign"
                    onAssignClick={onRemoveClientList}
                />
            </div>
            <div className={classNames("row", styles.paymentFormRow)}>
                <div
                    className={classNames(
                        "col-12 my-2",
                        styles.subscriptionFormFooter
                    )}
                >
                    <div className="d-flex">
                        <div className="me-auto"></div>
                        <div className="ms-auto">
                            <Button
                                style={{ minWidth: 104, marginRight: 12 }}
                                className="greyBtn"
                                onClick={() => onChange(2)}
                            >
                                Previous
                            </Button>
                            <Button
                                className={styles.nextBtn}
                                style={{ marginRight: 12 }}
                                type="primary"
                                htmlType="submit"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    );
};

export default AssignClient;
