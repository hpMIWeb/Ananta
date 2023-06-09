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
        <HotKeys keyMap={keyMap} handlers={handlers}>
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="about" element={<Dashboard />} />
                            <Route path="task" element={<TaskList />} />
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
                            <Route path="*" element={<NoMatch />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Provider>
        </HotKeys>
    );
};

export default App;
