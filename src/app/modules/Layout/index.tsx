import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FileOutlined, TeamOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { HIDE_LAYOUT_ROUTES } from "../../../utils/constant";
import styles from "./layout.module.scss";
import "./layout.scss";
import classNames from "classnames";
import Icon from "../../components/ui/Icon/Index";
import HeaderBox from "../Header/index";
import MenuItem from "antd/es/menu/MenuItem";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import Cookies from "js-cookie";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem("Home", "1", <Icon name="home" width={16} />),
    getItem(
        "Subscription",
        "2",
        <Icon name="submission" width={17.5} height={14} />
    ),
    getItem("PromoCode", "3", <Icon name="promo" width={15.75} height={14} />),
    getItem(
        "Clients",
        "4",
        <Icon name="management" width={17.5} height={14} />
    ),
    getItem(
        "Employees",
        "5",
        <Icon name="management" width={17.5} height={14} />
    ),
    getItem("Task Master", "6", <Icon name="features" width={16} />, [
        getItem("Task", "7", <Icon name="modules" width={16} />),
        getItem("Compliance", "8", <Icon name="modules" width={16} />),
        getItem("Timesheet", "9", <Icon name="time" width={16} />),
        getItem("Approval", "10", <Icon name="modules" width={16} />),
        getItem("Settings", "11", <Icon name="profile" width={16} />),
    ]),
    getItem("Files", "20", <FileOutlined />),
    getItem("Logout", "21", <Icon name="logout" width={16} />),
    getItem("Roles", "22", <Icon name="modules" width={16} />),
];

const LayoutComponent = ({
    switchTheme,
    theme: themeProp,
}: {
    switchTheme: () => void;
    theme: string;
}) => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(true);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const location = useLocation();

    if (HIDE_LAYOUT_ROUTES.includes(location.pathname)) {
        //To hide navbar, header and footer
        return <Outlet />;
    }

    const onMenuClick: MenuClickEventHandler = (event) => {
        switch (event.key) {
            case "1":
                navigate("/");
                return;
            case "2":
                navigate("/subscription");
                return;
            case "3":
                navigate("/promocodes");
                return;
            case "4":
                navigate("/caclient");
                return;
            case "5":
                navigate("/employee");
                return;
            case "6":
            case "7":
                navigate("/task");
                return;
            case "8":
                navigate("/compliance");
                return;
            case "9":
                navigate("/timesheet");
                return;
            case "10":
                navigate("/approval");
                return;
            case "11":
                navigate("/setting");
                return;
            case "21": {
                localStorage.removeItem("authtoken");
                Cookies.remove("jwt_token");
                //navigate("/login");
                return;
            }
            case "22": {
                navigate("/Role");
                return;
            }
        }
    };

    return (
        <Layout style={{ minHeight: "100vh", background: "#EDF2F9" }}>
            <Sider
                collapsible
                className={classNames(
                    styles.navbarSlider,
                    "main-nav-bar-slider"
                )}
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                trigger={null}
                collapsedWidth={65}
                width={218}
            >
                <Menu
                    theme="dark"
                    defaultSelectedKeys={["6"]}
                    mode="inline"
                    items={items}
                    inlineCollapsed={collapsed}
                    onClick={onMenuClick}
                    className={styles.navbarMenuList}
                />
            </Sider>
            <Layout className={styles.layoutWrapper}>
                <Header
                    className={styles.headerWrapper}
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        height: 70,
                    }}
                >
                    <HeaderBox
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        switchTheme={switchTheme}
                        theme={themeProp}
                    />
                </Header>

                <Content style={{ margin: 0 }}>
                    <div
                        // style={{
                        //   minHeight: 360,
                        // }}
                        className={styles.outletWrapper}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer className={classNames("p-0", styles.footerWrapper)}>
                    Thank you for creating with NV Associate |{" "}
                    {new Date().getFullYear()} ©{" "}
                </Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutComponent;
