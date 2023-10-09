import { Space, Modal, Tag } from "antd";
import Table from "../../Table/Index";
import styles from "./promoCodeHistoryModal.module.scss";
import dayjs from "dayjs";
import { capitalize } from "../../../app/utilities/utility";

const PromocodeHistoryModal = ({
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
            title: "Promocode Name",
            dataIndex: "name",
            key: "name",
            className: "center-align-cell",
        },
        {
            title: "Promocode Type",
            dataIndex: "type",
            key: "type",
            className: "center-align-cell",
        },
        {
            title: "Use Per user",
            dataIndex: "codeLife",
            key: "codeLife",
            className: "center-align-cell",
        },
        {
            title: "Maximum Discount",
            dataIndex: "ammount",
            key: "ammount",
            className: "center-align-cell",
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
            title={`History for Promocode Plan ID - ${subscriptionId}`}
            centered
            width="80%"
            open={modalOpen}
            onOk={() => setModalOpen(false)}
            onCancel={() => setModalOpen(false)}
            className="customAddFormSelectOptions"
        >
            <div className={styles.historyTableWrapper}>
                <div>
                    <Table columns={columns} data={subscriptionHistoryData} />
                </div>
            </div>
        </Modal>
    );
};

export default PromocodeHistoryModal;
