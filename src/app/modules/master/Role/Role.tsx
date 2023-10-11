import React, { useEffect, useState } from "react";
import { Button, Col, Divider, Row, Table, Typography } from "antd";
import styles from "./role.module.scss";
import addSubImg from "../../../../assets/images/add-subscription.jpg";
import classNames from "classnames";
import "./Role.scss";
import { AddRole as IAddRole, Role as IRole } from "./interfaces/IRole";
import { ToastContainer, toast } from "react-toastify";

import api from "../../../utilities/apiServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import DeletePopupConfirm from "../../../../components/DeletePopupConfirm/DeletePopupConfirm";
import SearchFilterBar from "../../../../components/SearchFilterBar/Index";
import CardContentSkeletonLoader from "../../../../components/CardContentSkeletonLoader/Index";

const Role = () => {
    const pageSize = 25;
    const [current, setCurrent] = useState(1);
    const [roleList, setRoleList] = useState<IRole[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortState, setSortState] = useState({ type: "", sortOrder: "" });
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [selectedDepartmentEmployees, setSelectedDepartmentEmployees] =
        useState<IRole[]>([]);

    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);

    const columns = [
        {
            title: "Sr.No",
            dataIndex: "srNo",
            key: "srNo",
            width: "5%",
            sorter: (a: any, b: any) => a.srNo - b.srNo,
            className: "center-align-cell",
        },
        {
            title: "Role Name",
            dataIndex: "roleName",
            width: "30%",
            sorter: (a: any, b: any) => a.roleName.localeCompare(b.roleName), // Add sorter for Role Name
        },
        {
            title: "Role Type",
            dataIndex: "roleTypeName",
            width: "25%",
            sorter: (a: any, b: any) =>
                a.roleTypeName.localeCompare(b.roleTypeName), // Add sorter for Role Type
        },
        {
            title: "No of users",
            dataIndex: "userCount",
            width: "10%",
            className: "center-align-cell",
            render: (record: any) => (
                <span className="center-align-cell">
                    {record.userCount ? record.userCount : 0}
                </span>
            ),
        },
        {
            title: "Modules",
            dataIndex: "modules",
            width: "10%",
            className: "center-align-cell",
            render: () => (
                <span>
                    <img
                        src={require("./Image/dd.jpg")}
                        style={{ maxHeight: "20px", alignItems: "center" }}
                    />
                    &nbsp;&nbsp;4/8
                </span>
            ),
        },
        {
            title: "Action",
            dataIndex: "",
            key: "action",
            width: "10%",
            className: "center-align-cell",
            render: (_: any, record: IRole) => (
                <span className="actionColumn">
                    <FontAwesomeIcon
                        icon={faEdit}
                        className="btn-at"
                        title="Edit Role"
                        style={{ color: "#2c7be5", marginLeft: "15px" }}
                        onClick={() => editClickHandler(record)}
                    />
                    <Divider type="vertical" />

                    <DeletePopupConfirm
                        popUpTitle={`Do you want to delete ${record.roleName} Role?`}
                        content=""
                        onConfirm={() => deleteClickHandler(record._id)}
                        button-label="Delete  Role"
                    />
                </span>
            ),
        },
    ];

    useEffect(() => {
        getAllRole();
    }, []);

    const getAllRole = () => {
        setLoading(true); // Set loading state to true
        api.getRole()
            .then((resp: any) => {
                setRoleList(resp.data);
            })
            .finally(() => {
                setLoading(false); // Reset loading state
            });
    };

    // Search input change handler
    const handleSearch = (searchValue: string) => {
        setSearchQuery(searchValue);
    };

    const getData = (current: number, pageSize: number) => {
        const startIndex = (current - 1) * pageSize;
        let retVal = roleList;
        if (searchQuery.trim() !== "") {
            retVal = retVal.filter((item) => {
                return Object.values(item).some(
                    (value) =>
                        value
                            .toString()
                            .toLowerCase()
                            .indexOf(searchQuery?.toLowerCase()) !== -1
                );
            });
        }

        return retVal.map((item: any, index: number) => {
            const serialNumber = startIndex + index + 1; // Calculate the serial number
            return {
                ...item,
                key: index,
                srNo: serialNumber, // Assign the serial number to the 'srNo' property
            };
        });
    };

    const deleteClickHandler = (roleId: string) => {
        // Delete from  DB
        setLoading(true); // Reset loading state
        api.deleteRole(roleId)

            .then((resp: any) => {
                const updatedData = roleList.filter(
                    (item: IRole) => item._id !== roleId
                );

                setRoleList(updatedData);
                toast.success("Role successfully deleted.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .catch((error) => {
                toast.error("Technical error while deleting Role.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .finally(() => {
                setLoading(false); // Reset loading state
            });
    };

    const editClickHandler = (role: IRole) => {
        navigate("/role-action", {
            state: { roleData: role, updated: true },
        });
    };

    const addRoleHandler = () => {
        navigate("/role-action");
    };

    return (
        <>
            <ToastContainer autoClose={25000} />
            {/* <LoadingSpinner isLoading={loading} /> */}
            <div className={classNames(styles.promoCodesPageWrapper)}>
                <div
                    className={classNames(
                        "card-header d-flex",
                        styles.promoCodesPageHeader
                    )}
                    style={{ minHeight: 60 }}
                >
                    <div
                        className={classNames(
                            "d-flex align-items-center w-100",
                            styles.departmentHeaderTitle
                        )}
                    >
                        <div className="me-auto">
                            <h5
                                className={classNames(
                                    "my-2 position-relative z-index-1",
                                    styles.deapartmentLabel
                                )}
                            >
                                Role
                            </h5>
                        </div>
                        <div className={classNames("ms-auto z-index-1")}>
                            <Button
                                onClick={addRoleHandler}
                                className={styles.newPromoBtn}
                            >
                                Add New
                            </Button>
                        </div>
                    </div>
                    <div
                        style={{
                            backgroundImage: `url(${addSubImg})`,
                        }}
                        className={classNames(
                            "rounded-3 rounded-bottom-0",
                            styles.addPromoCodeImg
                        )}
                    ></div>
                </div>
                <div className={styles.departmentBottomWrapper}>
                    <div style={{ marginBottom: 24 }}>
                        <SearchFilterBar
                            searchValue={searchQuery}
                            setSearchValue={handleSearch}
                            sortState={sortState}
                            setSortState={setSortState}
                            setSortStateHandler={(options: any) => {
                                setSortState(options);
                            }}
                            allowSortBy={false}
                        />
                    </div>
                    {loading && <CardContentSkeletonLoader />}
                    {!loading && (
                        <div>
                            <Table
                                columns={columns}
                                dataSource={getData(current, pageSize)}
                                size="small"
                                style={{ width: "100%" }}
                                className="r4 table-striped-rows"
                                bordered
                                pagination={false}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Role;
