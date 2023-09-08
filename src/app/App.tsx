import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import store from "../states/store";
import Layout from "./modules/Layout/index";
import Home from "./modules/Home";
import NoMatch from "./modules/NoMatch";
import TaskList from "./modules/task/TaskList";
import AddTask from "./modules/task/AddTask";
import AddMultipleTask from "./modules/task/AddMultipleTask";
import TimeSheet from "./modules/timesheet/TimeSheet";
import ComplianceList from "./modules/compliance/ComplianceList";
// import "./App.scss";
import "../styles/index.scss";
import "./App.scoped.css";
import "antd/dist/reset.css";
import AddCompliance from "./modules/compliance/AddCompliance";
import EmpTimeSheet from "./modules/timesheet/EmpTimeSheet";
import ClientTimeSheet from "./modules/timesheet/ClientTimeSheet";
import Approval from "./modules/aproval/Aproval";
import Setting from "./modules/Setting/Setting";
import Login from "./modules/login/Login";
import Role from "./modules/fileManager/Role";
import useLocalStorage from "use-local-storage";
import Team from "./modules/fileManager/Team";
import Checklist from "./modules/fileManager/Checklist";
import { getAuthToken } from "../utils/helpers";
import { useDispatch, Provider } from "react-redux";
import { getUserInfoReducersApi } from "../redux/getUserInfoReducers";
import PrivateRoute from "./components/PrivateRoute/Index";
import Clients from "./modules/Clients/Index";
import AddClient from "./modules/Clients/AddClient/Index";
import Logout from "./modules/Logout/index";
import Subscription from "./modules/Subscription/Index";
import AddSubscription from "./modules/Subscription/AddSubscription/Index";
import NewAddOns from "./modules/Subscription/NewAddOns/Index";
import PromoCodes from "./modules/PromoCodes/Index";
import AddPromoCode from "./modules/PromoCodes/AddPromoCode/Index";

const keyMap = {
    SNAP_LEFT: "command+left",
    DELETE_NODE: ["del", "backspace"],
    openAddTask: "F8",
};

const App = () => {
    const dispatch = useDispatch();
    const defaultDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    const [theme, setTheme] = useLocalStorage(
        "theme",
        defaultDark ? "dark" : "light"
    );

    const switchTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };

    const handlers = {
        openAddTask: () => {
            console.log("Add Task will open");
            // navigate("/addTask");
        },
    };

    useEffect(() => {
        if (getAuthToken) {
            // @ts-ignore
            dispatch(getUserInfoReducersApi());
        }
    }, [getAuthToken]);

    return (
        <div
            className="AppWrapper"
            style={{ paddingRight: 16 }}
            data-theme={theme}
        >
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Layout switchTheme={switchTheme} theme={theme} />
                        }
                    >
                        <Route path="login" element={<Login />} />
                        <Route
                            index
                            element={<PrivateRoute component={Home} />}
                        />
                        <Route
                            index
                            path="task"
                            element={<PrivateRoute component={TaskList} />}
                        />
                        <Route
                            path="add-task"
                            element={<PrivateRoute component={AddTask} />}
                        />
                        <Route
                            path="add-multi-task"
                            element={
                                <PrivateRoute component={AddMultipleTask} />
                            }
                        />
                        <Route
                            path="compliance"
                            element={
                                <PrivateRoute component={ComplianceList} />
                            }
                        />
                        <Route
                            path="add-compliance"
                            element={<PrivateRoute component={AddCompliance} />}
                        />
                        <Route
                            path="approval"
                            element={<PrivateRoute component={Approval} />}
                        />
                        <Route
                            path="timesheet"
                            element={<PrivateRoute component={TimeSheet} />}
                        />
                        <Route
                            path="emp-time-sheet"
                            element={<PrivateRoute component={EmpTimeSheet} />}
                        />
                        <Route
                            path="client-time-sheet"
                            element={
                                <PrivateRoute component={ClientTimeSheet} />
                            }
                        />
                        <Route
                            path="Setting"
                            element={<PrivateRoute component={Setting} />}
                        />
                        <Route
                            path="Role"
                            element={<PrivateRoute component={Role} />}
                        />
                        <Route
                            path="Team"
                            element={<PrivateRoute component={Team} />}
                        />
                        <Route
                            path="Checklist"
                            element={<PrivateRoute component={Checklist} />}
                        />
                        <Route
                            path="subscription"
                            element={<PrivateRoute component={Subscription} />}
                        />
                        <Route
                            path="subscription/add-subscription"
                            element={
                                <PrivateRoute component={AddSubscription} />
                            }
                        />
                        <Route
                            path="subscription/add-subscription"
                            element={
                                <PrivateRoute component={AddSubscription} />
                            }
                        />
                        <Route
                            path="subscription/edit-subscription/:subscriptionId"
                            element={
                                <PrivateRoute component={AddSubscription} />
                            }
                        />
                        <Route
                            path="addons/create"
                            element={<PrivateRoute component={NewAddOns} />}
                        />
                        <Route
                            path="addons/edit/:addonsId"
                            element={<PrivateRoute component={NewAddOns} />}
                        />
                        <Route
                            path="promocodes"
                            element={<PrivateRoute component={PromoCodes} />}
                        />
                        <Route
                            path="promocodes/create"
                            element={<PrivateRoute component={AddPromoCode} />}
                        />
                        <Route
                            path="promocodes/edit/:promocodeId"
                            element={<PrivateRoute component={AddPromoCode} />}
                        />
                        {/* 
                           
                            */}
                        {/*  */}
                        <Route
                            path="caclient"
                            element={<PrivateRoute component={Clients} />}
                        />
                        <Route
                            path="caclient/create"
                            element={<PrivateRoute component={AddClient} />}
                        />
                        <Route
                            path="caclient/edit/:clientId"
                            element={<PrivateRoute component={AddClient} />}
                        />
                        {/* <Route
                                path="caclient/createbulk"
                                element={
                                    <PrivateRoute component={BulkAddClient} />
                                }
                            /> */}
                        {/* <Route
                                path="employee"
                                element={<PrivateRoute component={Employees} />}
                            />
                            <Route
                                path="employee/add-employee"
                                element={
                                    <PrivateRoute component={AddEmployee} />
                                }
                            /> */}
                        {/* <Route
                                path="employee/edit-employee/:employeeId"
                                element={
                                    <PrivateRoute component={AddEmployee} />
                                }
                            /> */}
                        <Route
                            path="logout"
                            element={<PrivateRoute component={Logout} />}
                        />
                        <Route path="*" element={<NoMatch />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
