import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FileOutlined, TeamOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import { removeLocalstorage } from "../utilities/utility";

const { Header, Content, Footer, Sider } = Layout;

const LayoutComponent = () => {
    const [collapsed, setCollapsed] = useState(true);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const navigate = useNavigate();

    const handleClick = (e: any) => {
        navigate(e.key);
        if (e.key === "/login") {
            localStorage.removeItem("authtoken");
        }
    };

    type MenuItem = Required<MenuProps>["items"][number];

    function getItem(
        label: React.ReactNode,
        key: React.Key,
        icon?: React.ReactNode,
        children?: MenuItem[]
    ): MenuItem {
        return {
            key,
            icon,
            children,
            label,
        } as MenuItem;
    }

    const items: MenuItem[] = [
        getItem("Task Master", "/", <TeamOutlined />, [
            getItem("Task", "/task"),
            getItem("Compliance", "/compliance"),
            getItem("Timesheet", "/timesheet"),
            getItem("Approval", "/approval"),
            getItem("Settings", "/setting"),
        ]),
        getItem("Files", "12", <FileOutlined />),
        getItem("Logout", "/"),
    ];

    const logout = () => {
        removeLocalstorage("authtoken");
        navigate("/login", { replace: true });
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={["6"]}
                    mode="inline"
                    items={items}
                    onClick={handleClick}
                ></Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />

                <Content style={{ margin: "0 16px" }}>
                    <Breadcrumb style={{ margin: "16px 0" }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            height: "100%",
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: "center" }}>Footer</Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutComponent;
