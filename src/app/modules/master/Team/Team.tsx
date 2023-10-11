import React, { useEffect, useState } from "react";
import {
    Col,
    Divider,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Table,
    Typography,
} from "antd";
import { SearchOutlined, TeamOutlined } from "@ant-design/icons";
import styles from "./team.module.scss";
import classNames from "classnames";

import "./Team.scss";
import { AddTeam as IAddTeam, Team as ITeam } from "./interfaces/ITeam";
import { Department as IDepartment } from "../Department/interfaces/IDeparment";
import api from "../../../utilities/apiServices";
import { capitalize, employeeOpts } from "../../../utilities/utility";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../../components/Button/Index";
import DeletePopupConfirm from "../../../../components/DeletePopupConfirm/DeletePopupConfirm";
import SearchFilterBar from "../../../../components/SearchFilterBar/Index";
import CardContentSkeletonLoader from "../../../../components/CardContentSkeletonLoader/Index";

const Team = () => {
    const pageSize = 25;
    const [current, setCurrent] = useState(1);
    const [teamList, setTeamList] = useState<ITeam[]>([]);
    //const [addTeam, setAddTeam] = useState<IAddTeam>({} as IAddTeam);
    const [searchValue, setSearchValue] = useState<string>("");
    const [sortState, setSortState] = useState({ type: "", sortOrder: "" });

    const [addTeam, setAddTeam] = useState<IAddTeam>({
        name: "", // Empty string as a placeholder
        department: "", // Empty string as a placeholder
        leader: [], // Empty array as a placeholder
        member: [], // Empty array as a placeholder
    });
    const [departmentList, setDepartmentList] = useState<IDepartment[]>([]);
    const [userList, setUserList] = useState<[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<ITeam>({} as ITeam);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [isTeamMemberModalOpen, setIsTeamMemberModalOpen] = useState(false);
    const [selectedTeamMembers, setSelectedTeamMembers] = useState<any[]>([]);

    const showTeamMemberModal = (members: any) => {
        setSelectedTeamMembers(members); // Assuming "Employees" is the property containing the list of employees for a department
        setIsTeamMemberModalOpen(true);
    };

    const closeTeamMemberModal = () => {
        setSelectedTeamMembers([]);
        setIsTeamMemberModalOpen(false);
    };

    const teamMemberColumns = [
        {
            title: "Fist Name",
            dataIndex: "firstName",
            key: "firstName",
        },
        {
            title: "Last Name",
            dataIndex: "lastName",
            key: "lastName",
        },
    ];

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
            title: "Team Name",
            dataIndex: "name",
            width: "30%",
            sorter: (a: ITeam, b: ITeam) => a.name.localeCompare(b.name),
        },
        {
            title: "Department",
            dataIndex: "department",
            width: "20%",
            render: (department: any) => (
                <span>
                    {department && department.name
                        ? department.name
                        : "Unknown Department"}
                </span>
            ),
            sorter: (a: any, b: any) => {
                const departmentA = a.department ? a.department.name : "";
                const departmentB = b.department ? b.department.name : "";
                return departmentA.localeCompare(departmentB);
            },
        },
        {
            title: "Team Leader",
            dataIndex: "leader",
            width: "15%",
            render: (leaders: any) => (
                <span className="actionColumn">
                    {leaders && leaders.length > 0
                        ? leaders[0].firstName
                        : "No Leader"}
                </span>
            ),
            sorter: (a: any, b: any) => {
                const leaderA = a.leader[0]?.firstName || "";
                const leaderB = b.leader[0]?.firstName || "";
                return leaderA.localeCompare(leaderB);
            },
        },
        {
            title: "Team Members",
            dataIndex: "member",
            width: "10%",
            className: "center-align-cell",
            render: (member: any) => (
                <span className="actionColumn">
                    {member && member.length > 0 ? (
                        <span
                            onClick={() => {
                                showTeamMemberModal(member);
                            }}
                        >
                            <TeamOutlined />

                            {/* {member.map((memberData: any, index: any) => (
                                <Tooltip
                                    key={index}
                                    title={capitalize(
                                        `${memberData.firstName} ${memberData.lastName}`
                                    )}
                                ></Tooltip>
                            ))} */}

                            {member.length}
                        </span>
                    ) : (
                        "No Leader"
                    )}
                </span>
            ),
        },
        {
            title: "Action",
            dataIndex: "",
            key: "action",
            width: "10%",
            className: "center-align-cell",
            render: (_: any, record: ITeam) => (
                <span className="actionColumn">
                    <FontAwesomeIcon
                        icon={faEdit}
                        className="btn-at"
                        title="Edit Team"
                        style={{ color: "#2c7be5", marginLeft: "15px" }}
                        onClick={() => editClickHandler(record)}
                    />
                    <Divider type="vertical" />

                    <DeletePopupConfirm
                        popUpTitle={`Do you want to delete ${record.name} Team?`}
                        content=""
                        onConfirm={() => deleteClickHandler(record._id)}
                        button-label="Delete  Team"
                    />
                </span>
            ),
        },
    ];

    const deleteClickHandler = (teamId: string) => {
        // Delete from  DB
        setLoading(true);
        api.deleteTeam(teamId)
            .then((resp: any) => {
                const updatedData = teamList.filter(
                    (item: ITeam) => item._id !== teamId
                );
                setTeamList(updatedData);
                toast.success("Team successfully deleted.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .catch((error) => {
                toast.error("Technical error while deleting Team.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const editClickHandler = (team: ITeam) => {
        setSelectedTeam(team);
        setAddTeam({
            name: team.name,
            department: team.department._id,
            leader: [team.leader[0]._id.toString()],
            member: team.member.map((memberData: any) => memberData._id),
        });
        form.setFieldsValue({
            name: team.name,
            department: team.department._id,
            leader: team.leader[0]._id,
            member: team.member.map((memberData: any) => memberData._id),
        });

        setModalMode("edit"); // Set mode to "edit"
        showModal("edit"); // Open the modal
    };

    useEffect(() => {
        getTeam();
        getUserList();
        getDepartmentList();
    }, []);

    const getTeam = () => {
        setLoading(true);
        api.getTeam()
            .then((resp: any) => {
                console.log(resp.data);
                setTeamList(resp.data);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getUserList = () => {
        setLoading(true);
        api.getUserList()
            .then((resp: any) => {
                setUserList(resp.data);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getDepartmentList = () => {
        setLoading(true);
        api.getDepartment()
            .then((resp: any) => {
                setDepartmentList(resp.data);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = (mode: "add" | "edit") => {
        if (mode === "add") {
            form.setFieldsValue({
                name: "",
                member: "",
                leader: "",
                department: "",
            });
            setAddTeam({
                name: "",
                member: [],
                leader: [],
                department: "",
            });

            setModalMode(mode);
            setIsModalOpen(true);
        } else {
            setModalMode(mode);
            setIsModalOpen(true);
        }
    };

    const handleCancel = () => {
        setModalMode("add");
        form.resetFields();
        form.setFieldsValue({} as IAddTeam);
        setAddTeam({} as IAddTeam);
        setIsModalOpen(false);
    };

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                try {
                    setLoading(true);
                    const apiCall =
                        modalMode === "add"
                            ? api.createTeam(addTeam)
                            : api.updateTeam(addTeam, selectedTeam._id);

                    apiCall
                        .then((resp: any) => {
                            const successMessage =
                                modalMode === "add"
                                    ? "Team added."
                                    : "Team Updated.";

                            toast.success(successMessage, {
                                position: toast.POSITION.TOP_RIGHT,
                            });
                            getTeam();
                            setIsModalOpen(false);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                } catch (ex) {
                    setLoading(false);
                    toast.error("Technical error while creating Team", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            })
            .catch((errorInfo) => {
                setIsModalOpen(true);
                console.log("Validation failed:", errorInfo);
            });
    };

    // Search input change handler
    const handleSearch = (searchValue: string) => {
        setSearchQuery(searchValue);
    };

    function onChange(sorter: any) {
        console.log(sorter);
    }

    const getData = (current: number, pageSize: number) => {
        const startIndex = (current - 1) * pageSize;
        let retVal = teamList;

        if (searchQuery.trim() !== "") {
            retVal = retVal.filter((item) => {
                return Object.values(item).some((value) => {
                    if (value)
                        return (
                            value
                                .toString()
                                .toLowerCase()
                                .indexOf(searchQuery?.toLowerCase()) !== -1
                        );
                    else {
                        return value;
                    }
                });
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

    const inputChangeHandler = (event: any, nameItem: string = "") => {
        let name = "";
        let value = "";
        if (event && event.target) {
            name = event.target.name;
            value = event.target.value;
        } else if (nameItem !== "" && event !== "" && event !== undefined) {
            name = nameItem;
            value = event.value ?? event;
        } else if (event) {
            name = event.name;
            value = event.value;
        }

        if (name === "leader") {
            // Handle team leader as an array
            setAddTeam({
                ...addTeam,
                leader: [value], // Convert the value to an array
            });
        } else if (name === "member") {
            // Handle team member as an array
            const transformedValues = event.map((item: any) => item.value);
            setAddTeam({ ...addTeam, [name]: transformedValues });
        } else {
            setAddTeam({
                ...addTeam,
                [name]: value,
            });
        }
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
                                Team
                            </h5>
                        </div>
                        <div className={classNames("ms-auto z-index-1")}>
                            <Button
                                onClick={() => {
                                    showModal("add");
                                }}
                                className={styles.newPromoBtn}
                                type="primary"
                            >
                                Add New
                            </Button>
                        </div>
                    </div>
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
                    <Modal
                        title={
                            modalMode === "add"
                                ? "Create New Team"
                                : "Edit Team"
                        }
                        open={isModalOpen}
                        onCancel={handleCancel}
                        onOk={handleOk}
                        width={350}
                    >
                        <hr />
                        <Form form={form} initialValues={addTeam}>
                            <Row gutter={[8, 8]} className="form-row">
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 16 }}
                                    md={{ span: 24 }}
                                >
                                    <Form.Item
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please enter team name",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Team Name"
                                            className="w100"
                                            name="name"
                                            onChange={(event) => {
                                                inputChangeHandler(event);
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={[8, 8]} className="">
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 16 }}
                                    md={{ span: 24 }}
                                >
                                    <Form.Item
                                        name="department"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please enter department",
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            options={departmentList.map(
                                                (departmentList) => ({
                                                    value: departmentList._id,
                                                    label: capitalize(
                                                        departmentList.name
                                                    ),
                                                })
                                            )}
                                            placeholder="Select Department"
                                            onChange={(value, event) => {
                                                inputChangeHandler(
                                                    event,
                                                    "department"
                                                );
                                            }}
                                            showSearch={true}
                                            className="w100"
                                        ></Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[8, 8]} className="">
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 16 }}
                                    md={{ span: 24 }}
                                >
                                    <Form.Item
                                        name="leader"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter leader",
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            options={userList.map(
                                                (user: any) => ({
                                                    value: user._id,
                                                    label: capitalize(
                                                        `${user.firstName} ${user.lastName}`
                                                    ),
                                                })
                                            )}
                                            placeholder="Select Team Leader"
                                            onChange={(value, event) => {
                                                inputChangeHandler(
                                                    event,
                                                    "leader"
                                                );
                                            }}
                                            showSearch={true}
                                            className="w100"
                                        ></Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[8, 8]} className="">
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 16 }}
                                    md={{ span: 24 }}
                                >
                                    <Form.Item
                                        name="member"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please select member",
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            options={[
                                                ...userList.map(
                                                    (user: any) => ({
                                                        value: user._id,
                                                        label: capitalize(
                                                            `${user.firstName} ${user.lastName}`
                                                        ),
                                                    })
                                                ),
                                            ]}
                                            placeholder="Select Team Member"
                                            onChange={(value, event) => {
                                                inputChangeHandler(
                                                    event,
                                                    "member"
                                                );
                                            }}
                                            showSearch={true}
                                            className="w100"
                                            mode="multiple"
                                        ></Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                    {/* Team modal */}
                    <Modal
                        title="Team Member"
                        open={isTeamMemberModalOpen}
                        onCancel={closeTeamMemberModal}
                        footer={null}
                    >
                        <Table
                            dataSource={selectedTeamMembers}
                            columns={teamMemberColumns}
                            pagination={false}
                        />
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default Team;
