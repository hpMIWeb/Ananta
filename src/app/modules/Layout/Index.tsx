import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { HIDE_LAYOUT_ROUTES } from "../../../utils/constant";
import styles from "./layout.module.scss";
import "./layout.scss";
import classNames from "classnames";
import Icon from "../../../components/Icon/Index";
import HeaderBox from "../Header/Index";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { DatabaseOutlined } from "@ant-design/icons";

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
        <Icon name="management" width={17.5} height={14} />,
        [
            getItem(
                "Dashboard",
                "25",
                <Icon name="management" width={17.5} height={14} />
            ),getItem(
                "Settings",
                "25",
                <Icon name="management" width={17.5} height={14} />
            ),
        ]
    ),
    getItem(
        "Employees",
        "5",
        <Icon name="management" width={17.5} height={14} />
    ),
    getItem("Master", "12", <Icon name="management" width={16} height={14} />, [
        getItem(
            "Department",
            "13",
            <Icon name="management" width={17.5} height={14} />
        ),
        getItem(
            "Designation",
            "14",
            <Icon name="management" width={17.5} height={14} />
        ),
        getItem(
            "Role",
            "15",
            <Icon name="management" width={17.5} height={14} />
        ),
        getItem(
            "Team",
            "16",
            <Icon name="management" width={17.5} height={14} />
        ),
        getItem(
            "Checklist",
            "17",
            <Icon name="management" width={17.5} height={14} />
        ),
    ]),
    getItem(
        "Default",
        "18",
        <Icon name="management" width={16} height={14} />,
        [
            getItem(
                "Department",
                "19",
                <Icon name="management" width={17.5} height={14} />
            ),
            getItem(
                "Designation",
                "20",
                <Icon name="management" width={17.5} height={14} />
            ),
            getItem(
                "Role",
                "21",
                <Icon name="management" width={17.5} height={14} />
            ),
            getItem(
                "Checklist",
                "22",
                <Icon name="management" width={17.5} height={14} />
            ),
            getItem(
                "Industry Type",
                "23",
                <Icon name="management" width={17.5} height={14} />
            ),
            getItem(
                "Line Of Business",
                "24",
                <Icon name="management" width={17.5} height={14} />
            ),
        ]
    ),
];

const LayoutComponent = ({
    switchTheme,
    theme: themeProp,
}: {
    switchTheme: () => void;
    theme: string;
}) => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const location = useLocation();

    if (HIDE_LAYOUT_ROUTES.includes(location.pathname)) {
        //To hide navbar, header and footer
        return <Outlet />;
    }

    // const onMenuClick: MenuClickEventHandler = (event) => {
    //   switch (event.key) {
    //     case "1":
    //       navigate("/");
    //       return;
    //     case "2":
    //       navigate("/subscription");
    //       return;
    //     case "3":
    //       navigate("/promocodes");
    //       return;
    //     case "4":
    //       navigate("/caclient");
    //       return;
    //     case "5":
    //       navigate("/employee");
    //       return;
    //   }
    //   // Your code here
    // };

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
            case "13":
                navigate("/department");
                return;
            case "14":
                navigate("/designation");
                return;
            case "15":
                navigate("/role");
                return;
            case "16":
                navigate("/team");
                return;
            case "17":
                navigate("/checklist");
                return;
            case "18":
                navigate("/default-department");
                return;
            case "19":
                navigate("/default-department");
                return;
            case "20":
                navigate("/default-designation");
                return;
            case "21":
                navigate("/default-role");
                return;
            case "22":
                navigate("/default-checklist");
                return;
            case "23":
                navigate("/default-industry-type");
                return;
            case "24":
                navigate("/default-line-of-business");
                return;

            case "25":
                navigate("/caclient");
                return;
            case "26":
                navigate("/caclient");
                return;
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
                    defaultSelectedKeys={["1"]}
                    mode="inline"
                    items={items}
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
