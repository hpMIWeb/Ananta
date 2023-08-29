import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HotKeys } from "react-hotkeys";
import store from "../states/store";
import Layout from "./modules/Layout/index";
import Home from "./modules/Home";
import Dashboard from "./modules/Dashboard";
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
import { useDispatch } from "react-redux";
import { getUserInfoReducersApi } from "../redux/getUserInfoReducers";

const keyMap = {
    SNAP_LEFT: "command+left",
    DELETE_NODE: ["del", "backspace"],
    openAddTask: "F8",
};

const App = () => {
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
            <HotKeys keyMap={keyMap} handlers={handlers}>
                <BrowserRouter>
                    <Routes>
                        <Route path="login" element={<Login />} />
                        <Route
                            path="/"
                            element={
                                <Layout
                                    switchTheme={switchTheme}
                                    theme={theme}
                                />
                            }
                        >
                            <Route element={<Home />} />
                            <Route path="about" element={<Dashboard />} />
                            <Route index path="task" element={<TaskList />} />
                            <Route path="add-task" element={<AddTask />} />
                            <Route
                                path="add-multi-task"
                                element={<AddMultipleTask />}
                            />
                            <Route
                                path="compliance"
                                element={<ComplianceList />}
                            />
                            <Route
                                path="add-compliance"
                                element={<AddCompliance />}
                            />
                            <Route path="approval" element={<Approval />} />
                            <Route path="timesheet" element={<TimeSheet />} />
                            <Route
                                path="emp-time-sheet"
                                element={<EmpTimeSheet />}
                            />
                            <Route
                                path="client-time-sheet"
                                element={<ClientTimeSheet />}
                            />
                            <Route path="Setting" element={<Setting />} />
                            <Route path="Role" element={<Role />} />
                            <Route path="Team" element={<Team />} />
                            <Route path="Checklist" element={<Checklist />} />
                            <Route path="*" element={<NoMatch />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </HotKeys>
        </div>
    );
};

export default App;
