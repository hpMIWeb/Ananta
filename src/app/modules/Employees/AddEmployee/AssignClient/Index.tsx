import classNames from "classnames";
import styles from "./assignClient.module.scss";
import { Checkbox, Form, Modal, Space, Tag } from "antd";
import Button from "../../../../../components/Button/Index";
import { useEffect, useState } from "react";
import AssignClientBox from "./AssignClientBox";
import { useSelector } from "react-redux";
import Input from "../../../../../components/Input/Index";
import { SearchOutlined } from "@ant-design/icons";

import { CloseCircleOutlined } from "@ant-design/icons";
const AssignClient = ({
  onChange,
  setEmployeeInfo,
  selectedEmployeeData,
}: any) => {
  const getClients = useSelector((state: any) => state.getClients.data);
  const [clientList, setClientList] = useState<any>(getClients);
  const [assignClient, setAssignClient] = useState<any>([]);

  const [selectedClients, setSelectedClients] = useState<any>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const onFinish = () => {
    setEmployeeInfo({ assignClients: assignClient });

    onChange(4);
  };

  useEffect(() => {
    if (selectedEmployeeData) {
      setAssignClient(selectedEmployeeData.assignClients);
      setSelectedClients(selectedEmployeeData.assignClients);

      selectedEmployeeData.assignClients.map((clientId: string) => {
        handleClientSelection(clientId);
      });
    }
  }, []);

  useEffect(() => {
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
      setAssignClient(
        assignClient.filter((client: any) => client !== clientId)
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
        setAssignClient((prevAssignClient: any) => [
          ...prevAssignClient,
          clientId, // Add only the ID to assignClient
        ]);
      }
    }
  };

  // Render clients with checkboxes in the modal body
  const renderClientList = () => {
    return (
      <div>
        {clientList.map((client: any) => (
          <div key={client._id}>
            <Checkbox
              onChange={() => handleClientSelection(client._id)}
              checked={selectedClients.some((c: any) => c.id === client._id)} // Use some() to check if client.id is in selectedClients
            >
              {client.firmName}
            </Checkbox>
          </div>
        ))}
      </div>
    );
  };

  const handleRemoveClient = (clientId: string) => {
    console.log("clientId", clientId);
    const updatedClients = selectedClients.filter(
      (client: any) => client.id !== clientId
    );
    setSelectedClients(updatedClients);
  };

  // Search input change handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    // Filter the promo codes based on the search input
    if (query !== "") {
      const filteredClient = clientList.filter((client: any) =>
        client.firmName.toLowerCase().includes(query.toLowerCase())
      );
      setClientList(filteredClient);
    } else {
      setClientList(getClients);
    }
  };

  return (
    <Form
      name="basic"
      onFinish={onFinish}
      autoComplete="off"
      requiredMark={false}
      className="customAddForm"
    >
      <div className={classNames("row", styles.paymentFormRow)}>
        <div className={classNames("col-12", styles.subscriptionFormFooter)}>
          <div className="d-flex">
            <div className="me-auto">
              <label className="custom-label" style={{ color: "black" }}>
                List Of Clients
              </label>
              {selectedClients.length > 0 ? (
                selectedClients.map((client: any, index: number) => (
                  <div
                    className="custom-label"
                    key={index}
                    style={{ marginLeft: "30px", color: "black" }}
                  >
                    {index + 1} {client.name}
                  </div>
                ))
              ) : (
                <div className="custom-label" style={{ textAlign: "center" }}>
                  No clients assigned yet
                </div>
              )}{" "}
            </div>
            <div className="ms-auto">
              <Button
                className={styles.nextBtn}
                style={{ marginRight: 12 }}
                type="primary"
                onClick={handleAssignClientModalClick}
              >
                {selectedClients.length === 0 ? "Assign" : "Edit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className={classNames("row", styles.paymentFormRow)}>
        <div
          className={classNames(
            "col-12 my-2",
            styles.subscriptionFormFooter,
            styles.selectedClientsContainer // Add this class
          )}
        >
          <div className="d-flex">
            <div className="me-auto"></div>
          </div>
        </div>
      </div>
      <Modal
        title={`List Of Client`}
        centered
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        okText={"Assign"}
        onCancel={() => setModalOpen(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        //  width={755} // Set the modal width as needed
      >
        <div className={classNames("row", styles.paymentFormRow)}>
          <div className={classNames("col-12 my-2")}>
            <span style={{ display: "inline-block" }}>
              {selectedClients.map((client: any, index: number) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => handleRemoveClient(client.id)} // Pass the client id as an argument
                  className={classNames(
                    styles.clientTag,
                    styles.clientNameLabel
                  )}
                >
                  <span className={styles.tagName}>{client.name}</span>
                </Tag>
              ))}
            </span>
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
          <div
            className={classNames("col-12 my-2", styles.clientList)}
            //  style={{ maxHeight: "200px", minHeight: "200px", overflow: "auto" }}
          >
            {renderClientList()}
          </div>
        </div>
      </Modal>
      <div className={classNames("row", styles.paymentFormRow)}>
        <div
          className={classNames("col-12 my-2", styles.subscriptionFormFooter)}
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
