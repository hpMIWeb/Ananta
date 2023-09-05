import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HotKeys } from "react-hotkeys";
import store from "../states/store";
import Layout from "./modules/Layout";
import Home from "./modules/Home";
import Dashboard from "./modules/Dashboard";
import NoMatch from "./modules/NoMatch";
import TaskList from "./modules/task/TaskList";
import AddTask from "./modules/task/AddTask";
import AddMultipleTask from "./modules/task/AddMultipleTask";
import TimeSheet from "./modules/timesheet/TimeSheet";
import ComplianceList from "./modules/compliance/ComplianceList";
import "./App.scss";
import "antd/dist/reset.css";
import AddCompliance from "./modules/compliance/AddCompliance";
import EmpTimeSheet from "./modules/timesheet/EmpTimeSheet";
import ClientTimeSheet from "./modules/timesheet/ClientTimeSheet";
import Approval from "./modules/aproval/Aproval";
import Setting from "./modules/Setting/Setting";
import Login from "./modules/login/Login";
import Department from "./modules/master/Department/Department";
import DefaultDepartment from "./modules/default-master/DefaultDepartment/DefaultDepartment";
import Designation from "./modules/master/Designation/Designation";
import DefaultDesignation from "./modules/default-master/DefaultDesignation/DefaultDesignation";
import Role from "./modules/master/Role/Role";
import DefaultRole from "./modules/default-master/DefaultRole/DefaultRole";
import RoleAction from "./modules/master/Role/RoleAction";
import DefaultRoleAction from "./modules/default-master/DefaultRole/DefaultRoleAction";
import DefaultChecklist from "./modules/default-master/Checklist/DefaultChecklist";
import Team from "./modules/master/Team/Team";
import Checklist from "./modules/master/Checklist/Checklist";

const keyMap = {
    SNAP_LEFT: "command+left",
    DELETE_NODE: ["del", "backspace"],
    openAddTask: "F8",
};

const App = () => {
    const handlers = {
        openAddTask: () => {
            console.log("Add Task will open");
            // navigate("/addTask");
        },
    };

    return (
        <div data-theme={"dark"}>
            <HotKeys keyMap={keyMap} handlers={handlers}>
                <Provider store={store}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="login" element={<Login />} />
                            <Route path="/" element={<Layout />}>
                                <Route element={<Home />} />
                                <Route path="about" element={<Dashboard />} />
                                <Route
                                    index
                                    path="task"
                                    element={<TaskList />}
                                />
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
                                <Route
                                    path="timesheet"
                                    element={<TimeSheet />}
                                />
                                <Route
                                    path="emp-time-sheet"
                                    element={<EmpTimeSheet />}
                                />
                                <Route
                                    path="client-time-sheet"
                                    element={<ClientTimeSheet />}
                                />
                                <Route path="Setting" element={<Setting />} />
                                {/* Master link */}
                                <Route
                                    path="department"
                                    element={<Department />}
                                />
                                <Route
                                    path="designation"
                                    element={<Designation />}
                                />{" "}
                                <Route path="role" element={<Role />} />
                                <Route
                                    path="role-action"
                                    element={<RoleAction />}
                                />
                                <Route path="team" element={<Team />} />
                                <Route
                                    path="checklist"
                                    element={<Checklist />}
                                />
                                {/* Default Master link */}
                                <Route
                                    path="default-department"
                                    element={<DefaultDepartment />}
                                />{" "}
                                <Route
                                    path="default-designation"
                                    element={<DefaultDesignation />}
                                />{" "}
                                <Route
                                    path="default-role"
                                    element={<DefaultRole />}
                                />
                                <Route
                                    path="default-role-action"
                                    element={<DefaultRoleAction />}
                                />{" "}
                                <Route
                                    path="default-checklist"
                                    element={<DefaultChecklist />}
                                />
                                <Route path="*" element={<NoMatch />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </Provider>
            </HotKeys>
        </div>
    );
};

export default App;
