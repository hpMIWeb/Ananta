import React, { useState, useEffect } from "react";
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
import { capitalize } from "../../utilities/utility";

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
        "Clients",
        "4",
        <Icon name="management" width={17.5} height={14} />,
        [
            getItem(
                "Dashboard",
                "401",
                <Icon name="management" width={17.5} height={14} />
            ),
            getItem(
                "Settings",
                "402",
                <Icon name="management" width={17.5} height={14} />
            ),
        ]
    ),
    getItem(
        "Employees",
        "5",
        <Icon name="management" width={17.5} height={14} />,
        [
            getItem(
                "Dashboard",
                "501",
                <Icon name="management" width={17.5} height={14} />
            ),
            getItem(
                "Settings",
                "502",
                <Icon name="management" width={17.5} height={14} />
            ),
        ]
    ),
    getItem(
        "Associate Partners",
        "29",
        <Icon name="management" width={17.5} height={14} />,
        [
            getItem(
                "Dashboard",
                "601",
                <Icon name="management" width={17.5} height={14} />
            ),
            getItem(
                "Settings",
                "602",
                <Icon name="management" width={17.5} height={14} />
            ),
        ]
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
                "701",
                <Icon name="management" width={17.5} height={14} />
            ),
            getItem(
                "Designation",
                "702",
                <Icon name="management" width={17.5} height={14} />
            ),
            getItem(
                "Role",
                "703",
                <Icon name="management" width={17.5} height={14} />
            ),
            getItem(
                "Checklist",
                "704",
                <Icon name="management" width={17.5} height={14} />
            ),
            getItem(
                "Industry Type",
                "705",
                <Icon name="management" width={17.5} height={14} />
            ),
            getItem(
                "Line Of Business",
                "706",
                <Icon name="management" width={17.5} height={14} />
            ),
        ]
    ),
    getItem(
        "Billing",
        "25",
        <Icon name="management" width={17.5} height={14} />,
        [
            getItem(
                "Subscriptions",
                "2",
                <Icon name="submission" width={17.5} height={14} />
            ),
            getItem(
                "AddOns",
                "34",
                <Icon name="submission" width={17.5} height={14} />
            ),
            getItem(
                "PromoCodes",
                "3",
                <Icon name="promo" width={17.5} height={14} />
            ),
            getItem(
                "Invoicing",
                "32",
                <Icon name="management" width={17.5} height={14} />
            ),
            getItem(
                "Settings",
                "33",
                <Icon name="management" width={17.5} height={14} />
            ),
        ]
    ),
    getItem(
        "Task Master",
        "101",
        <Icon name="management" width={17.5} height={14} />,
        [
            getItem(
                "Task",
                "35",
                <Icon name="submission" width={17.5} height={14} />
            ),
            getItem(
                "Compliance",
                "36",
                <Icon name="submission" width={17.5} height={14} />
            ),
            getItem(
                "Timesheet",
                "37",
                <Icon name="promo" width={17.5} height={14} />
            ),
            getItem(
                "Approval",
                "38",
                <Icon name="management" width={17.5} height={14} />
            ),
            getItem(
                "Settings",
                "39",
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
    // const initialBreadCrumbs = {
    //     href: "/",
    //     title: <Icon width={16} height={16} name="home" />,
    // };
    // const initialBreadCrumbs = (
    //     <>
    //         <Breadcrumb.Item>
    //             <a
    //                 onClick={() => {
    //                     navigate("/");
    //                 }}
    //             >
    //                 <Icon width={16} height={16} name="home" />
    //             </a>
    //         </Breadcrumb.Item>
    //     </>
    // );

    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const location = useLocation();
    const [breadcrumbs, setBreadcrumbs] = useState<any>([]);

    const sanitisePathName = (pathName: string) => {
        const billingsNavs = ["subscription", "promocodes", "addons"];
        const clientNavs = ["caclient"];
        const employeeNavs = ["employee"];
        const associatePartnerNavs = ["associatePartners"];
        const mastersNavs = [
            "department",
            "designation",
            "role",
            "team",
            "checklist",
        ];
        const defaultNavs = [
            "default-department",
            "default-designation",
            "default-role",
            "default-team",
            "default-checklist",
            "default-industry-type",
            "default-line-of-business",
        ];
        const taskMasterNavs = [
            "task",
            "compliance",
            "timesheet",
            "emp-time-sheet",
            "client-time-sheet",
            "approval",
            "setting",
            "default-line-of-business",
        ];

        const billingItems = billingsNavs.filter((item: string) => {
            return pathName.includes(item);
        });

        const clientItems = clientNavs.filter((item: string) => {
            return pathName.includes(item);
        });

        const employeeItems = employeeNavs.filter((item: string) => {
            return pathName.includes(item);
        });

        const associatePartnerItems = associatePartnerNavs.filter(
            (item: string) => {
                return pathName.includes(item);
            }
        );

        const masterItems = mastersNavs.filter((item: string) => {
            return pathName.includes(item);
        });

        const defaultItems = defaultNavs.filter((item: string) => {
            return pathName.includes(item);
        });
        const taskMasterItem = taskMasterNavs.filter((item: string) => {
            return pathName.includes(item);
        });

        // Append `prefix` in breadcrumbs
        if (billingItems.length > 0) {
            return ["Billing", ...pathName.split("/")];
        } else if (clientItems.length > 0) {
            return ["Clients", ...pathName.split("/")];
        } else if (employeeItems.length > 0) {
            return ["Employees", ...pathName.split("/")];
        } else if (associatePartnerItems.length > 0) {
            return ["Associated Partners", ...pathName.split("/")];
        } else if (defaultItems.length > 0) {
            return ["Default", ...pathName.split("/")];
        } else if (masterItems.length > 0) {
            return ["Master", ...pathName.split("/")];
        } else if (taskMasterItem.length > 0) {
            return ["Task Manager", ...pathName.split("/")];
        }
        return [];
    };

    useEffect(() => {
        if (location && location.pathname) {
            const paths = sanitisePathName(location.pathname);
            const pathData = paths
                .filter((item: string) => {
                    return item !== "";
                })
                .map((pathItem: string, index: number) => {
                    return getBreadCrumbs("/" + pathItem, pathItem, index);
                });
            setBreadcrumbs(pathData);
        }
    }, [location]);

    if (HIDE_LAYOUT_ROUTES.includes(location.pathname)) {
        //To hide navbar, header and footer
        return <Outlet />;
    }

    // Rename `breadcrumbs` name
    const breadcrumbEnums = {
        "add-subscription": "Create New",
        "edit-subscription": "Edit",
        "add-employee": "Create New",
        "view-employee": "View Employee",
        "view-associatePartners": "View Associate Partners",
        "view-caclient": "View client",
        caclient: "Dashboard",
        employee: "Dashboard",
        create: "Create New",
        promocodes: "Promo Code",
        associatePartners: "Dashboard",
        department: "Department",
        designation: "Designation",
        role: "Role",
        team: "Team",
        checklist: "Checklist",
        "default-department": "Default Department",
        "default-designation": "Default Designation",
        "default-role": "Default Role",
        "default-team": "Default Team",
        "default-checklist": "Default Checklist",
        "default-industry-type": "Default Industry Type",
        "default-line-of-business": "Default line of Business",
        task: "Task List",
        "add-task": "Add Task",
        "add-multi-task": "Add Multi Task",
        compliance: "Compliance List",
        "add-compliance": "Add Compliance",
        "emp-time-sheet": "Employee TimeSheet",
        "client-time-sheet": "Client TimeSheet",
    };

    const getBreadCrumbs = (strHref: string, title: string, index: number) => {
        let str = title as keyof typeof breadcrumbEnums;
        let titleStr = breadcrumbEnums[str];
        return (
            <>
                <Breadcrumb.Item
                    onClick={() => {
                        if (index === 0) {
                            return null;
                        } else {
                            navigate(strHref);
                        }
                    }}
                >
                    {titleStr ? breadcrumbEnums[str] : capitalize(str)}
                </Breadcrumb.Item>
            </>
        );
    };

    const onMenuClick: MenuClickEventHandler = (event) => {
        switch (event.key) {
            case "1":
                navigate("/");
                return;
            case "2": {
                navigate("/subscription");
                return;
            }
            case "34":
                navigate("/addons");
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
            case "401":
                navigate("/caclient");
                return;
            case "26":
                navigate("/caclient");
                return;
            case "501":
                navigate("/employee");
                return;
            case "502":
                navigate("/employee");
                return;
            case "29":
                navigate("/associatePartners");
                return;
            case "601":
                navigate("/associatePartners");
                return;
            case "31":
                navigate("/associatePartners");
                return;
            case "101":
                navigate("/task");
                return;
            case "36":
                navigate("/compliance");
                return;
            case "37":
                navigate("/timesheet");
                return;
            case "38":
                navigate("/approval");
                return;
            case "39":
                navigate("/setting");
                return;
        }
    };

    return (
        <Layout
            style={{
                minHeight: "100vh",
                background: "#EDF2F9",
            }}
        >
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
                width={225}
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
                    ></HeaderBox>
                </Header>
                <div className={classNames(styles.navigationWrapper)}>
                    <div style={{ float: "left", marginRight: "10px" }}>
                        <Icon
                            width={16}
                            height={16}
                            name="home"
                            onClick={() => {
                                navigate("/");
                            }}
                        />
                    </div>
                    <div style={{ float: "left" }}>
                        <Breadcrumb separator=">">{breadcrumbs}</Breadcrumb>
                    </div>
                </div>
                <Content
                    style={{
                        margin: 0,
                    }}
                >
                    <div className={styles.outletWrapper}>
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
