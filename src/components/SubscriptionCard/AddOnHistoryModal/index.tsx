import { Space, Modal, Tag } from "antd";
import Table from "../../Table/Index";
import styles from "./addonHistoryModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { capitalize } from "../../../app/utilities/utility";

const AddOnHistoryModal = ({
    modalOpen,
    setModalOpen,
    subscriptionHistoryData,
    subscriptionId,
}: any) => {
    const columns = [
        {
            title: "Sr No",
            dataIndex: "no",
            key: "no",
            className: "center-align-cell",
            render: (text: any, record: any, index: number) => (
                <span>{index + 1}</span>
            ),
        },
        {
            title: "Date",
            dataIndex: "updatedAt",
            key: "updatedAt",
            className: "center-align-cell",
            render: (updatedAt: string) => {
                const formattedDate = dayjs(updatedAt).format(
                    "DD-MMM-YYYY HH:mm:ss"
                );
                return <span>{formattedDate}</span>;
            },
        },
        {
            title: "Plan Name",
            dataIndex: "add_on_title",
            key: "add_on_title",
            className: "center-align-cell",
        },
        {
            title: "Addon Type",
            dataIndex: "add_on_type",
            key: "add_on_type",
            className: "center-align-cell",
        },
        {
            title: "Value",
            dataIndex: "storage_size",
            key: "storage_size",
            className: "center-align-cell",
        },
        {
            title: "Validity",
            dataIndex: "",
            key: "time_period_type",
            className: "center-align-cell",
            render: (subscriptionHistoryData: any) => (
                <span>
                    {subscriptionHistoryData.time_period}{" "}
                    {capitalize(subscriptionHistoryData.time_period_type)}
                </span>
            ),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            className: "center-align-cell",
            render: (price: number) => (
                <span>₹ {price.toLocaleString("en-IN")}</span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            className: "center-align-cell",
        },
    ];

    return (
        <Modal
            title={`History for AddOn Plan ID - ${subscriptionId}`}
            centered
            width="80%"
            open={modalOpen}
            onOk={() => setModalOpen(false)}
            onCancel={() => setModalOpen(false)}
        >
            <div className={styles.historyTableWrapper}>
                <div>
                    <Table columns={columns} data={subscriptionHistoryData} />
                </div>
            </div>
        </Modal>
    );
};

export default AddOnHistoryModal;
