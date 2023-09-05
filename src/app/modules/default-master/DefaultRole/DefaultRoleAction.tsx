import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Row,
    Select,
    Table,
    Typography,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./DefaultRole.scss";
import {
    AddDefaultRole as IAddDefaultRole,
    DefaultRole as IDefaultRole,
    DefaultRoleType as IRoleType,
} from "./interfaces/IDefaultRole";
import { ToastContainer, toast } from "react-toastify";

import api from "../../../utilities/apiServices";

import { useLocation, useNavigate } from "react-router-dom";
import { capitalize } from "../../../utilities/utility";
import LoadingSpinner from "../../LoadingSpinner"; // Update the path accordingly

const { Title } = Typography;
const pageSize = 25;

const DefaultRoleAction = () => {
    const [addRole, setAddRole] = useState<IAddDefaultRole>(
        {} as IAddDefaultRole
    );
    const [roleTypeList, setRoleTypeList] = useState<IRoleType[]>([]);
    const [form] = Form.useForm();
    const location = useLocation();
    const navigate = useNavigate();

    const [roleData, setRoleData] = useState<IDefaultRole>(
        location.state?.roleData || ({} as IDefaultRole)
    );
    const isEditMode = !!location.state?.roleData;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRoleType();
        if (location.state?.roleData) {
            const roleData = location.state.roleData;
            setRoleData(roleData);

            form.setFieldsValue({
                roleName: roleData.roleName,
                roleType: roleData.roleType,
            });
        }
    }, [location.state]);

    const getRoleType = () => {
        setLoading(true); // Set loading state to true
        api.getRoleType()
            .then((resp: any) => {
                setRoleTypeList(resp.data);
            })
            .finally(() => {
                setLoading(false); // Reset loading state
            });
    };

    const cancelNewRoleHandler = () => {
        navigate("/default-role");
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

        setAddRole({
            ...addRole,
            [name]: value,
        });
    };

    const handleRoleAction = () => {
        setLoading(true);
        form.validateFields()
            .then((values) => {
                try {
                    const apiCall = isEditMode
                        ? api.updateDefaultRole(addRole, roleData._id)
                        : api.createDefaultRole(addRole);

                    apiCall
                        .then((resp: any) => {
                            const successMessage = isEditMode
                                ? "Role Updated."
                                : "Role Added.";

                            toast.success(successMessage, {
                                position: toast.POSITION.TOP_RIGHT,
                            });
                            const updateRole = resp.data;

                            navigate("/default-role", {
                                state: {
                                    roleData: updateRole,
                                    updated: !isEditMode,
                                },
                            });
                        })
                        .finally(() => {
                            setLoading(false); // Reset loading state
                        });
                } catch (ex) {
                    setLoading(false); // Reset loading state
                    toast.error("Technical error while creating Role.", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            })
            .catch((errorInfo) => {
                setLoading(false); // Reset loading state
                console.log("Validation failed:", errorInfo);
            });
    };

    return (
        <div>
            <Row gutter={[8, 8]} className="form-row">
                <div>
                    <Title level={5}>
                        {isEditMode ? "Update Role" : "Create New Role"}
                    </Title>
                </div>
                <div className="add-task-cancel">
                    <Button
                        type="primary"
                        danger
                        icon={<CloseOutlined />}
                        onClick={cancelNewRoleHandler}
                    >
                        Cancel
                    </Button>
                </div>
            </Row>
            <Divider></Divider>
            <ToastContainer autoClose={25000} />
            <LoadingSpinner isLoading={loading} />
            <Form form={form} initialValues={addRole}>
                <Row gutter={[8, 8]} className="form-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
                            name="roleName"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter role name.",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Role Name"
                                name="roleName"
                                onChange={(event) => {
                                    inputChangeHandler(event);
                                }}
                                className="w100"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }}>
                        <Form.Item
                            name="roleType"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select role type.",
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                options={roleTypeList.map((roleTypeList) => ({
                                    value: roleTypeList._id,
                                    label: capitalize(roleTypeList.role_type),
                                }))}
                                placeholder="Select Role Type"
                                onChange={(value, event) => {
                                    inputChangeHandler(event, "roleType");
                                }}
                                showSearch={true}
                                className="w100"
                            ></Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Divider></Divider>
                <Row gutter={[8, 8]} className="form-row">
                    <Button
                        htmlType="submit"
                        type="primary"
                        className="w100"
                        onClick={handleRoleAction}
                    >
                        {isEditMode ? "Update Role" : "Add Role"}
                    </Button>
                </Row>
            </Form>
        </div>
    );
};

export default DefaultRoleAction;
