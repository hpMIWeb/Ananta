import falconIcon from "../../../assets/images/falcon.png";
import styles from "./header.module.scss";
import classNames from "classnames";
import Icon from "../../components/ui/Icon/Index";
import { Link, Navigate } from "react-router-dom";
import Input from "../../components/ui/Input/Index";
import Button from "../../components/ui/Button/Index";
import { Avatar } from "antd";
import Dropdown from "../../components/ui/DropDown/Index";
import Tooltip from "../../components/ui/Tooltip/Index";

const HeaderBox = ({ collapsed, setCollapsed, switchTheme, theme }: any) => {
    const items = [
        {
            key: "1",
            label: <Link to="/logout">Logout</Link>,
        },
    ];
    return (
        <div className={styles.headerBoxWrapper}>
            <div className={styles.headerBoxContainer}>
                <div className={styles.headerLogoInput}>
                    <div className={styles.demoLogoVertical}>
                        <div className="d-flex align-items-center">
                            <div className={styles.toggleIconWrapper}>
                                <Tooltip
                                    placement="right"
                                    title="Toggle Navigation"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCollapsed((prev: any) => !prev)
                                        }
                                        className={classNames(
                                            styles.navbarToggleMinus,
                                            {
                                                [styles.navbarToggleMinusCollapsed]:
                                                    collapsed,
                                            }
                                        )}
                                        data-toggle="collapse"
                                        data-target="#navbar-collapse-minus"
                                    >
                                        <span className={styles.iconBar}></span>
                                        <span className={styles.iconBar}></span>
                                        <span className={styles.iconBar}></span>
                                    </button>
                                </Tooltip>
                            </div>
                            <Link className="navbar-brand" to="/">
                                <div
                                    className={classNames(
                                        "d-flex align-items-center",
                                        styles.headerLogoText
                                    )}
                                >
                                    <img
                                        className="me-2"
                                        src={falconIcon}
                                        alt=""
                                        width="40"
                                    />
                                    <span className={styles.navbarLogoTitle}>
                                        NV
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={styles.headerBoxRightWrapper}>
                    <Input
                        className={classNames(
                            styles.headerSearchInput,
                            "headerSearchInput"
                        )}
                        placeholder="Search..."
                        allowClear
                        prefix={
                            <Icon width={13.33} height={13.33} name="search" />
                        }
                    />
                    <div className="navbar-nav navbar-nav-icons ms-auto flex-row align-items-center">
                        <div
                            className={classNames(
                                "theme-control-toggle fa-icon-wait px-2",
                                styles.logoutBtn
                            )}
                        >
                            <Link to="/logout">
                                <Icon name="logout" />
                            </Link>
                        </div>
                        <div className="theme-control-toggle fa-icon-wait px-2">
                            <Tooltip
                                placement="right"
                                title={
                                    theme === "light"
                                        ? "Switch to dark theme"
                                        : "Switch to light theme"
                                }
                            >
                                <Button
                                    onClick={() => switchTheme(theme)}
                                    className="lightThemeBtn"
                                >
                                    <Icon
                                        name={
                                            theme === "light"
                                                ? "lightTheme"
                                                : "darkTheme"
                                        }
                                        height={16}
                                        width={16}
                                    />
                                </Button>
                            </Tooltip>
                        </div>
                        <div
                            className={classNames(
                                "theme-control-toggle fa-icon-wait",
                                styles.headerAvatarIcon
                            )}
                        >
                            <Dropdown
                                menu={{ items }}
                                placement="bottomRight"
                                trigger={["click"]}
                                arrow={{ pointAtCenter: true }}
                                overlayClassName="profileMenuDropDown"
                            >
                                <Button className={styles.headerAvatarBtn}>
                                    <Avatar
                                        size={34}
                                        src="https://anantainovations.com/assets/img/team/3-thumb.png"
                                    />
                                </Button>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderBox;
