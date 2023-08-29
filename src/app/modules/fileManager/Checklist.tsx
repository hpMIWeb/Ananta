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
import "./Checklist.scss";
import Search from "antd/es/transfer/search";
import Title from "antd/es/typography/Title";

const Checklist = () => {
    const columns = [
        {
            title: "Sr. No",
            dataIndex: "srno",
            width: "10%",
        },
        {
            title: "Checklist Name",
            dataIndex: "checklistname",
            width: "50%",
        },
        {
            title: "Department",
            dataIndex: "department",
            width: "30%",
        },
        {
            title: "Action",
            dataIndex: "action",
            width: "10%",
        },
    ];
    const [isModalOpen1, setIsModalOpen1] = useState(false);

    const showModal1 = () => {
        setIsModalOpen1(true);
    };
    const handleCancel1 = () => {
        //form.resetFields();
        setIsModalOpen1(false);
    };
    const handleOk1 = () => {
        //form.resetFields();
        setIsModalOpen1(false);
    };
    const [isModalOpen2, setIsModalOpen2] = useState(false);

    const showModal2 = () => {
        setIsModalOpen2(true);
    };
    const handleCancel2 = () => {
        //form.resetFields();
        setIsModalOpen2(false);
    };
    const handleOk2 = () => {
        //form.resetFields();
        setIsModalOpen2(false);
    };
    const data = [
        {
            srno: <div className="c4">1.</div>,
            checklistname: <div className="c4">Sales</div>,
            department: <div className="c4">Accounting</div>,
            action: (
                <div className="c4">
                    <EditOutlined onClick={showModal1} />
                    &nbsp;
                    <DeleteOutlined onClick={showModal2} />
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
                    <Title level={4}>Checklist</Title>
                </Col>
                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 16 }}
                    md={{ span: 18 }}
                ></Col>
                <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 2 }}>
                    <Button
                        type="primary"
                        className="c2"
                        onClick={showModal}
                        style={{ float: "right", marginBottom: "10px" }}
                    >
                        Create New
                    </Button>
                </Col>
            </Row>
            <hr />
            <div className="c3">
                <Search placeholder="Search ..." />
            </div>
            <br />
            <div>
                <Table className="c4" columns={columns} dataSource={data} />
            </div>
            <Modal
                title="Sales Entry Checklist"
                open={isModalOpen1}
                width={650}
                onCancel={handleCancel1}
                onOk={handleOk1}
            >
                <hr />
            </Modal>
            <Modal
                title="Sales Entry Checklist"
                open={isModalOpen2}
                onCancel={handleCancel2}
                onOk={handleOk2}
                width={650}
                okText="Save"
                cancelText="Delete"
                cancelButtonProps={{ style: { color: "red" } }}
            >
                <hr />
            </Modal>
            <Modal
                title="Create New Checklist"
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleOk}
                width={650}
                okText="Add"
            >
                <hr />
                <Form>
                    <Row gutter={[8, 8]} className="form-row">
                        <Col
                            xs={{ span: 24 }}
                            sm={{ span: 16 }}
                            md={{ span: 24 }}
                        >
                            <div className="c1">
                                <Input
                                    placeholder="Checklist Title"
                                    className="c7"
                                />
                                <Select
                                    placeholder="Select Department"
                                    className="c8"
                                />
                            </div>
                            <hr />
                            <div className="c1">
                                <p className="c6">1.</p>
                                <Input className="c7" />
                            </div>
                            <br />
                            <div className="c1">
                                <p className="c6">2.</p>
                                <Input className="c7" />
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default Checklist;
