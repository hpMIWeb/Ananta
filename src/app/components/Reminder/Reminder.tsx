import React, { useState, useEffect } from "react";
import "./Reminder.scss";

import api from "../../utilities/apiServices";

import { Modal, Popover, Select, Tooltip } from "antd";
import { CaretDownOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { capitalize } from "../../utilities/utility";
const Reminder = (props: any) => {
    // State to control Reminder modal visibility
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    // State to control popover visibility
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);

    const showReminderModal = () => {
        setIsReminderModalOpen(true);
    };

    const saveReminderDetails = () => {
        setIsReminderModalOpen(false);
    };

    const closeReminderModal = () => {
        setIsReminderModalOpen(false);
    };

    // Function to handle popover visibility change
    const handlePopoverVisibleChange = (visible: boolean) => {
        showReminderModal();
        setIsPopoverVisible(visible);
    };

    return (
        <div className="reminder-container w100">
            <div className="reminder-wrapper">
                {
                    <ClockCircleOutlined
                        className="reminder-icon"
                        onClick={() => setIsPopoverVisible(!isPopoverVisible)}
                    />
                }
                &nbsp;
                <div>
                    <p className="reminder-label">Reminder</p>
                    <p className="reminder-value">
                        Not selected yet &nbsp;
                        <Popover
                            placement="bottom"
                            content={
                                <div style={{ width: 300 }}>
                                    <Modal
                                        title="Reminder Modal" // Set the title here
                                        open={isReminderModalOpen} // Use 'visible' instead of 'open'
                                        onOk={saveReminderDetails}
                                        onCancel={closeReminderModal}
                                    >
                                        {/* Place your modal content here */}
                                        <p>Some contents...</p>
                                        <p>Some contents...</p>
                                        <p>Some contents...</p>
                                    </Modal>
                                </div>
                            }
                            open={isPopoverVisible}
                            onOpenChange={handlePopoverVisibleChange}
                            trigger="click"
                            overlayStyle={{ zIndex: 9999 }}
                        >
                            <CaretDownOutlined />
                        </Popover>{" "}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Reminder;
