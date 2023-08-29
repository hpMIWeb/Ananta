import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Table,
    Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./Team.scss";
import { AddTeam as IAddTeam, Team as ITeam } from "./interfaces/ITeam";
import { Department as IDepartment } from "../Department/interfaces/IDeparment";
import api from "../../../utilities/apiServices";
import { capitalize, employeeOpts } from "../../../utilities/utility";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
const pageSize = 25;
const { Title } = Typography;

const Team = () => {
    const [current, setCurrent] = useState(1);
    const [teamList, setTeamList] = useState<ITeam[]>([]);
    const [addTeam, setAddTeam] = useState<IAddTeam>({} as IAddTeam);
    const [departmentList, setDepartmentList] = useState<IDepartment[]>([]);
    const [userList, setUserList] = useState<[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<ITeam>({} as ITeam);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [form] = Form.useForm();

    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [selectedDepartmentEmployees, setSelectedDepartmentEmployees] =
        useState<ITeam[]>([]);

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
                <span className="actionColumn">
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
            dataIndex: "teammembers",
            width: "10%",
        },
        {
            title: "Action",
            dataIndex: "",
            key: "action",
            width: "10%",
            render: (_: any, record: ITeam) => (
                <span className="actionColumn">
                    <FontAwesomeIcon
                        icon={faEdit}
                        className="btn-at"
                        title="Edit Department"
                        style={{ color: "#2c7be5", marginLeft: "15px" }}
                        onClick={() => editClickHandler(record)}
                    />
                    <Divider type="vertical" />
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => deleteClickHandler(record._id)}
                    >
                        <FontAwesomeIcon
                            icon={faTrash}
                            className="btn-at"
                            title="Delete Department"
                            style={{ color: "#fa5c7c" }}
                        />
                    </Popconfirm>
                </span>
            ),
        },
    ];

    const deleteClickHandler = (teamId: string) => {
        // Delete from  DB
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
        api.getTeam().then((resp: any) => {
            console.log(resp.data);
            setTeamList(resp.data);
        });
    };

    const getUserList = () => {
        api.getUserList().then((resp: any) => {
            setUserList(resp.data);
        });
    };

    const getDepartmentList = () => {
        api.getDepartment().then((resp: any) => {
            setDepartmentList(resp.data);
        });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = (mode: "add" | "edit") => {
        if (mode === "add") {
            form.setFieldsValue({} as IAddTeam);
            setAddTeam({} as IAddTeam);
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
        setIsModalOpen(false);
    };

    const handleOk = () => {
        //

        form.validateFields()
            .then((values) => {
                try {
                    console.log("modalMode", modalMode);
                    //  return;
                    const apiCall =
                        modalMode === "add"
                            ? api.createTeam(addTeam)
                            : api.updateTeam(addTeam, selectedTeam._id);

                    apiCall.then((resp: any) => {
                        const successMessage =
                            modalMode === "add"
                                ? "Team added."
                                : "Team Updated.";

                        toast.success(successMessage, {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        form.resetFields();
                        getTeam();
                    });
                } catch (ex) {
                    toast.error("Technical error while creating Team", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            })
            .catch((errorInfo) => {
                setIsModalOpen(true);
                console.log("Validation failed:", errorInfo);
            });
        setIsModalOpen(false);
    };

    // Search input change handler
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    function onChange(sorter: any) {
        console.log(sorter);
    }

    const getData = (current: number, pageSize: number) => {
        const startIndex = (current - 1) * pageSize;
        let retVal = teamList;

        if (searchQuery.trim() !== "") {
            retVal = retVal.filter((item) => {
                return item.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
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
        <div>
            <Row gutter={[8, 8]} className="form-row">
                <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 4 }}>
                    <Title level={4}>Teams</Title>
                    <ToastContainer autoClose={25000} />
                </Col>
                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 16 }}
                    md={{ span: 18 }}
                ></Col>
                <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 2 }}>
                    <Button
                        type="primary"
                        className="t2"
                        onClick={() => {
                            showModal("add");
                        }}
                        style={{ float: "right", marginBottom: "10px" }}
                    >
                        Create New
                    </Button>
                </Col>
            </Row>
            <Divider></Divider>
            <Row
                gutter={[8, 8]}
                className="form-row"
                style={{ marginTop: "0" }}
            >
                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 8 }}
                    style={{
                        float: "right",
                        marginBottom: "10px",
                        marginTop: "7px",
                    }}
                >
                    <Input
                        placeholder="Search..."
                        className="search-box"
                        bordered={false}
                        onChange={handleSearch}
                        prefix={<SearchOutlined />}
                    />
                </Col>
            </Row>

            <div>
                <div className="client-details">
                    <Table
                        columns={columns}
                        dataSource={getData(current, pageSize)}
                        onChange={onChange}
                        size="small"
                        style={{ width: "100%" }}
                        className="table-striped-rows  teamTable"
                        bordered
                    />
                </div>
            </div>
            <Modal
                title={modalMode === "add" ? "Create New Team" : "Edit Team"}
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
                                        message: "Please enter team name",
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
                                        message: "Please enter department",
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
                                        inputChangeHandler(event, "department");
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
                                    options={userList.map((user: any) => ({
                                        value: user._id,
                                        label: capitalize(
                                            `${user.firstName} ${user.lastName}`
                                        ),
                                    }))}
                                    placeholder="Select Team Leader"
                                    onChange={(value, event) => {
                                        inputChangeHandler(event, "leader");
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
                                    options={userList.map((user: any) => ({
                                        value: user._id,
                                        label: capitalize(
                                            `${user.firstName} ${user.lastName}`
                                        ),
                                    }))}
                                    placeholder="Select Team Member"
                                    onChange={(value, event) => {
                                        inputChangeHandler(event, "member");
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
        </div>
    );
};

export default Team;
