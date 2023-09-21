import { Space, Modal, Tag } from "antd";
import Table from "../../Table/Index";
import styles from "./subscriptionHistoryModal.module.scss";

const SubscriptionHistoryModal = ({ modalOpen, setModalOpen }) => {
  const columns = [
    {
      title: "Sr No",
      dataIndex: "no",
      key: "no",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Plan Name",
      dataIndex: "planName",
      key: "planName",
    },
    {
      title: "Storage",
      dataIndex: "storage",
      key: "storage",
    },
    {
      title: "No Of Client",
      dataIndex: "noOfClient",
      key: "noOfClient",
    },
    {
      title: "Users",
      dataIndex: "users",
      key: "users",
      children: [
        {
          title: "CA Owner & Employee Users",
          dataIndex: "caOwner",
          key: "caOwner",
        },
        {
          title: "Client Owner & Employee Users",
          dataIndex: "employeeUsers",
          key: "employeeUsers",
        },
        {
          title: "Client Vendors Users",
          dataIndex: "vendorsUsers",
          key: "vendorsUsers",
        },
      ],
    },
    {
      title: "No Of Credits",
      dataIndex: "noOfCredits",
      key: "noOfCredits",
    },
    {
      title: "Validity",
      dataIndex: "validity",
      key: "validity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Display on Portal",
      dataIndex: "displayOnPortal",
      key: "displayOnPortal",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    }, {
      title: "Modules",
      dataIndex: "users",
      key: "users",
      children: [
        {
          title: "TaskManager",
          dataIndex: "TaskManager",
          key: "TaskManager",
        },{
          title: "FileManager",
          dataIndex: "FileManager",
          key: "FileManager",
        },{
          title: "E-Commerce",
          dataIndex: "E-Commerce",
          key: "E-Commerce",
        },
        
      ],
    },
  ];

  const data = [
    {
      key: "1",
      no: 1,
      date: "10-May-2022",
      planName: "Gold",
      storage: "2 GB",
      noOfClient: 10,
      caOwner: 5,
      employeeUsers: 30,
      vendorsUsers: 50,
      noOfCredits: "10,000",
      validity: "3 Months",
      price: "10,000.00",
      displayOnPortal: "Yes",
      status: "Active",
      TaskManager: "Active",
    },
    {
      key: "2",
      no: 2,
      date: "11-May-2022",
      planName: "Semi Gold",
      storage: "4 GB",
      noOfClient: 15,
      caOwner: 9,
      employeeUsers: 50,
      vendorsUsers: 70,
      noOfCredits: "15,000",
      validity: "6 Months",
      price: "15,000.00",
      displayOnPortal: "No",
      status: "Inactive",
      TaskManager: "Active",
    },
    {
      key: "3",
      no: 3,
      date: "11-May-2022",
      planName: "Silver",
      storage: "6 GB",
      noOfClient: 12,
      caOwner: 10,
      employeeUsers: 40,
      vendorsUsers: 60,
      noOfCredits: "20,000",
      validity: "1 Year",
      price: "30,000.00",
      displayOnPortal: "Yes",
      status: "Active",
      TaskManager: "Active",
    },
  ];

  return (
    <Modal
      title="History for Plan ID - 12345678"
      centered
      width="80%"
      open={modalOpen}
      onOk={() => setModalOpen(false)}
      onCancel={() => setModalOpen(false)}
    >
      <div className={styles.historyTableWrapper}>
        <div className={styles.historyTableContainer}>
          <Table scroll={{ x: 1000 }} columns={columns} data={data} />
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionHistoryModal;
