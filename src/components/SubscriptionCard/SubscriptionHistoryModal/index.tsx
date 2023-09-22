import { Space, Modal, Tag } from "antd";
import Table from "../../Table/Index";
import styles from "./subscriptionHistoryModal.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { capitalize } from "../../../app/utilities/utility";


const SubscriptionHistoryModal = ({ modalOpen, setModalOpen,subscriptionHistoryData,subscriptionId }:any) => {
  const columns = [
    {
      title: "Sr No",
      dataIndex: "no",
      key: "no",
      className: "center-align-cell",
      render: (text: any, record: any, index: number) => <span >{index + 1}</span>,
    },
    {
      title: "Date",
      dataIndex: "updatedAt",
      key: "updatedAt",
      className: "center-align-cell",
      render: (updatedAt: string) => {
        const formattedDate = dayjs(updatedAt).format("DD-MMM-YYYY HH:mm:ss");
    return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Plan Name",
      dataIndex: "plan_name",
      key: "plan_name",
      className: "center-align-cell",
    },
    {
      title: "Storage",
      dataIndex: "storage_space",
      key: "storage_space",
      className: "center-align-cell",
      render:(storage_space:string)=><span>{storage_space} GB</span>
    },
    {
      title: "No Of Client",
      dataIndex: "no_of_client",
      key: "no_of_client",
      className: "center-align-cell",
    },
    {
      title: "Users",
      dataIndex: "no_of_users",
      key: "no_of_users",
      className: "center-align-cell",
      children: [
        {
          title: "CA Office Users",
          dataIndex: "no_of_users",
          key: "no_of_users",
          className: "center-align-cell",
          width: 80, // Set the desired width (adjust as needed)
          render:(no_of_users:any)=><span>{no_of_users.employee_ca}</span>
        },
        {
          title: "Client Office Users",
          dataIndex: "no_of_users",
          key: "no_of_users",
          className: "center-align-cell",
          width: 80, // Set the desired width (adjust as needed)
          render:(no_of_users:any)=><span>{no_of_users.employee_client}</span>
        },
        {
          title: "Client Vendor Users",
          dataIndex: "no_of_users",
          key: "no_of_users",
          className: "center-align-cell",
          width: 80, // Set the desired width (adjust as needed)
          render:(no_of_users:any)=><span>{no_of_users.client_vendor}</span>
        },
      ],
    },
    {
      title: "No Of Credits",
      dataIndex: "transaction_credits",
      key: "transaction_credits",
      className: "center-align-cell",
    },
    {
      title: "Validity",
      dataIndex: "",
      key: "period",
      className: "center-align-cell",
      render:(subscriptionHistoryData:any)=><span>{subscriptionHistoryData.period}  {capitalize(subscriptionHistoryData.period_type)}</span>
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      className: "center-align-cell",
      render: (price: number) => (
        <span>
         ₹ {price.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: "Display on Portal",
      dataIndex: "display_on_portal",
      key: "display_on_portal",
      className: "center-align-cell",
      render: (displayOnPortal: boolean) => (displayOnPortal ? "Yes" : "No"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      className: "center-align-cell",
    }, {
      title: "Modules",
      dataIndex: "features",
      key: "features",
      className: "center-align-cell",
      children: [
        {
          title: "TaskManager",
          dataIndex: "features",
          key: "features",
          className: "center-align-cell",
          render: (featureData: any) => {
            const isTaskManagerEnabled = featureData.TaskManager;
            const icon = isTaskManagerEnabled ? faCheck : faTimes;
            const color = isTaskManagerEnabled ? 'green' : 'red';
            return (
              <span style={{ color }}>
                <FontAwesomeIcon icon={icon} />
              </span>
            );
          },
        },{
          title: "FileManager",
          dataIndex: "features",
          key: "features",
          className: "center-align-cell",
          render: (featureData: any) => {
            const isFileManagerEnabled = featureData.FileManager;
            const icon = isFileManagerEnabled ? faCheck : faTimes;
            const color = isFileManagerEnabled ? 'green' : 'red';
            return (
              <span style={{ color }}>
                <FontAwesomeIcon icon={icon} />
              </span>
            );
          },
        },{
          title: "E-Commerce",
          dataIndex: "features",
          key: "features",
          className: "center-align-cell",
          render: (featureData: any) => {
            const isECommerceEnabled = featureData.E_Commerce;
            const icon = isECommerceEnabled ? faCheck : faTimes;
            const color = isECommerceEnabled ? 'green' : 'red';
            return (
              <span style={{ color }}>
              <FontAwesomeIcon icon={icon} />
              </span>
            );
          },
        },
        {
          title: "Template Customization",
          dataIndex: "features",
          key: "features",
          className: "center-align-cell",
          render: (featureData: any) => {
            const isTemplateCustomizationEnabled = featureData.Tamplate_Customization_for_import;
            const icon = isTemplateCustomizationEnabled ? faCheck : faTimes;
            const color = isTemplateCustomizationEnabled ? 'green' : 'red';
            return (
              <span style={{ color }}>
                <FontAwesomeIcon icon={icon} />
              </span>
            );
          },
        },
        
      ],
    },
  ];

  
  return (
    <Modal
    title={`History for Plan ID - ${subscriptionId}`} 
      centered
      width="80%"
      open={modalOpen}
      onOk={() => setModalOpen(false)}
      onCancel={() => setModalOpen(false)}
    >
      <div className={styles.historyTableWrapper}>
        <div className={styles.historyTableContainer}>
          <Table  columns={columns} data={subscriptionHistoryData} />
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionHistoryModal;
