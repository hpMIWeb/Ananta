import React, { useState, useEffect } from "react";
import "./Followers.scss";

import api from "../../utilities/apiServices";

import { Popover, Select, Tooltip } from "antd";
import { CaretDownOutlined, UserAddOutlined } from "@ant-design/icons";
import { capitalize } from "../../utilities/utility";
const Followers = (props: any) => {
    // State to follower list
    const [followerList, setFollowerList] = useState<[]>([]);
    // State to control popover visibility
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    // State to store selected values
    const [selectedValues, setSelectedValues] = useState([]);

    useEffect(() => {
        getUserList();
    }, []);

    const getUserList = () => {
        api.getUserList().then((resp: any) => {
            setFollowerList(resp.data);
        });
    };
    // Function to handle selection changes
    const handleSelectChange = (values: any) => {
        // Convert selected values to user objects
        const selectedUsers = followerList.filter((user: any) =>
            values.includes(user._id)
        );
        console.log(selectedUsers);
        setSelectedValues(selectedUsers);
    };

    // Function to handle popover visibility change
    const handlePopoverVisibleChange = (visible: boolean) => {
        setIsPopoverVisible(visible);
    };

    return (
        <div className="follower-container w100">
            <div className="follower-wrapper">
                {
                    <UserAddOutlined
                        className="follower-icon"
                        onClick={() => setIsPopoverVisible(!isPopoverVisible)}
                    />
                }
                &nbsp;
                <div>
                    <p className="follower-label">Followers</p>
                    <p className="follower-value">
                        {selectedValues.length > 0
                            ? selectedValues.map((user: any, index: number) =>
                                  index === 0 ? (
                                      <span key={user._id}>
                                          {capitalize(
                                              `${user.firstName} ${user.lastName}`
                                          )}{" "}
                                      </span>
                                  ) : (
                                      ""
                                  )
                              )
                            : "Not selected yet "}
                        {selectedValues.length > 1 && (
                            <Tooltip
                                placement="bottom"
                                title={selectedValues
                                    .map(
                                        (follower: any) =>
                                            `${capitalize(
                                                `${follower.firstName} ${follower.lastName}`
                                            )}`
                                    )
                                    .join(", ")}
                            >
                                {selectedValues.length > 1 &&
                                    `+ ${selectedValues.length - 1}`}
                            </Tooltip>
                        )}
                        &nbsp;
                        <Popover
                            placement="bottom"
                            content={
                                <div style={{ width: 300 }}>
                                    <Select
                                        mode="multiple"
                                        style={{ width: "100%" }}
                                        placeholder="Select Followers"
                                        defaultValue={selectedValues}
                                        onChange={handleSelectChange}
                                        options={followerList.map(
                                            (user: any) => ({
                                                value: user._id,
                                                label: capitalize(
                                                    `${user.firstName} ${user.lastName}`
                                                ),
                                            })
                                        )}
                                    ></Select>
                                </div>
                            }
                            visible={isPopoverVisible} // Control popover visibility
                            onVisibleChange={handlePopoverVisibleChange} // Handle visibility change
                            trigger="click" // Show popover on click
                            overlayStyle={{ zIndex: 9999 }} // Adjust z-index as needed
                        >
                            <CaretDownOutlined></CaretDownOutlined>
                        </Popover>{" "}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Followers;
