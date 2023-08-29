import React, { useState } from "react";
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Table,
} from "antd";
import {
    UserOutlined,
    DeleteOutlined,
    EditOutlined,
    BoxPlotOutlined,
} from "@ant-design/icons";
import "./Role.scss";
import Search from "antd/es/transfer/search";
import Title from "antd/es/typography/Title";

const Role = () => {
    const columns = [
        {
            title: "Sr. No",
            dataIndex: "srno",
            width: "6%",
        },
        {
            title: "Role Name",
            dataIndex: "rolename",
            width: "32%",
        },
        {
            title: "Role Type",
            dataIndex: "roletype",
            width: "32%",
        },
        {
            title: "No of users",
            dataIndex: "noofusers",
            width: "10%",
        },
        {
            title: "Modules",
            dataIndex: "modules",
            width: "10%",
        },
        {
            title: "Action",
            dataIndex: "action",
            width: "10%",
        },
    ];
    const columns1 = [
        {
            title: "Permissions",
            dataIndex: "permission",
            width: "50%",
        },
        {
            title: "Full Access",
            dataIndex: "fullaccess",
            width: "10%",
        },
        {
            title: "View",
            dataIndex: "view",
            width: "10%",
        },
        {
            title: "Create",
            dataIndex: "create",
            width: "10%",
        },
        {
            title: "Edit / Modify",
            dataIndex: "e/f",
            width: "10%",
        },
        {
            title: "Delete",
            dataIndex: "delete",
            width: "10%",
        },
    ];
    const data = [
        {
            srno: <div className="r4">1.</div>,
            rolename: <div className="r4">Admin</div>,
            roletype: <div className="r4">Admin</div>,
            noofusers: (
                <div className="r4">
                    <UserOutlined />
                    &nbsp;&nbsp;08
                </div>
            ),
            modules: (
                <div className="r4">
                    <img src={require("./Image/dd.jpg")} className="r5" />
                    &nbsp;&nbsp;4/8
                </div>
            ),
            action: (
                <div className="r4">
                    <EditOutlined />
                    &nbsp;&nbsp;
                    <DeleteOutlined />
                </div>
            ),
        },
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        //form.resetFields();
        setIsModalOpen(false);
    };
    const handleOk = () => {
        //form.resetFields();
        setIsModalOpen(false);
    };

    return (
        <div>
            <Row gutter={[8, 8]} className="form-row">
                <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 4 }}>
                    <Title level={4}>Roles</Title>
                </Col>
                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 16 }}
                    md={{ span: 18 }}
                ></Col>
                <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 2 }}>
                    <Button
                        type="primary"
                        className="r2"
                        onClick={showModal}
                        style={{ float: "right", marginBottom: "10px" }}
                    >
                        Create New
                    </Button>
                </Col>
            </Row>
            <hr className="r10" />
            <div className="r3">
                <Search placeholder="Search ..." />
            </div>
            <br />
            <div>
                <Table className="r4" columns={columns} dataSource={data} />
            </div>
            <Modal
                title="Create New Role"
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleOk}
                width={1000}
            >
                <hr />
                <Form>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 16 }}
                            md={{ span: 24 }}
                        >
                            <div className="r1">
                                <p className="r6">Role Name</p>
                                <p className="r7">Role Type</p>
                            </div>
                            <div className="r1">
                                <Input
                                    placeholder="Department Name"
                                    className="r8"
                                />
                                <Select
                                    placeholder="Department Name"
                                    className="r9"
                                />
                            </div>
                            <br />
                            <Table
                                className="r4"
                                columns={columns1}
                                dataSource={data}
                            />
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} className="">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 24 }}
                            md={{ span: 24 }}
                        ></Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default Role;
