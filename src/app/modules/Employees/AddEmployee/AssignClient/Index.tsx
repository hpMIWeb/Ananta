import classNames from "classnames";
import styles from "./assignClient.module.scss";
import { Checkbox, Form, Modal, Tag } from "antd";
import Button from "../../../../../components/Button/Index";
import { useEffect, useState } from "react";
import AssignClientBox from "./AssignClientBox";
import { useSelector } from "react-redux";
import Input from "../../../../../components/Input/Index";
import { SearchOutlined } from "@ant-design/icons";

const AssignClient = ({ onChange, setEmployeeInfo }: any) => {
    const getClients = useSelector((state: any) => state.getClients.data);
    const [addedClientList, setAddedClientList] = useState<any>([]);
    const [clientList, setClientList] = useState<any>(getClients);

    const [selectedClients, setSelectedClients] = useState<any>([]);

    const [modalOpen, setModalOpen] = useState(false);
    const onFinish = () => {
        setEmployeeInfo({ assignClients: selectedClients });
        onChange(4);
    };

    useEffect(() => {
        console.log("getClients", getClients); // Log the initial data
        setClientList(getClients);
    }, []);

    const handleAssignClientModalClick = () => {
        setModalOpen(true);
    };

    // Function to handle client selection
    const handleClientSelection = (clientId: string) => {
        if (selectedClients.some((client: any) => client.id === clientId)) {
            // If the client is already selected, remove it
            setSelectedClients(
                selectedClients.filter((client: any) => client.id !== clientId)
            );
        } else {
            // If the client is not selected, add it
            const selectedClient = clientList.find(
                (client: any) => client._id === clientId
            );
            if (selectedClient) {
                setSelectedClients([
                    ...selectedClients,
                    { id: selectedClient._id, name: selectedClient.firmName },
                ]);
            }
        }
        console.log("selectedClients", selectedClients);
    };

    // Render clients with checkboxes in the modal body
    const renderClientList = () => {
        return (
            <div>
                {clientList.map((client: any) => (
                    <div key={client._id}>
                        <Checkbox
                            onChange={() => handleClientSelection(client._id)}
                            checked={selectedClients.some(
                                (c: any) => c.id === client._id
                            )} // Use some() to check if client.id is in selectedClients
                        >
                            {client.firmName}
                        </Checkbox>
                    </div>
                ))}
            </div>
        );
    };

    // Search input change handler
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        // Filter the promo codes based on the search input
        const filteredClient = clientList.filter((client: any) =>
            client.firmName.toLowerCase().includes(query.toLowerCase())
        );
        console.log(filteredClient);
        setClientList(filteredClient);
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
                                className={styles.nextBtn}
                                style={{ marginRight: 12 }}
                                type="primary"
                                onClick={handleAssignClientModalClick}
                            >
                                Assign
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title={`List Of Client`}
                centered
                open={modalOpen}
                onOk={() => setModalOpen(false)}
                onCancel={() => setModalOpen(false)}
                width={400} // Set the modal width as needed
            >
                <div className={classNames("row", styles.paymentFormRow)}>
                    <div className={classNames("col-12 my-2")}>
                        <div className="selected-industries">
                            {selectedClients.map(
                                (client: any, index: number) => (
                                    <Tag
                                        key={index}
                                        closable
                                        onClose={() => {
                                            // Handle tag close to remove the tag
                                            const updatedClient = [
                                                ...selectedClients,
                                            ];
                                            updatedClient.splice(index, 1);
                                            setSelectedClients(updatedClient);
                                        }}
                                        style={{ marginTop: "8px" }}
                                    >
                                        {client.name}
                                    </Tag>
                                )
                            )}
                        </div>
                    </div>
                </div>
                <div className={classNames("row", styles.paymentFormRow)}>
                    <div className={classNames("col-12 my-2")}>
                        <Input
                            placeholder="Search..."
                            className="search-box"
                            bordered={false}
                            onChange={handleSearch}
                            prefix={<SearchOutlined />}
                        />
                    </div>
                </div>
                <div className={classNames("row", styles.paymentFormRow)}>
                    <div className={classNames("col-12 my-2")}>
                        {renderClientList()}
                    </div>
                </div>
            </Modal>
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
            </div>{" "}
        </Form>
    );
};

export default AssignClient;
