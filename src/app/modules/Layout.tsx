import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
    FileOutlined,
    TeamOutlined,
    DatabaseOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import MenuItem from "antd/es/menu/MenuItem";

const { Header, Content, Footer, Sider } = Layout;

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
    getItem("Task Master", "Task Master", <TeamOutlined />, [
        getItem("Task", "/task"),
        getItem("Compliance", "/compliance"),
        getItem("Timesheet", "/timesheet"),
        getItem("Approval", "/approval"),
        getItem("Settings", "/setting"),
    ]),
    getItem("Master", "Master", <DatabaseOutlined />, [
        getItem("Department", "/department"),
        getItem("Designation", "/designation"),
        getItem("Role", "/role"),
        getItem("Team", "/team"),
        getItem("Checklist", "/checklist"),
    ]),
    getItem("Default", "Default", <DatabaseOutlined />, [
        getItem("Department", "/default-department"),
        getItem("Designation", "/default-designation"),
        getItem("Role", "/default-role"),
        getItem("Checklist", "/default-checklist"),
        getItem("Industry Type", "/default-industry-type"),
        getItem("Line Of Business", "/default-line-of-business"),
    ]),
    getItem("Files", "12", <FileOutlined />),
    getItem("Logout", "/login"),
];

const LayoutComponent = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState(["sub1"]);
    const [breadcrumbTrail, setBreadcrumbTrail] = useState(["Home"]);
    const rootSubmenuKeys = ["Task Master", "Master", "Default"];
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const navigate = useNavigate();

    const handleClick = (e: any) => {
        navigate(e.key);
        console.log(e.keyPath);
        const rearrangedTrail = [
            breadcrumbTrail[0],
            ...e.keyPath.slice().reverse(),
        ];
        setBreadcrumbTrail(rearrangedTrail);

        if (e.key === "/login") {
            localStorage.removeItem("authtoken");
        }
    };

    const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
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
                    mode="inline"
                    theme="dark"
                    openKeys={openKeys}
                    onOpenChange={onOpenChange}
                    items={items}
                    onClick={handleClick}
                ></Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />

                <Content style={{ margin: "0 16px" }}>
                    <Breadcrumb style={{ margin: "16px 0" }}>
                        {breadcrumbTrail.map((breadcrumb, index) => (
                            <Breadcrumb.Item key={index}>
                                {breadcrumb}
                            </Breadcrumb.Item>
                        ))}
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
